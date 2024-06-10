try {
  var s = "return a*a;twist a st trooez";
  var f = new Function("a", s);
  console.log(f(3));
  } catch(e) {
  console.log("new Function::error::" + e + "::" + e.stack);
  }
