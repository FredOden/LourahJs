var Lourah = Lourah || {};
( function () {
    Lourah.maths = Lourah.maths || {};
    
    Lourah.maths.isPrime = num => {

      if (num <= 3) return num > 1;
      if ((num % 2 === 0) || (num % 3 === 0)) return false;
      let count = 5;
      let sNum = Math.sqrt(num);
      
      while (count <= sNum) {
        if (num % count === 0 || num % (count + 2) === 0) {
          return false;
          }
        count += 6;
        }
      return true;
      } 
    })();


let start = java.lang.System.currentTimeMillis();
let p = Lourah.maths.isPrime(2000000011);
let t = java.lang.System.currentTimeMillis() - start;
console.log("::" + p + "::" + t);