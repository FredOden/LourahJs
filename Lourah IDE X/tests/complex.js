var Lourah = Lourah || {};

(function () {
    Lourah.math = Lourah.math || {};
    if (Lourah.math.complex) return;
    let Z = r => i => ({
        r:r
        , i:i
        , toString: () => "" + r + " i" + i
        , add: zz => Z(r + zz.r)(i + zz.i)
        , mult: zz => Z(r*zz.r - i*zz.i)(r*zz.i + i*zz.r)
        , conj: () => Z(r)(-i)
        , div: zz => zz.mult(zz.conj()).mult(Z(1/(zz.r*zz.r + zz.i*zz.i))(0))
        });
    
    Lourah.math.complex = {
      Z:Z
      ,R:(r) => Z(r)(0)
      ,I:(i) => Z(0)(i)
      };
    })();
//let add = (zz, top) => z(zz.r + top.r)(zz.i + top.i);
//console.log(Z()());
var Z = Lourah.math.complex.Z;
var R = Lourah.math.complex.R;
var I = Lourah.math.complex.I;
console.log(
  Z(2)(3)
  .add(Z(5)(5))
  .add(Z(10)(100))
  .mult(Z(0)(5))
  .div(R(1))
  );
