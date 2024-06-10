var Lourah = Lourah || {};
Activity.importScript(
  Lourah. jsFramework. parentDir()
  + "/Lourah.ai.Atom.js"
  );

( function () {

    Lourah.ai = Lourah.ai || {};
    if (Lourah.ai.Monolog) return;

    function Monolog() {}

    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(
      function(name) {
        Monolog['is' + name] = function(obj) {
          return toString.call(obj) == '[object ' + name + ']';
          };
        }
      );


    function variable() {
      var _ = {
        pattern: /.*/
        ,value: []
        };
      //console.log(_);
      var v = function(pattern) {
        _.pattern = pattern?pattern:/.*/;
        return v;
        }

      v.add = (val) => {
        //if (!_.value[idx]) _.value[idx] = [];
        _.value.push(val);
        return v;
        }

      v.set = (array) => {
        _.value = array;
        v.commit();
        }

      v.fail = () => {
        return _.value.length === 0;
        }

      v.commit = () => {
        _.pattern = new RegExp(
          _.value.join("|"));
        }

      v.get = () => _.value;

      v.getPattern = () => _.pattern;

      v.clear = () => {
        _.value = [];
        _.pattern = /.*/;
        return v;
        }

      v.toString = () => JSON.stringify(_.value);

      v._ = () => JSON.stringify(_);

      return v;
      }

    function intersection(a, b) {
      //console.log("inter::" + a + "::" + b);
      if (a.length > b.length) return a.filter(item => b.indexOf(item) !== -1);
      else return b.filter(item => a.indexOf(item) !== -1);
      }


    function predicat () {
      var _ = [];
      var _Pointers = [];


      function addPointer(list) {
        var index = _.length;
        list.forEach((item, i) => {
            if (!_Pointers[i]) {
              _Pointers[i] = {};
              }
            var key = item.toString();
            if (!_Pointers[i][key]) {
              _Pointers[i][key] = []
              }
            _Pointers[i][key].push(index);
            });
        return list;
        }

      var p = function () {
        return p.query.apply(null, arguments);
        //return p;
        }

      p.query = function () {
        var keys = [];
        var solutions = [];
        var found = 0;

        for (var i = 0; i < arguments.length; i++) {
          var v = arguments[i];
          //console.log("v::" +v);
          //arguments[i].clear();
          //solutions[i] = []; //arguments[i].get();

          keys[i] = Object.keys(_Pointers[i]).filter(
            key => {
              try {
                return key.match(v.getPattern());
                }
              catch(any) {
                return key.match(v);
                }
              }
            );
          }

        for(var rule = 0; rule < _.length; rule++) {
          var matches = [];
          for (var i = 0; i < arguments.length; i++) {
            for(var k = 0; k < keys[i].length; k++) {
              if(_[rule].indexOf(keys[i][k]) === i) {
                matches.push(keys[i][k]);
                break;
                }
              }
            }
          if (matches.length === arguments.length) {
            if (solutions.findIndex(solution => {
                  for (var i = 0; i < arguments.length; i++) {
                    //console.log("::" + i + "::" + solution[i] + "::" + matches[i]);
                    if (solution[i] !== matches[i]) return false;
                    //already = (i === arguments.length - 1);
                    }
                  return true;
                  }) === -1) {
              //console.log("push::" + matches);
              solutions.push(matches);
              }
            }
          }
        //console.log("solutions::" + solutions.length);
        //console.log("rules::" + _.length);

        for (var i = 0; i < arguments.length; i++) {
          try {
            arguments[i].set([]);
            for(var s = 0; s < solutions.length; s++) {
              if (arguments[i].get().indexOf(solutions[s][i]) === -1) {
                arguments[i].add(solutions[s][i]);
                }
              }
            arguments[i].commit();
            } catch(any) {
            // should process other kind of answer
            // don't do anything for atoms
            }
          }
        /**/
        return p;
        }


      p.set = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args[i] = (
            Array.isArray(arguments[i])
            ? arguments[i]
            : [ arguments[i] ]
            ).map(item => Lourah.ai.Atom.$(item));
          }
        /*
        if (arguments.length === 1) {
          console.log("args[0]::" + args[0]);
          }
        /**/
        if (args.length === 1) {
          for (var i = 0; i < args[0].length; i++) {
            _.push(addPointer([args[0][i].getKey()]));
            }
          } else {
          buildLists(args).forEach(
            list => _.push(addPointer(list))
            )
          }
        return p;
        }

      p.toString = () =>
      //"_::" +
      JSON.stringify(_)
      //+ "::_Pointers::" + JSON.stringify(_Pointers)

      p.and = () => {
        p.query.apply(null, arguments);
        return p;
        };
      p.or = () => {
        for (var i = 0; i < arguments.length; i++) {
          arguments [i].clear();
          }
        p.query.apply(null, arguments);
        return p;
        };
      p.cut = () => {
        return p;
        };

      return p;
      }

    /**
    builsLists: build atom lists from a compound
    list, example
    compoundList [[a,b],[c,d,e], [f,g]]
    returns  [
      [ a, c, f]
      ,[a, c, g]
      ,[a, d, f]
      ,[a, d, g]
      ,[a, e, f]
      ,[a, e, g]
      ,[b, c, f]
      ...
      ,[b, e, g]
      ]
    */

    function buildLists(compoundList) {

      if (compoundList.length === 1) {
        //console.log("0::" + compoundList[0]);
        return compoundList[0];
        }
      var ret = [];
      var atoms = buildLists(compoundList.slice(1));
      for (var i = 0; i < atoms.length; i++) {
        for (var j = 0; j < compoundList[0].length; j++) {
          var atom = compoundList[0][j];
          ret.push([ atom ].concat(
              atoms[i]
              ));
          }
        }
      return ret;
      }

    Monolog.predicat = predicat;
    Monolog.variable = variable;

    Lourah.ai.Monolog = Monolog;
    })();

