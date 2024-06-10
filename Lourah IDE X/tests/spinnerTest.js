Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.widget.Tokenizer.js");

var $screen = Lourah.android.Overview.buildFromSugar(
  {
    $sv: {
      class: "android.widget.ScrollView"
      , $ll: {
        class: "android.widget.LinearLayout"
        ,$spinner: {
          class: "android.widget.Spinner"
          , setFocusable: true
          , setFocusableInTouchMode: true
          }
        ,$actv: {
          class: "android.widget.MultiAutoCompleteTextView"
          //, setHint: "'Country'"
          ,setTextColor: android.graphics.Color.WHITE
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
    ,$dropDown: {
      class: "android.widget.TextView"
      ,setId: android.view.View.generateViewId()
      ,setTextColor: android.graphics.Color.YELLOW
      ,setBackgroundColor : android.graphics.Color.DKGRAY
      ,setTypeface : android.graphics.Typeface.MONOSPACE
      ,setTextSize : 12
      ,setFocusable: false
      }
    }
  );


var spinnerArray = new java.util.ArrayList();

spinnerArray.add("for");
spinnerArray.add("while");
spinnerArray.add("return");
spinnerArray.add("class");
spinnerArray.add("function");

spinnerArray.addAll([
    "try"
    ,"catch"
    ,"finally"
    ,"try {\n} catch(e) {\n}"
    ,"try {\n} catch(e) {\n} finally {\n}"
    ,"for ( ; ; ) {\n\n}"
    ,"for ( in ) {\n\n}"
    ,"for (var i = 0; i < .length; i++) {\n\n}"
    ,"function () {\n\n}"
    ,"if () {\n}"
    ,"if () {\n} else {\n}"
    ,"else {\n}"
    ,"while () {\n}"
    ,"( function () {\n\n})();"
    ,"console.log(\n\n);"
    ,"var"
    ,"var /* object */ = {\n\n}"
    ,"var /* array */ = {\n\n}"
    ,"/* field */:\n, /* field */"
    ,"switch () {\ncase :{\n\nbreak;\n}\n}"
    ,"break"
    ,"continue"
    ,"Activity"
    ,"Activity.importScript()"
    ,"Activity.importScript(\nLourah.jsFramework.parentDir()\n+\n'/'\n);\n"
    ,"Activity.importScript(\nLourah.jsFramework.dir()\n+\n'/'\n);\n"
    ,"Activity.getApplicationContext()"
    ,"Activity. reportError();"
    ]);

var aLourah = [ "Lourah" ];
for(var k in Lourah) {
  aLourah.push("Lourah." + k);
  }

console.log("$screen.$dropDown::id::"
  + $screen.$dropDown.getId()
  );


spinnerArray.addAll(aLourah);
var adapter = new android.widget.ArrayAdapter(
  Activity.getApplicationContext()
  ,android.R.layout.simple_spinner_dropdown_item|0
  //,$screen.$dropDown.getId()
  ,spinnerArray
  );


$screen.$actv.setAdapter(adapter);
$screen.$actv.setThreshold(2);

Lourah.jsFramework.setOnBackButtonListener(() => false);

$screen.$actv.setTokenizer(
  //new android.widget.MultiAutoCompleteTextView.CommaTokenizer()
  //Lourah.widget.Tokenizer.buildPunctuationTokenizer()
  new Lourah.widget.Tokenizer(
    Lourah.widget.Tokenizer.Separators.JAVA
    )
  );
/**/

Activity.setTitle("Spinner Test");
Activity.setContentView($screen.$sv);
