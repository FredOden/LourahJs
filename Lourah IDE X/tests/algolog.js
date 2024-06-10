var Lourah = Lourah || {};
Activity.importScript(
  Lourah. jsFramework. parentDir()
  + "/Lourah.ai.Prolog.js"
  );

var Lourah = Lourah || {};
(function () {
    try {
      var rule = (arity) => {
      var _ = [];
        
        if (!arity) {
          throw new Error("Lourah.ai.Prolog.rule::error::Must specify arity");
          }
        
        function checkArity(args) {
            if (args.length !== arity) {
            throw new Error("Lourah.ai.Prolog.rule::query::Wrong number of arguments ::"
              + args.length
              + "::"
              + "should be ::"
              + arity
              + "::"
              );
            }
          }
        
        function r() {
          //checkArity(arguments);
          console.log("r::" + arguments);
          r.query.apply(null, arguments);
          }
        
        function caller(f, args) {
          try {
            //console.log("caller::args::" + args[0]);
            f.apply(null, args);
            } catch(failed) {
            //console.log("caller::failed::" + failed);
            return failed;
            }
          return true;
          }
        
        
        r.query = function() {
          //console.log("query::" + arguments[0]);
          checkArity(arguments);
          for (var i = 0; i < _.length; i++) {
            console.log("try::" + i);
            if (caller(_[i], arguments)) {
              return true;
              }
            }
          console.log("no.");
          return false;
          }
        
        r.add = (f) => {
          _.push(f);
          return r;
          }
        
        return r;
        }
      
      Lourah.ai.Prolog.rule = rule;
      //console.log("rule::" + Lourah.ai.Algolog.rule);
      }
    catch(any) {
      console.log("caught::" + any);
      }
    })();



var context = (function () {
    function c () {
      }
    c.var = (name) => {
      this[name] = Lourah.ai.Algolog.variable();
      return this[name];
      }
    return c;
    })();

try {
  var ctx = Lourah.ai.Prolog.getContext();
  var W = ctx.var();
  var X = ctx.var();
  var Y = ctx.var();
  var Z = ctx.var();
  var _ = ctx.var();
  var Roads = ctx.var();
  var Cities = ctx.var();


  var road = ctx.predicat();
  var junction = ctx.predicat();

  var a10,a6,a1;

  road.set("A10", a10 = ["Etampes", "Orleans", "Blois", "Tours", "Chatellerault", "Poitiers", "Niort", "Saintes", "Blaye", "Saint Andre de Cubezac", "Bordeaux"]);
  road.set("A6", a6 = ["Paris", "Etampes", "Fontainebleau", "Sens", "Auxerre"]);
  road.set("A1", a1 = ["Paris", "Lille", "Compiegne"]);
  X.clear();
  Y.clear();


  var fullMap = road(Roads, Cities).getSolutions();
  
  /*
  console.log("road::"
    + JSON.stringify(fullMap)
    );
  /**/
  
  
  Cities.get()
  .filter((city, i, self) => {
      return self.indexOf(city) !== i
      })
  .forEach(jCity => {
      var idx = -1;
      while((idx = Cities.get().indexOf(jCity, idx + 1)) > -1) {
        junction.set(Roads.get()[idx], jCity);
        }
      })
  ;

  
  var rJunction = Lourah.ai.Prolog.rule(2);
  rJunction.add((A, B) => {
      //console.log("in rule::" + A + "::" + B);
      road(A, _.clear());
      road(B, _);
      //console.log("rule::_::" + _);
      }).add((A, B) => {
      road(A, _.clear());
      road(W, _);
      road(B, _);
      })
  
  
  rJunction("A1", "A10")
  
 /*
  road(X, "Poitiers");
  //junction(X, _.clear());
  //junction(Y, _);
  road(W, "Lille");
  road(Y, Z)(W, Z);
  junction([W], Z);
  //road(Y, "Lille");
  //road(X, Z)(Y, Z)
/**/

  //road(X, Z);

  function path(from, to) {
    var Junction = Lourah.ai.Algolog.variable();
    var RoadTo = Lourah.ai.Algolog.variable();
    junction(Junction, from);


    }

  //road(X, Z.clear())(Y, Z);
  //console.log("road::" + road);
  //console.log("parent::" + parent);
  console.log("X::" + X);
  console.log("Y::" + Y);
  console.log("Z::" + Z);
  console.log("W::" + W);
  console.log("_::" + _);
  console.log("Roads::" + Roads);
  console.log("Cities::" + Cities);

  } catch(e) {
  console.log("Algolog.js::" + e + "::" + e.stack);
  }
