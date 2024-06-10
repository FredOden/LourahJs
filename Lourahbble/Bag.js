
function Bag(game) {
	var bag = [];

	this.reset = function() {
		var size = 0 
		var keys = Object.keys(game.count);
		for(var k in game.count) {
			size += game.count[k];
		}
		bag = new Array(size);
		var alphabet = game.alphabet.slice();
		var count = Bag.deepCopy(game.count);
		var l;
		for(var i = 0; i<size; i++) {
			l = alphabet.charAt(Bag.random(0, alphabet.length));
			bag[i] = l;

			count[l]--;
			if (count[l] === 0) {
				var idx = alphabet.indexOf(l);
				alphabet = alphabet.substr(0, idx) + alphabet.substr(idx + 1);
				//log("alphabet::-'" + l + "'->'" + alphabet + "'");
			}
		}
	};

	this.pickLetter = function() {
		if (bag.length === 0) return null;
		var idx = Bag.random(0, bag.length);
		var l = bag[idx];
		bag = bag.slice(0, idx).concat(bag.slice(idx+1));
		//log("bag[" + idx +"::'" + l + "'->'" + bag + "'");
		return {letter:l, weight:game.weights[l]};
	};

	this.reset();
}

Bag.deepCopy = (from) => JSON.parse(JSON.stringify(from));

Bag.random = (min,max) => Math.floor(min + Math.random()*(max - min));

