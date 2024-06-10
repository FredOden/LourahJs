var Lourah = Lourah || {};
(function () {

    Lourah.ai = Lourah.ai || {};

    if (Lourah.ai.Atom) return;


    var instance = 0;

    var instances = {
      list: [] // new Array(1024)
      , print: {}
      };


    Lourah.ai.Atom = function (jsVar, bDuplicateKey) {
      

      var key = jsVar.toString();
      
      if (!bDuplicateKey && Lourah.ai.Atom.getKeys(new RegExp("^" + key + "$")).length > 0) {
        throw new Error("Atom::new::cannot create new atom with duplicate key::'"
          + key
          + "' or set bDuplicateKey to true as second parameter"
          + " when using new Lourah.ai.Atom(object, true)"
          + " to accept duplicate keys on atoms"
          );
        }
      
      instances.list[instance] = this;
      var _ = {
        id: instance++
        ,js: jsVar
        }

      if (!instances.print[key]) {
        instances.print[key] = [];
        }

      instances.print[key].push(_.id);

      this.toString = () => _.id + "::" + _.js;
      this.getJs = () => _.js;
      this.getId = () => _.id;
      this.getKey = () => key;
      }

    Lourah.ai.Atom.dumpInstances = () => JSON.stringify(instances);

    Lourah.ai.Atom.getInstance = (i) => {
      if (i >= 0 && i < instances.list.length) {
        return instances.list[i];
        }
      throw new Error("Lourah.ai.Atom.getInstance::" + i + " is invalid instance number!");
      };

    Lourah.ai.Atom.remove = (i) => {
      var atom = Lourah.ai.Atom.getInstance(i);
      var print = instances.print[atom.getKey()];
      var iPrint = print.indexOf(i);
      if (iPrint > -1) {
        print.splice(iPrint, 1);
        }
      instances.list[i] = undefined;
      };

    Lourah.ai.Atom.getList = () => {
      return instances.list.slice();
      }

    Lourah.ai.Atom.getKeys = (pattern, bExact) => {
      pattern = pattern || /.*/;
      return Object.keys(instances.print).filter(
        key => bExact?(key === pattern):key.match(pattern)
        );
      }

    Lourah.ai.Atom.getAtoms = (pattern, exact) => {
      var atoms = [];
      Lourah.ai.Atom.getKeys(pattern, exact).forEach(
        key => {
          //console.log("key::" + key + "::[" + instances.print[key] + "]");
          atoms = atoms.concat(
            instances.print[key].map(
              instance => Lourah.ai.Atom.getInstance(instance)
              )
            )
          }
        );
      //console.log("atoms::[" + atoms + "]");
      return atoms
      }
    /*
    Lourah.ai.Atom.getExactAtoms = (pattern) => {
      var atoms = [];
      Lourah.ai.Atom.getKeys(pattern, true).forEach(
        key => {
          //console.log("key::" + key + "::[" + instances.print[key] + "]");
          atoms = atoms.concat(instances.print[key])
          }
        );
      //console.log("atoms::[" + atoms + "]");
      return atoms
      }
    /**/
    
    Lourah.ai.Atom.isAtom = (atom) => {
      //console.log("id::" + atom.getId());
      try {
        return atom === instances.list[atom.getId()];
        } catch(e) {
        return false;
        }
      }
    
    Lourah.ai.Atom.$ = (jsVar, bDuplicate) => {
      var atoms;
      
      if (Lourah.ai.Atom.isAtom(jsVar)) {
        return jsVar;
        }
      
      if (bDuplicate) {
        return new Lourah.ai.Atom(jsVar, true);
        }
      
      var atoms = Lourah.ai.Atom.getAtoms(jsVar.toString(), true);
      if (atoms.length) {
        return atoms[0];
        }
      
      return new Lourah.ai.Atom(jsVar);
      
      /*
      return Lourah.ai.Atom.isAtom(jsVar)
      ? jsVar
      : (bDuplicate
        ? new Lourah.ai.Atom(jsVar, bDuplicate)
        : ((atoms = Lourah.ai.Atom.getKeys(jsVar.toString(), true)).length
          ? atoms[0]
          : new Lourah.ai.Atom(jsVar)
          )
        );
      /**/
      }
    }) ();
