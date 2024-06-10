Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.debug.js");

var loop = new Lourah.debug.Bench("Loop");

for (var i = 0; i < 1000000; i++) {}

loop.top(
  o => console.log(o.bench.getName() + "::" + (o.top - o.start)/1000)
  );