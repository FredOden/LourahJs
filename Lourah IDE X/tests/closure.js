function poids(g) {
  return function (x) {
    console.log("poids:" + x.name);
    return g*x.mass;
    }
  }

function poids2(g) {
  return function (x) {
    console.log("poids2:" + x.name);
    return 25*x.mass;
    }
  }

var jupiter = poids(24.79);
var terre = poids(9.81);

var v = {
  name:"velo"
  ,mass:12
  };

var p = {
  name:"plomb"
  ,mass:64
  };

console.log("::" + jupiter(v) + "::" + terre(p));
