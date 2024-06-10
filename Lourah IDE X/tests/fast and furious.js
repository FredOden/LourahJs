Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ide.Editor.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Formula.js");

var e = new Lourah.ide.Editor();
var log = s => screen.$l.setText(screen.$l.getText() + s + '\n');

var desc = {
  $top: {
    class: "android.widget.LinearLayout"
    , setOrientation: android.widget.LinearLayout.VERTICAL
    , $t: {
      class: "android.widget.TextView"
      ,setBackgroundColor: android.graphics.Color.LTGRAY
      ,setGravity: android.view.Gravity.RIGHT
      ,setTextSize: 18
      }
    , $b: {
      class: "android.widget.Button"
      ,setText: "'Fast!'"
      ,setOnClickListener: {
        onClick: v => {
          try {
            
            screen.$l.setText("");
            
            var expression = formula.parse(e.getEditor().et.getText().toString());

            log(expression);
            //screen.$l.setText(""+expression);
            screen.$t.setText("" + eval("" + expression));
            } catch(e) {
            screen.$t.setText("::" + e + "::" + e.stack);
            }
          }
        }
      }
    , $ll: {
      class: "android.widget.LinearLayout"
      , $e: {
        class: "android.widget.ScrollView"
        }
      }
    , $l : {
      class: "android.widget.TextView"
      }
    }
  };

var screen = Lourah.android.Overview.buildFromSugar(desc);
var formula = new Lourah.utils.text.Formula();

e.setLanguage("j.js");
e.getEditor().ll.removeView(e.getEditor().hl);
screen.$e.addView(e.getEditor().hl);


e.getEditor().et.setTextSize(18);
e.getEditor().et.requestFocus();

e.getEditor().et.setText(""); //"\/\/(c) 2019 Lourah\n");
e.getEditor().ln.setTextSize(18);

e.getLanguage().colorizations.formula = {
  re: /\^|π|°|√|\|/g
  ,foregroundColor: 0xff00ff00|0
  ,style:android.graphics.Typeface.BOLD_ITALIC
  }
e.getLanguage().colorizations.numbers.foregroundColor = 0xffff00ff|0;

try {
  Activity.getWindow().setSoftInputMode(
  android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
  );
  } catch(e) {
  Activity.reportError("setSoftInputMode::" + e);
  }



Activity.setTitle("Fast and Furious");
Activity.setContentView(screen.$top);
