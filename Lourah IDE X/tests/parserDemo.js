
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Parser.js");

var lexicon = {
  Comment : {
    re : /(^\s*#+.*$)/g
    }
  ,Number:Lourah.utils.text.Parser.TOKENS.Number
  , print : { re : /\b(print)\b/g }
  , if : { re : /\bif\b/g }
  , then : { re: /\bthen\b/g }
  , else : { re : /\belse\b/g }
  , for : { re : /\bfor\b/g }
  , to : { re : /\bto\b/g }
  , not: { re : /\bnot\b/g }
  , step: { re : /\bstep\b/g }
  , def: { re : /\bdef\b/g }
  ,Math: {
    re : /(\bcos\b)|(\bsin\b)|(\btan\b)|(\bln\b)|(\bexp\b)/g
    }
  ,OperatorB : {
    re : /(\band\b)|(\bor\b)|(\bxor\b)/g
    }
  ,OperatorL : {
    re : /(\beq\b)|(\bne\b)|(\bgt\b)|(\bge\b)|(\blt\b)|(\ble\b)/g
    }

  ,Identifier : Lourah.utils.text.Parser.TOKENS.Identifier
  ,OperatorA : {
    re : /(\+|\-)/g
    }
  ,OperatorM : {
    re : /(\*|\/|\^)/g
    }
  ,'=' : {
    re : /=/g
    }
  ,';' : {
    re : /;/g
    }
  ,'(' : { re : /(\()/g }
      ,')' : { re : /(\))/g }
  ,'[': { re : /(\[)/g }
      ,']' : { re : /(\])/g }
  ,'{': { re : /(\{)/g }
      ,'}' : { re : /(\})/g }
  ,'π': { re : /π/g }
  ,'√': { re : /\√/g }
  ,'°': { re : /°/g }
  ,'®': { re : /®/g }

  };

function operate(o, a, b) {

  //var a = fa();
  //var b = fb();
  //console.log("operate(" + [o, a, b] + ")");
  a = isNaN(a)?vars[a]:a;
  b = isNaN(b)?vars[b]:b;
  switch(o) {
    case '+': return a+b;
    case '-': return a-b;
    case '*': return a*b;
    case '/': return a/b;
    case '^': return Math.pow(a, b);
    case 'and': return a && b;
    case 'or': return a || b;
    case 'xor':return (a || b) && !(a && b);
    case 'gt': return a > b;
    case 'ge': return a >= b;
    case 'le': return a <= b;
    case 'lt': return a < b;
    case 'ne': return a != b;
    case 'eq': return a == b;
    }
  }

function callMath(math, val) {
  val = isNaN(val)?vars[val]:val;
  switch(math) {
    case "cos" : return Math.cos(val);
    case "sin" : return Math.sin(val);
    case "tan" : return Math.tan(val);
    case "ln" : return Math.log(val);
    case "exp" : return Math.exp(val);
    }
  }

function $N(a) {
  return isNaN(a)?vars[a]:Number(a);
  }

var vars ={};

var rules = {

  variable: {
    "Identifier":
    (p) => p.$(0)
    ,"Identifier [ &factor ]" :
    p => () => p.$(0)() + "[" + p.$(2)() + "]"
    }

  ,atom : {
    "Number":
    (p) => () => Number(p.$(0)())//{p.val = p.$(0)(); console.log("p.val::"+p.val); return p.$(0) is }
    , "π" : (p) => () => Math.PI
    , "&variable":
    (p) => () => {
      if (vars[p.$(0)()] === undefined) {
        vars[p.$(0)()] = 0;
        }
      return vars[p.$(0)()];
      }
    , "( &factor )":
    p => {
      return p.$(1);
      }
    ,"√ &atom":
    p => () => Math.sqrt(p.$(1)())
    ,"&atom °":
    p => () => p.$(0)()*Math.PI/180
    ,"&atom ®":
    p => () => p.$(0)()*180/Math.PI
    ,"Math ( &factorA )":
    p => () => callMath(p.$(0)(), p.$(2)())

    /*
    ,"not &atom":
    p => () => !p.$(1)
    */
    /*
    , "Comment":
    p => Lourah.utils.text.Parser.NOTHING
    */
    }

  
  ,factor : {
    "&factorL":
    p => p.$(0)
    ,"not &factorL":
    p => () => !p.$(1)()
    }

  ,factorL : {
    "&factorL OperatorL &factorL":
     p => () => operate(p.$(1)(), p.$(0)(), p.$(2)())
    ,"&factorB":
      p => p.$(0)
    }
  
  
  ,factorB : {
    "&factorB OperatorB &factorB":
    p => () => operate(p.$(1)(), p.$(0)(), p.$(2)())
    ,"&factorA":
    p => p.$(0)
    }

  ,factorA: {
    "&factorA OperatorA &factorA":
    p => () => operate(p.$(1)(), p.$(0)(), p.$(2)())

    ,"OperatorA &atom":
    p => () => operate(p.$(0)(), 0, p.$(1)())
     

    ,"&factorM":
    p => p.$(0)
    }

  ,factorM: {
    "&factorM OperatorM &factorM":
    p => () => operate(p.$(1)(), p.$(0)(), p.$(2)())
    ,"&atom":
    p => p.$(0)
    }

  ,expr : {
    "&variable = &expr":
    (p) => () => {
      p2 = p.$(2)();
      vars[p.$(0)()] = p2;
      p.val = p2;
      return p2;
      }
    ,"&factor ;":
    (p) => p.$(0)
    /*
    ,"&atom ;":
    (p) => p.$(0)
    */
    ,";":
    Lourah.utils.text.Parser.NOTHING
    , "print &atom ;":
    (p) => () => { console.log(p.$(1)());return p.$(1)(); }
    , "if &factor then &expr":
    p => () => {
      if ($N(p.$(1)())) return p.$(3)();
      else return Lourah.utils.text.Parser.NOTHING;
      }
    , "if &factor then &expr else &expr":
    p => () => $N(p.$(1)())?p.$(3)():p.$(5)()
    , "&block":
    (p) => p.$(0)
    , "for &variable = &factor to &factor &expr":
    (p) => () => {
      var v = p.$(1)();
      var from = Number(p.$(3)());
      var to = Number(p.$(5)());
      if (to <  from) {
        throw "for::error::to("+to+") < from(" + from +")";
        }
      for(vars[v] = from; vars[v] <= to; vars[v]++) {
        p.$(6)();
        }
      return p.$(6)(); //Lourah.utils.text.Parser.NOTHING;
      }
    , "for &variable = &factor to &factor step &factor &expr":
    (p) => () => {
      var v = p.$(1)();
      var step = Number(p.$(7)());
      var from = Number(p.$(3)());
      var to = Number(p.$(5)());
      if (step === 0) {
        throw "for::error::step = " + step;
        }
      if ((step >0)?(to <  from):(to > from)) {
        throw "for::error::to("+to+ ((step>0)?") < from(":") > from(")
          + from +")";
        }
      for(vars[v] = from; (step>0)?(vars[v] <= to):(vars[v] >= to); vars[v]+=step) {
        p.$(8)();
        }

      return p.$(8)();
      }
    }

  , statement : {
    "&expr":
    (p) => p.$(0)
    , "&expr &statement":
    (p) => () => {
      p.$(0)();
      return p.$(1)();
      }
    }

  , block : {
    "{ &statement }":
    (p) => p.$(1)
    }

  }



var parser = new Lourah.utils.text.Parser(lexicon, rules, "statement");

var now = () => {
  var to = java.lang.System.currentTimeMillis();
  return to; is
  }

try {
  var start = now();
  var source = Activity.path2String(Lourah.jsFramework.dir() + "/parserDemo3.txt");
  var p = parser.compile(source);
    //source = "if x-6 then {(4*(1+2)*3*2+1)*π;} else f = for i = 3 to -1 step x-8 f = f + √2*√(√81+4^2)*3*√(π-i);a[f]=√(f+2);√a[f];;");//"for k = 5 +1 to 2*5 {x=x+k;\nif x-7 then print(x*1111); else print(x);} p[π] = 180;1+2*3 + p[π];", "statement");
  var top = now() - start;
  console.log("compile::time::" + top);
  } catch (e) {
  console.log("compile::error::" + e + "::" + e.stack);
  }


try {
  vars = {};
  vars.x = 6;

  var r;
  start = now();
  r = p.run();
  top = now() - start;
  console.log("r::" + r +"::exécution time::" + top);
  //console.log("p.run::" + p.generated);
  for(var kv in vars) {
    console.log(kv + "=" + vars[kv]);
    }
  } catch(e) {
  throw "parser::execution::" + e;
  }
try {
  vars = {};
  vars.x = 7;

  var r;
  start = now();
  r = p.run();
  top = now() - start;
  console.log("r::" + r +"::exécution time::" + top);
  //console.log("p.run::" + p.generated);
  for(var kv in vars) {
    console.log(kv + "=" + vars[kv]);
    }
  } catch(e) {
  throw "parser::execution::" + e;
  }
