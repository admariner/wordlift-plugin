/**
 * This files provide the sagas for post excerpt
 *
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 */
/**
 * External dependencies.
 */
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore } from "redux";
/**
 * Internal dependencies.
 */
import { reducer } from "../actions";
import rootSaga from "../sagas";

export const POST_EXCERPT_INITIAL_STATE = {
  isRequestInProgress: false,
  // Empty at starting
  currentPostExcerpt: "",
  // notification data
  notificationMessage: "",
  notificationType: ""
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, POST_EXCERPT_INITIAL_STATE, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
