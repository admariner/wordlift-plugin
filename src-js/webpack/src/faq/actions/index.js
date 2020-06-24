/**
 * This file provides the actions used by FAQ meta box.
 *
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 */

/**
 * External dependencies.
 */
import {createAction} from "redux-actions";
/**
 * Internal dependencies
 */
import {
  ANSWER_SELECTED_BY_USER,
  CLOSE_EDIT_SCREEN,
  QUESTION_SELECTED_BY_USER,
  REQUEST_DELETE_FAQ_ITEMS,
  REQUEST_FAQ_ADD_NEW_QUESTION,
  REQUEST_GET_FAQ_ITEMS,
  REQUEST_UPDATE_FAQ_ITEMS,
  RESET_TYPED_QUESTION,
  UPDATE_FAQ_ITEM,
  UPDATE_FAQ_ITEMS,
  UPDATE_MODAL_STATUS,
  UPDATE_NOTIFICATION_AREA,
  UPDATE_QUESTION_ON_INPUT_CHANGE,
  UPDATE_REQUEST_IN_PROGRESS
} from "../constants/action-types";

/**
 * Action for adding new question.
 * @type {function(): {type: *}}
 */
export const requestAddNewQuestion = createAction(REQUEST_FAQ_ADD_NEW_QUESTION);

/**
 * Action for getting FAQ items from API.
 * @type {function(): {type: *}}
 */
export const requestGetFaqItems = createAction(REQUEST_GET_FAQ_ITEMS);

/**
 * Action for deleting FAQ items from API.
 * @type {function(): {type: *}}
 */
export const requestDeleteFaqItems = createAction(REQUEST_DELETE_FAQ_ITEMS);

/**
 * Action for updating FAQ items in store.
 * @type {function(): {type: *}}
 */
export const updateFaqItems = createAction(UPDATE_FAQ_ITEMS);

/**
 * Action for updating question in state when user types the question.
 * @type {function(): {type: *}}
 */
export const updateQuestionOnInputChange = createAction(UPDATE_QUESTION_ON_INPUT_CHANGE);

/**
 * Action when the user selects the question from the list of questions.
 * @type {function(): {type: *}}
 */
export const questionSelectedByUser = createAction(QUESTION_SELECTED_BY_USER);

/**
 * Action when the user wants to close the edit screen
 * @type {function(): {type: *}}
 */
export const closeEditScreen = createAction(CLOSE_EDIT_SCREEN);

/**
 * Action when the ui wants to update the data in API.
 * @type {function(): {type: *}}
 */
export const requestUpdateFaqItems = createAction(REQUEST_UPDATE_FAQ_ITEMS);

/**
 * Action when the ui wants a single FAQ item.
 * @type {function(): {type: *}}
 */
export const updateFaqItem = createAction(UPDATE_FAQ_ITEM);

/**
 * Action when the ui wants to show/hide the modal.
 * @type {function(): {type: *}}
 */
export const updateFaqModalVisibility = createAction(UPDATE_MODAL_STATUS);

/**
 * Action for showing notification area.
 * @type {function(): {type: *}}
 */
export const updateNotificationArea = createAction(UPDATE_NOTIFICATION_AREA);

/**
 * Action for resetting input field.
 * @type {function(): {type: *}}
 */
export const resetTypedQuestion = createAction(RESET_TYPED_QUESTION);

/**
 * Action for opening modal if the answer is selected by the user
 */
export const answerSelectedByUser = createAction(ANSWER_SELECTED_BY_USER);

/**
 * Action for changing the request status
 */
export const changeRequestStatus = createAction(UPDATE_REQUEST_IN_PROGRESS);
