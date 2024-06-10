function Lexic(game) {
	var System = java.lang.System;

	function string2Path(string, path) {
		var writer = null;
		try {
			writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(
				new java.io.FileOutputStream(path), "utf-8"));
			writer.write(string);
		} catch (e) {
			// Report
			Activity.reportError("string2Path::" + path + "::" + e + "::" + e.stack);
		} finally {
			try {writer.close();} catch (e) {/*ignore*/}
		}
	}


	function loadLexicTxt() {
		log("txt::load::" + game.lexic.path.txt);
		var start = System.currentTimeMillis();
		game.lexic.words = (new String(Activity.path2String(game.lexic.path.txt)))
			.split("\n");

		var top = System.currentTimeMillis();
		log("LoadLexic::" + game.lexic.path.txt + "::" + (top - start) + " ms");
		start = System.currentTimeMillis();


		for(var i = 0; i < game.lexic.words.length; i++) {
			var key = game.lexic.words[i].split('').sort().join('');
			if (!game.lexic.atoms[key]) game.lexic.atoms[key] = i.toString(36);
			else game.lexic.atoms[key] += "," + i.toString(36);
		}


		//Activity.reportError("lexic::" + JSON.stringify(atoms));

		//Activity.reportError("done::" + Object.keys(atoms).length);
		top = System.currentTimeMillis();
		log("txt::done::" + (top - start) + " ms");
		log("txt::atoms::" + Object.keys(game.lexic.atoms).length);
		log("txt::words::" + game.lexic.words.length);


		try {
			start = System.currentTimeMillis();
			var json = JSON.stringify(game.lexic);
			top = System.currentTimeMillis();
			log("txt::json::generate::" + (top - start) + " ms");
			log("txt::json::size::" + json.length);
		} catch(e) {
			log("txt::json::error::" + e + "::" + e.stack);
			return;
		}

		start = System.currentTimeMillis();
		string2Path(json, game.lexic.path.json);
		top = System.currentTimeMillis();
		log("txt::json::saved::" + (top - start) + " ms");


	}

	function loadLexicJson() {
		log("json::load::" + game.lexic.path.json);
		start = System.currentTimeMillis();
		game.lexic = JSON.parse(Activity.path2String(game.lexic.path.json));
		top = System.currentTimeMillis();
		log("json::done::" + (top - start) + " ms");
		log("json::atoms::" + Object.keys(game.lexic.atoms).length);
		log("json::words::" + game.lexic.words.length);
	}

	this.load = () => {
		var json = new java.io.File(game.lexic.path.json);

		if (json.isFile() && json.canRead()) {
			loadLexicJson();
		}
		else {
			loadLexicTxt();
		}
	}

	function Solution(w) {
		this.points = 0;
		w.split('').forEach(l => this.points += game.weights[l]);
		this.toString = () => "[" + w + "] => " + this.points;
		this.length = w.length;
		this.word = w;
	}

	function atomicSolutionsOf(lexic, hand, line, before, after) {
		var solutions = [];

		//. "123456789012345"
		//line="*E**T**ARRANGE*";
		//log("hand::'"+ hand + "'");
		var pattern = "^";
		if (line) {
			line.split('').forEach(c => pattern += (c.match(/[A-Z]/))?c:'.');
			log("::"+line+"::"+pattern);
		}

		var k = hand.toUpperCase().split('');
		Lourah.util.Arrays.powerSetValidated(k, (set, combination) => {
			var a = lexic.atoms[combination.sort().join('')];
			if (a !== undefined && set.indexOf(a) === -1) return a;
		}).forEach(e => e.split(',').forEach(idx => solutions.push(new Solution(lexic.words[parseInt(idx, 36)]))));
		//solutions.sort((a,b) => b.points - a.points);
		//log("solutions::" + solutions);
		return solutions;
	}

	function compoundSolutionsOf(lexic, hand, line, before, after) {
		var solutions = [];
		var wildCard = hand.indexOf('*');
		if (wildCard === -1) {
			solutions = atomicSolutionsOf(lexic, hand, line, before, after);
		}
		else {
			var modifiedHand = hand.replace('*','');

			for(var i = 0; i < game.alphabet.length; i++) {
				solutions = solutions.concat(compoundSolutionsOf(lexic, modifiedHand + game.alphabet[i], line, before, after));
				//log("tried::" + game.alphabet[i] + "::" + solutions.length);
			}
		}
		solutions.sort((a, b) => b.points - a.points);
		return solutions;
	}

	this.solutionsOf = function (hand, line, before, after) {
		return compoundSolutionsOf(game.lexic, hand, line, before, after);
	}


}

