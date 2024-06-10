(function() {

Activity.errorReporter = {
	report: (msg) => log(msg)
	};


Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Arrays.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.Color.js");

    
var System = java.lang.System;

Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});

var board = (new Lourah.android.Overview({
	  ll : {
		class : "android.widget.LinearLayout"
	   ,attributes : {
		   setOrientation : android.widget.LinearLayout.VERTICAL
		   }
	   ,content : {
		   edit : {
			  class : "android.widget.EditText"
			}
		   ,bt : {
			  class : "android.widget.Button"
			 , attributes : {
				setText : "'search...'"
				}
			}
			,play : {
				class : "android.widget.Button"
				,attributes : { setText: "'Play'" }
			}
			
		   ,scroll : {
			  class : "android.widget.ScrollView"
			 ,content : {
				tv : {
				   class : "android.widget.TextView"
				   ,attributes: {
					   setTextColor: android.graphics.Color.GREEN
					   ,setBackgroundColor : android.graphics.Color.BLACK
					   }
					}
				}
				
			}
		   //,title : titledEdit("'title'")
		   }
		}
	,/*scrollboard : {
		class : "android.widget.scrollView"
		,content : {*/
	      playboard : {
		     class : "android.widget.ImageView"
		   }
     /*
		}
	 } */
	})).$();

Activity.setContentView(board.ll);
Activity.setTitle("Lourabble (c) 2018-2021 Lourah.com");
log("Starting...");



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


function log(txt) {
	Lourah.jsFramework.mainThread(() => board.tv.setText(board.tv.getText() + txt + "\n"));
	}
	
var Lourabble = {};

Lourabble.fr = {
  weights : {
	A:1,B:3,C:3,D:2,E:1,F:4,G:2,
	H:4,I:1,J:8,K:10,L:1,M:3,N:1,
	O:1,P:3,Q:8,R:1,S:1,T:1,U:1,
	V:4,W:10,X:10,Y:10,Z:10," ":0
	}
  ,count : {
    A:9,B:2,C:2,D:3,E:15,F:2,G:2,
    H:2,I:8,J:1,K:1,L:5,M:3,N:6,
    O:6,P:2,Q:1,R:6,S:6,T:6,U:6,
    V:2,W:1,X:1,Y:1,Z:1," ":2
	}
  ,alphabet : "ABCDEFGHIJKLMNOPQRTSUVWXYZ".split('')
};

var game = Lourabble.fr;

var ODS = {
   path : {
   	txt : Lourah.jsFramework.dir() + "/Lourahbble.txt",
       json: Lourah.jsFramework.dir() + "/Lourahbble.json"
   	},
   atoms : {
	/*
	"sorted list of characters" : [
	   list of indexes in words
	   ]
	*/
	},
   words : []
   };

function Solution(w) {
	this.points = 0;
	w.split('').forEach(l => this.points += game.weights[l]);
	this.toString = () => "[" + w + "] => " + this.points;
	this.length = w.length;
	}

function atomicSolutionsOf(ods, hand, line, before, after) {
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
     	var a = ods.atoms[combination.sort().join('')];
         if (a !== undefined && set.indexOf(a) === -1) return a;
      }).forEach(e => e.split(',').forEach(idx => solutions.push(new Solution(ods.words[parseInt(idx, 36)]))));
      //solutions.sort((a,b) => b.points - a.points);
      //log("solutions::" + solutions);
   return solutions;
}

function compoundSolutionsOf(ods, hand, line, before, after) {
	var solutions = [];
	var wildCard = hand.indexOf('*');
	if (wildCard === -1) {
       solutions = atomicSolutionsOf(ods, hand, line, before, after);
	   }
	else {
	var modifiedHand = hand.replace('*','');
	
	for(var i = 0; i < game.alphabet.length; i++) {
		solutions = solutions.concat(compoundSolutionsOf(ods, modifiedHand + game.alphabet[i], line, before, after));
		//log("tried::" + game.alphabet[i] + "::" + solutions.length);
		}
	}
	solutions.sort((a, b) => b.points - a.points);
	return solutions;
	}

function solutionsOf(ods, hand, line, before, after) {
	return compoundSolutionsOf(ods, hand, line, before, after);
	}

