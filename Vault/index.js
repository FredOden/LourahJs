Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Zip.js");

var dir = Lourah.jsFramework.dir();

var json = JSON.parse(Activity.path2String(
                     dir
                     + "/ui.json"
                     ));
                     
var ui = (new Lourah.android.Overview(json.ui)).$();

Activity.setContentView(ui.ll);

log("init::Lourah::" + JSON.stringify(Lourah));

ui.ed.setText("storage/emulated/0/Download/simcity-buildit-1-25-2-81407.apk");

Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});

ui.multiAccount.setOnClickListener({
	onClick: w => {
		try {
		   multiAccount();
		   } catch(e) {
			Activity.reportError("multiAccount::" + e + "::" + e.stack);
		   }
		}
	});

ui.exec.setOnClickListener({
    onClick: w => {
      try {
        shell(ed.getText());
        } catch(e) {
        }
      }
    });

ui.ed.setOnKeyListener({
	onKey : (view, keyCode, keyEvent) => {
		try {
		ui.tv.setText("<" +keyCode + ">");
		if (keyCode === android.view.KeyEvent.KEY_ENTER) {
			ui.tv.setText("---");
			//shell(view.getText() + "\n");
			}
	    return true;
		} catch(e) {
			Activity.reportError(e);
	    }
	  }
	});


ui.ed.addTextChangedListener({
	
	afterTextChanged:function(e) {
		try {
		    
		  } catch(e) {
			Activity.reportError("afterTextChanged::" + e + ":" + e.stack);
		  }
		} 
     ,onTextChanged : function(s, start, before, count) {
     	}
     ,beforeTextChanged : () => {}

	});

for(var key in json.tools) {
	var toolButtons = (new Lourah.android.Overview(json.toolButtons)).$();
	toolButtons.b.setText(key);
	ui.ll.addView(toolButtons.b);
	toolButtons.b.setOnClickListener({
		onClick: (w) => {
			ui.tv.setText("");
			var cmd = json.tools[w.getText()].join("\n") + "\n";
		    shell(cmd);
			}
		});
}

function shell(command) {
try{
    var sh = java.lang.Runtime.getRuntime().exec("sh");
    outputStream = new java.io.DataOutputStream(sh.getOutputStream());

    outputStream.writeBytes(command); // -a | grep 'inet addr:'\n");
    outputStream.flush();

    outputStream.writeBytes("exit\n");
    outputStream.flush();
    
    ui.tv.setText(Activity.inputStream2String(sh.getInputStream()));
    //sh.waitFor();
}catch(e){
    android.widget.Toast.makeText(
     Activity,
     "Vault::" + e, 
     android.widget.Toast.LENGTH_LONG
     ).show();
}


}

function log(txt) {
	ui.tv.setText(ui.tv.getText() + txt + "\n");
	}

function multiAccount() {
	log("Starting Multi Account ...");
	/*
	var ctx = Activity;
	var i = ctx.getPackageManager().getLaunchIntentForPackage(ui.ed.getText());
	ctx.startActivity(i);
	*/
	try {
	   log("Lourah::"+ JSON.stringify(Lourah));
	   var zip = new Lourah.util.Zip(ui.ed.getText());
	   var s = "AndroidManifest.xml::\n";
	   s += zip.readManifest();
	   /*
	   zip.unzip(e => {
		  s+="dir::" + e.getName()+"\n";
		}
		, e => {
		  s+="file::" + e.getName()+"\n";
		}
		);
		*/
		} catch(e) {
		  log("Zip::error::" + e + "::" + e.stack);
		}
		
		
	   log(s);
	}