Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.ai.Prolog.js');
          
try {
  var ctx = Lourah.ai.Prolog.getContext();

  var parent = ctx.predicate();
  var homme = ctx.predicate();

  var X = ctx.var();
  var Y = ctx.var();
  var Z = ctx.var();

  parent.set(["michel", "monique"], ["frederic", "christine"]);
  parent.set(["jean", "nano"], "michel");
  parent.set(["gerard", "louisette"], ["monique", "jean-pierre"]);
  
  homme.set(["michel", "frederic", "jean", "gerard"]);
  
  
  try {
    
    parent(X, Y)(X, Z);
    homme(X);
    //homme(Z);

    var _t = ctx.getTrack();
    _t.rewind();
    
    var t = ctx.buildTrack();
    var vars = ctx.getVars();
    var solutions = [];
    
    function Env(vars) {
      env = vars.map(v => v());
      this.set = (v, val) => {
        var i = vars.indexOf(v);
        env[i] = val;
        }
      this.get = () => env;
      }
    
    
    while(_t.next()) {
      if (Y() === Z()) continue;
      var e = new Env(vars);
      console.log("X::" + X() + "::Y::" + Y() + "::Z::" + Z());
      }
    
    } catch(status) {
    console.log("status::" + status);
    }


  } catch(e) {
  console.log("testBacktracking;:" + e + "::" + e.stack);
  }
