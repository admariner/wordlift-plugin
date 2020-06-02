/**
 * This file provides the sagas for the edit mappings screen.
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.25.0
 */

/**
 * External dependencies.
 */
import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
/**
 * Internal dependencies
 */
import EDIT_MAPPING_API from "../api/edit-mapping-api";
import {
    MAPPING_HEADER_CHANGED_ACTION,
    MAPPING_ID_CHANGED_FROM_API_ACTION,
    MAPPING_TERMS_CHANGED_ACTION,
    NOTIFICATION_CHANGED_ACTION,
    PROPERTY_LIST_CHANGED_ACTION,
    RULE_GROUP_LIST_CHANGED_ACTION
} from "../actions/actions";
import {
    EDIT_MAPPING_REQUEST_MAPPING_ITEM,
    EDIT_MAPPING_REQUEST_TERMS,
    EDIT_MAPPING_SAVE_MAPPING_ITEM
} from "../actions/action-types";
import EditComponentFilters from "../filters/edit-component-filters";
import {getTermsForTaxonomy} from "./selectors";
import editMappingStore from "./edit-mapping-store";


function* getTermsForSelectedTaxonomy(action) {
    // Check if the terms are fetched for the taxonomy.
    const existingTerms = getTermsForTaxonomy(editMappingStore.getState(), action.payload.taxonomy);
    if (0 !== existingTerms.length || action.payload.taxonomy === "post_type") {
        // It means the terms are already present for the taxonomy, not needed to fetch it again from API.
        return
    }
    const response = yield call(EDIT_MAPPING_API.getTermsFromAPI, action.payload.taxonomy);
    const terms = response.map(e => {
        return {
            label: e.name,
            value: e.slug,
            taxonomy: e.taxonomy
        };
    });
    MAPPING_TERMS_CHANGED_ACTION.payload = {
        taxonomy: action.payload.taxonomy,
        terms: terms
    };
    yield put(MAPPING_TERMS_CHANGED_ACTION);
}

function* saveMappingItem(action) {
    const {mappingData} = action.payload;
    const {mapping_id, message, status} = yield call(EDIT_MAPPING_API.saveMappingItem, mappingData);
    MAPPING_ID_CHANGED_FROM_API_ACTION.payload = {
        mappingId: parseInt(mapping_id)
    };
    yield put(MAPPING_ID_CHANGED_FROM_API_ACTION);
    // Send notification after saving.
    window !== undefined ? window.scrollTo(0, 0) : undefined;
    NOTIFICATION_CHANGED_ACTION.payload = {
        message: message,
        type: status
    };
    yield put(NOTIFICATION_CHANGED_ACTION);
}

function* loadTermOptions(ruleGroupList) {
    const taxonomies = EditComponentFilters.getUniqueTaxonomiesSelected(ruleGroupList)
    for (let taxonomy of taxonomies) {
        yield put({
            type: EDIT_MAPPING_REQUEST_TERMS,
            payload: {
                taxonomy: taxonomy
            }
        })
    }
}

function* getMappingItem(action) {
    const {mappingId} = action.payload;
    const data = yield call(EDIT_MAPPING_API.getMappingItemByMappingId, mappingId);
    MAPPING_HEADER_CHANGED_ACTION.payload = {
        title: data.mapping_title,
        mapping_id: data.mapping_id
    };
    yield put(MAPPING_HEADER_CHANGED_ACTION);

    PROPERTY_LIST_CHANGED_ACTION.payload = {
        value: EditComponentFilters.mapPropertyAPIKeysToUi(data.property_list)
    };
    yield put(PROPERTY_LIST_CHANGED_ACTION);

    const ruleGroupList = EditComponentFilters.mapRuleGroupListAPIKeysToUi(data.rule_group_list)
    RULE_GROUP_LIST_CHANGED_ACTION.payload = {
        value: ruleGroupList
    };

    yield call(loadTermOptions, ruleGroupList)

    yield put(RULE_GROUP_LIST_CHANGED_ACTION);
}

function* editMappingSaga() {
    yield takeEvery(EDIT_MAPPING_REQUEST_TERMS, getTermsForSelectedTaxonomy);
    yield takeLatest(EDIT_MAPPING_SAVE_MAPPING_ITEM, saveMappingItem);
    yield takeLatest(EDIT_MAPPING_REQUEST_MAPPING_ITEM, getMappingItem);
}

export default editMappingSaga;