try {
  var X = Lourah.ai.Monolog.variable();
  var Y = Lourah.ai.Monolog.variable();
  var Z = Lourah.ai.Monolog.variable();

  var male = Lourah.ai.Monolog.predicat();
  var female = Lourah.ai.Monolog.predicat();
  var parent = Lourah.ai.Monolog.predicat();

  male.set([{name:"Matt", toString: () => "Mathieu"}, "Ulysse", "Eloi", "Frederic", "Jacques", "Jean", "Michel", "Lionel", "Dragan", "Mathis", "Hugo", "Dimitri", "Nicolas"]);
  female.set(["Sarah", "Alienor", "Marie Lise", "Nano", "Monique", "Katia", "Christine", "Oceane", "Alienot", "Alexandra"]);


  parent.set(["Sarah", "Frederic"] , [ "Mathieu", "Alienor", "Ulysse", "Eloi"]);
  parent.set(["Marie Lise", "Jacques"], ["Sarah", "Lionel"]);
  parent.set(["Monique", "Michel"], ["Frederic", "Christine"]);
  parent.set(["Lionel", "Katia"], ["Oceane", "Mathis", "Hugo"]);
  parent.set(["Dragan", "Christine"], ["Nicolas", "Dimitri", "Alexandra"]);
  parent.set(["Jean", "Nano"], "Michel");


  /* mother */
  X.clear();
  Y.clear();
  Z.clear();

  var GrandFather = Lourah.ai.Monolog.variable();
  var GrandMother = Lourah.ai.Monolog.variable();
  var GrandParent = Lourah.ai.Monolog.variable();
  var GrandChildren = Lourah.ai.Monolog.variable();

  var Uncle = Lourah.ai.Monolog.variable();
  var Sibling = Lourah.ai.Monolog.variable();
  var _ = Lourah.ai.Monolog.variable();


  parent(_, Y)(GrandParent, _)(_, GrandChildren);

  var grandParent = Lourah.ai.Monolog.predicat();

  GrandParent.get().forEach((gp) => {
      var Gc = Lourah.ai.Monolog.variable();
      var _ = Lourah.ai.Monolog.variable();
      parent(gp, _)(_, Gc);
      grandParent.set(gp, Gc.get());
      });

  female(GrandMother);
  grandParent(GrandMother, _.clear());
  //female(GrandMother);

  var ruleGP = function (A, B) {
    var X = Lourah.ai.Monolog.variable();
    var Y = Lourah.ai.Monolog.variable();
    }

  parent(/Lio/, Y);female(Y);

  grandParent(GrandFather, "Alienor");
  male(GrandFather);


  //console.log("grandParent::" + grandParent);
  //console.log("parent::" + parent);
  //console.log("female::" + female);
  console.log("GrandParent::" + GrandParent);
  
  console.log("GrandChildren::"
    +
    Lourah.ai.Atom.getAtoms(
      GrandChildren.get()[0]
      )[0].getJs().name
    );
  
  console.log("GrandMother::" + GrandMother);
  console.log("GrandFather::" + GrandFather);
  //console.log("_::" + _);
  //console.log("X::" + X);
  console.log("Y::" + Y);

  var ee = Symbol("ee");
  console.log("ee::" + ee.toString());

  //console.log(JSON.stringify(buildLists([["a", "b"], ["c", "d", "e"], ["f", "g"]])));

  //console.log("X::" + variables("X"));
  } catch(e) {
  console.log("prolog.js::" + e + "::" + e.stack);
  }
