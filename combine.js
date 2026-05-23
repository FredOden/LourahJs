
var combine = (a, b) => {
	var r = [];
	console.log("a::["+a+"],b::["+b+"]");
	//if (!b || b.length === 0) r.push(a);
	
	var left, right;
	if (a.length >= 1) {
    	left = a.slice(0, a.length-1);
	}
	else {
	  return right;
	}
	right = [a.slice(a.length-1)];
	if (b) right = right.concat(b);
	r = (r.concat(combine(left, right)));
	return r;
}


function powerSet( list ){
	var set = []
	, listSize = list.length
	, combinationsCount = (1 << listSize)
	, combination;

 for (var i = 1; i < combinationsCount ; i++ ){
 	
  var combination = [];
  for (var j=0;j<listSize;j++){
  	if ((i & (1 << j))) {
  		combination.push(list[j]);
  		}
  }
  set.push(combination);
  }
  return set;
  }

var a;
var r = JSON.stringify(a = powerSet([1,2,3,4,5,6,7,8,9]));

console.log(r, a.length);


