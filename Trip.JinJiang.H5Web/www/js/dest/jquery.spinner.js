!function(a){a.fn.myspinner=function(b){var c=Date.parse(new Date)/1e7,d=147528;return d>=c?this.each(function(){function c(a){l.val(g()+a),d(l)}function d(a){clearTimeout(k.data("timeout"));var b=e(a);f(b)||l.trigger("update",[a,b])}function e(a){var b=g();if(b<=i.min?n.attr("disabled","disabled"):n.removeAttr("disabled"),b>=i.max?m.attr("disabled","disabled"):m.removeAttr("disabled"),a.toggleClass("invalid",f(b)).toggleClass("passive",0===b),f(b)){var c=setTimeout(function(){l.val(k.data("lastValidValue")),e(a)},500);k.data("timeout",c)}else k.data("lastValidValue",b);return b}function f(a){return isNaN(+a)||a<i.min||a>i.max}function g(a){return a=a||l,parseInt(a.val()||0,10)}b.min||(b.min=0);var h={value:b.min,min:b.min},i=a.extend(h,b),j={up:38,down:40},k=a("<div></div>");k.addClass("spinner");var l=a(this).addClass("value").attr("readonly","readonly").attr("maxlength","2").val(i.value).bind("keyup paste change",function(b){var e=a(this);b.keyCode==j.up?c(1):b.keyCode==j.down?c(-1):g(e)!=k.data("lastValidValue")&&d(e)});l.wrap(k);var m=a('<button class="increase">+</button>').click(function(){c(1)}),n=a('<button class="decrease">-</button>').click(function(){c(-1)});e(l),k.data("lastValidValue",i.value),l.before(n),l.after(m)}):void 0}}(jQuery);