var pages =
[
    [
        'h1', 'The Chrome Browser<br>is strongly reccomended',
        'h2', 'The Text-to-Speech API used<br>'+
            'by this web site have only<br>'+
            'verified as functional in Chrome',
        'section', '<a href="https://www.google.com/chrome/index.html">Get Chrome<a/>',
        'h4', '<i>Continue at your own peril...</i>'
    ],
    [
        'h1', 'Intermediate jQuery',
        'h2', 'Part 2',
        'section', 'Mike Scalora',
        'section', 'Twitter: @mscalora',
        'section', 'GitHub ID: mscalora',
        'section', 'GitHub Repo: https://github.com/mscalora/OpenWest2015',
        'section', 'Live Site: <b>http://tinyurl.com/ij-part2</b>',
        'note', 'Poll: how many attended last year?',
        'note', 'Presentation on GitHub',
        'div', '<label style="font-size: 80%;"><input id="long" type="checkbox"/> long version</label>',
        'div', "<script id='1' type='application/text'>$('body').on('keydown',function(e){console.log(e.keyCode)});</script>",
    ],
    [
        'h2', 'Roadmap',
        'ul', [
            'li', 'Command Plugins',
            'li', 'Selector Plugins',
            'li', 'jQuery Promises 101',
            'li', 'Function Plugins',
            'li', "Custom Animation if there's time",
            'note', '',
        ]
    ],
    [   false,
        'h2', 'Why Create A Plugin?',
        'ul', [
            'li', 'Modularity',
            'li', 'Scope/Namespace',
            'li', 'Reuse',
            'li', 'Cleaner code',
            'li', 'More consistent API'
        ]
    ],
    [   false,
        'h2', "What is $?",
        'div', "<script id='1' type='application/text'>($==jQuery)</script>",
    ],
    [   false,
        'h2', "What is jQuery?",
        'div', "<script id='1' type='application/text'>(typeof jQuery)</script>",
        'div', "<script id='2'>jQuery.toString()</script>"
    ],
    [   false,
        'h2', "What does jQuery(a, b) return?",
        'div', "<script id='1' type='application/text'>typeof jQuery('*')</script><script id='2'>jQuery('*').toString()</script>",
        'div', "<script id='3' type='application/text'>z = $('div[id]')</script>",
        'div', "<script id='4' type='application/text'>z.filter(':empty')</script>",
    ],
    [
        'h2', 'Custom jQuery Methods',
        'h2', 'a.k.a. Command Plugins',
        'ul', [
            'li', 'just a method/function',
            'li', 'this',
            'li', '[ ] of 0 or more elements',
            'li', 'think chainability',
            'li', 'use options objects',
            'li', 'avoid the global namespace'
        ]
    ],
    'example-1-A.html',
    [false, 'example-1-B.html'],
    [false, 'example-1-C.html'],
    'example-1-D.html',
    [
        'h2', 'Pseudo Selector Plugins',
        'section', 'Examples: <b>:text</b>  and  <b>:contains(<i>string</i>)</b>',
        'ul', [
            'li', 'just a function',
            'li', 'called for a single element',
            'li', 'return true or false',
            'li', 'first parameter is a DOM node',
            'li', 'YOUR parameter(s) are ONE string'
        ],
    ],
    'example-2-A.html',
    'example-2-B.html',
    'example-2-C.html',
    [
        'h2', "jQuery's Deferred/Promise Classes",
        'h3', 'Callback utility with conventions',
        'ul', [
            'li', 'States: pending, resolved, rejected',
            'li', 'Callbacks: progress, done, fail, always',
            'li', 'Not reusable',
            'li', 'Deferred - publisher API',
            'li', 'Promise - subscriber API',
        ],
    ],
    'example-3-A.html',
    'example-3-B.html',
    [
        'h2', "Utility Method Plugin",
        'ul', [
            'li', 'just a function',
            'li', 'hanging off the jQuery function',
            'li', 'namespace',
        ],
    ],
    'example-4-A.html',
    [
        'h2', "Custom Animation",
        'h3', 'Bonus Content',
        'ul', [
            'li', 'NOT just a function',
            'li', 'really complex API',
            'li', 'top 3 things to remember',
            'div','<ol style="margin-left:1em;"><li><b>step</b> (callback)</li><li><b>now</b> (param)</li><li><b>fx</b> (param)</li></ol>',
        ],
    ],
    'example-5-A.html',
    'example-5-B.html',
    'example-5-C.html',
    ['h1', '<div style="font-size: 200px; font-family: fantasy; margin-bottom: 0;">fin</div>']

];

if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
    pages.shift();
}

var long_version = !!localStorage && localStorage.long_version==='1';

if (!long_version) {
    for (var idx = pages.length - 1; idx >= 0; idx--) {
        if ($.isArray(pages[idx]) && pages[idx][0] === false) {
            pages.splice(idx, 1);
        }
    }
}
