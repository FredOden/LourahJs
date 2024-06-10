Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});
	

Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/android.app.Dialog.js");


Activity.setTitle("Lourah IDE - (c) 2019, Lourah.com");

var editor = (new Lourah.android.Overview({
	  sv : {
		class : "android.widget.ScrollView"
	    ,content : {
		   ll : {
			  class : "android.widget.LinearLayout"
			  , attributes : {
				setOrientation : android.widget.LinearLayout.VERTICAL
				}
			  , content : {
				  hl : {
					class: "android.widget.LinearLayout"
					,attributes : {
						setOrientation : android.widget.LinearLayout.HORIZONTAL
						,setPadding : [0, 0, 0, 0]
					 }
					,content: {
					  hln : {
						  class: "android.widget.HorizontalScrollView"
						  ,content : {
					         ln : {
						       class: "android.widget.EditText"
						     , attributes : {
							       setTextColor: 0xffbfa090|0
					              ,setBackgroundColor : android.graphics.Color.BLACK
					              ,setEnabled : false
							      ,setTextSize : 12
							      ,setTypeface : android.graphics.Typeface.MONOSPACE
							      //,setMaxWidth : 44*3
							      ,setGravity : android.view.Gravity.RIGHT
							      ,setPadding : [0, 5, 0, 0]
							      //,setEms : 2
							      }
					          }
					       }
					   }
					  ,hsv : {
						class : "android.widget.HorizontalScrollView"
						,content: {
				           et : {
					          class : "android.widget.EditText"
					         ,attributes : {
						         setTextColor: android.graphics.Color.WHITE
					            ,setBackgroundColor : android.graphics.Color.BLACK
					            ,setTypeface : android.graphics.Typeface.MONOSPACE
					            ,setTextSize : 12
					            ,setEms : 80
					            ,setPadding : [5, 0, 0, 0]
					            ,setInputType : android.text.InputType.TYPE_NULL
                                              | android.text.InputType.TYPE_CLASS_TEXT
					                          | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE
					                          | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
						      }
					        }
					      }
					    }
					 }
				  }
					
				  ,tv : {
					class : "android.widget.TextView"
					,attributes : {
						setTextColor : android.graphics.Color.WHITE
						,setBackgroundColor : android.graphics.Color.BLUE
						}
					}
				}
			 }
		   }
		}
	  
	}
	)).$();
	
var ide = (new Lourah.android.Overview({
	main: {
	  class : "android.widget.LinearLayout"
    , attributes : {
				setOrientation : android.widget.LinearLayout.VERTICAL
				}
	 ,content : {
		
		status: {
			class : "android.widget.TextView"
			,attributes : {
			    setText : "'Status...'"
			    }
			}
		,editor : editor.sv
		}
	}
	})).$();
	
Activity.setContentView(ide.main);

function log(text) {
	Activity.runOnUiThread(new java.lang.Runnable({
	  run: () => editor.tv.setText(editor.tv.getText() + "\n" + text)
	  }));
	}
	
log("Lourah IDE::start");

numberLines('');
editor.et.requestFocus();

