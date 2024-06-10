
function file2table(filename, table, tableHandler) {
    var txt = Activity.path2String(
      Lourah.jsFramework.dir()
      + "/capacities.txt"
      );

    var lines = ("" + txt).split("\n");

    var headers = lines[0].split(/t/);
    lines = lines.splice(1);

    //console.log("'" + lines[0] + "'");

     
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      line = line.split(/\t/);
      if (line[0].match(/^[0-9]/)) {
        line = line.splice(1);
        }

      table[line[0]] = table[line[0]] || [];
      table[line[0]].push(line.splice(1));
      }

    //console.log(JSON.stringify(capacities));
    }


function capacitiesHandler(capacities, lines, headers) {
  }
  
  console.log(capacities.L[39]);
