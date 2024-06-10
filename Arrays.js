var Lourah = Lourah || {};
(function() {
Lourah.util = Lourah.util || {};
Lourah.util.Arrays = Lourah.util.Arrays || {};

/**
Lourah.util.Set
create a set object that contains unic elements
*/
Lourah.util.Set = function() {
	var set = {};
	var k = (o) => o.toString();
	this.set = (o) => {
		set[k(o)] = o;
		return this;
	};
	this.delete = (o) => {
		set[k(o)] = undefined;
		return this;
	};
	this.get = (o) => {
		if (o) return set[k(o)];
		var keys = Object.keys(set);
		return keys.map(key => set[key]);
	};
}

Lourah.util.Arrays.inter = (a, b) => {
	if (a.length > b.length) return a.filter(item => b.indexOf(item) !== -1);
	else return b.filter(item => a.indexOf(item) !== -1);
}

Lourah.util.Arrays.equivalent = (a, b) => {
	return a.length === b.length 
        && a.length === inter(a, b).length;
}


/**
Lourah.util.Arrays.combine:
performs combination of items of the "toCombine" array
if "size" is specified, only the combinations of "size" are returned, otherwise all combinations are returned
*/
Lourah.util.Arrays.combine = (toCombine, size) => {
	var combinations = new Lourah.util.Set();
	var gen = array => {
		if (!size || array.length === size ) {
			  combinations.set(array);
			  if (size) return;
			  }
		if (array.length === 1) return;
		for(var i = 0; i < array.length; i++) {	 
			gen(
			   array.slice(0,i).concat(array.slice(i+1))
			   );
		}
	};
	gen(toCombine);
	return combinations.get();
};


Lourah.util.Arrays.powerSet = function(list) {
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
};

Lourah.util.Arrays.powerSetValidated = function(list, validator) {
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
  var v = (validator)?validator(set, combination): combination;
  if (v !== undefined) set.push(v);
  }
  return set;
};
  
})();

/*
var c = Lourah.util.Arrays.combine("ABCDEF".split(''), 5);
console.log(c.get().map(a => a.sort().join('')));
console.log(c.get().length);
*/