function loadOdsTxt() {
log("txt::load::" + ODS.path.txt);
var start = System.currentTimeMillis();
ODS.words = (new String(Activity.path2String(ODS.path.txt)))
      .split("\n");
        //.split("\r\n");

var top = System.currentTimeMillis();
log("LoadOds::" + ODS.path.txt + "::" + (top - start) + " ms");
start = System.currentTimeMillis();


for(var i = 0; i < ODS.words.length; i++) {
	var key = ODS.words[i].split('').sort().join('');
	if (!ODS.atoms[key]) ODS.atoms[key] = i.toString(36);
	else ODS.atoms[key] += "," + i.toString(36);
	}


//Activity.reportError("ods::" + JSON.stringify(atoms));

//Activity.reportError("done::" + Object.keys(atoms).length);
top = System.currentTimeMillis();
log("txt::done::" + (top - start) + " ms");
log("txt::atoms::" + Object.keys(ODS.atoms).length);
log("txt::words::" + ODS.words.length);


try {
  start = System.currentTimeMillis();
  var json = JSON.stringify(ODS);
  top = System.currentTimeMillis();
  log("txt::json::generate::" + (top - start) + " ms");
  log("txt::json::size::" + json.length);
} catch(e) {
  log("txt::json::error::" + e + "::" + e.stack);
  return;
}

start = System.currentTimeMillis();
string2Path(json, ODS.path.json);
top = System.currentTimeMillis();
log("txt::json::saved::" + (top - start) + " ms");


}

function loadOdsJson() {
	log("json::load::" + ODS.path.json);
	start = System.currentTimeMillis();
    ODS = JSON.parse(Activity.path2String(ODS.path.json));
    top = System.currentTimeMillis();
    log("json::done::" + (top - start) + " ms");
    log("json::atoms::" + Object.keys(ODS.atoms).length);
    log("json::words::" + ODS.words.length);
	}

function loadOds() {
	Lourah.jsFramework.uiThread(() => {
	  board.bt.setEnabled(false);
      board.bt.setText("Wait ... loading ODS");
      });
      
      var json = new java.io.File(ODS.path.json);
      
      if (json.isFile() && json.canRead()) {
      	loadOdsJson();
      	}
      else {
      	loadOdsTxt();
          }
    
    
    Lourah.jsFramework.uiThread(() => {
      board.bt.setEnabled(true);
      board.bt.setText("Search solutions in ODS...");
      });
	}

var tLoader = Lourah.jsFramework.createThread(() => {
	  try {
		    loadOds();
		} catch(e) {
			log("tLoader::" + e + "::" + e.stack);
		}
	});

board.bt.setOnClickListener({
	onClick: view => {
	  try {
		var w = new String(board.edit.getText());
		//var k = w.toUpperCase().split('').sort().join('');
		//var solutions = ODS.atoms[k].split(',').map(s => parseInt(s, 36));
		var start = java.lang.System.currentTimeMillis();
		solutions = solutionsOf(ODS, w);
		var top = java.lang.System.currentTimeMillis();
		log("??? " + w + " ???::" + (top - start) + " ms");
		if (!solutions) {
			log("No solution")
			}
		else {
			log("found " + solutions.length + " solutions");
			solutions.forEach(solution => log(":::" + solution));
		    }
		}
	  catch(e) {
		log("error::" + e + "::" + e.stack);
		}
	  }
	});

board.ll.setOnTouchListener({
	onTouch: (view, motionEvent) => {
		try {
		    log("touched::" + motionEvent);
		    return true;
		  } catch(e) {
			log("ll::onTouch::" + e + "::" + e.stack);
			return false;
		  }
		}
    });



    
board.play.setOnClickListener({
	onClick : () => {
		 try {
            playLourabble();
          } catch(e) {
            Activity.reportError("playLourabble::" + e + "::" + e.stack);
          }
       }
	});

tLoader.start();

var COLUMNS = 15, ROWS = 15;
var cells = new Array((ROWS+6)*COLUMNS);
    
function cell(r, c) {
    	return cells[c + r*ROWS];
    	}

var DL=1,TL=2,DW=3,TW=4;OK=0;KO=-1;
    
