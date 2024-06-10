var Lourah = Lourah || {};
Activity.importScript(
  Lourah. jsFramework. parentDir()
  + "/Lourah.ai.Algolog.js"
  );


try {
  var X = Lourah.ai.Algolog.variable();
  var Y = Lourah.ai.Algolog.variable();
  var Z = Lourah.ai.Algolog.variable();

  var male = Lourah.ai.Algolog.predicat();
  var female = Lourah.ai.Algolog.predicat();
  var parent = Lourah.ai.Algolog.predicat();
  
  male.set(["Mathieu", "Ulysse", "Eloi", "Frederic", "Jacques", "Jean", "Michel", "Lionel", "Dragan", "Mathis", "Hugo", "Dimitri", "Nicolas"]);
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

  var GrandFather = Lourah.ai.Algolog.variable();
  var GrandMother = Lourah.ai.Algolog.variable();
  var GrandParent = Lourah.ai.Algolog.variable();
  var GrandChildren = Lourah.ai.Algolog.variable();

  var Uncle = Lourah.ai.Algolog.variable();
  var Sibling = Lourah.ai.Algolog.variable();
  var _ = Lourah.ai.Algolog.variable();

  //console.log("parent::" + parent);

  parent(_, Y)(GrandParent, _)(_, GrandChildren);

  //console.log("GrandParent::" + GrandParent);
  console.log("GrandChildren::" + GrandChildren);

  
  var grandParent = Lourah.ai.Algolog.predicat();

  GrandParent.get().forEach((gp) => {
      var Gc = Lourah.ai.Algolog.variable();
      var _ = Lourah.ai.Algolog.variable();
      parent(gp, _)(_, Gc);
      grandParent.set(gp, Gc.get());
      });

  //female(GrandMother);
  grandParent(GrandMother, _.clear());
  female(GrandMother);

  var ruleGP = function (A, B) {
    var X = Lourah.ai.Algolog.variable();
    var Y = Lourah.ai.Algolog.variable();
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
  var road = Lourah.ai.Algolog.predicat();
  
  road.set("A10", ["Etampes", "Orleans", "Blois", "Tours", "Chatellerault", "Poitiers", "Niort", "Saintes", "Blaye", "Saint Andre de Cubezac", "Bordeaux"]);
  road.set("A6", ["Paris", "Etampes", "Fontainebleau", "Sens", "Auxerre"]);
  X.clear();
  Y.clear();
  road("A10", Y)("A6", Y);
  //console.log("road::" + road);
  //console.log("parent::" + parent);
  console.log("X::" + X);
  console.log("Y::" + Y);
  } catch(e) {
  console.log("Algolog.js::" + e + "::" + e.stack);
  }
