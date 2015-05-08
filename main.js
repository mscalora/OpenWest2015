
function outputLine(s, classes) {
    $('#output').show();
    if (classes===false) {
        var block = $('<code>').text(s).addClass('javascript');
        block = $('<pre></pre>').addClass('echo').append(block).appendTo('#output');
        hljs.highlightBlock(block[0]);
    } else if (classes===true) {
        var block = $('<code>').text(s).addClass('javascript');
        block = $('<pre></pre>').append(block).appendTo('#output');
        hljs.highlightBlock(block[0]);
    } else if (classes===null || classes==='response') {
        $('<div>').html(s).addClass('response').appendTo('#output');
    } else {
        $('<div>').text(s).addClass(classes||'').appendTo('#output');
    }
    $('#container').trigger('remiddle');
}

function unmiddle() {
    return $('#container').animate({ marginTop: 0 })
        .promise().then(function(){$('#container').stop();});
}

function remiddle() {
    return $('#container').trigger('remiddle').promise();
}

function clearCmd() {
    $('#cmd').val('');
}

function clear() {
    $('#output').html('').hide();
    remiddle();
}

function focusEnd() {
    var input = $('#cmd');
    var val = input.val();
    input.trigger('focus');
    input.get(0).setSelectionRange(val.length*2,val.length*2);
}

var redial = null;

