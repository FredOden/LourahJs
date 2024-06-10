Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");
txt = "((3)^2 + (4)^2)^-1";
var txt = "(3^4)^(2-5)";
var txt = "((2*3)^2)^2";
var txt = "(1+1^2^3)^4";
//var txt = "Math.cos(1) - (1.01^2)^2";
//var txt = "(1 + Math.cos(0))^6 + 3";

//var pat = /((?:[\w.]*\s*\(.*\)+)|(?:[\w.]+))\^(.+)/g;
//var pat = /((?:[\w.]+)|(?:[\w.]*\s*(?:(?:\(.*\))+)))\^([\w.]+)/g;


//var pat = /((?:[\w.]*\s*(?:(?:\([^()]*\))+))|(?:[w.]+))\^((?:[\w.]+)+)?/g;

var patV1 = /((?:[\w.]*\s*(?:(?:\([^()]*\))+))|(?:[w.]+))\^((?:[\w.]+)+)?/g;

var patV2 = /((?:[^^+\-*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:[\w.]+)+)?/g;

var patV3 = /((?:[^^\+\-\*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:(?:-|\+)?[^^+\-*\/]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))/g;

var patV4 = /((?:[\w.+\-]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))\^((?:[\w.+\-]+)|(?:[\w.]*\s*(?:(?:\([^()]*\))+)))/g;

var pat = patV4;
//pat = patV1

var s = new Lourah.utils.text.SearchString(txt);
 while(s.search(pat).getMatchs().length>0) {
  console.log("toProcess::"+s);
  s.process(toPow)
  }

s.search(/<<x<</g).replaceAll("(")
  .search(/>>x>>/g).replaceAll(")");

if (s.search(/\^/g).getMatchs().length > 0) {
  throw "Lourah.util.text.Fomula::error::^ not reduced, check parenthesis::'" + txt +"'";
  }

s.search(/\b(pow)\b/g).replaceAll("Math.$1");

try {
  console.log(txt + "::" + s);
  console.log("Eval::" + eval(""+s));
  } catch(e) {
  console.log("ERROR::" + e);
  }

function toPow(m, sub) {
  //console.log("...toPow::" + sub);
  //var [left, right] = [sub.$(1), sub.$(2)];
  //console.log("......[left, right]::[" + [left, right] + "]");
  //console.log("s::" + s);
  var left = (new Lourah.utils.text.SearchString(sub.$(1))).search(pat).process(toPow);
  var right = (new Lourah.utils.text.SearchString(sub.$(2))).search(pat).process(toPow);
 
  //console.log("......<" + m + ">[left, right]::[" + [left, right] + "]");
  var ret = "pow<<x<<" + brackets(left) + "," + brackets(right) + ">>x>>";
  //console.log(".........>" + ret);
  return ret;
  }

function brackets(s) {
  return s.search(/\(/g)
  .replaceFirst("<<x<<")
  .search(/\)/g)
  .replaceLast(">>x>>");
  }
