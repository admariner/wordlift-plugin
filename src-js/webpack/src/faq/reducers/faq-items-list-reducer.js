/**
 * This file provides the reducers for the list view of FAQ items.
 *
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 *
 */

/**
 * External dependencies
 */
import {createReducer} from "@reduxjs/toolkit";
/**
 * Internal dependencies.
 */
import {
  CLOSE_EDIT_SCREEN,
  QUESTION_SELECTED_BY_USER,
  RESET_TYPED_QUESTION,
  UPDATE_FAQ_ITEMS,
  UPDATE_QUESTION_ON_INPUT_CHANGE,
  UPDATE_REQUEST_IN_PROGRESS
} from "../constants/action-types";

export const faqItemsListReducer = createReducer(null, {
  [UPDATE_FAQ_ITEMS]: (state, action) => {
    state.faqItems = action.payload;
  },
  [UPDATE_QUESTION_ON_INPUT_CHANGE]: (state, action) => {
    state.question = action.payload;
  },
  [QUESTION_SELECTED_BY_USER]: (state, action) => {
    state.selectedFaqId = action.payload;
  },
  [CLOSE_EDIT_SCREEN]: (state, action) => {
    state.selectedFaqId = null;
  },
  [RESET_TYPED_QUESTION]: (state, action) => {
    state.question = "";
  },
  [UPDATE_REQUEST_IN_PROGRESS]: (state, action) => {
    state.requestInProgress = action.payload;
  }
});
