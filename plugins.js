(function($){
    function sig(el) {

        var it = $(el ? el : this).first();
        if (it.length) {
            var dom = it[0];
            var parts = [].slice.call(dom.classList || dom.className ? dom.className.split() : []);
            parts.unshift(dom.tagName + (dom.id ? '#' + dom.id : ''));
            var attr = '';
            for (name in ["name", "type"]) {
                var value = it.attr(name);
                if (value !== undefined) {
                    attr += '@' + name + '="' + value + '"';
                }
            }
            return parts.join('.') + attr;
        }
    }

    $.fn.sig = sig;

    $.fn.toString = function() {
        var items = [];
        this.each(function(){
            items.push(sig(this));
        });
        return 'jQuery['+items.join(', ')+']'
    };

    $.fn.outln = function(options) {
        return this.css('outline', options||'4px dashed red');
    };

    $.fn.rect = function() {
        var it = this.filter(':visible').first();
        if (it.length) {
            var rect = it.offset();
            offset.right = offset.left+it.width();
            offset.bottom = offset.top+it.height();
            return offset
        }
    }
}(jQuery));

(function($) {

    $.getSelectedText = function() {
        var text = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                text = container.innerText;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                text = document.selection.createRange().text;
            }
        }

        return text.replace(/\s+/g, " ");
    }

    var speechUtteranceChunker = function (utt, options, callback) {
        opts = $.extend({}, options, { chunkLength: 160 });
        var chunkLength = opts.chunkLength;
        var pattRegex = new RegExp('^.{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[\.\!\?\,]{1}|^.{1,' + chunkLength + '}$|^.{1,' + chunkLength + '} ');
        var txt = (opts.offset !== undefined ? utt.text.substring(opts.offset) : utt.text);
        var chunkArr = txt.match(pattRegex);
        if (chunkArr[0] !== undefined && chunkArr[0].length > 2) {
            var chunk = chunkArr[0];
            var newUtt = new SpeechSynthesisUtterance(chunk);
            for (var x in utt) {
                if (utt.hasOwnProperty(x) && x !== 'text') {
                    newUtt[x] = utt[x];
                }
            }
            newUtt.onend = function () {
                opts.offset = opts.offset || 0;
                opts.offset += chunk.length - 1;
                speechUtteranceChunker(utt, opts, callback);
            };
            setTimeout(function () {
                speechSynthesis.speak(newUtt);
            }, 0);
        } else {
            if (callback !== undefined) {
                callback();
            }
        }
    };

    $.speak = function(words, options) {
        var opts = $.extend({}, options, $.speak.defaults);
        var deferred = $.Deferred();
        var text;
        if (typeof words === "string" || $.isNumeric(words)) {
            text = ''+words;
        } else if (words instanceof jQuery) {
            text = words.text();
        } else if (words===undefined || words===null) {
            text = $.getSelectedText();
        } else {
            text = ''+words;
        }

        speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.2;
        var props = ["voice", "rate", "volume", "lang", "pitch"];
        for (var i = 0; i<props.length; i++) {
            if (opts[props[i]]!==undefined) {
                if (props[i]==='voice' && typeof opts.voice === 'string') {
                    var voice = speechSynthesis.getVoices()
                        .filter(function(voice) { return voice.name == opts.voice; })[0];
                    if (voice) {
                        utterance.voice = voice;
                    } else {
                        if (opts.debug) {
                            console.warn("The voice '"+opts.voice+"' was not found.")
                        }
                    }
                } else {
                    utterance[props[i]] = opts[props[i]];
                }
            }
        }

        speechUtteranceChunker(utterance, opts, function () {
            deferred.resolve();
        });
        return deferred.promise();
    }

    $.speak.defaults = {
        rate: 0.9,
        voice: "Victoria",
        debug: false
    };

    $.fn.speak = function(options){
        var promise = $.speak(this, options);
        this.promise = function() {
            return promise;
        }
        return this;
    }

})(jQuery);
