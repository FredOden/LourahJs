var Lourah = Lourah || {};
(function () {
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.debug.js");
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.text = Lourah.utils.text || {};

    function nothing() {
      return () => 0;
      }

    Program = function(parsed) {
      this.run = () => this.generated();
      this.generated = parsed?parsed.$$():nothing;
      }

    var perfmeter;

    var cacheParsed;


    Lourah.utils.text.Parser = function(lexicon, rules, topLevelRule) {
      this.compile = (code) => {
        //perfmeter = new Lourah.debug.Bench("Parser");
        cacheParsed = new CacheParsed();
        var tokens = lex(lexicon, code);
        var program = parse(rules[topLevelRule], topLevelRule, tokens, 0, [[topLevelRule,0]], {});
        //console.log("perfmeter::" + perfmeter);
        console.log("cacheParsed::" + cacheParsed);
        console.log("max depth::" + maxDepth);
        return new Program(program);
        }

      function lex(lexicon, text) {
        var tokens = [];
        var read = new Lourah.utils.text.SearchString(text);
        for(var tok in lexicon) {
          read.search(lexicon[tok].re)
          .process(($, match, i) => {
              tokens.push({token:tok, match:match/*,$$:() => () => match.$(0)*/})
              // discard
              return " ".repeat($.length);
              });
          }
        read.search(/[^\s]/g)
        .walk((match, i) => {
            throw ("lex::error::Invalid sequence::'" + match.$(0) + "'::at::" + match.getFrom());
            });
        tokens.sort((a,b) => a.match.getFrom() - b.match.getFrom());

        return tokens;
        }

      var depth = 0;
      var maxDepth = 0;
      var keys = {};
      var lastError = "";
      var syntaxes = {};
      var subRules = {};
      var brokenRules = {};

      function CacheParsed() {
        var cache = {};
        var c = 0;
        var cCalled = 0;
        var cUsed = 0;
        var broken = {};
        var b = 0;
        var bUsed = 0;
        var bCalled = 0;
        this.cache = (parsed, rule, at) => {
          if (!cache[rule]) cache[rule] = {};
          cache[rule][at] = parsed;
          c++;
          };

        this.find = (rule, at) => {
          cCalled++;
          if (!cache[rule]) return undefined;
          var r = cache[rule][at];
          if (r) cUsed++;
          return r;
          };
        
        this.setBreak = (rule, at) => {
          if (!broken[rule]) broken[rule] = {};
          broken[rule][at] = true;
          b++
          }
        
        this.isBroken = (rule, at) => {
          bCalled++;
          if (!broken[rule]) return false;
          var r = broken[rule][at];
          if (r) bUsed++;
          return r;
          }
        
        this.toString = () => {
          return "parsed::" +c + "(" + [cCalled, cUsed] + ")::broken::" + b + "(" + [bCalled, bUsed] + ")";
          };
        }

      function Parsed(syntax, at, tryRule, name, elements) {
        //perfmeter.tip();
        this.syntax = syntax;
        this.at = at;
        //this.rule = tryRule;
        //this.name = name;
        this.refs = [name, tryRule];

        this.elements = elements

        //this.length = syntax.length
        this.val;
        this.handler = rules[name][tryRule] || nothing;
        this.$$().p = this;
        //perfmeter.top();
        };

      Parsed.prototype.$ = function(i, j) {
        if (this.elements[i].token) {
          return () => {
            return this.elements[i].match.$(j?j:0);
            }
          }
        return this.elements[i].$$();
        }


      Parsed.prototype.$$ = function() {
        try {
          return this.handler(this);
          } catch(e) {
          throw "$$::" + [this.refs[0],this.refs[1]] + "::error::" + e + "::" + e.stack;
          }
        }


      function dump(aTok) {
        var s = "[";
          aTok.forEach((e, i) => s = s + e.token + "(" + e.match.$(0) + ")" + (i !== (aTok.length - 1)?",":""));
          s += "]";
        return s;
        }



      function parse(rule, name, tokens, atStart, ancestors, forbiddenRules) {

        /*
        function indent(tr) {
          return " ".repeat(depth)+"::" +name +"::" + ((tr)?(tr + "::"):"");
          }
        */


        depth ++;
        if (depth > 1000) {
          console.log("parse::tooDeep::" + depth);
          throw "parse::tooDeep::" + depth;
          }

        if (depth > maxDepth) maxDepth = depth;
        var found;

        if (!keys[name]) {
          keys[name] = Object.keys(rule).sort((a, b) => b.split(' ').length - a.split(' ').length);
          }


        var error = true;

        rulesLoop:
        for(var k = 0; k < keys[name].length; k++) {
          var tryRule = [keys[name][k]][0];
          /*@@@*/
          //if (tryRule in forbiddenRules) {
          var forbiddenTryRule = forbiddenRules[tryRule];

          if (forbiddenTryRule) {

            if (forbiddenTryRule.indexOf(atStart) !== -1) {
              //console.log(indent(tryRule) + "SKIP RULE::" + atStart);
              continue;
              }

            }
            //}

          /*@@@*/
          if (cacheParsed.isBroken(tryRule, atStart)) {
            continue;
            }


          var pc;
          pc = cacheParsed.find(tryRule, atStart);
          if(pc != undefined) {
            return pc;
            }

          /*@@@*/
          if (!syntaxes[tryRule]) {
            syntaxes[tryRule] = tryRule.split(' ');
            }

          var syntax = syntaxes[tryRule];
          var at = atStart;
          var elements = [];
          elementsLoop:
          for(var iElement = 0; iElement < syntax.length; iElement++) {
            var element = syntax[iElement];


            try {
              if (tokens[at + iElement].token !== element) {
                if (element.charAt(0) === "&") {
                  if (!subRules[element]) {
                    subRules[element] = [element.substring(1)];
                    }
                  subRule = subRules[element];


                  /*@@@*/

                  // @@@skip recursion
                  var current = [ subRule[0], at + iElement ];
                  //console.log(indent(tryRule) +"current::" + current + "::ancestors::" + ancestors);
                  forbidden = forbiddenRules;
                  var foundAncestor = false;
                  for(var i = 0; i < ancestors.length; i++) {
                    ancestor = ancestors[i];
                    if (ancestor[1] === current[1]) {
                      if (ancestor[0] === current[0]) {
                        // how to skip ???
                        //console.log(indent(tryRule) + "TO  SKIP::[" + current + "]:");
                        foundAncestor = true;
                        //forbidden = JSON.parse(JSON.stringify(forbiddenRules));
                        forbidden = {};
                        for(var kr in forbiddenRules) {
                          forbidden[kr] = forbiddenRules[kr]//.slice();
                          }

                        if (!forbidden[tryRule]) {
                          forbidden[tryRule] = [at + iElement];
                          }
                        else if (forbidden[tryRule].indexOf(at + iElement) === -1) {
                          (forbidden[tryRule] = forbidden[tryRule].slice(0)).push(at + iElement);
                          }
                        break;
                        //continue rulesLoop;
                        }
                      }
                    }

                  //console.log(indent(tryRule) + "forbidden::" + JSON.stringify(forbidden));
                  var heritage;
                  if (foundAncestor) {
                    heritage = ancestors;
                    } else {
                    heritage = ancestors.slice();
                    heritage.push(current);
                    }
                  //console.log(indent(tryRule) + "heritage::" + heritage);

                  /*@@@*/
                  //console.log("CALL::" + subRule[0] + "::" + (at + iElement));
                  var parsed = parse(rules[subRule[0]], subRule[0], tokens, at + iElement, heritage, forbidden);
                  //console.log("CALLED::" + parsed);
                  if (!parsed) {
                    //brokenRules[tryRule] = at;
                    //console.log("BREAK::" + subRule[0] + "::" + (at + iElement));
                    cacheParsed.setBreak(tryRule, atStart);
                    break;
                    }

                  elements[iElement] = parsed;
                  at = parsed.at +  parsed.syntax.length - 1 - iElement;
                  error = false;
                  continue;
                  } else {
                  //brokenRules[tryRule] = at;
                  cacheParsed.setBreak(tryRule, atStart);
                  //console.log("BREAK::" + subRule[0] + "::" + (at + iElement));
                  break;
                  }
                }
              } catch(e) {
              // reached "EOF"
              break;
              }

            elements[iElement] = tokens[at + iElement];
            error = false;
            }

          if (iElement === syntax.length) {
            var p = new Parsed(syntax, at, tryRule, name, elements);
            cacheParsed.cache(p, tryRule, atStart);
            found = p;
            lastError = "";
            break;
            } else {
            if (iElement > -1) { //=== syntax.length -1) {
              if (tokens[at + iElement] /* && syntax[iElement].charAt(0) != '&' */) {
                /* lastError = lastError
                + "expected "
                + syntax[iElement]
                + " got "
                + tokens[at + iElement].match.$(0)
                + " at "
                + tokens[at +iElement].match.getFrom() 
                + '\n'
                ;
                */
                }
              }
            }

          }
        depth--;
        if (depth === 1) {
          if (lastError) console.log("Error::" + lastError + "::" + depth);
          }
        return found;
        }

      };

    Lourah.utils.text.Parser.NOTHING = nothing;
    Lourah.utils.text.Parser.TOKENS = {
      Number : {
        re : /\b((?:0x[0-9a-f]+)|(?:\d*[.]?\d+(?:(?:[E|e][+\-]?)\d*[.]?\d+)?))\b/g
        }
      ,Identifier : {
        re : /([A-Za-z_][0-9A-Za-z_]*)/g
        }
      };

    })();
