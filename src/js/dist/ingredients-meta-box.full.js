!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=293)}({293:function(e,t){jQuery((function(e){e(".wl-recipe-ingredient-form__submit").on("click",(function(t){t.preventDefault(t);const n=e(".wl-table--main-ingredient__data");let r=[];n.each((t,n)=>{const i=e(n).find("#recipe-id").val(),o=e(n).find("input[name='main_ingredient[]']").val();i&&o&&r.push({recipe_id:i,ingredient:o})});const i={_wpnonce:_wlRecipeIngredient.nonce,data:JSON.stringify(r)};wp.ajax.post("wl_update_ingredient_post_meta",i).done((function(e){wp.data.dispatch("core/notices").createNotice("success",e.message,{type:"snackbar",isDismissible:!0})})).fail((function(e){wp.data.dispatch("core/notices").createNotice("error",e.message,{type:"snackbar",isDismissible:!0})}))}))}))}});