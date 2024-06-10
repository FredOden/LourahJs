var str = "to be updated";
var u = new java.net.URL("https://www.google.com/");
console.log("u::<" + u + ">");
var t = new java.lang.Thread({run: () => {
      try {
        var inp = u.openStream();
        console.log("inp::" + inp);
        str = new java.lang.String(inp.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        } catch(e) {
        Activity.reportError("@::" + e + "::" + e.stack);
        }
      }
    }
  );

t.start();
t.join();

console.log("str::<" + str + ">");
