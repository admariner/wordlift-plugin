!function(e){var n={};function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(i,o,function(n){return e[n]}.bind(null,o));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=292)}({292:function(e,n){jQuery(document).ready((function(e){e(".wl-recipe-ingredient-form").on("submit",(function(n){n.preventDefault(n);const t={_wpnonce:_wlRecipeIngredient.nonce,main_ingredient:e(this).find(".main-ingredient").val(),recipe_id:e(this).find("#recipe_id").val()},i=e(this).find("input.button");i.val(_wlRecipeIngredient.texts.saving),wp.ajax.post("wl_update_ingredient_post_meta",t).done((function(e){i.val(e.btnText)})).fail((function(e){console.log(e),i.val(e.btnText)}))})),e(".main-ingredient").on("change keyup",()=>{const n=e(this).attr("id");e(".main-ingredient").autocomplete({minLength:3,delay:500,source:function(n,t){wp.ajax.post("wl_ingredient_autocomplete",{query:n.term,_wpnonce:_wlRecipeIngredient.acNonce}).done(e=>{t(e)}).fail(e=>{t([{label:_wlRecipeIngredient.texts.noResults,val:-1}]),console.log(e)}),e(this).removeClass("autocomplete-loading")},search:function(){e(this).addClass("autocomplete-loading")},open:function(){e(this).removeClass("autocomplete-loading")},select:function(t,i){if(-1==i.item.val)return e(this).val(""),!1;e("#"+n).val(i)}})})}))}});