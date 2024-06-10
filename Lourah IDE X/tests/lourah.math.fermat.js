var Lourah = Lourah || {};
(function () {
    Lourah.math = Lourah.math || {};
    if (Lourah.math.fermat) return;
    Lourah.math.fermat = {
      delta:(n, j) => j * (2*n - j)
      }
    })();

var F = Lourah.math.fermat;

console.log("k=" + Math.sqrt(F.delta(25,5)));
