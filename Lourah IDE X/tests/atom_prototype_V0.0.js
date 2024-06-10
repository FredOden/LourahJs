var Lourah = Lourah || {};
(function () {

    Lourah.ai = Lourah.ai || {};
    
    if (Lourah.ai.Atom) return;
    
    Lourah.ai.Atom = function() {
      }
    
    var instance = 0;
    
    var instances = {
      list: [] // new Array(1024)
      , print: {}
      };
    
    Lourah.ai.Atom.create = function () {
      var _;
      
      var a = function (jsObj) {
        return a.set(jsObj);
        };

      //console.log("a::" + a);
      instances.list[instance] = a;
      var self = instance ++;
      
      a.set = (jsObj) => {
        _ = jsObj;
        var print = a.print();
        (
          instances.print[print]
          = instances.print[print] || []
          ).push(self);
        console.log("list::[" + instances.list + "]");
        console.log(JSON.stringify(instances.print));
        return a;
        };
      
      a.get = () => _;
      
      a.print = (printer) => {
        if (printer) {
          return printer(_);
          }
        if (_.printer) {
          return _.printer();
          }
        return _.toString();
        }
      
      a.getSelf = () => self;

      a.toString = () => self + "::" + _;

      return a;
      }
    
    Lourah.ai.Atom.findByInstance = (i) => {
      console.log("findByInstance::" + [
          i
          , instances.list.length
          , "'" + instances.list[i] + "'"
          ]);
      if (i >= instance || !instances.list[i]) {
        throw "Lourah.ai.Atom::findByInstance::error::instance " + i + " does not exist";
        }
      return instances.list[i];
      }
    }) ();

var a = Lourah.ai.Atom.create();
var b = Lourah.ai.Atom.create();
var c = Lourah.ai.Atom.create();
a({name:"Jerry", what: "mouse", toString: () => JSON.stringify(a.get())});
b({name:"Tom", what: "cat", toString: () => "TomCat" });
c({name:"Tommy", what: "cat", toString: () => "TomCat" });
var b = Lourah.ai.Atom.create();
console.log('a::' + a.getSelf() + "::" + JSON.stringify(a.get()));
console.log('b::' + b.getSelf() + "::" + JSON.stringify(b.get()));

console.log("1::" + Lourah.ai.Atom.findByInstance(1).print());

console.log("print::" + JSON.stringify("print"));
