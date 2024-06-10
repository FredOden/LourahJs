var Lourah = Lourah || {};
( function () {

    Lourah.ai = Lourah.ai || {};
    if (Lourah.ai.Monolog) return;

    function Monolog() {}

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
        _.pattern = new RegExp(
          array.join("|"));
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
          solutions[i] = []; //arguments[i].get();

          keys[i] = Object.keys(_Pointers[i]).filter(
            key => key.match(v.getPattern())
            );
          }

        for(var rule = 0; rule < _.length; rule++) {
          var matches = [];
          for (var i = 0; i < arguments.length; i++) {
            for(var k = 0; k < keys[i].length; k++) {
              if(_[rule].indexOf(keys[i][k]) === i) {
                matches.push(keys[i][k]);
                }
              }
            }
          if (matches.length === arguments.length) {
            var already = false;
            for(j = 0; j < found; j++) {
              for (var i = 0; i < arguments.length; i++) {
                if (solutions[i][j] !== matches[i]) break;
                already = (i === arguments.length - 1);
                }
              if (already) break;
              }
            if (already) continue;
            found++;
            for (var i = 0; i < arguments.length; i++) {
              if (true || solutions[i].indexOf(matches[i]) === -1) {
                solutions[i].push(matches[i]);
                }
              }
            /**/
            }
          }
                
        for (var i = 0; i < arguments.length; i++) {
          arguments[i].set(solutions[i]);
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
            );
          }

        if (args.length === 1) {
          for (var i = 0; i < args[0].length; i++) {
            _.push(addPointer([args[0][i]]));
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





  /*
  likes = Lourah.ai.Monolog.predicat();
  fruit = Lourah.ai.Monolog.predicat();
  vegetable = Lourah.ai.Monolog.predicat();

  fruit.set(["apples", "melon"])
  .set("mangos")
  .set("bananas")
  .set("cherries")
  .set("pears");

  vegetable.set("tomatos")
  .set("beans")
  .set("spinach");



  console.log("X::" + X);
  console.log("Y::" + Y);

  likes
  .set("pippo", ["melon", "apples", "bananas", "cherries"]);
  likes
  .set("lourah", ["pears", "apples", "beans"], "dry")
  .set(["lourah", "pippo"], ["mangos"], ["fresh", "dry"]);
  console.log("likes::" + likes);
  //console.log("fruit::" + fruit);
  //console.log("vegetable::" + vegetable);
  //console.log("X::" + X._());
  //fruit(Y);
  likes(X,Y,Z("fresh"));
  */
  /*
  var pere = Lourah.ai.Monolog.predicat();
  pere.set("michel", ["christine", "frederic"]);
  pere.set("jean", "michel");
  pere.set("gaston", ["jean", "jeannette"]);
  pere.set("alcide", "gaston");
  pere.set("frederic", [ "eloi", "ulysse", "mathieu", "alienor"]);

  var _ = Lourah.ai.Monolog.variable();

  pere(X("gaston"), _);
  pere(_, Z); // Z is grand children


  pere(X, _);
  */

  //console.log("sol::" + sol);

  var male = Lourah.ai.Monolog.predicat();
  var female = Lourah.ai.Monolog.predicat();
  var parent = Lourah.ai.Monolog.predicat();

  male.set(["Mathieu", "Ulysse", "Eloi", "Frederic", "Jacques", "Michel", "Lionel", "Dragan", "Mathis", "Hugo", "Dimitri", "Nicolas"]);
  female.set(["Sarah", "Alienor", "Marie Lise", "Monique", "Katia", "Christine", "Oceane", "Alienot", "Alexandra"]);
  parent.set(["Sarah", "Frederic"] , [ "Mathieu", "Alienor", "Ulysse", "Eloi"]);
  parent.set(["Marie Lise", "Jacques"], ["Sarah", "Lionel"]);
  parent.set(["Monique", "Michel"], ["Frederic", "Christine"]);
  parent.set(["Lionel", "Katia"], ["Oceane", "Mathis", "Hugo"]);
  parent.set(["Dragan", "Christine"], ["Nicolas", "Dimitri", "Alexandra"]);
  /* mother */
  X.clear();
  Y.clear();
  Z.clear();

  var GrandFather = Lourah.ai.Monolog.variable();
  var GrandMother = Lourah.ai.Monolog.variable();
  var GrandParent = Lourah.ai.Monolog.variable();

  var Uncle = Lourah.ai.Monolog.variable();
  var Sibling = Lourah.ai.Monolog.variable();
  var _ = Lourah.ai.Monolog.variable();

  //male(Father);
  //parent(Father, _);

  /*
  parent(X, _)(_, Z)(GrandParent, _);
  female(GrandParent);
  */

  
  function grandParent(A, B) {
    var _ = Lourah.ai.Monolog.variable();
    parent(_, B)(A, _)(_, B);
    //console.log("B::" + B._());
    //console.log("A::" + A._());
    //console.log("_::" + _._());
    }

  grandParent(GrandParent, Z);

  function grandMother(A, B) {
  
    parent(_, B)(A, _)(_, B);
    female(A);
    //male(B);
    }
  
  GrandParent.get().forEach(name => {
      X.clear();
      GrandMother.clear();
      console.log("name::" + name);
    grandMother(GrandMother(name), X);
    console.log("GM::" + GrandMother);
    console.log("GC::" + X);
      }
    );
  /**/
  /*
  female(GrandMother);
  parent(GrandMother, _);
  male(GrandFather);
  parent(GrandFather, _);

  parent(GrandMother, Sibling);
  parent(Sibling, Z);
  male(Uncle);
  parent(Uncle, Z);

  //var mother.set(Mother)

  /*
  X.clear();
  Y.clear();
  male(X);
  parent(X, Y);
  */

  //parent(X, Y);

  console.log("GrandParent::" + GrandParent);
  console.log("GrandMother::" + GrandMother);
  console.log("GrandFather::" + GrandFather);
  console.log("_::" + _);
  console.log("X::" + X);
  console.log("Y::" + Y);

  var ee = Symbol("ee");
  console.log("ee::" + ee.toString());

  //console.log(JSON.stringify(buildLists([["a", "b"], ["c", "d", "e"], ["f", "g"]])));

  //console.log("X::" + variables("X"));
  } catch(e) {
  console.log("prolog.js::" + e + "::" + e.stack);
  }
