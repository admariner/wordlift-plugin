!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=227)}({0:function(t,e){t.exports=window.React},193:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));const o=t=>void 0!==t&&void 0!==t.tagName&&void 0!==t.id&&void 0!==t.classList&&"SPAN"===t.tagName&&t.classList.contains("textannotation")},20:function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},227:function(t,e,n){"use strict";n.r(e),function(t){n(0);var e=n(31),o=n(26),r=n(193);n(228);t.tinymce.PluginManager.add("wl_tinymce_2",(function(t){t.on("NodeChange",n=>{Object(e.trigger)(o.d,{selection:t.selection.getContent({format:"text"}),editor:t,editorType:"tinymce"}),console.log(o.d,{selection:t.selection.getContent({format:"text"}),editor:t,editorType:"tinymce"});const i=void 0!==n&&Object(r.a)(n.element)?n.element.id:void 0;Object(e.trigger)(o.a,i)})}))}.call(this,n(20))},228:function(t,e,n){},26:function(t,e,n){"use strict";n.d(e,"d",(function(){return o})),n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return c})),n.d(e,"e",(function(){return u}));const o="wordlift.selectionChanged",r="wordlift.annotationChanged",i="wordlift",c="core/editor",u="wordlift/editor"},31:function(t,e){t.exports=Backbone}});