!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=242)}({0:function(t,e){t.exports=window.React},12:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(16),o=n.n(r),i=n(27),s=n(23),a=function(t){return null===t};function c(t,e,n){void 0===e&&(e=s.a),o()(Object(i.a)(e)||a(e),"Expected payloadCreator to be a function, undefined or null");var r=a(e)||e===s.a?s.a:function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return t instanceof Error?t:e.apply(void 0,[t].concat(r))},c=Object(i.a)(n),u=t.toString(),l=function(){var e=r.apply(void 0,arguments),o={type:t};return e instanceof Error&&(o.error=!0),void 0!==e&&(o.payload=e),c&&(o.meta=n.apply(void 0,arguments)),o};return l.toString=function(){return u},l}},123:function(t,e,n){},124:function(t,e,n){},138:function(t,e,n){"use strict";var r=n(32),o=n(51),i=n(88);class s{constructor(t,e){this.editor=t,this.highlightHandler=e,this.faqItems=[],this.addQuestionText=this.editor.translate("Add Question"),this.addAnswerText=this.editor.translate("Add Answer"),this.addQuestionOrAnswerText=this.editor.translate("Add Question / Answer"),Object(r.on)(o.c,t=>{this.faqItems=t})}setButtonTextBasedOnSelectedText(t,e,n){i.a.isQuestion(t)?(e.innerText=this.addQuestionText,n.setAttribute("aria-label",this.addQuestionText)):(e.innerText=this.addAnswerText,n.setAttribute("aria-label",this.addAnswerText))}disableButton(t,e){t.classList.add("mce-disabled"),e.disabled=!0}enableButton(t,e){t.classList.remove("mce-disabled"),e.disabled=!1}static shouldDisableButton(t,e){if(0===t.length||void 0===t)return!0;return 0===e.filter(t=>""===t.answer).length&&!i.a.isQuestion(t)}changeButtonStateOnSelectedText(){const t=this.editor,e=t.selection.getContent({format:"text"}),n=document.getElementById("wl-faq-toolbar-button");if(null===n)return;const r=n.getElementsByTagName("button")[0];s.shouldDisableButton(e,this.faqItems)?this.disableButton(n,r):this.enableButton(n,r);const o=t.getBody().getAttribute("contenteditable");"false"!==o&&!1!==o||this.disableButton(n,r),this.setButtonTextBasedOnSelectedText(e,r,n)}changeToolBarButtonStateBasedOnTextSelected(){const t=this.editor;t.on("NodeChange",t=>{this.changeButtonStateOnSelectedText()}),t.on("selectionchange",t=>{this.changeButtonStateOnSelectedText()})}addButtonToToolBar(){const t=this.editor,e=this;t.addButton("wl-faq-toolbar-button",{text:"Add Question or Answer",id:"wl-faq-toolbar-button",onclick:function(){const n=t.selection.getContent({format:"text"}),i=t.selection.getContent({format:"html"});e.highlightHandler.saveSelection(),Object(r.trigger)(o.a,{selectedText:n,selectedHTML:i})}}),this.changeToolBarButtonStateBasedOnTextSelected()}}e.a=s},139:function(t,e,n){"use strict";e.a=class{constructor(){}performTextHighlighting(){this._throwFunctionNotImplementedError("doTextHighlighting()")}showFloatingActionButton(){this._throwFunctionNotImplementedError("showFloatingActionButton()")}initialize(){this.performTextHighlighting(),this.showFloatingActionButton()}_throwFunctionNotImplementedError(t){throw new Error(t+" should be implemented by the parent class ")}}},144:function(t,e,n){"use strict";var r=n(32),o=n(51),i=n(60),s=n(92);var a=class{constructor(t){this.range=t,this.nodesShouldNotBeHighlighted=[],this.nodesToBeHighlighted=[],this.nodesToBeAddedOnStartContainer=[],this.nodesToBeAddedOnEndContainer=[],this.processRange(t)}getProcessedRange(){return{nodesToBeHighlighted:this.nodesToBeHighlighted,nodesShouldNotBeHighlighted:this.nodesShouldNotBeHighlighted}}ifTextContentNotEmptyPushNode(t,e,n=!1){""!==t.textContent&&(n?this.nodesToBeHighlighted.push(t):this.nodesShouldNotBeHighlighted.push(t),e.push(t))}splitToTwoNodesByOffset(t,e){return{startNode:document.createTextNode(t.slice(0,e)),endNode:document.createTextNode(t.slice(e,t.length))}}processRange(t){if(t.startContainer===t.endContainer){const{startNode:e,middleNode:n,endNode:r}=this.createTextNodesFromRange(t);this.ifTextContentNotEmptyPushNode(e,this.nodesToBeAddedOnStartContainer),this.nodesToBeAddedOnStartContainer.push(n),this.nodesToBeHighlighted.push(n),this.ifTextContentNotEmptyPushNode(r,this.nodesToBeAddedOnStartContainer)}else{let{startNode:e,endNode:n}=this.splitToTwoNodesByOffset(t.startContainer.textContent,t.startOffset);this.ifTextContentNotEmptyPushNode(e,this.nodesToBeAddedOnStartContainer),this.ifTextContentNotEmptyPushNode(n,this.nodesToBeAddedOnStartContainer,!0);let r=this.splitToTwoNodesByOffset(t.endContainer.textContent,t.endOffset);this.ifTextContentNotEmptyPushNode(r.startNode,this.nodesToBeAddedOnEndContainer,!0),this.ifTextContentNotEmptyPushNode(r.endNode,this.nodesToBeAddedOnEndContainer)}this.appendCreatedNodesToParentElement(t.startContainer.parentElement,t.startContainer,this.nodesToBeAddedOnStartContainer),this.appendCreatedNodesToParentElement(t.endContainer.parentElement,t.endContainer,this.nodesToBeAddedOnEndContainer)}appendCreatedNodesToParentElement(t,e,n){for(let r of n)t.insertBefore(r,e);e.textContent=""}createTextNodesFromRange(t){const e=t.startContainer.textContent;return{startNode:document.createTextNode(e.slice(0,t.startOffset)),middleNode:document.createTextNode(e.slice(t.startOffset,t.endOffset)),endNode:document.createTextNode(e.slice(t.endOffset,e.length))}}};class c{constructor(t){this.editor=t,this.selection=null,i.c.registerAllElements(),Object(r.on)(o.b,t=>{this.highlightSelectedText(t.text,t.isQuestion,t.id)}),Object(r.on)(o.d,({id:t,type:e})=>{let n=this.editor.getContent();n=s.a.removeHighlightingBasedOnType(t,e,n),this.editor.setContent(n)})}saveSelection(){this.selection=this.editor.selection}static getTagBasedOnHighlightedText(t){return t?i.b:i.a}highlightSelectedText(t,e,n){if(null===this.selection)return;const r=c.getTagBasedOnHighlightedText(e),o=this.selection.getRng(),i=new a(o).getProcessedRange();let u=Array.from(this.selection.getNode().childNodes);s.a.highlightNodesByRange(u,r,n.toString(),o,i),o.collapse()}}e.a=c},15:function(t,e,n){"use strict";function r(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}n.d(e,"a",(function(){return r}))},16:function(t,e,n){"use strict";t.exports=function(t,e,n,r,o,i,s,a){if(!t){var c;if(void 0===e)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var u=[n,r,o,i,s,a],l=0;(c=new Error(e.replace(/%s/g,(function(){return u[l++]})))).name="Invariant Violation"}throw c.framesToPop=1,c}}},17:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var r=n(0),o=n.n(r),i=(n(82),n(29));const s=({children:t,className:e="",lessPadding:n=!1,isSticky:r=!1,centerText:s=!1})=>{const a=Object(i.a)({"wl-col--less-padding":n,"wl-col--sticky":r,"wl-col--center-text":s});return o.a.createElement("div",{className:"wl-col "+e+" "+a},t)}},2:function(t,e,n){t.exports=n(45)()},21:function(t,e,n){"use strict";t.exports=n(47)},23:function(t,e,n){"use strict";e.a=function(t){return t}},24:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var r=n(0),o=n.n(r),i=(n(81),n(29));const s=({children:t,className:e="",fullWidth:n=!1,rowLayout:r=!1,shouldWrap:s=!1})=>{const a=Object(i.a)({"wl-container--full-width":n,"wl-container--row-layout":r,"wl-container--wrap":s});return o.a.createElement("div",{className:"wl-container "+a+" "+e},t)}},242:function(t,e,n){"use strict";n.r(e),function(t){var e=n(138),r=n(144),o=n(139);const i=t.tinymce;class s extends o.a{constructor(){super(),this.editor=null,this.highlightHandler=null;const t=this;i.PluginManager.add("wl_faq_tinymce",(function(e){t.editor=e,t.initialize()}))}performTextHighlighting(){this.highlightHandler=new r.a(this.editor)}showFloatingActionButton(){new e.a(this.editor,this.highlightHandler).addButtonToToolBar()}initialize(){this.performTextHighlighting(),this.showFloatingActionButton()}}new s}.call(this,n(28))},25:function(t,e,n){"use strict";n.d(e,"e",(function(){return r})),n.d(e,"f",(function(){return o})),n.d(e,"j",(function(){return i})),n.d(e,"m",(function(){return s})),n.d(e,"c",(function(){return a})),n.d(e,"b",(function(){return c})),n.d(e,"g",(function(){return u})),n.d(e,"i",(function(){return l})),n.d(e,"k",(function(){return d})),n.d(e,"l",(function(){return f})),n.d(e,"h",(function(){return p})),n.d(e,"a",(function(){return h})),n.d(e,"d",(function(){return m})),n.d(e,"n",(function(){return g}));const r="REQUEST_FAQ_ADD_NEW_QUESTION",o="REQUEST_GET_FAQ_ITEMS",i="UPDATE_FAQ_ITEMS",s="UPDATE_QUESTION_ON_INPUT_CHANGE",a="QUESTION_SELECTED_BY_USER",c="CLOSE_EDIT_SCREEN",u="REQUEST_UPDATE_FAQ_ITEMS",l="UPDATE_FAQ_ITEM",d="UPDATE_MODAL_STATUS",f="UPDATE_NOTIFICATION_AREA",p="RESET_TYPED_QUESTION",h="ANSWER_SELECTED_BY_USER",m="REQUEST_DELETE_FAQ_ITEMS",g="UPDATE_REQUEST_IN_PROGRESS"},27:function(t,e,n){"use strict";e.a=function(t){return"function"==typeof t}},28:function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},29:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));const r=t=>{let e="";for(let n of Object.keys(t))t[n]&&(e+=" "+n);return e.trim()}},32:function(t,e){t.exports=Backbone},35:function(t,e,n){"use strict";n.d(e,"e",(function(){return i})),n.d(e,"g",(function(){return s})),n.d(e,"f",(function(){return a})),n.d(e,"j",(function(){return c})),n.d(e,"m",(function(){return u})),n.d(e,"d",(function(){return l})),n.d(e,"c",(function(){return d})),n.d(e,"i",(function(){return f})),n.d(e,"k",(function(){return p})),n.d(e,"l",(function(){return h})),n.d(e,"h",(function(){return m})),n.d(e,"a",(function(){return g})),n.d(e,"b",(function(){return y}));var r=n(12),o=n(25);const i=Object(r.a)(o.e),s=Object(r.a)(o.f),a=Object(r.a)(o.d),c=Object(r.a)(o.j),u=Object(r.a)(o.m),l=Object(r.a)(o.c),d=Object(r.a)(o.b),f=(Object(r.a)(o.g),Object(r.a)(o.i)),p=Object(r.a)(o.k),h=Object(r.a)(o.l),m=Object(r.a)(o.h),g=Object(r.a)(o.a),y=Object(r.a)(o.n)},40:function(t,e,n){"use strict";n.d(e,"c",(function(){return h})),n.d(e,"a",(function(){return m}));var r=n(0),o=n.n(r),i=n(7),s=(n(123),n(24)),a=n(17),c=n(57);var u=({updateHandler:t,deleteHandler:e})=>o.a.createElement(s.a,{fullWidth:!0},o.a.createElement(a.a,{className:"wl-col--width-40 wl-col--low-padding"},o.a.createElement(c.a,{text:"delete",className:"wl-action-button--delete wl-action-button--normal",onClickHandler:e})),o.a.createElement(a.a,{className:"wl-col--width-10"}),o.a.createElement(a.a,{className:"wl-col--width-40 wl-col--low-padding"},o.a.createElement(c.a,{text:"update",className:"wl-action-button--update wl-action-button--primary",onClickHandler:t}))),l=n(2),d=n.n(l),f=n(35),p=(n(124),n(84));const h={ANSWER:"ANSWER",QUESTION:"QUESTION"},m=50;class g extends o.a.Component{constructor(t){super(t),this.state={textAreaValue:this.props.value},this.changeValueOnUserType=this.changeValueOnUserType.bind(this),this.updateFaqEditItem=this.updateFaqEditItem.bind(this),this.deleteFaqItem=this.deleteFaqItem.bind(this)}updateFaqEditItem(){const t=Object(f.i)({id:this.props.id,type:this.props.type,value:this.state.textAreaValue});this.props.dispatch(t)}deleteFaqItem(){this.setState({textAreaValue:""}),this.props.dispatch(Object(f.f)({id:this.props.id,type:this.props.type.toLowerCase()}))}changeValueOnUserType(t){this.setState({textAreaValue:t.target.value})}render(){return o.a.createElement(o.a.Fragment,null,o.a.createElement("span",{className:"wl-faq-edit-item--title"},this.props.title),o.a.createElement("br",null),o.a.createElement(s.a,null,o.a.createElement(a.a,{className:"wl-col--width-100 wl-col--less-padding"},o.a.createElement("textarea",{className:"wl-faq-edit-item--textarea",rows:3,value:this.state.textAreaValue,onChange:t=>{this.changeValueOnUserType(t)}}),Object(p.b)(this.props.type,this.state.textAreaValue),Object(p.c)(this.props.type,this.state.textAreaValue))),o.a.createElement(u,{updateHandler:this.updateFaqEditItem,deleteHandler:this.deleteFaqItem}))}}g.propTypes={type:d.a.string,id:d.a.string};e.b=Object(i.b)()(g)},41:function(t,e,n){"use strict";var r=n(21),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},s={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},a={};function c(t){return r.isMemo(t)?s:a[t.$$typeof]||o}a[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},a[r.Memo]=s;var u=Object.defineProperty,l=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,f=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,h=Object.prototype;t.exports=function t(e,n,r){if("string"!=typeof n){if(h){var o=p(n);o&&o!==h&&t(e,o,r)}var s=l(n);d&&(s=s.concat(d(n)));for(var a=c(e),m=c(n),g=0;g<s.length;++g){var y=s[g];if(!(i[y]||r&&r[y]||m&&m[y]||a&&a[y])){var b=f(n,y);try{u(e,y,b)}catch(t){}}}}return e}},45:function(t,e,n){"use strict";var r=n(46);function o(){}function i(){}i.resetWarningCache=o,t.exports=function(){function t(t,e,n,o,i,s){if(s!==r){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function e(){return t}t.isRequired=t;var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},46:function(t,e,n){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},47:function(t,e,n){"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,i=r?Symbol.for("react.portal"):60106,s=r?Symbol.for("react.fragment"):60107,a=r?Symbol.for("react.strict_mode"):60108,c=r?Symbol.for("react.profiler"):60114,u=r?Symbol.for("react.provider"):60109,l=r?Symbol.for("react.context"):60110,d=r?Symbol.for("react.async_mode"):60111,f=r?Symbol.for("react.concurrent_mode"):60111,p=r?Symbol.for("react.forward_ref"):60112,h=r?Symbol.for("react.suspense"):60113,m=r?Symbol.for("react.suspense_list"):60120,g=r?Symbol.for("react.memo"):60115,y=r?Symbol.for("react.lazy"):60116,b=r?Symbol.for("react.block"):60121,v=r?Symbol.for("react.fundamental"):60117,E=r?Symbol.for("react.responder"):60118,O=r?Symbol.for("react.scope"):60119;function T(t){if("object"==typeof t&&null!==t){var e=t.$$typeof;switch(e){case o:switch(t=t.type){case d:case f:case s:case c:case a:case h:return t;default:switch(t=t&&t.$$typeof){case l:case p:case y:case g:case u:return t;default:return e}}case i:return e}}}function w(t){return T(t)===f}e.AsyncMode=d,e.ConcurrentMode=f,e.ContextConsumer=l,e.ContextProvider=u,e.Element=o,e.ForwardRef=p,e.Fragment=s,e.Lazy=y,e.Memo=g,e.Portal=i,e.Profiler=c,e.StrictMode=a,e.Suspense=h,e.isAsyncMode=function(t){return w(t)||T(t)===d},e.isConcurrentMode=w,e.isContextConsumer=function(t){return T(t)===l},e.isContextProvider=function(t){return T(t)===u},e.isElement=function(t){return"object"==typeof t&&null!==t&&t.$$typeof===o},e.isForwardRef=function(t){return T(t)===p},e.isFragment=function(t){return T(t)===s},e.isLazy=function(t){return T(t)===y},e.isMemo=function(t){return T(t)===g},e.isPortal=function(t){return T(t)===i},e.isProfiler=function(t){return T(t)===c},e.isStrictMode=function(t){return T(t)===a},e.isSuspense=function(t){return T(t)===h},e.isValidElementType=function(t){return"string"==typeof t||"function"==typeof t||t===s||t===f||t===c||t===a||t===h||t===m||"object"==typeof t&&null!==t&&(t.$$typeof===y||t.$$typeof===g||t.$$typeof===u||t.$$typeof===l||t.$$typeof===p||t.$$typeof===v||t.$$typeof===E||t.$$typeof===O||t.$$typeof===b)},e.typeOf=T},51:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"b",(function(){return i})),n.d(e,"d",(function(){return s}));const r="FAQ_EVENT_HANDLER_SELECTION_CHANGED",o="FAQ_ITEMS_CHANGED",i="FAQ_HIGHLIGHT_TEXT",s="FAQ_ITEM_DELETED"},57:function(t,e,n){"use strict";var r=n(0),o=n.n(r);n(95);e.a=({className:t="",text:e,onClickHandler:n})=>o.a.createElement("button",{onClick:n,className:"wl-action-button "+t,type:"button"},e)},60:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"a",(function(){return o}));const r="wl-faq-question",o="wl-faq-answer";class i extends HTMLElement{constructor(){super()}}class s extends HTMLElement{constructor(){super()}}class a{static registerFaqQuestionElement(){void 0===customElements.get(r)&&customElements.define(r,i,{extends:"div"})}static registerFaqAnswerElement(){void 0===customElements.get(o)&&customElements.define(o,s,{extends:"div"})}static registerAllElements(){a.registerFaqQuestionElement(),a.registerFaqAnswerElement()}}e.c=a},7:function(t,e,n){"use strict";function r(t,e){return(r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}function o(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,r(t,e)}n.d(e,"a",(function(){return d})),n.d(e,"b",(function(){return et}));var i=n(0),s=n.n(i),a=n(2),c=n.n(a),u=c.a.shape({trySubscribe:c.a.func.isRequired,tryUnsubscribe:c.a.func.isRequired,notifyNestedSubs:c.a.func.isRequired,isSubscribed:c.a.func.isRequired}),l=c.a.shape({subscribe:c.a.func.isRequired,dispatch:c.a.func.isRequired,getState:c.a.func.isRequired});s.a.forwardRef;var d=function(t){var e;void 0===t&&(t="store");var n=t+"Subscription",r=function(e){o(s,e);var r=s.prototype;function s(n,r){var o;return(o=e.call(this,n,r)||this)[t]=n.store,o}return r.getChildContext=function(){var e;return(e={})[t]=this[t],e[n]=null,e},r.render=function(){return i.Children.only(this.props.children)},s}(i.Component);return r.propTypes={store:l.isRequired,children:c.a.element.isRequired},r.childContextTypes=((e={})[t]=l.isRequired,e[n]=u,e),r}();function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var p=n(9),h=n(15),m=n(41),g=n.n(m),y=n(16),b=n.n(y),v=n(21),E={notify:function(){}};var O=function(){function t(t,e,n){this.store=t,this.parentSub=e,this.onStateChange=n,this.unsubscribe=null,this.listeners=E}var e=t.prototype;return e.addNestedSub=function(t){return this.trySubscribe(),this.listeners.subscribe(t)},e.notifyNestedSubs=function(){this.listeners.notify()},e.isSubscribed=function(){return Boolean(this.unsubscribe)},e.trySubscribe=function(){var t,e;this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=(t=[],e=[],{clear:function(){e=null,t=null},notify:function(){for(var n=t=e,r=0;r<n.length;r++)n[r]()},get:function(){return e},subscribe:function(n){var r=!0;return e===t&&(e=t.slice()),e.push(n),function(){r&&null!==t&&(r=!1,e===t&&(e=t.slice()),e.splice(e.indexOf(n),1))}}}))},e.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=E)},t}(),T=void 0!==s.a.forwardRef,w=0,S={};function N(){}function C(t,e){var n,r;void 0===e&&(e={});var s=e,a=s.getDisplayName,c=void 0===a?function(t){return"ConnectAdvanced("+t+")"}:a,d=s.methodName,m=void 0===d?"connectAdvanced":d,y=s.renderCountProp,E=void 0===y?void 0:y,C=s.shouldHandleStateChanges,P=void 0===C||C,x=s.storeKey,j=void 0===x?"store":x,A=s.withRef,_=void 0!==A&&A,B=Object(h.a)(s,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),R=j+"Subscription",I=w++,H=((n={})[j]=l,n[R]=u,n),q=((r={})[R]=u,r);return function(e){b()(Object(v.isValidElementType)(e),"You must pass a component to the function returned by "+m+". Instead received "+JSON.stringify(e));var n=e.displayName||e.name||"Component",r=c(n),s=Object(p.a)({},B,{getDisplayName:c,methodName:m,renderCountProp:E,shouldHandleStateChanges:P,storeKey:j,withRef:_,displayName:r,wrappedComponentName:n,WrappedComponent:e}),a=function(n){function a(t,e){var o;return(o=n.call(this,t,e)||this).version=I,o.state={},o.renderCount=0,o.store=t[j]||e[j],o.propsMode=Boolean(t[j]),o.setWrappedInstance=o.setWrappedInstance.bind(f(f(o))),b()(o.store,'Could not find "'+j+'" in either the context or props of "'+r+'". Either wrap the root component in a <Provider>, or explicitly pass "'+j+'" as a prop to "'+r+'".'),o.initSelector(),o.initSubscription(),o}o(a,n);var c=a.prototype;return c.getChildContext=function(){var t,e=this.propsMode?null:this.subscription;return(t={})[R]=e||this.context[R],t},c.componentDidMount=function(){P&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},c.componentWillReceiveProps=function(t){this.selector.run(t)},c.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},c.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=N,this.store=null,this.selector.run=N,this.selector.shouldComponentUpdate=!1},c.getWrappedInstance=function(){return b()(_,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+m+"() call."),this.wrappedInstance},c.setWrappedInstance=function(t){this.wrappedInstance=t},c.initSelector=function(){var e=t(this.store.dispatch,s);this.selector=function(t,e){var n={run:function(r){try{var o=t(e.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(t){n.shouldComponentUpdate=!0,n.error=t}}};return n}(e,this.store),this.selector.run(this.props)},c.initSubscription=function(){if(P){var t=(this.propsMode?this.props:this.context)[R];this.subscription=new O(this.store,t,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},c.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(S)):this.notifyNestedSubs()},c.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},c.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},c.addExtraProps=function(t){if(!(_||E||this.propsMode&&this.subscription))return t;var e=Object(p.a)({},t);return _&&(e.ref=this.setWrappedInstance),E&&(e[E]=this.renderCount++),this.propsMode&&this.subscription&&(e[R]=this.subscription),e},c.render=function(){var t=this.selector;if(t.shouldComponentUpdate=!1,t.error)throw t.error;return Object(i.createElement)(e,this.addExtraProps(t.props))},a}(i.Component);return T&&(a.prototype.UNSAFE_componentWillReceiveProps=a.prototype.componentWillReceiveProps,delete a.prototype.componentWillReceiveProps),a.WrappedComponent=e,a.displayName=r,a.childContextTypes=q,a.contextTypes=H,a.propTypes=H,g()(a,e)}}var P=Object.prototype.hasOwnProperty;function x(t,e){return t===e?0!==t||0!==e||1/t==1/e:t!=t&&e!=e}function j(t,e){if(x(t,e))return!0;if("object"!=typeof t||null===t||"object"!=typeof e||null===e)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!P.call(e,n[o])||!x(t[n[o]],e[n[o]]))return!1;return!0}var A=n(8);function _(t){return function(e,n){var r=t(e,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function B(t){return null!==t.dependsOnOwnProps&&void 0!==t.dependsOnOwnProps?Boolean(t.dependsOnOwnProps):1!==t.length}function R(t,e){return function(e,n){n.displayName;var r=function(t,e){return r.dependsOnOwnProps?r.mapToProps(t,e):r.mapToProps(t)};return r.dependsOnOwnProps=!0,r.mapToProps=function(e,n){r.mapToProps=t,r.dependsOnOwnProps=B(t);var o=r(e,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=B(o),o=r(e,n)),o},r}}var I=[function(t){return"function"==typeof t?R(t):void 0},function(t){return t?void 0:_((function(t){return{dispatch:t}}))},function(t){return t&&"object"==typeof t?_((function(e){return Object(A.b)(t,e)})):void 0}];var H=[function(t){return"function"==typeof t?R(t):void 0},function(t){return t?void 0:_((function(){return{}}))}];function q(t,e,n){return Object(p.a)({},n,t,e)}var M=[function(t){return"function"==typeof t?function(t){return function(e,n){n.displayName;var r,o=n.pure,i=n.areMergedPropsEqual,s=!1;return function(e,n,a){var c=t(e,n,a);return s?o&&i(c,r)||(r=c):(s=!0,r=c),r}}}(t):void 0},function(t){return t?void 0:function(){return q}}];function F(t,e,n,r){return function(o,i){return n(t(o,i),e(r,i),i)}}function U(t,e,n,r,o){var i,s,a,c,u,l=o.areStatesEqual,d=o.areOwnPropsEqual,f=o.areStatePropsEqual,p=!1;function h(o,p){var h,m,g=!d(p,s),y=!l(o,i);return i=o,s=p,g&&y?(a=t(i,s),e.dependsOnOwnProps&&(c=e(r,s)),u=n(a,c,s)):g?(t.dependsOnOwnProps&&(a=t(i,s)),e.dependsOnOwnProps&&(c=e(r,s)),u=n(a,c,s)):y?(h=t(i,s),m=!f(h,a),a=h,m&&(u=n(a,c,s)),u):u}return function(o,l){return p?h(o,l):(a=t(i=o,s=l),c=e(r,s),u=n(a,c,s),p=!0,u)}}function D(t,e){var n=e.initMapStateToProps,r=e.initMapDispatchToProps,o=e.initMergeProps,i=Object(h.a)(e,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),s=n(t,i),a=r(t,i),c=o(t,i);return(i.pure?U:F)(s,a,c,t,i)}function L(t,e,n){for(var r=e.length-1;r>=0;r--){var o=e[r](t);if(o)return o}return function(e,r){throw new Error("Invalid value of type "+typeof t+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function Q(t,e){return t===e}var W,$,k,V,G,z,K,Y,X,J,Z,tt,et=(k=($=void 0===W?{}:W).connectHOC,V=void 0===k?C:k,G=$.mapStateToPropsFactories,z=void 0===G?H:G,K=$.mapDispatchToPropsFactories,Y=void 0===K?I:K,X=$.mergePropsFactories,J=void 0===X?M:X,Z=$.selectorFactory,tt=void 0===Z?D:Z,function(t,e,n,r){void 0===r&&(r={});var o=r,i=o.pure,s=void 0===i||i,a=o.areStatesEqual,c=void 0===a?Q:a,u=o.areOwnPropsEqual,l=void 0===u?j:u,d=o.areStatePropsEqual,f=void 0===d?j:d,m=o.areMergedPropsEqual,g=void 0===m?j:m,y=Object(h.a)(o,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),b=L(t,z,"mapStateToProps"),v=L(e,Y,"mapDispatchToProps"),E=L(n,J,"mergeProps");return V(tt,Object(p.a)({methodName:"connect",getDisplayName:function(t){return"Connect("+t+")"},shouldHandleStateChanges:Boolean(t),initMapStateToProps:b,initMapDispatchToProps:v,initMergeProps:E,pure:s,areStatesEqual:c,areOwnPropsEqual:l,areStatePropsEqual:f,areMergedPropsEqual:g},y))})},8:function(t,e,n){"use strict";function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t){return"Minified Redux error #"+t+"; visit https://redux.js.org/Errors?code="+t+" for the full message or use the non-minified dev environment for full errors. "}n.d(e,"a",(function(){return g})),n.d(e,"b",(function(){return h})),n.d(e,"c",(function(){return f})),n.d(e,"d",(function(){return m})),n.d(e,"e",(function(){return d}));var a="function"==typeof Symbol&&Symbol.observable||"@@observable",c=function(){return Math.random().toString(36).substring(7).split("").join(".")},u={INIT:"@@redux/INIT"+c(),REPLACE:"@@redux/REPLACE"+c(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+c()}};function l(t){if("object"!=typeof t||null===t)return!1;for(var e=t;null!==Object.getPrototypeOf(e);)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(t)===e}function d(t,e,n){var r;if("function"==typeof e&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error(s(0));if("function"==typeof e&&void 0===n&&(n=e,e=void 0),void 0!==n){if("function"!=typeof n)throw new Error(s(1));return n(d)(t,e)}if("function"!=typeof t)throw new Error(s(2));var o=t,i=e,c=[],f=c,p=!1;function h(){f===c&&(f=c.slice())}function m(){if(p)throw new Error(s(3));return i}function g(t){if("function"!=typeof t)throw new Error(s(4));if(p)throw new Error(s(5));var e=!0;return h(),f.push(t),function(){if(e){if(p)throw new Error(s(6));e=!1,h();var n=f.indexOf(t);f.splice(n,1),c=null}}}function y(t){if(!l(t))throw new Error(s(7));if(void 0===t.type)throw new Error(s(8));if(p)throw new Error(s(9));try{p=!0,i=o(i,t)}finally{p=!1}for(var e=c=f,n=0;n<e.length;n++){(0,e[n])()}return t}function b(t){if("function"!=typeof t)throw new Error(s(10));o=t,y({type:u.REPLACE})}function v(){var t,e=g;return(t={subscribe:function(t){if("object"!=typeof t||null===t)throw new Error(s(11));function n(){t.next&&t.next(m())}return n(),{unsubscribe:e(n)}}})[a]=function(){return this},t}return y({type:u.INIT}),(r={dispatch:y,subscribe:g,getState:m,replaceReducer:b})[a]=v,r}function f(t){for(var e=Object.keys(t),n={},r=0;r<e.length;r++){var o=e[r];0,"function"==typeof t[o]&&(n[o]=t[o])}var i,a=Object.keys(n);try{!function(t){Object.keys(t).forEach((function(e){var n=t[e];if(void 0===n(void 0,{type:u.INIT}))throw new Error(s(12));if(void 0===n(void 0,{type:u.PROBE_UNKNOWN_ACTION()}))throw new Error(s(13))}))}(n)}catch(t){i=t}return function(t,e){if(void 0===t&&(t={}),i)throw i;for(var r=!1,o={},c=0;c<a.length;c++){var u=a[c],l=n[u],d=t[u],f=l(d,e);if(void 0===f){e&&e.type;throw new Error(s(14))}o[u]=f,r=r||f!==d}return(r=r||a.length!==Object.keys(t).length)?o:t}}function p(t,e){return function(){return e(t.apply(this,arguments))}}function h(t,e){if("function"==typeof t)return p(t,e);if("object"!=typeof t||null===t)throw new Error(s(16));var n={};for(var r in t){var o=t[r];"function"==typeof o&&(n[r]=p(o,e))}return n}function m(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return 0===e.length?function(t){return t}:1===e.length?e[0]:e.reduce((function(t,e){return function(){return t(e.apply(void 0,arguments))}}))}function g(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return function(){var n=t.apply(void 0,arguments),r=function(){throw new Error(s(15))},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},a=e.map((function(t){return t(o)}));return r=m.apply(void 0,a)(n.dispatch),i(i({},n),{},{dispatch:r})}}}},81:function(t,e,n){},82:function(t,e,n){},84:function(t,e,n){"use strict";(function(t){n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return c}));var r=n(0),o=n.n(r),i=n(40);const s=["h1","h2","h3","h4","h5","h6","br","ol","ul","li","a","p","div","b","strong","i","em"];function a(e,n){const{invalidWordCountMessage:r}=t._wlFaqSettings;if(e!==i.c.ANSWER||0===n.length)return o.a.createElement(o.a.Fragment,null);const s=n.match(/\S+/g);if(null===s||0===s.length)return o.a.createElement(o.a.Fragment,null);const a=s.length,c=r.replace("{ANSWER_WORD_COUNT_WARNING_LIMIT}",i.a);return a<=i.a?o.a.createElement(o.a.Fragment,null):o.a.createElement("p",{className:"wl-faq-edit-item--warning"},o.a.createElement("span",{className:"dashicons dashicons-warning"}),c)}function c(e,n){const{invalidTagMessage:r}=t._wlFaqSettings;if(e!==i.c.ANSWER||0===n.length)return o.a.createElement(o.a.Fragment,null);const a=function(t){const e=t.match(/<\/?\w+/gim);if(null===e)return!1;const n=e.map(t=>t.replace("<","").replace("/","").toLowerCase().replace(" ",""));return[...new Set(n)].filter(t=>!s.includes(t)).map(t=>"<"+t+">")}(n);if(!1===a||0===a.length)return o.a.createElement(o.a.Fragment,null);{const t=a.join(","),e=r.replace("{INVALID_TAGS}",t);return o.a.createElement("p",{className:"wl-faq-edit-item--danger"},o.a.createElement("span",{className:"dashicons dashicons-no-alt"})," ",e)}}}).call(this,n(28))},88:function(t,e,n){"use strict";e.a=class{static isQuestion(t){return t.trim().endsWith("?")}}},9:function(t,e,n){"use strict";function r(){return(r=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}n.d(e,"a",(function(){return r}))},92:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(40),o=n(60);class i{static highlightHTML(t,e,n){const r=document.createElement("div");return r.innerHTML=t,i.highlightNodes(r,e,n),r.innerHTML}static removeHighlightingTagsByClassName(t,e,n){const r=document.createElement("div");r.innerHTML=t;const o=r.querySelectorAll(`${e}[class="${n}"]`);for(let t of o){const e=Array.prototype.slice.call(t.childNodes);for(let n of e)t.parentElement.insertBefore(n,t);t.remove()}return r.innerHTML}static highlightNodesByRange(t,e,n,r,o){for(let s of t)if(0===s.childNodes.length&&s.nodeType===Node.TEXT_NODE&&""!==s.textContent.trim()){if(o.nodesToBeHighlighted.includes(s)||!o.nodesShouldNotBeHighlighted.includes(s)&&r.intersectsNode(s)){const t=document.createElement(e);t.classList=[n],t.textContent=s.textContent,s.parentElement.replaceChild(t,s)}}else i.highlightNodesByRange(s.childNodes,e,n,r,o)}static highlightNodes(t,e,n){for(let r of t.childNodes)if(0===r.childNodes.length&&r.nodeType===Node.TEXT_NODE&&""!==r.textContent.trim()){const t=document.createElement(e);t.classList=[n],t.textContent=r.textContent,r.parentElement.replaceChild(t,r)}else i.highlightNodes(r,e,n)}static removeHighlightingBasedOnType(t,e,n){return e.toLowerCase()===r.c.QUESTION.toLowerCase()?(n=i.removeHighlightingTagsByClassName(n,o.b,t),n=i.removeHighlightingTagsByClassName(n,o.a,t)):e.toLowerCase()===r.c.ANSWER.toLowerCase()&&(n=i.removeHighlightingTagsByClassName(n,o.a,t)),n}}},95:function(t,e,n){}});