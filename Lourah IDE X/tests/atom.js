Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Lourah.ai.Atom.js"
  );


function item(name) {
  return new Lourah.ai.Atom({
      name: name
      ,type: "item"
      ,toString: () => JSON.stringify(name)
      });
  }

var a = new Lourah.ai.Atom({name:"Jerry", what: "mouse", toString: () => "JerryLikesCheese"});
var b = new Lourah.ai.Atom({name:"Tom", what: "cat", toString: () => "TomCatcat" });
var c = new Lourah.ai.Atom({name:"Tommy", what: "cat", toString: () => "TomCat" });
var d = new Lourah.ai.Atom("Uranium");
var e = item("Rasta");
var f = item("Rocket");
var g = item({a: "A", b: "B"});
console.log('a::' + a.getId() + "::" + JSON.stringify(a.getJs()));
console.log('b::' + b.getId() + "::" + JSON.stringify(b.getJs()));

Lourah.ai.Atom.remove(1);

Lourah.ai.Atom.getList().forEach((element, i) => {
    try {
      //console.log("element::'" + element.getJs().name + "'");
      console.log(i + "::'" + Lourah.ai.Atom.getInstance(i) + "'");
      } catch(e) {}
    });
var ur = Lourah.ai.Atom.getAtoms("Uranium", true);
console.log("c::" + c);
console.log("ur::[" + ur +"]");
console.log("test atom::" +
  Lourah.ai.Atom.isAtom(g));

console.log("instances::" + Lourah.ai.Atom.dumpInstances());
