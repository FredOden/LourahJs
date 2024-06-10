
string2Path = (string, path) => {
      //Activity.reportError("Lourah.ide.string2Path::" + path);
      //return;
      var bw = new java.io.BufferedWriter(
        new java.io.OutputStreamWriter(
          new java.io.FileOutputStream(path)
          , "UTF-8")
        );
      try {
        bw.write(string);
        } catch(e) {
        throw("string2Path::" + e + "::" + e.stack);
        } finally {
        bw.close();
        }
      };

var txt = Activity.path2String(
  Lourah.jsFramework.dir()
  + "/capacities.txt"
  );

var lines = ("" + txt).split("\n");

lines = lines.splice(1);

//console.log("'" + lines[0] + "'");

var capacities = {
  };

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];

  line = line.split(/\t/);
  if (line[0].match(/^[0-9]/)) {
    line = line.splice(1);
    }

  capacities[line[0]] = capacities[line[0]] || [];
  capacities[line[0]].push(line.splice(1));
  }

//console.log(JSON.stringify(capacities));

//console.log(capacities.L[39]);
string2Path(
  JSON.stringify(capacities).replace(/]/, "]\n")
  , Lourah.jsFramework.dir()
  + "/capacities.json"
  );
console.log("capacities generated");
