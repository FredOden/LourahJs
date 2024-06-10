Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.debug.js");


  var bp = new Lourah.debug.BP();
  bp.setEnabled(true);
  var a = [];
  bp.TRACE(() => "a=" + a);
  var b = new Lourah.debug.Bench("Me");
  java.lang.Thread.sleep(100);
  b.top(b => console.log("::" + b.name+ "::" + (b.top - b.last)));
  java.lang.Thread.sleep(200);

  var c = new Lourah.debug.Bench("You");
  bp.BREAK(() => "c::" + JSON.stringify(c));
  b.top(b => console.log("::" + b.name + "::" + (b.top - b.last)));
  c.top(c => console.log("::" + c.name + "::" + (c.top - c.last)));
  java.lang.Thread.sleep(100);
  b.top(b => console.log("::" + b.name + "::" + (b.top - b.last) + "::" + (b.top - b.start)));
  c.top(b => console.log("::" + b.name + "::" + (b.top - b.last) + "::" + (b.top - b.start)));



try {
  c.zz = "top";
  console.log(":c:zz::" + ca.zz);
  } catch(e) {
  console.log("::error::" + e + "::" + e.stack);
  }
