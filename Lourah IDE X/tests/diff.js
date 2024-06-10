
function diff(s1, s2) {
  var i1 = 0;
  var i2 = 0;
  var s = "";
  for(;;) {
    if (s1.charAt(i1) === s2.charAt(i2)) {
      i1++;
      i2++;
      s += s1.charAt(i1);
      continue;
      }
    if (s1.charAt(i1) !== s2.charAt(i2)) {
      i2++;
      
      }
    }
  }