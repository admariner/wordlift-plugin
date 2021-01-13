/**
 * External dependencies
 */
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";

/**
 * WordPress dependencies
 */
import apiFetch from "@wordpress/api-fetch";
import * as data from "@wordpress/data";

/**
 * Internal dependencies
 */
import { receiveAnalysisResults, toggleLinkSuccess, updateOccurrencesForEntity } from "../../Edit/actions";
import {
  ADD_ENTITY,
  ANNOTATION,
  SET_CURRENT_ENTITY,
  TOGGLE_ENTITY,
  TOGGLE_LINK
} from "../../Edit/constants/ActionTypes";
import { requestAnalysis } from "./actions";
import parseAnalysisResponse from "./compat";
import { EDITOR_STORE } from "../../common/constants";
import EditorOps from "../api/editor-ops";
import { makeEntityAnnotationsSelector, mergeArray } from "../api/utils";
import { Blocks } from "../api/blocks";
import { getAnnotationFilter, getBlockEditorFormat, getClassificationBlock, getSelectedEntities } from "./selectors";
import { addEntityRequest, addEntitySuccess } from "../../Edit/components/AddEntity/actions";
import { applyFormat } from "@wordpress/rich-text";
import { doAction } from "@wordpress/hooks";
import { createEntityRequest } from "../../common/containers/create-entity-form/actions";
import createEntity from "../api/create-entity";
import { relatedPostsRequest, relatedPostsSuccess } from "../../common/containers/related-posts/actions";
import getRelatedPosts from "../../common/api/get-related-posts";
import ClassicEditorBlock from "../api/classic-editor-block";
import ClassicEditorBlockValidator from "./classic-editor-block-validator";

function* handleRequestAnalysis() {
  const editorOps = new EditorOps(EDITOR_STORE);

  const settings = global["wlSettings"];
  const canCreateEntities =
    "undefined" !== typeof settings["can_create_entities"] && "yes" === settings["can_create_entities"];
  const _wlMetaBoxSettings = global["_wlMetaBoxSettings"].settings;
  const request = editorOps.buildAnalysisRequest(
    settings["can_create_entities"]["language"],
    [_wlMetaBoxSettings["currentPostUri"]],
    canCreateEntities
  );

  const response = yield call(global["wp"].ajax.post, "wl_analyze", {
    _wpnonce: settings["analysis"]["_wpnonce"],
    data: JSON.stringify(request)
  });

  embedAnalysis(editorOps, response);

  const parsed = parseAnalysisResponse(response);

  yield put(receiveAnalysisResults(parsed));
}

function embedAnalysis(editorOps, response) {
  // Bail out if the response doesn't contain results.
  if ("undefined" === typeof response || "undefined" === typeof response.annotations) return;

  const annotations = Object.values(response.annotations).sort(function(a1, a2) {
    if (a1.end > a2.end) return -1;
    if (a1.end < a2.end) return 1;

    return 0;
  });

  annotations.forEach(annotation =>
    editorOps.insertAnnotation(annotation.annotationId, annotation.start, annotation.end)
  );

  editorOps.applyChanges();
}

