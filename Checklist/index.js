Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.setTitle("Checklist by Lourah");

Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});
	

//Activity. reportError("__Activity::" +  __Activity__);

var myActivity = Activity.getApplicationContext();

var vocabulary = JSON.parse(Activity.path2String(
                  Lourah.jsFramework.dir() + "/vocabulary.json"));
	
var internationalizer = new Lourah.android.Internationalizer();
internationalizer.addVocabulary(vocabulary);

var checkList;// = loadUI();

function loadUI() {return (new Lourah.android.Overview({
	  main : {
		class : "android.widget.LinearLayout"
	   ,attributes : {
		   setOrientation : android.widget.LinearLayout.VERTICAL
		   }
		}
	 ,start: {
		class: "android.widget.ScrollView"
		,content: {
			startPanel: {
				class: "android.widget.LinearLayout"
				,attributes: {
					setOrientation: android.widget.LinearLayout.VERTICAL
					}
				,content: {
					startTitle: {
						class: "android.widget.TextView"
						, attributes: {
							setText: "'@ListOfItemsToCheck'"
							,setTextSize : 24
							}
						}
					}
				}
			}
		}
	}, internationalizer)).$();
}

var checkList;

function makeMainMenu() {
checkList = loadUI();
Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});
	
Activity.setContentView(checkList.main);
var dir = new java.io.File(Lourah.jsFramework.dir());
var files = dir.listFiles();
for(var i = 0; i < files.length; i++) {
	var b = new android.widget.Button(myActivity);
	var name = files[i].getName();
	
	if (name.match(/.+[.]ckl[.]json$/)) {
	   var file = files[i];
	   var radical = name.substr(0, name.indexOf(".ckl.json"));
	   b.setText(radical);
	   checkList.main.addView(b);
	   setTriggerHandler(b, checkListHandler, file, radical);
	   }
	}
}
	
function setTriggerHandler(button, handler, file, radical) {
	button.setOnClickListener({
		onClick:(v) => {
			try {
				handler(button, file, radical)
				}
			catch(e) {
				Activity.reportError("checkListHandler::" + radical + "::exception::" + e + "::" + e.stack);
				}
			}
		});
	}

var cbs = [];

function checkListHandler(button, file, radical) {
	
	Lourah.jsFramework.setOnBackButtonListener(() => {
	   checkList = loadUI();
	   cbs=[];
	   makeMainMenu();
	   return true;
	});
	
	cbs = [];
	
	
	var list = JSON.parse(Activity.path2String(file.toString()));
	Activity.setContentView(checkList.start);
	checkList.startPanel.setBackgroundColor(0xffff0000|0);
	
	checkList.startTitle.setText(list.name);
	
	list.items.forEach(item => {
		var cb = new android.widget.CheckBox(myActivity);
		cb.setText(item);
		cbs.push(cb);
		checkList.startPanel.addView(cb);
		cb.setOnClickListener({
			onClick: v => {
				try {
					checkListHandler.check();
					}
				catch(e) {
					Activity.reportError("startCheckHandler::exception::" + e + "::" + e.stack);
					}
				}
			});
		});
	
	}


	
checkListHandler.check = () => {
	var go = true;
	for(var i = 0; i < cbs.length; i++) {
		if (!cbs[i].isChecked()) {
			go = false;
			break;
			}
		}
	checkList.startPanel.setBackgroundColor(go?0xff00ff00|0:0xffff0000|0);
	};

makeMainMenu();