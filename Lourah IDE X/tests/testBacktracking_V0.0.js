function getContext() {

  var _Vars = [];

  // Shared among predicates
  
  var _Track;

  function Track() {
    var args = [];
    var solutions = [];
    var at = 0;
    var predicat;

    this.addSolutions = (s) => solutions = solutions.concat(s);
    this.setArgs = (a) => {
      args = [];
      for (var i = 0; i < a.length; i++) {
        args[i] = context.isVar(a[i])?a[i]:null;
        }
      };
    this.setPredicat = (p) => predicat = p;
    this.cut = () => {
      if (solutions && solutions.length) solutions.splice(0, 1);
      };
    this.rewind = () => at = 0;
    this.size = () => solutions.length;
    this.next = () => {
      if ((!solutions) || (at < 0) || (at >= solutions.length)) {
        return false;
        }
      for (var i = 0; i < args.length; i++) {
        if (args[i]) {
          args[i](solutions[at][i]);
          }
        }
      at++;
      return true;
      };
    this.toString = () => {
      var toString = "Track::{"
        //+ "args::[" + args + "]"
        + ",size::" + this.size()
        + ",solutions::" + JSON.stringify(solutions)
        + "}"
      return toString;
      };
    }

  function context() {
    }

  context.clear = function() {
    _Track = undefined;
    for (var i = 0; i < _Vars.length; i++) {
      _Vars[i].clear();
      }
    }

  context.track = () => _Track;

  function buildLists(compoundList) {

    if (compoundList.length === 1) {
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


  var _Atoms = {
    instance:0
    ,list: [] // new Array(1024)
    , print: {}
    };


  function Atom(jsVar, bDuplicateKey) {
    var key = jsVar.toString();

    if (!bDuplicateKey && Atom.getKeys(new RegExp("^" + key + "$")).length > 0) {
      throw new Error("Atom::new::cannot create new atom with duplicate key::'"
        + key
        + "' or set bDuplicateKey to true as second parameter"
        + " when using new Lourah.ai.Atom(object, true)"
        + " to accept duplicate keys on atoms"
        );
      }

    _Atoms.list[_Atoms.instance] = this;
    var _ = {
      id: _Atoms.instance++
      ,js: jsVar
      }

    if (!_Atoms.print[key]) {
      _Atoms.print[key] = [];
      }

    _Atoms.print[key].push(_.id);

    this.toString = () => _.id + "::" + _.js;
    this.getJs = () => _.js;
    this.getId = () => _.id;
    this.getKey = () => key;
    }

  Atom.dumpInstances = () => JSON.stringify(instances);

  Atom.getInstance = (i) => {
    if (i >= 0 && i < _Atoms.list.length) {
      return _Atoms.list[i];
      }
    throw new Error("Atom.getInstance::" + i + " is invalid instance number!");
    };

  Atom.remove = (i) => {
    var atom = Atom.getInstance(i);
    var print = _Atoms.print[atom.getKey()];
    var iPrint = print.indexOf(i);
    if (iPrint > -1) {
      print.splice(iPrint, 1);
      }
    _Atoms.list[i] = undefined;
    };

  Atom.getList = () => {
    return _Atoms.list.slice();
    }

  Atom.getKeys = (pattern, bExact) => {
    pattern = pattern || /.*/;
    return Object.keys(_Atoms.print).filter(
      key => bExact?(key === pattern):key.match(pattern)
      );
    }

  Atom.getAtoms = (pattern, exact) => {
    var atoms = [];
    Atom.getKeys(pattern, exact).forEach(
      key => {
        atoms = atoms.concat(
          _Atoms.print[key].map(
            instance => Atom.getInstance(instance)
            )
          )
        }
      );
    return atoms
    }

  Atom.isAtom = (atom) => {
    try {
      return atom === _Atoms.list[atom.getId()];
      } catch(e) {
      return false;
      }
    }

  Atom.$ = (jsVar, bDuplicate) => {
    var atoms;

    if (Atom.isAtom(jsVar)) {
      return jsVar;
      }

    if (bDuplicate) {
      return new Atom(jsVar, true);
      }

    var atoms = Atom.getAtoms(jsVar.toString(), true);
    if (atoms.length) {
      return atoms[0];
      }

    return new Atom(jsVar);
    }

  context.predicate = function() {
    var _ = [];
    var _Pointers = [];


    function addPointer(list) {
      var index = _.length;
      list.forEach((item, i) => {
          if (!_Pointers[i]) {
            _Pointers[i] = {};
            }
          var key = item.getKey();
          if (!_Pointers[i][key]) {
            _Pointers[i][key] = []
            }
          _Pointers[i][key].push(index);
          });
      return list;
      }

    function predicat() {
      var track = _Track;
      _Track = new Track();
      _Track.setArgs(arguments);
      _Track.setPredicat(predicat);

      if (!track) {
        return predicat.query.apply(null, arguments);
        }
      track.rewind();
      var success = false;
      if(track.next()) {
        try {
          predicat.query.apply(null, arguments);
          success = true;
          } catch(status) {}
        }
      if (!success) throw false;
      return predicat;
      }

    predicat.query = function () {
      var keys = [];
      var kAtoms = [];
      var solutions = [];
      var found = 0;

      for (var i = 0; i < arguments.length; i++) {
        var av = Array.isArray(arguments[i])
        ? arguments[i]
        : [ arguments[i] ]
        ;

        keys[i] = [];
        kAtoms[i] = [];
        av.forEach(v => {
            keys[i] = keys[i].concat(Object.keys(_Pointers[i]).filter(
                key => {
                  try {
                    var val = v();
                    if (val === undefined) return true;
                    if (!(val instanceof RegExp)) {
                      return key === val;
                      }
                    return key.match(val);
                    }
                  catch(any) {
                    return key === v;
                    }
                  }
                )
              );
            });

        kAtoms[i] = keys[i].map(
          key => Atom.getAtoms(key, true)[0]
          );
        }

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
                  if (solution[i] !== matches[i]) return false;
                  }
                return true;
                }) === -1) {
            solutions.push(matches);
            }
          }
        }

      if (solutions.length === 0) {
        throw false;
        }

      _Track.addSolutions(solutions);

      return predicat;
      }


    predicat.set = function () {
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args[i] = (
          Array.isArray(arguments[i])
          ? arguments[i]
          : [ arguments[i] ]
          ).map(item => Atom.$(item));
        }

      if (args.length === 1) {
        for (var i = 0; i < args[0].length; i++) {
          _.push(addPointer([args[0][i]]));
          }
        } else {
        buildLists(args).forEach(
          list => {
            _.push(addPointer(list))
            }

          )
        }
      return predicat;
      }

    predicat.cut = () => {
      _Track.cut();
      return predicat;
      }

    predicat.toString = () =>
    //"_::" +is
    JSON.stringify(_)
    //+ "::_Pointers::" + JSON.stringify(_Pointers)

    return predicat;
    }

  context.var = function () {
    var value;

    function variable(val) {
      if (arguments.length === 0) return value;
      value = val;
      return variable;
      }

    variable.clear = function() {
      value = undefined;
      return variable;
      }

    _Vars.push(variable);
    return variable;
    }

  context.isVar = v => v.toString() === context.var().toString();

  return context;
  }

try {
  var ctx = getContext();

  var test = ctx.predicate();

  var X = ctx.var();
  var Y = ctx.var();
  var Z = ctx.var();

  test.set("a", "b");
  test.set("a", "c");
  test.set("b", ["e", "f"]);
  test.set("bb", "d");
  test.set("f", "g");
  test.set("d", "sun");
  test.set("f", "b");

  //console.log("X::" + X(X()+1) + "::Y::" + Y(X() + Y()));

  try {
    test(X, Y);
    test(Y, Z);

    ctx.track().rewind();
    while(ctx.track().next()) {
      console.log("X::" + X() + "::Y::" + Y() + "::Z::" + Z());
      }
    } catch(status) {
    console.log("status::" + status);
    }


  } catch(e) {
  console.log("testBacktracking;:" + e + "::" + e.stack);
  }