var javascript = {
	colorizations : {
	   keywords : { 
           re :  /\b(typeof|new|this|in|of|for|while|do|continue|break|continue|switch|case|if|else|return|class|var|const|let|function)\b/g
         , foregroundColor : 0xffef5050|0
         }
       
       ,sugars : {
       	 re : /(=>)/g
         , foregroundColor : 0xffff5050|0
         , style : android.graphics.Typeface.BOLD
     	}
       
       ,classes : {
       	re : /\b[A-Z][A-Za-z0-9_$]*\b/g
         , foregroundColor : 0xff005f5f|0
         }
       
       ,constants : {
       	re : /\b(undefined|null|true|false|Infinity)\b/g
         , foregroundColor : 0xff009f00|0
         }
         
       ,errors : {
       	re : /\b(try|catch|finally|throw)\b/g
         , foregroundColor : 0xffff0000|0
         }
         
       ,numbers : {
       	re : /\b(0x[0-9a-f]+)|(\d*[.]?\d+[E|e]?[+\-]?\d*)\b/g
         , foregroundColor : 0xff5050ff|0
         }

       ,strings : {
       	re : /(".*?")|('.*?')|([\/].*?[\/])/g
         , foregroundColor : 0xffbfbf00|0
         , style : android.graphics.Typeface.BOLD_ITALIC
         }
         
       ,comments : {
       	re : /(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm
         , foregroundColor : 0xff7f7f7f|0
         , backgroundColor : 0xff1f1f1f|0
         }
      }
     ,indentations : {
     	block : {
     	  in : /{/g
           ,out : /}/g
     	 }
         ,list : {
         	in : /\(/g
            ,out : /\)/g
         	}
         ,array : {
         	in : /\[/g
            ,out : /\]/g
         	}
  	}
	};

var language = javascript;

editor.et.addTextChangedListener({
	  beforeTextChanged : (s, start, count, after) => {
		try {
			beforeChange(s, start, count, after);
			} catch(e) {
				Activity.reportError("identation::" + e + "::" + e.stack);
			}
      }
	, onTextChanged : (s, start, before, count) => {
		try {
			onChange(s, start, before, count);
			} catch(e) {
				Activity.reportError("identation::" + e + "::" + e.stack);
			}
      }
	, afterTextChanged : (s) => {
		//Activity.reportError("et::" + s);
		try {
			    colorSyntax(s);
			    numberLines(s);
			    //editor.et.invalidate();//@optim
			} catch(e) {
			    Activity.reportError("colorSyntax::" + e + "::" + e.stack);
			}
		
		}
	});

var newLine = -1;
var space = '\t';//.repeat(4);
var nl = '\n';

function beforeChange(s, start, count, after) {
	//log("beforeChsnge::" + start + "::" + count + "::" + after + "::s::'" + s + "'");
	newLine = -1;
    }

function onChange(s, start, before, count) {
	//log("onChsnge::" + start + "::" + before + "::" + count);
	if (count >= before) {
	   //log("onChange::at::(" + start + "," + before + "," + count + ")");
	   var jss = "" + s.subSequence(start + before, start + count).toString();
       //log("  onChange::insert::'" + jss + "'::s::'" + s + "'");
       if (jss === nl) {
          //log("onChange::newline::at::" + (start + before));
          newLine = start+before;
          }
       } 
    }

function indent(s, at) {
	var depth = 0;
	for(var i in language.indentations) {
		var indentation = language.indentations[i];
		var match_in = indentation.in.exec(s.toString());
		var idx;
		var d = 0;
		while(match_in && (idx = (indentation.in.lastIndex - match_in[0].length)) < at) {
			d++;
			match_in = indentation.in.exec(s.toString());
			}
		indentation.in.lastIndex = 0;
		var match_out = indentation.out.exec(s.toString());
		while(match_out && (idx = indentation.out.lastIndex - match_out[0].length) < at) {
			d--;
			match_out = indentation.out.exec(s.toString());
			}
		indentation.out.lastIndex = 0;
		if (d > 0) depth += d;
		}
	
	if (depth <= 0) return;
	
	var spaces = space.repeat(depth);
	
	s.insert(at + 1, spaces);
    }


function colorSyntax(s) {
	
	if (newLine !== -1) {
       indent(s, newLine);
	   return;
	}

    var spans;
	
    spans=s.getSpans(0, s.toString().length(), android.text.style.ForegroundColorSpan);
    for(var i=0; i<spans.length; i++){
      s.removeSpan(spans[i]);
    }
    
    spans=s.getSpans(0, s.toString().length(), android.text.style.BackgroundColorSpan);
    for(var i=0; i<spans.length; i++){
      s.removeSpan(spans[i]);
    }
    
    spans=s.getSpans(0, s.toString().length(), android.text.style.StyleSpan);
    for(var i=0; i<spans.length; i++){
      s.removeSpan(spans[i]);
    }
    
    
    for (var f in language.colorizations) {
       var family = language.colorizations[f];
	   var matches = family.re.exec(s.toString());
	
	   if (matches) {
		for(;;) {
		   var idx = family.re.lastIndex - matches[0].length;
		   if(family.foregroundColor)
		     s.setSpan(
		            new android.text.style.ForegroundColorSpan(
				      family.foregroundColor)
				   ,idx
				   ,family.re.lastIndex
				   ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
				  );
				
		   if(family.backgroundColor)
		     s.setSpan(
				    new android.text.style.BackgroundColorSpan(
				      family.backgroundColor)
				   ,idx
				   ,family.re.lastIndex
				   ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
				  );
				
		   
		   if(family.style)
		      s.setSpan(
                    new android.text.style.StyleSpan(family.style)
				   ,idx
				   ,family.re.lastIndex
				   ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
				  );
			
		   
		
		   matches = family.re.exec(s.toString());
		   if (!matches) break;
		   }
		   
		 }
	   }
	}
	
function numberLines(s) {
	var n = (s.toString().match(/\r?\n/g) || '').length;
	var sl = "";
	for(var i = 0; i<=n; i++) {
		sl += (i + 1) + ((i<n)?'\n':'');
		}
	editor.ln.setEms(Math.max(2,(n).toString().length - 1));
	editor.ln.setText(sl);
	}


var d = new Lourah.android.app.Dialog(Activity);
d.setTitle("dialog");
d.setMessage("message");
d.setButton(new Lourah.android.app.Dialog.Button(
   Lourah.android.app.Dialog.Button.POSITIVE
  ,"OK"
  ,(me, clicked, d, i) => {
    log(clicked.getKind() +"::" + clicked.getText() + "::hit::" + i);
    var script = Activity.path2String(
              Lourah.jsFramework.dir() + "/index.js");
    editor.et.setText(script);
    var dialogSave = new Lourah.android.app.DialogSave(Activity);
    dialogSave.show();
    }
  ));
d.setButton(new Lourah.android.app.Dialog.Button(
   Lourah.android.app.Dialog.Button.NEGATIVE
  ,"KO"
  , (me, clicked, d, i) => {
    log(clicked.getKind() + "::" + clicked.getText() + "::hit::" + i)
    }
  ));
d.show();
/*
var script = Activity.path2String(
              Lourah.jsFramework.dir() + "/index.js");
              
editor.et.setText(script);
*/

//d.setMessage("done");
//d.show();

