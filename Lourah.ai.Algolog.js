var Lourah = Lourah || {};
Activity.importScript(
  Lourah. jsFramework. parentDir()
  + "/Lourah.ai.Atom.js"
  );

( function () {

    Lourah.ai = Lourah.ai || {};
    if (Lourah.ai.Algolog) return;

    function Algolog() {}

    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(
      function(name) {
        Algolog['is' + name] = function(obj) {
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

      v.failed = () => {
        return _.value.length === 0;
        }

      /*
      commit:
        pattern must be a RegExp
      */
      v.commit = (pattern) => {
        _.pattern = pattern;
        /*
        new RegExp(
          _.value
          .filter((item, i, self) => self.indexOf(item) === i)
          .map((item) => "^" + item + "$")
          .join("|"));
        /**/
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
      var _Solutions = [];


      function addPointer(list) {
        var index = _.length;
        list.forEach((item, i) => {
            if (!_Pointers[i]) {
              _Pointers[i] = {};
              }
            var key = item.getKey();
            //console.log("item::" + key);
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

      p.getSolutions = () => _Solutions;
      
      p.query = function () {
        var keys = [];
        var kAtoms = [];
        var solutions = [];
        var found = 0;

        for (var i = 0; i < arguments.length; i++) {
          var av = Array.isArray(arguments[i])
          ? arguments[i]
          : [ arguments[i] ]
          ;
          
          //console.log("v::" +v);
          //arguments[i].clear();
          //solutions[i] = []; //arguments[i].get();

          //@can be optimized
          keys[i] = [];
          kAtoms[i] = [];
          av.forEach(v => {
              keys[i] = keys[i].concat(Object.keys(_Pointers[i]).filter(
                  key => {
                    try {
                      return key.match(v.getPattern());
                      }
                    catch(any) {
                      //console.log("any::" + v + "::key::" + key);
                      return key === v;
                      }
                    }
                  )
                );
              });
          kAtoms[i] = keys[i].map(
            key => Lourah.ai.Atom.getAtoms(key, true)[0]
            );
          }

        //console.log("keys::" + keys);

        for(var rule = 0; rule < _.length; rule++) {
          var matches = [];
          for (var i = 0; i < arguments.length; i++) {
            for(var k = 0; k < keys[i].length; k++) {
              if(_[rule].indexOf(kAtoms[i][k]) === i) {
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
        
        if (solutions.length === 0) {
          throw false;
          }
        //console.log("solutions::" + solutions.length);
        //console.log("rules::" + _.length);

        for (var i = 0; i < arguments.length; i++) {
          try {
            arguments[i].set([]);
            var pattern = undefined;
            for(var s = 0; s < solutions.length; s++) {
              if (arguments[i].get().indexOf(solutions[s][i]) === -1) {
                if (!pattern) pattern = "^" + solutions[s][i] + "$";
                else pattern += "|^" + solutions[s][i] + "$";
                }
                arguments[i].add(solutions[s][i]);               
              }
            //console.log("pattern::" + i + "::" + pattern);
            arguments[i].commit(new RegExp(pattern));
            } catch(any) {
            // should process other kind of answer
            // don't do anything for atoms
            }
          }
        _Solutions = solutions;
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
          //console.log("args::" + i + "::" + args[i]);
          }
        /*
        if (arguments.length === 1) {
          console.log("args[0]::" + args[0]);
          }
        /**/
        if (args.length === 1) {
          for (var i = 0; i < args[0].length; i++) {
            //console.log("single::" + [args[0][i]]);
            _.push(addPointer([args[0][i]]));
            }
          } else {
          buildLists(args).forEach(
            list => {
              //console.log("list::" + list);
              _.push(addPointer(list))
              }

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
      //console.log("ret::" + JSON.stringify(ret) + "");
      return ret;
      }

    Algolog.predicat = predicat;
    Algolog.variable = variable;

    Lourah.ai.Algolog = Algolog;
    })();
