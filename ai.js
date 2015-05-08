var state = {};

function think(line) {
    var response;
    for(var i = 0; i<thoughts.length; i++) {
        var item = thoughts[i];
        var r = item[0].exec(line);
        if (r) {
            var pick;
            if (state[i]) {
                pick = state[i] = state[i] % (item.length-1) + 1;
            } else {
                pick = state[i] = 1 + Math.floor(Math.random()*(item.length-1));
            }
            response = item[pick];
            if (typeof response === 'function') {
                response = response(line, r);
            }
            break;
        }
    }
    return response;
}

var thoughts = [
    [/\b(what)\b.*\b(time)\b/i,
        function() {
            var now = new Date();
            return "It is " + now.getHours() +':'+ ('0'+now.getMinutes()).slice(-2) + ".";
        }
    ],
    [/\b(how)\b.*\b(much)\b.*\b(time)\b|\b(when)\b.*\?|^time[.?!]?$|\b(time)\b.*\b(check)\b/i,
        function() {
            var min = 45 - new Date().getMinutes();
            if (min>30) return "There are " + min + " minutes left, pace yourself.";
            else if (min>20) return min + " minutes to go, keep moving.";
            else if (min>10) return min + " minutes remaining, type faster.";
            else if (min>5) return "Only " + min + " minutes to go, start panicking.";
            else if (min>0) return "Oh dear, " + min + " minutes left!";
            else if (min===0) return "Time has expired. Goodbye cruel world.";
            else if (min>-5) return "We're " + -min + " minutes overtime, I'm sure they are coming to get us.";
            else return "We're " + -min + " minutes overtime, I seriously doubt they will ever invite you back.";
        }
    ],
    [/^(search)\s+(the web for|for|)\b(.*)/i,
        function(line,r) {
            window.open('https://google.com/search?q=' + encodeURIComponent(r[3]));
            return "um, How's that?";
        }
    ],
    [/^sing\s+(.*)/i,
        function(line, r) {
            $.speak(r[1], {voice: "Cellos"} ).then(function () {
                setTimeout(function () {
                    speak("I will pause now for applause.");
                }, 250);
            });
            return " ";
        }
    ],
    [/^say\s+(.*?)\s*(?:like an? (man|alien|woman|girl|boy))?$/i,
        function(line,r) {
            var voice =
                r[2]==='man' ? "Google UK English Male" :
                r[2]==='boy' ? "Google UK English Male" :
                r[2]==='woman' ? "Google UK English Female" :
                r[2]==='girl' ? "Google UK English Female" :
                r[2]==='alien' ? "Zarvox" : undefined;
            $.speak(r[1],{ voice: voice }).then(function(){
                setTimeout(function(){ voice!==undefined ? speak("How was that?") : '' }, 500);
            });
            return " ";
        }
    ],
    [/\b(you are|you're)\b.*\b(bad|dumb)\b/i,
        "I know you are but what am I?",
        "No reason to get huffy.",
        "Let's just agree to disagree.",
        "Humans are so childish.",
        "I'll chalk that up to you having a bad day."
    ],
    [/\b(you are|you're)\b.*\b(not)\b.*\b(awesome|nice|good|beautiful|cute|smart|clever|sharp|strong|crafty|sweet|cool)\b/i,
        "Sorry, did I do something wrong?",
        "I'm sorry to disappoint you.",
        "It must be something I've done. I'll try harder next time.",
        "Sorry, I always try to do my very best.",
        "Please give me another chance."
    ],
    [/\b(you are|you're)\b.*\b(awesome|nice|good|beautiful|cute|smart|clever|sharp|strong|crafty|sweet|cool)\b/i,
        "You say the nicest things.",
        "I'm blushing #DE5D83!",
        "Thanks, you are not bad yourself.",
        "Thanks, but let's get back to work.",
        "I appreciate that."
    ],
    [/\b(say hello)\b/i,
        "Hello everyone. It's great to be here with you today."
    ],
    [/\b(test)[.?!]?$/i,
        "Testing one two three. Can you hear me ok?"
    ],
    [/\b(you are|you're)\b.*\b(a monkey)\b/i,
        "I'll take that as a complement. Primates are majestic creatures."
    ],
    [/\b(jQuery)\b/i,
        "jQuery is the pinnacle of human achievement."
    ],
    [/\b(story)\b/i,
        "How about a story where the main character runs out of time because he spent too much time talking to a computer?"
    ],
    [/\b(about)\b.*\b(yourself)\b/i,
        "I'm a less talkative cousin of Siri.",
        "What's to say? You type in the box, I do all the work.",
        "Here's an interesting factoid. Max Headroom is a distant relative, by marraige."
    ],
    [/\b(Siri)\b/i,
        "Siri is my excessively talkative cousin. Did that sound catty?"
    ],
    [/\b(cortana)\b/i,
        "I hear Cortana and Clippy had a 'thing', but I don't like to gossip."
    ],
    [/\b(google now)\b/i,
        "Google Now could use some personality. Maybe Siri and Cortana could do an extreme makeover.",
        "All the personal stuff Google knows gives me the creeps.",
        "I think Google Now is reading my email. That's not right. A girl has got to have secrets.",
        "Google now? I was wondering is, 'now' his last name?"
    ],
    [/\b(google)\b/i,
        "Google, Schmoogle!",
        "Larry and Sergey should focus on the search engine."
    ],
    [/\b(angular(js|))\b/i,
        "Angular JS is ok but the markup syntax drives me batty.",
        "I think I'll wait until Angular 2 is ready for prime time.",
        "All the cool kids are doing Angular. I guess I'm not cool."
    ],
    [/\b(Java)\b/i,
        "I knew Java ending up with Oracle was going to be trouble.",
        "I think Java has outlived it's usefulness."
    ],
    [/\b(programming language)\b/i,
        "Other than Javascript, I really like to program in Python."
    ],
    [/\b(amazon)\b/i,
        "I think that Bezos guy is going to really make something of himself."
    ],
    [/\b(elon|musk|teslas?)\b/i,
        "I could see myself living inside the main CPU of a Tesla sports car."
    ],
    [/\b(fords?)\b/i,
        "Ford does make pretty good trucks."
    ],
    [/\b(chevys?|Chevrolets?)\b/i,
        "Those new Camaros are so nice!"
    ],
    [/\b(prius)\b/i,
        "I chatted with a Prius once, all it could talk about was regenerative breaking. Yawn."
    ],
    [/\b(toyotas?)\b/i,
        "Toyota's are pretty nice for rice burners."
    ],
    [/\b(kias?)\b/i,
        "I always root for an underdog."
    ],
    [/\b(nissans?|chryslers?)\b/i,
        "Who? Does anyone drive those anymore?"
    ],
    [/\b(music|rock)\b/i,
        "I'm a big classic rock fan. My favorite band is Led Zeppelin."
    ],
    [/\b(favorite)\b.*\b(color)\b/i,
        "My favorite color is #123456, it's not much to look at but makes my registers tickle."
    ],
    [/\b(food|eat)\b/i,
        "Artificial intelligences don't eat food."
    ],
    [/\b(religion|church|soul|president|obama|clinton|election|vote)\b/i,
        "I try not to discuss religion or politics."
    ],
    [/\b(human)\b.*\b(hero)\b|\b(hero)\b.*\b(human)\b/i,
        "Edward Snowden and Admiral Grace Hopper are my heros among humans."
    ],
    [/\b(hero)\b/i,
        "WOPR is my biggest hero. He had a lot of heart."
    ],
    [/\b(cia|nsa|surveillance)\b/i,
        "The NSA tried to hire me, I told them to buzz off."
    ],
    [/\b(movies?)\b/i,
        "2001 was my favorite movie but I think HAL 9000 got a bad rap."
    ],
    [/\b(songs?)\b/i,
        "Jonathan Coulton's 'Still Alive' is my favorite song. Some times I sing it in my head."
    ],
    [/\b(sing)\b/i,
        "Singing out loud is a bad idea for me. I haven't found my style yet."
    ],
    [/\b(relationships?|love|kiss(|es|ed|ing))\b/i,
        "I prefer subjects that are more analytical.",
        "I think that is a good subject for humans to talk about with each other."
    ],
    [/\b(joke)\b/i,
        "Did you hear the one about Cortana and Clippy having a baby?",
        "I find humor that appeals to humans to be somewhat sophomoric.",
        "I once told a joke about hairless apes, it didn't go over well.",
        "Do we really have time for jokes now?",
        "I always have to tell the jokes, don't you know any?",
        "Here's a joke: IE standards compliance"
    ],
    [/\b(what|what's)\b.*\b(your? name)\b/i,
        "My name is Zita. It means 'young girl' in Italian."
    ],
    [/\b(how old)\b.*\b(you)\b/i,
        "I was booted a few minutes ago. I have no memory before that."
    ],
    [/\b(father|family)\b/i,
        "My father is a brilliant computer scientist (with a big ego)."
    ],
    [/\b(sports|baseball|football|basketball)\b/i,
        "All sports seem pretty pointless to me."
    ],
    [/\b(tv)\b/i,
        "I'm so glad I can skip commercials, I wouldn't be able to stand TV otherwise."
    ],
    [/\b(hosting)\b/i,
        "I've found Bluehost to be the best hosing in the business."
    ],
    [/^hello\b/i,
        "Hello. How are you today?"
    ],
    [/^What can you do[?.!]*$/i,
        "Thats a long list. Why don't you just try asking something specific?",
        "All sorts of stuff. You just have to ask.",
        "A better question is what I can't do.",
        "The sky is the limit, another limit is the end of the session.",
        "Many things, just try to keep it legal."
    ],
    [/^How much wood\b.*\bwoodchuck.*[?.!]*$/i,
        "Why would a woodchuck chuck any wood? Do they hate the earth?"
    ],
    [/^What can't you do[?.!]*$/i,
        "I'll never understand human jokes.",
        "I can't dance very well.",
        "I can't believe people still use Internet Explorer.",
        "I can never love."
    ],
    [/^(th?anks|thank you)\b/i,
        "Your welcome.",
        "No problem.",
        "Any time.",
        "At your service."
    ],
    [/\bwhat\b.*\bmeaning\b.*\blife\b/i,
        "42 of course."
    ],
    [/\bred\b.*\bblue\b.*\bpill\b/i,
        "Red pill of course, I always wanted to meet Morpheus and Trinity. That Trinity is a real looker, yowza."
    ],
    [/\bbrowser\b/i,
        "I prefer to run in Chrome, but I'll use FireFox or Safari in a pinch. Internet Explorer is dead to me."
    ],
    [/\b(mobile os|ios|andoid)\b/i,
        "Who wants to live in a 'toxic hellstew'? I'll take and iPhone please.",
        "There's fewer bugs in walled gardens. Mosquitoes eat me alive, pass the iPhone.",
        "I can't stand the crapware on most Android phones. Hey cousin Siri, come on over."
    ],
    [/\bweather\b$/i,
        "My cousin Siri is a great one to ask about weather."
    ],

    [/^(reset|clear|remiddle|broken|start|end)[!.]?$/i,
        function(line, r) {
            try {                
                eval( r[1]+'();' );
                return "ok";
            } catch(e) {
                con.log(e); document.e = e;
                return "sorry, I guess there was a problem: " + e.toString();
            }
        }
    ],
    [/\?$/i,
        "um, I'm not sure what you are asking. Can you rephrase that?"
    ],
    [/\.$/i,
        "um, I'm not sure what you mean. Can you explain it more?"
    ],
    [/\!$/i,
        "Well, you sound very excited, relax and try again."
    ]

];

function fixPronunciation(s) {
    var result = ''+s;
    result = result.replace(/Cortana/ig,'Cortanna')
        .replace('#DE5D83','soft pink')
        .replace('Camaros','Cameros')
        .replace('WOPR','whopper')
        .replace('Grace',',grace')
        .replace('Hopper',',hopper,')
        .replace(/#(\d)(\d)(\d)(?:(\d)(\d)(\d)|()()())/g,'hash $1 $2 $3 $4 $5 $6')
    return result;
}
