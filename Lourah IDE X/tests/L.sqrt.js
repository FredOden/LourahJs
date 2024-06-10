//
var L = L || {};
(function () {
    if (L.sqrt) return;

    L.sqrt = (x) => {
      var depth = 8;
      var d2 = 10;
      var x1 = x - 9;
      //var p = 1 + (x-1)/(2 + (x-1)/(2 + (x - 1)/2));
      var p = 6 + x1/17;
      for (var i = 1; i < depth - 1; i++) {
        p = 6 + x1/p;
        }
      p = 3 + x1/p;
      //console.log("x::" + x + " p::" + p);
      var p2 = p*p;
      var pp = 2*p;
      var xp2 = x - p2;
      var r = pp + xp2/pp;
      for(var i = 1; i < d2 - 1; i++) {
        r = pp + xp2/r;
        }
      r = p + xp2/r;
      return r;
      }
    })();
/*
var x = 1024;
var [ l, s ] = [ L.sqrt(x), Math.sqrt(x) ];
console.log([l, s, l - s]);
*/