function* toggleEntity({ entity }) {
  // Get the supported blocks.
  const blocks = Blocks.create(data.select(EDITOR_STORE).getBlocks(), data.dispatch(EDITOR_STORE));

  const mainType = entity.mainType || "thing";
  const onClassNames = ["disambiguated", `wl-${mainType.replace(/\s/, "-")}`];

  // Build a css selector to select all the annotations for the provided entity.
  const annotationSelector = makeEntityAnnotationsSelector(entity);

  // Collect the annotations that have been switch on/off.
  const occurrences = [];

  if (0 === entity.occurrences.length) {
    // Switch on.
    blocks.replace(
      new RegExp(`<span\\s+id="(${annotationSelector})"\\sclass="([^"]*)">`, "gi"),
      (match, annotationId, classNames) => {
        const newClassNames = mergeArray(classNames.split(/\s+/), onClassNames);
        occurrences.push(annotationId);
        return `<span id="${annotationId}" class="${newClassNames.join(" ")}" itemid="${entity.id}">`;
      }
    );
  } else {
    console.debug(`Looking for "<span\\s+id="(${annotationSelector})"\\sclass="([^"]*)"\\sitemid="[^"]*">"...`);
    // Switch off.
    blocks.replace(
      new RegExp(`<span\\s+id="(${annotationSelector})"\\sclass="([^"]*)"\\sitemid="[^"]*">`, "gi"),
      (match, annotationId, classNames) => {
        const newClassNames = classNames.split(/\s+/).filter(x => -1 === onClassNames.indexOf(x));
        return `<span id="${annotationId}" class="${newClassNames.join(" ")}">`;
      }
    );
  }

  yield put(updateOccurrencesForEntity(entity.id, occurrences));

  // Send the selected entities to the WordLift Classification box.
  data.dispatch(EDITOR_STORE).updateBlockAttributes(getClassificationBlock().clientId, {
    entities: yield select(getSelectedEntities)
  });

  // Apply the changes.
  blocks.apply();
}

function* toggleLink({ entity }) {
  // Get the supported blocks.
  const blocks = Blocks.create(data.select(EDITOR_STORE).getBlocks(), data.dispatch(EDITOR_STORE));

  // Build a css selector to select all the annotations for the provided entity.
  const annotationSelector = makeEntityAnnotationsSelector(entity);

  const cssClasses = ["wl-link", "wl-no-link"];

  const link = !entity.link;

  blocks.replace(
    new RegExp(`<span\\s+id="(${annotationSelector})"\\sclass="([^"]*)"\\sitemid="([^"]*)">`, "gi"),
    (match, annotationId, classNames) => {
      // Remove existing `wl-link` / `wl-no-link` classes.
      const newClassNames = classNames.split(/\s+/).filter(x => -1 === cssClasses.indexOf(x));
      // Add the `wl-link` / `wl-no-link` class according to the desired outcome.
      newClassNames.push(link ? "wl-link" : "wl-no-link");
      return `<span id="${annotationId}" class="${newClassNames.join(" ")}" itemid="${entity.id}">`;
    }
  );

  // Apply the changes.
  blocks.apply();

  yield put(toggleLinkSuccess({ id: entity.id, link }));
}

/**
 * Handle `ANNOTATION` actions.
 *
 * When the `ANNOTATION` action is fired, the `selected` css class will be added
 * to the selected annotation and removed from the others.
 *
 * The annotation id should match the element id.
 *
 * @since 3.23.0
 * @param {string|undefined} annotationId The annotation id.
 */
function* toggleAnnotation({ annotation }) {
  // Bail out if the annotation didn't change.
  const selectedAnnotation = yield select(getAnnotationFilter);
  if (annotation === selectedAnnotation) return null;

  // Get the supported blocks.
  const blocks = Blocks.create(data.select(EDITOR_STORE).getBlocks(), data.dispatch(EDITOR_STORE));

  blocks.replace(
    new RegExp(`<span\\s+id="([^"]+)"\\sclass="(textannotation(?:\\s[^"]*)?)"`, "gi"),
    (match, annotationId, classNames) => {
      // Get the class names removing any potential `selected` class.
      const newClassNames = classNames.split(/\s+/).filter(x => "selected" !== x);

      // Add the `selected` class if the annotation match.
      if (annotation === annotationId) newClassNames.push("selected");

      // Return the new span.
      return `<span id="${annotationId}" class="${newClassNames.join(" ")}"`;
    }
  );

  // Apply the changes.
  blocks.apply();
}

/**
 * Handles the request to add an entity.
 *
 * First we toggle the wordlift/annotation in Block Editor to create the annotation.
 */
