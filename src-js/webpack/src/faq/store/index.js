/**
 * This file provides the redux store for FAQ meta box.
 *
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 *
 */
/**
 * External dependencies
 */
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, createStore} from "redux";
/**
 * Internal dependencies
 */
import rootSaga from "../sagas";
import {faqReducer} from "../reducers";

export const FAQ_INITIAL_STATE = {
  faqListOptions: {
    question: "",
    faqItems: [],
    selectedFaqId: null,
    requestInProgress: false
  },
  faqModalOptions: {
    isModalOpened: false,
    selectedAnswer: ""
  },
  faqNotificationArea: {
    notificationMessage: "",
    notificationType: ""
  }
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(faqReducer, FAQ_INITIAL_STATE, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
