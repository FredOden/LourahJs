Lourah = Lourah || {};
(function () {
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.text = Lourah.utils.text || {};

    /*
    Lourah.utils.text.Search = function(pattern) {
      var re = new RegExp(pattern, "g");
      this.inText = (text) => {
        return new Lourah.utils.text.Search.Text(re, text);
        }
      };
    */

    function Match(match, lastIndex, idx) {
      var from = lastIndex - match[0].length;
      var to = lastIndex;
      var index = idx;
      this.getFrom = () => from;
      this.getTo = () => to;
      this.getIndex = () => index;
      this.getText = () => match[0];
      this.$ = (i) => match[i];
      this.move = (offset) => {
        to += offset;
        from += offset;
        };
      this.setIndex = (i) => index = i;
      this.toString = () => {
        return JSON.stringify({
            from:from
            ,to:to
            ,$:match
            ,index:index
            });
        }
      };

    Lourah.utils.text.SearchString = function(text) {
      var object = text;
      var string = text.toString();
      var matchs = [];
      var re;

      this.search = regex => {
        try {
          var match;
          re = regex;
          if (!regex.global) {
            re = new RegExp(regex.toString(), "g");
            }
          matchs = [];
          var index = 0;
          while(match = re.exec(string)) {
            if (re.lastindex === 0) break;
            if (re.lastindex === -1) break;
            if (match[0] === '') throw "regex::" + regex + "::finds empty strings then generates infinite loop";
            matchs[index] = new Match(
              match
              , re.lastIndex
              , index
              );
            index++;

            }
          return this;
          } catch(e) {
          Activity.reportError("Lourah.utils.text.SearchString:search::" + e + "::" + e.stack);
          return this;
          }
        };

      this.getMatchs = () => matchs;

      this.replaceOccurence = (idx, replace) => {
        try {
          if (idx < 0 || idx >= matchs.length) return false;
          var r = matchs[idx].$(0).replace(
            re
            ,replace
            );


          string = string.substring(0, matchs[idx].getFrom()) + r + string.substring(matchs[idx].getTo());

          var offset = r.length - matchs[idx].$(0).length;
          //console.log("Before::" + string);
          //console.log("offset::" + offset);
          matchs.splice(idx, 1);
          //console.log("splice::" + matchs);
          for(var i = idx; i < matchs.length; i++) {
            matchs[i].move(offset);
            matchs[i].setIndex(i);
            }
          //console.log("After::" + matchs);
          return this;
          } catch(e) {
          Activity.reportError("Lourah.utils.text.Search.Text::replace::" + e + "::" + e.stack);
          return false;
          }
        };
      
      this.replaceFirst = (replace) => {
        this.replaceOccurence(0, replace);
        return this;
        }
      
      this.replaceLast = (replace) => {
        if (matchs.length > 0) {
          this.replaceOccurence(matchs.length - 1, replace);
          }
        return this;
        }

      this.replaceAll = (replace) => {
        // var maxLoop = 10;
        while(this.replaceOccurence(0, replace)) {

          //console.log("->'" + text + "'");
          /*if (maxLoop-- === 0) {
            console.log("LOOP!!");
            return;
            }*/
          }
        return this;
        };

      this.process = (f) => {
        var index = 0;
        //console.log(matchs.length);
        //return this;
        while(matchs.length) {
          if (!this.replaceOccurence(0, f(matchs[0].$(0), matchs[0], index++))) return this;
          }
        return this;
        };
      
      this.walk = (f) => {
        matchs.forEach(f);
        return this;
        }

      this.toString = () => string;


      };
    })();

(testLourahIDEX = () => {
    //var search = new Lourah.utils.text.Search("(.o.)");
    var txt = "the quick brown fox jumps over the lazy dog";
    var replaced = new Lourah.utils.text.SearchString(txt);

    replaced.search(/(.o.)/g)
    .replaceAll("<$1>")
    .search(/(the)/g)
    .replaceOccurence(1, "ThE")
    .replaceOccurence(0, "a")
    .search(/(fox)(.*)(dog)/g)
    .replaceAll("$3$2$1")
    .search(/([a-z]+)/g)
    .process((s, m, i) => {
        if (i%2) return s.toUpperCase();
        return s;
        });
    console.log("in::'" + txt + "'");
    console.log("->::'" + replaced + "'");
    });