(function(){
	for(var i = 0; i < cells.length; i++) {
    	cells[i] = { l: "", v: OK, locked:false };
    	}
	for(var i = ROWS*COLUMNS; i < cells.length; i++) {
		cells[i].v = KO;
		}
	for(var i = 0; i < 7; i++) {
        cell(20, 4 + i).v = OK;
        }
	cell(0,0).v = cell(7, 0).v = cell(14, 0).v = TW;
    cell(0,14).v = cell(7, 14).v = cell(14, 14).v= TW;
    cell(0, 7).v = cell(14, 7).v = TW;
    cell(7,7).v = DW;

    for(var i = 1; i < 5; i++) {
    	cell(i,i).v = cell(i, COLUMNS - 1- i).v
       =cell(ROWS - 1 - i, i).v
       =cell(ROWS - 1 - i, COLUMNS - 1- i).v
       =DW;
    	}

    cell(0,3).v = cell(0, COLUMNS - 1 - 3).v
    =cell(3,0).v = cell(3, COLUMNS - 1).v
    =cell(ROWS - 1 - 3,0).v = cell(ROWS - 1 - 3, COLUMNS - 1).v
    =cell(ROWS - 1,3).v = cell(ROWS - 1, COLUMNS - 1 - 3).v
    =cell(3,7).v = cell(ROWS - 1 - 3,7).v
    =cell(7,3).v = cell(7, COLUMNS - 1 - 3).v
    =cell(2,6).v = cell(2, 8).v
    =cell(ROWS - 1 - 2,6).v = cell(ROWS - 1 - 2, 8).v
    =cell(6,2).v = cell(8,2).v
    =cell(6,COLUMNS - 1 - 2).v = cell(8,COLUMNS - 1 - 2).v
    =cell(6,6).v = cell(8,8).v
    =cell(8,6).v = cell(6,8).v
    = DL;
    
     cell(1,5).v = cell(1,9).v
    =cell(5,5).v = cell(5,9).v
    =cell(9,5).v = cell(9,9).v
    =cell(ROWS - 1 - 1, 5).v = cell(ROWS - 1 - 1, 9).v
    =cell(5,1).v = cell(5, COLUMNS - 1 - 1).v
    =cell(9,1).v = cell(9, COLUMNS - 1 - 1).v
    = TL;
})();

var hand = [cell(20,4),cell(20,5),cell(20,6),cell(20,7),cell(20,8),cell(20,9),cell(20,10)] ;
var bag;

function deepCopy(from) {
	return JSON.parse(JSON.stringify(from));
	}
	
function random(min,max) {
	return Math.floor(min + Math.random()*(max - min));
	}
	
function Coup(cells, points) {
	this.getCells = () => cells;
	this.getPoints = () => points;
	}
	
function User(name, type) {
	this.getType = () => type?type:Player.HUMAN;
	this.getName = () => name;
	}
	
function Player(user, bag) {
	var score;
	var coups = [];
	var hand = new Array(7);
	this.getUser = () => user;
	this.getScore = () => score;
	this.getCoups = () => coups;
	this.pickLetters = () => {
		if (bag.length === 0) return;
		for(var i = 0; i<hand.length; i++) {
			if (!hand[i]) {
				hand[i] = bag.pickLetter();
				}
			}
		};
	}
	
function Party(players) {
	
	
	}
	
Player.HUMAN = "Human";
Player.MACHINE = "Machine";
	
	
function Bag(game) {
var bag = [];
 
makeBag = function() {
	    
		var size = 0 
		var keys = Object.keys(game.count);
		for(var k in game.count) {
			size += game.count[k];
			}
		bag = new Array(size);
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
		var count = deepCopy(game.count);
		var l;
		for(var i = 0; i<size; i++) {
	        l = alphabet.charAt(random(0, alphabet.length));
		    bag[i] = l;
		    
		    count[l]--;
		    if (count[l] === 0) {
			  var idx = alphabet.indexOf(l);
			  alphabet = alphabet.substr(0, idx) + alphabet.substr(idx + 1);
			  //log("alphabet::-'" + l + "'->'" + alphabet + "'");
			}
			
		}
		
		//return bag;
};

makeBag();

this.pickLetter = function() {
	if (bag.length === 0) return null;
	var idx = random(0, bag.length);
	var l = bag[idx];
	bag = bag.slice(0, idx).concat(bag.slice(idx+1));
	log("bag[" + idx +"::'" + l + "'->'" + bag + "'");
	return l;
	};

this.makeHand = function() {
  for(var i = 0; i<7; i++) {
    	if (!hand[i].l) {
    	   var l = this.pickLetter();
           if (l) hand[i].l = l;
    	   }
    	}
    };
   
}

