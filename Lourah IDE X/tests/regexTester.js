var i= 0;
var m;
var re = /[a-z]?/g;
var t = "h";
m = re.exec(t);
console.log(m + ":1:" + re.lastIndex);
m = re.exec(t);
console.log("'" + (m?m[0]:"null") + "'" + ":2:" + re.lastIndex);
m = re.exec(t);
console.log("'" + (m?m[0]:"null") + "'" + ":2:" + re.lastIndex);

