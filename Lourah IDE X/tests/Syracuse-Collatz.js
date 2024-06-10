const next = (n) => (n % 2 === 0)?(n/2):(3*n + 1);

function sc(n) {
  var k = next(n);
  console.log(k);
  if (k === 1) return 1;
  return sc(k);
  }

sc(7);