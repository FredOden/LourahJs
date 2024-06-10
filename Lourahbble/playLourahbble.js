
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Arrays.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.Color.js");
Activity.importScript(Lourah.jsFramework.dir() + "/Lexic.js");
    
Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});

var Lourahbble = {};

Lourahbble.fr = {
	lexic: {
		path: {
			txt: Lourah.jsFramework.dir() + "/Lourahbble.fr.txt"
			,json: Lourah.jsFramework.dir() + "/Lourahbble.fr.json"
		}
		,atoms: {
			/*
	"sorted list of characters": [
	   list of indexes in words
	   ]
	   */
		}
		,words: []
	}

	,weights: {
		A:1,B:3,C:3,D:2,E:1,F:4,G:2,
		H:4,I:1,J:8,K:10,L:1,M:3,N:1,
		O:1,P:3,Q:8,R:1,S:1,T:1,U:1,
		V:4,W:10,X:10,Y:10,Z:10," ":0
	}
	,count: {
		A:9,B:2,C:2,D:3,E:15,F:2,G:2,
		H:2,I:8,J:1,K:1,L:5,M:3,N:6,
		O:6,P:2,Q:1,R:6,S:6,T:6,U:6,
		V:2,W:1,X:1,Y:1,Z:1," ":2
	}
	,alphabet: "ABCDEFGHIJKLMNOPQRTSUVWXYZ".split('')
};

function log(t) {
	console.log("LOG::" + t);
}

function playLourahbble(language) {
	var lexic = new Lexic(Lourahbble[language]);
	lexic.load();
	var solutions = lexic.solutionsOf("Hello");
	solutions.forEach((s) => console.log(s));
}
