
const s = a => b => a + b;
const m = a => b => a * b;

console.log(s(2)(3));
const cinq = m(s(2)(3));
console.log(cinq(3));