$('form').on('submit',function(e){
    e.preventDefault();
    e.stopPropagation();
    redial = null;
    var line = $('#cmd').val().trim();
    var last = line.slice(-1);
    var not_js = !!/^[- a-z'",]*$/i.exec(line);
    if (last==='.' || last==='?' || last==='!' || not_js) {
        var response = think(line);
        if (typeof response === 'string') {
            outputLine(line, false);
            outputLine(response,'response');
            $.speak(fixPronunciation(response||'ok'));
            clearCmd();
            history(line);
            return;
        }
    }
    if (line=='') {
        return;
    }
    outputLine(line, false);

    try {
        var v = eval(line);
        if (line.trim().slice(-1)!==';') {
            outputLine(v,'result');
        }
        history(line);
        clearCmd();
    } catch(e) {
        outputLine(e.name + ': ' + e.message,'error');
        history(line, true);
    }
    return false;
});

function loadHistory() {
    if (!document.history) {
        try {
            document.history = JSON.parse(localStorage.history||'{}');
        } catch(e) {
            con.error('Error parsing history data: "%s"',localStorage.history);
        }
        document.history = $.isPlainObject(document.history) ? document.history : {};
    }
}

function loadPageHistory(page_id) {
    loadHistory();
    var html = document.history[page_id];
    $('#history').html(html||'');
}

function historySave(){
    document.history[pageID] = $('#history').html();
    localStorage.history = JSON.stringify(document.history);
}

function history(line, error) {
    var lastLine = $('#history .item:last').text();
    if (line===lastLine) {
        return;
    }
    $('<div>').text(line).addClass('item' + (error? ' had-error':'')).appendTo('#history');
    loadHistory();
}

function historyDelete(all) {
    $(all ? '#history .item' : '#history .item:last').remove();
    historySave();
}

$('.history').on('click', function(){
    if ($('#history > div').length) {
        $('.history, #history').toggleClass('open');
    }
    return false;
});

$('#history').on('click', '.item', function(){
    $('.history, #history').toggleClass('open', false);
    $('#cmd').val($(this).text());
    return false;
});

var edits;

$('#cmd').on('keydown keyup', function(e){
    var down = e.type==='keydown';
    if (down && !e.metaKey && (e.keyCode===38 || e.keyCode===40)) {
        var up = e.keyCode===38;
        historyNav(up);
        return false;
    }
    if (e.metaKey && down && (e.keyCode===37 || e.keyCode===39)) {
        movePage(e.keyCode-38);
        return false;
    }
});

function historyNav(prev) {
    var input = $('#cmd');
    var history = $('#history');
    var items = history.children('div');
    var len = items.length;
    if (!len) {
        return false;
    }
    var line = input.val().trim();
    if (redial===null || (input && input.val()!==items.eq(redial).text())) {
        edits = line;
        redial = prev ? len-1 : 0;
    } else {
        redial = Math.min(len, Math.max(0, redial + (prev ? -1 : 1)));
    }
    if (redial==len) {
        input.val(edits);
        focusEnd();
    } else {
        input.val(items.eq(redial).text());
        focusEnd();
    }
}

$('html,body').on('click', function(){
    var history = $('.history, #history');
    if (history.hasClass('open')) {
        history.toggleClass('open', false);
        return false;
    }
});

function moveHighlight(dir){
    var it = $('.highlight');
    if (it.length) {
        var prev = it.removeClass('highlight');
        it = it[dir>0?'next':'prev'](':not(div)').addClass('highlight');
        if (!it.length && prev.is('li')) {
            prev.parent().addClass('highlight');
            return moveHighlight(dir);
        }
    } else {
        it = $('#slide > *')[dir>0?'first':'last'](':not(div)').addClass('highlight');
    }
    if (it.is('ul')) {
        it.removeClass('highlight');
        it = $('li',it)[dir>0?'first':'last'](':not(div)').addClass('highlight');
    }
    return false;
}

var sz = 100;

$('body').on('keydown keyup', function(e){
    var down = e.type==='keydown';
    //con.log("%s %s %s", e.keyCode, e.metaKey?'M':'-', e.type);
    if (e.metaKey && e.keyCode===75) { // Command-K
        clear();
        $('#container').trigger('remiddle');
        return false;
    }

    if (e.metaKey && e.keyCode===69) { // Command-E
        reset();
    }

    // F5<==>F6, PageUP<=>PageDOWN, CMD-Left<=>CMD-Right
    if (down && (e.keyCode===33 || e.keyCode===34 || e.keyCode===116 || e.keyCode===117 || (e.metaKey && (e.keyCode===37 || e.keyCode===39)))) {
        movePage(e.keyCode==39 || e.keyCode==34 || e.keyCode==117 ? 1 : -1);
        return false;
    }

    if (down &&  e.keyCode===187 && e.ctrlKey) {
        sz += 10;
        $('#command-line').css('font-size', sz+'%');
        return false;
    }

    if (down &&  e.keyCode===189 && e.ctrlKey) {
        sz -= 10;
        $('#command-line').css('font-size', sz+'%');
        return false;
    }

    if (down && (e.keyCode===109 || e.keyCode===107)) {
        moveHighlight(108-e.keyCode);
        return false;
    }

    if (down && e.metaKey && (e.keyCode===38 || e.keyCode===40)) {
        moveHighlight(e.keyCode-39);
        return false;
    }

    if (down && e.ctrlKey && (e.keyCode===221 || e.keyCode===219)) {
        moveHighlight(e.keyCode-220);
        return false;
    }

    if (down && e.metaKey && e.keyCode===46) {
        historyDelete();
    }

    if (down && $('#history').is(':visible') && e.keyCode===27) {
        $('#history').removeClass('open');
    }

    var input = $('#cmd');
    var preset = down && e.metaKey && e.keyCode>=48 && e.keyCode<=60;
    if (preset) {
        var id = e.keyCode-48;
        input.val($('#' + id).html()).trigger('focus');
        return false;
    }

    if (e.keyCode===16) {  // keep track of SHIFT key for shift-click-next/prev
        $('button[type=button]').toggleClass('prev', down);
    }

    if (down && !input.is(':focus') && e.keyCode>=20 && e.keyCode!==91 && e.keyCode!=93 && !e.metaKey && !e.shiftKey && !e.altKey) {
        input.trigger('focus');
    }
});

jQuery.fn.toString = function() {
    var items = [];
    this.each(function(){
        var parts = [].slice.call(this.classList);
        parts.unshift(this.tagName + (this.id ? '#'+this.id : ''));
        items.push(parts.join('.') + (this.name ? '@'+ this.name : ''));
    });
    return 'jQuery['+items.join(', ')+']'
};

con = console;
console = {
    log: function(s) { outputLine('Log: '+s, 'log'); con.log(s); },
    error: function(s) { outputLine('Error: '+s, 'error'); },
    warn: function(s) { outputLine('Warn: '+s, 'warn'); },
    debug: function(s) { outputLine('Debug: '+s, 'debug'); },
    trace: function(s) { outputLine('Trace: '+s, 'trace'); }
};

if (window.hljs) hljs.initHighlightingOnLoad();

jQuery.fn.keepMiddled = function(bottom, options) {
    var it = this.first();
    var opts = $.extend({}, options, jQuery.fn.keepMiddled.defaults);
    function middle() {
        if (it.is(':visible')) {
            var bot = typeof bottom === 'function' ? bottom() : bottom;
            var top = it.offset().top - it.margin().top;
            var height = it.height();
            var newTop = bot - top > height ? (bot - top - height) / 2 : 0;
            it.stop().animate({marginTop: newTop}, {duration: opts.duration})
                .children(':parent').animate({opacity: 1}, {duration: opts.duration});
        }
    }
    middle();
    it.on('remiddle.remiddle', middle);
    $(window).on('resize orientationchange', middle);
};
jQuery.fn.keepMiddled.defaults = {
    duration: 500
};

function speak(s) {
    return $.speak(s);
}

function reset() {
    var content = $('#content');
    content.html(content.data('reset') || '<sectipon><i>Reset</i></section>');
    var output = $('#output');
    output.html(output.data('reset') || '');
}

var pageNum = 0;
var pageID = null;

function slug(s) {
    return (''+s).replace(/[^-a-z0-9_]/gi,' ').trim().replace(/\s+/g,'-')||'id-undefined';
}

function page(num,pass) {
    if (num===undefined) return;
    pageNum = 1*num || 0;
    pageNum = Math.min(pages.length-1, Math.max(0, (pageNum)));
    if (!pass || ''+pageNum!==document.location.hash.slice(1)) {
        document.location.hash = pageNum;
        return;
    }
    var data = pages[pageNum];
    if ($.isArray(data) && data[0]===false) {
        data.splice(0,1);
        data = data.length===1 ? data[0] : data;
    }
    $('*').css('outline','');
    $('#title, #content, #slide, #output, #scripts').html('');
    $('#content, #output').removeData('reset');
    $('#cmd').val('');
    $('#output').hide();
    $('#container').css({marginTop: 0})
        .children(':parent').css({opacity: 0.01});
    if ($.isArray(data)) {
        pageId = slug(data[1]||'pageNum-'+pageNum);
        loadPageHistory(pageID);
        for (var i = 0; i<data.length;) {
            var node = $('<'+data[i++]+'>');
            var value = data[i++];
            if ($.isArray(value)) {
                for (var j = 0; j<value.length;) {
                    var subnode = $('<'+value[j++]+'>');
                    var subvalue = value[j++];
                    subnode.html(subvalue).appendTo(node);
                }
                node.appendTo('#slide');
            } else {
                node.html(value).appendTo('#slide');
            }
        }
        var long = $('#long');
        if (long.length) {
            long.prop('checked',long_version);
            long.off('change').on('change',function(){
                localStorage.long_version = long.prop('checked') ? 1 : 0;
                document.location.reload();
            });
        }
    } else {
        pageID = slug(data);
        loadPageHistory(pageID);
        $.get(data,function(response){
            var re = /<script[^>]*id=['"]([^'"]+)['"][^>]*>((.|\n)*?)<\/script>/gmi;
            var r;
            while (r = re.exec(response)) {
                $('#scripts').append(r[0]);
            }
            var re2 = /<body[^>]*>((.|\n)*)<\/body>/mi;
            r = re2.exec(response);
            if (r) {
                $('#content').html(r[1]).data('reset', r[1]);
            }
            var re3 = /<title[^>]*>((.|\n)*)<\/title>/mi;
            r = re3.exec(response);
            if (r) {
                var title = r[1];
                $('#title').html(title);
            }
            outputLine('<b>'+(title||data)+' demo loaded</b>',null)
            outputLine($('#source').html().trim().replace(/\n {4}/g,'\n'), true);
            $('#output').data('reset', $('#output').html());
        });
    }
}

function movePage(dir) { // -1 or 1
    pageNum = Math.min(pages.length-1, Math.max(0, (pageNum+dir)));
    document.location.hash = pageNum;
}

function start(){
    page(0);
}

function end(){
    page(9999);
}

$('button[type=button]').on('click',function() {
    var inc = $(this).hasClass('prev') ? -1 : 1;
    movePage(inc);
});

$(window).on('hashchange',function(){
    page((document.location.hash||'0').replace('#',''), true);
    remiddle();
}).trigger('hashchange');

$('#container').keepMiddled(function(){
    return $('#command-line').offset().top}
);

var voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Karen'; })[0];
if (voice) {
    voice.rate = 0.2;
    $.speak.defaults.voice = voice;
}

$('#output').on('focus', function(){
    $('#command-line').addClass('top');
}).on('blur', function(){
    $('#command-line').removeClass('top');
});
