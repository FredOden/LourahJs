Lourah = Lourah || {};
(function () {

    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");

    var patV1 = /((?:[\w.]*\s*(?:(?:\([^()]*\))+))|(?:[w.]+))\^((?:[\w.]+)+)?/g;

    var patV2 = /((?:[^^+\-*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:[\w.]+)+)?/g;

    var patV3 = /((?:[^^\+\-\*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:(?:-|\+)?[^^+\-*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))/g;

    var patV4 = /((?:[\w.+\-]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:[\w.+\-]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))/g;

    var pat = patV4;
    //pat = patV1

    Lourah.utils.text.Formula = function() {
      this.parse = (txt) => {
        var s = new Lourah.utils.text.SearchString(txt);

        s.search(/π/g).replaceAll("Math.PI")
        .search(/√([^;]+)/g).replaceAll("sqrt($1)")
        .search(/(\d*[.]?\d+)°/g)
        .replaceAll("$1*Math.PI/180")
        //.search(/([\w.]*(\([A-Za-z0-9\._\(\)%\$\+\-\*\/\[\]]*\))*)\^([\w.]*(\([A-Za-z0-9\._\(\)%\$\+\-\*\/\[\]]*\))*)/g)

        .search(/\|(.+)\|/g)
        .replaceAll("abs($1)")

        while(s.search(pat).getMatchs().length>0) {
          //console.log("toProcess::"+s);
          s.process(toPow)
          }

        s.search(/<<x<</g).replaceAll("(")
          .search(/>>x>>/g).replaceAll(")");

        if (s.search(/\^/g).getMatchs().length > 0) {
          throw "Lourah.util.text.Fomula::error::^ not reduced, check parenthesis::'" + txt +"'";
          }

        s.search(
          /\b(pow|a?cosh?|a?sinh?|a?tanh?|abs|sqrt)\(/g
          ).replaceAll("Math.$1(");
                
        s.search(/\b(log)\(/g)
              .replaceAll("Math.log10(");
        
        s.search(/\b(ln)\(/g)
              .replaceAll("Math.log(");
         

        return s.toString();
        };

      function toPow(m, sub) {
        //console.log("...toPow::" + sub);
        //var [left, right] = [sub.$(1), sub.$(2)];
        //console.log("......[left, right]::[" + [left, right] + "]");
        //console.log("s::" + s);
        var left = (new Lourah.utils.text.SearchString(sub.$(1))).search(pat).process(toPow);
        var right = (new Lourah.utils.text.SearchString(sub.$(2))).search(pat).process(toPow);

        //console.log("......<" + m + ">[left, right]::[" + [left, right] + "]");
        var ret = "pow<<x<<" + brackets(left) + "," + brackets(right) + ">>x>>";
        //console.log(".........>" + ret);
        return ret;
        }

      function brackets(s) {
        return s.search(/\(/g)
          .replaceFirst("<<x<<")
          .search(/\)/g)
        .replaceLast(">>x>>");
        }
      };

    })();

function testIdex() {
  var f = new Lourah.utils.text.Formula();

  console.log(f.parse("√|acosh(1)^2 + sinh(1°)^2|"));
  }