function* handleAddEntityRequest({ payload }) {
  // See https://developer.wordpress.org/block-editor/packages/packages-rich-text/#applyFormat
  const blockEditorFormat = yield select(getBlockEditorFormat);
  let value, onChange;
  let selectedBlock = wp.data.select("core/editor").getSelectedBlock();
  let isClassicEditorBlock = false;

  if (blockEditorFormat !== undefined) {
    onChange = blockEditorFormat.onChange;
    value = blockEditorFormat.value;
  }

  if (blockEditorFormat === undefined) {
    value = ClassicEditorBlockValidator.getValue(payload.label);
    if (value === false) {
      // This is not a valid classic block,return early.
      return false;
    }
    // mark it as classic editor block.
    isClassicEditorBlock = true;
  }

  const annotationId = "urn:local-annotation-" + Math.floor(Math.random() * 999999);

  // Create the entity if the `id` isn't defined.
  const id =
    payload.id ||
    (yield call(createEntity, {
      title: payload.label,
      status: "draft",
      description: payload.description,
      excerpt: ""
    }))["wl:entity_url"];

  const entityToAdd = {
    id,
    ...payload,
    annotations: { [annotationId]: { annotationId, start: value.start, end: value.end } },
    occurrences: [annotationId]
  };

  console.debug("Adding Entity", entityToAdd);
  const annotationAttributes = { id: annotationId, class: "disambiguated", itemid: entityToAdd.id };
  const format = {
    type: "wordlift/annotation",
    attributes: annotationAttributes
  };

  if (isClassicEditorBlock) {
    // classic editor block should be updated differently.
    const instance = new ClassicEditorBlock(selectedBlock.clientId, selectedBlock.attributes.content);
    instance.replaceWithAnnotation(payload.label, annotationAttributes);
    instance.update();
  } else {
    // update the block
    yield call(onChange, applyFormat(value, format));
  }
  // update the state.
  yield put({ type: ADD_ENTITY, payload: entityToAdd });

  // Send the selected entities to the WordLift Classification box.
  data.dispatch(EDITOR_STORE).updateBlockAttributes(getClassificationBlock().clientId, {
    entities: yield select(getSelectedEntities)
  });

  yield put(addEntitySuccess());
}

/**
 * Broadcast the `wordlift.addEntitySuccess` action in order to have the AddEntity local store capture it.
 */
function* handleAddEntitySuccess() {
  yield call(doAction, "wordlift.addEntitySuccess");
}

/**
 * Handles the action when the entity edit link is clicked in the Classification Box.
 *
 * Within the Block Editor we open a new window to the WordPress edit post screen.
 *
 * @since 3.23.0
 * @param Object entity The entity object.
 */
function* handleSetCurrentEntity({ entity }) {
  const url = `${window["wp"].ajax.settings.url}?action=wordlift_redirect&uri=${encodeURIComponent(entity.id)}&to=edit`;
  window.open(url, "_blank");
}

/**
 * Handle the Create Entity Request, which is supposed to open a form in the sidebar.
 */
function* handleCreateEntityRequest() {
  // Call the WP hook to close the entity select (see ../../Edit/components/AddEntity/index.js).
  doAction("unstable_wordlift.closeEntitySelect");
}

/**
 * Handles the request to load the related posts.
 */
function* handleRelatedPostsRequest() {
  const posts = yield call(getRelatedPosts);

  yield put(relatedPostsSuccess(posts));
}

export default function* saga() {
  yield takeLatest(requestAnalysis, handleRequestAnalysis);
  yield takeEvery(TOGGLE_ENTITY, toggleEntity);
  yield takeEvery(TOGGLE_LINK, toggleLink);
  yield takeLatest(ANNOTATION, toggleAnnotation);
  yield takeEvery(addEntityRequest, handleAddEntityRequest);
  yield takeEvery(addEntitySuccess, handleAddEntitySuccess);
  yield takeEvery(SET_CURRENT_ENTITY, handleSetCurrentEntity);
  yield takeEvery(createEntityRequest, handleCreateEntityRequest);
  yield takeEvery(relatedPostsRequest, handleRelatedPostsRequest);
}
