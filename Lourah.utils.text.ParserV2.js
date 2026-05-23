var Lourah = Lourah || {};
(function () {
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.text = Lourah.utils.text || {};

    function nothing() {}

    Lourah.utils.text.Parser = function(lexic, grammar, ctx) {
      var lexicon = lexic;
      var rules = grammar;
      var context = ctx;

      this.setLexicon = (lexic) => {
        lexicon = lexic;
        return this;
        }
      this.getLexicon = () => lexicon;

      this.setRules = (grammar) => {
        rules = grammar;
        return this;
        }
      this.getRules = () => rules;
      this.setContext = (ctx) => {
        context = ctx;
        return this;
        }
      this.getContext = () => context;

      this.compile = (code, rule) => {
        var tokens = lex(lexicon, code);
        return parse(rules[rule], rule, tokens, 0, [[rule,0]], {});
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


      function parse(rule, name, tokens, atStart, ancestors, forbiddenRules) {

        function indent(tr) {
          return " ".repeat(depth)+"::" +name +"::" + ((tr)?(tr + "::"):"");
          }

        function dump(aTok) {
          var s = "[";
            aTok.forEach((e, i) => s = s + e.token + "(" + e.match.$(0) + ")" + (i !== (aTok.length - 1)?",":""));
            s += "]";
          return s;
          }



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
          var tryRule = keys[name][k];

          if (forbiddenRules[tryRule]) {
            //console.log(indent(tryRule) + "isForbidden::at::" + atStart + "::[" + forbiddenRules[tryRule] +"]");
            if (forbiddenRules[tryRule].indexOf(atStart) !== -1) {
              //console.log(indent(tryRule) + "SKIP RULE::" + atStart);
              continue;
              }
            }

          var syntax = tryRule.split(' ');
          var at = atStart;
          var elements = [];
          elementsLoop:
          for(var iElement = 0; iElement < syntax.length; iElement++) {


            var element = syntax[iElement];
            try {
              if (tokens[at + iElement].token !== element) {
                if (element.charAt(0) === "&") {
                  var subRule = element.substring(1);
                  // @@@skip recursion
                  var current = [ subRule, at + iElement ];
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
                        for(kr in forbiddenRules) {
                          forbidden[kr] = forbiddenRules[kr].slice();
                          }

                        if (!forbidden[tryRule]) {
                          forbidden[tryRule] = [];
                          }
                        if (forbidden[tryRule].indexOf(at + iElement) === -1) {
                          forbidden[tryRule].push(at + iElement);
                          }
                        break;
                        //continue rulesLoop;
                        }
                      }
                    }

                  //console.log(indent(tryRule) + "forbidden::" + JSON.stringify(forbidden));

                  if (foundAncestor) {
                    heritage = ancestors;
                    } else {
                    var heritage = ancestors.slice();
                    heritage.push(current);
                    }
                  //console.log(indent(tryRule) + "heritage::" + heritage);

                  var parsed = parse(rules[subRule], subRule, tokens, at + iElement, heritage, forbidden);

                  if (!parsed) {
                    break;
                    }

                  elements[iElement] = parsed;
                  at = parsed.at +  parsed.syntax.length - 1 - iElement;
                  error = false;
                  continue;
                  } else {
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
            var p = new function() {
              this.syntax = syntax
              this.at = at
              this.rule = tryRule
              this.name = name
              this.elements = elements
              this.$ = (i) => {

                if (this.elements[i].token) {
                  return () => {
                    return this.elements[i].match.$(0);
                    }
                  }
                return this.elements[i].$$();
                }
              this.length = syntax.length
              this.val;
              this.toStringx = () => {
                s = "<" + this.at + ">[";
                  elements.forEach((e, idx) => s+= (e[idx].token?e[idx].$$:e[idx].name) +",");
                  s += "]";
                return s;
                }

              if (rules[this.name][this.rule]) {

                this.$$ = () => {try {
                    return rules[this.name][this.rule](this);
                    } catch(e) {
                    console.log("handler::error::" + e + "::" + e.stack);
                    }
                  }
                this.$$.p = this;
                } else {
                this.$$ = nothing;
                }

              };

            found = p;
            lastError = "";
            break;
            } else {
            if (iElement === syntax.length -1) {
              if (tokens[at + iElement]) {
                lastError = lastError + "expected " + syntax[iElement] + " got " + tokens[at + iElement].match.$(0) + " at " + tokens[at +iElement].match.getFrom() + '\n';
                }
              }
            }

          }
        depth--;
        if (depth === 0) {
          console.log("Error::" + lastError + "::");
          }
        return found;
        }

      };
    Lourah.utils.text.Parser.NOTHING = nothing;

    })();
