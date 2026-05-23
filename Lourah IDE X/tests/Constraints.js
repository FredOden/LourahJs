var ok = 1, ko = 0;

var a = true;
var b = false;

function Constraints (aConstraintsTree) {
  this.run = () => {
    for(constraint of aConstraintsTree) {
      }
    }
  }


run([
  a, [
    [b, [ ok, ko ]]
    ko ]
  ]);