function playLourabble() {
	
	
	var HORIZONTAL = 1;
	var VERTICAL = 2;
	var HUMAN = 1;
	var ROBOT = 2;
	
	var Bitmap = Packages.android.graphics.Bitmap;
    var Canvas = Packages.android.graphics.Canvas;
    var Typeface = Packages.android.graphics.Typeface;
    var Color = Lourah.graphics.Color;
    var Paint = Packages.android.graphics.Paint;
    var MotionEvent = Packages.android.view.MotionEvent;
    
    var background;
    
    
    function fillText(text, row, col, orientation, locked) {
    	text.split('').forEach(
           (l,i) => {
             var c = cell(row + ((orientation === VERTICAL)?i:0), col + ((orientation === HORIZONTAL)?i:0));
             c.l = l;
             c.locked = locked?true:false;
             });
    	}
    
    function fillHand(text) {
    	fillText(text, 20, 4, HORIZONTAL);
    	}
    
    function fillScore(score, who) {
    	if (who === HUMAN) fillText(score, 17, 2, HORIZONTAL);
        if (who === ROBOT) fillText(score, 17, COLUMNS - 1 - 5)
    	}
    
    fillText("INDONESIEN", 7,2, HORIZONTAL,true);
    fillText("GORONTALO", 4, 5, VERTICAL);
    
    //fillHand("AZE TY");
    
    
    
    //hand[1].l = 'S';
    
    
    
    function drawLetter(c, x, y, width, height, canvas, paint) {
    	paint.setColor(Color.argb(192,255,255,255));
        canvas.drawRect(x+1, y+1, x + width - 1, y + height - 1, paint);
        paint.setColor(Color.argb(127, 32, 32, 32));
        paint.setStrokeWidth(10);
        canvas.drawLine(x+5, y+height-5, x + width-5, y+height-5, paint);
        canvas.drawLine(x+width-5, y+5, x+width-5, y+height, paint);
        
        
        paint.setColor(c.locked?Color.BLACK:Color.argb(255,0,144,0));
        
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        paint.setTextSize(height*.75); 
        canvas.drawText(c.l, x + width*.15, y + height*.65, paint);
        if (game.weights[c.l]) {
          paint.setTextSize(height*.3);
          canvas.drawText((" " + game.weights[c.l]).substr(-2), x + width*.55, y + height*.85, paint);
          }
    	}

    function drawCellBackground(row, col, width, height, canvas, paint) {
    	if (cell(row, col).v === KO) return;
    	paint.setColor(Color.GREEN);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(5);
        canvas.drawRect(width*col, height*row, width*(col+1), height*(row + 1), paint);
        paint.setStyle(Paint.Style.FILL);
        switch (cell(row, col).v) {
        	case DL : paint.setColor(Color.CYAN);break;
        	case TL : paint.setColor(Color.BLUE);break;
        	case DW : paint.setColor(Color.MAGENTA);break;
        	case TW : paint.setColor(Color.RED);break;
        	case OK : paint.setColor(Color.LTGRAY);break;
            default: throw "error on cell value at (" + row + "," + col + ")::" + JSON.stringify(cell(row,col));return;    
        	}
        
        canvas.drawRect(width*col+1, height*row+1, width*(col+1)-1, height*(row + 1)-1, paint);
        
    	}
    
    function drawCell(row, col, width, height, canvas, paint) {
    	if (cell(row,col).v !== KO && cell(row,col).l) {
           drawLetter(cell(row, col), width*col, height*row, width, height, canvas, paint);
           }
    	}

    function drawBackground(imageView) {
    	if (! background) {
    	  log("create background");
      	background = Bitmap.createBitmap(imageView.width, imageView.height, Bitmap.Config.ARGB_8888);
          var canvas = new Canvas(background);
		  var paint = new Paint();
		  paint.setColor(Color.BLUE);
		  paint.setStyle(Paint.Style.STROKE);
          paint.setStrokeWidth(10);
          canvas.drawRect(0, 0, imageView.width, imageView.height, paint);
          var width = imageView.width/COLUMNS;
          var height = imageView.width/ROWS;
          for(var row = 0; row < ROWS+6; row++) {
        	for(var col = 0; col < COLUMNS; col++) {
        	   drawCellBackground(row, col, width, height, canvas, paint);
        	   }
        	}
          }
          return background;
    	}

	function drawBoard(imageView, motion) {
		drawBackground(imageView);
		var start = java.lang.System.currentTimeMillis();
		var bitmap = background.copy(background.getConfig(),true);
		var top = java.lang.System.currentTimeMillis();
		//log("backgrouund::" + (top-start) + " ms");
		var canvas = new Canvas(bitmap);
		var paint = new Paint();
        var width = imageView.width/COLUMNS;
        var height = imageView.width/ROWS;
        for(var row = 0; row < ROWS+6; row++) {
        	for(var col = 0; col < COLUMNS; col++) {
        	   drawCell(row, col, width, height, canvas, paint);
        	   }
        	}
        
        if (motion) {
        	motion(width, height, canvas, paint);
        	}
        
        imageView.setImageBitmap(bitmap);
		}
	
	function loadBoard(imageView) {
		metrics = new android.util.DisplayMetrics();
		Activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
		log("metrics.width::"+metrics.widthPixels+",metrics.height::"+metrics.heightPixels);
		var viewTreeObserver = imageView.getViewTreeObserver();
		var gll;
		viewTreeObserver.addOnGlobalLayoutListener(gll = {
			onGlobalLayout : () => {
		      log("width::"+imageView.getWidth()+",height::"+imageView.getHeight());
		      try {
		        drawBoard(imageView);
		        } catch(e) {
			    Activity.reportError("drawBoard::" + e + "::" + e.stack);
			    }
			imageView.setOnTouchListener({
		      onTouch: (view, motionEvent) => {
			   try {
				return onTouch(view, motionEvent);
				} catch(e) {
				Activity.reportError("board::onTouch::" + e + "::" + e.stack);
				return false;
				}
			}
		});
		      viewTreeObserver.removeOnGlobalLayoutListener(gll);
		      }
		});
	}
	
	var selectedLetter = undefined;
	function onTouch(view, motionEvent) {
		drawBoard(view, (width, height, canvas, paint) => {
			var col = (motionEvent.x / width)|0;
		    var row = (motionEvent.y / height)|0;
		    //
		    if (motionEvent.action === MotionEvent.ACTION_DOWN) {
			   //log("row::"+row+",col::"+col+",me::" + motionEvent.action);
			   if(cell(row,col) && cell(row,col).l && !cell(row,col).locked) {
				//log("selected::("+row+","+col+")::"+JSON.stringify(cell(row,col)));
				selectedLetter = {
                    l:cell(row,col).l
                   ,locked:false
                   ,row:row
                   ,col:col
				   };
				cell(row, col).l = "";
				drawCell(row,col, width, height, canvas, paint);
				}
			}
			if (motionEvent.action === MotionEvent.ACTION_UP) {
				if (selectedLetter) {
				  var row = ((motionEvent.y - 3*height + height/2)/height)|0;
				  var col =  ((motionEvent.x - width + width/2)/width)|0;
				  if (!cell(row,col) || cell(row,col).v === KO || cell(row,col).l) {
					row = selectedLetter.row;
					col = selectedLetter.col;
					}
				  cell(row, col).l = selectedLetter.l;
				  //log("drop::'"+JSON.stringify(cell(row,col))+ "' at(" + row + "," + col+")");
				  drawCell(row,col, width, height, canvas, paint);
				  selectedLetter = undefined;
				  return true;
				}
			}
			if (selectedLetter) {
		        drawLetter(selectedLetter, motionEvent.x - width, motionEvent.y - 3*height, width, height, canvas, paint);
		    }
        });
		return true;
	}
	
	Activity.setContentView(board.playboard);
	Lourah.jsFramework.setOnBackButtonListener(() => {
	   Activity.setContentView(board.ll);
	   Lourah.jsFramework.setOnBackButtonListener(() => false);
	   return true;
	});
	log("starting play");
	
	if(!bag) bag = new Bag(game);
	
	//log("bag::[" + bag + "]::" + bag.length);
	
	bag.makeHand();
	
    
	loadBoard(board.playboard);
	
	
	
}

})();
