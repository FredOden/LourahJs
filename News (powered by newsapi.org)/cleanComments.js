var config =
  ("" + Activity.path2String(Lourah.jsFramework.dir() + "/config.json"))
      .replace(/\s*\/\/[^*].*\n/g, "")
  ;
console.log(config);
try {
JSON.parse(config);
  } catch(e) {
  console.log(e);
  }