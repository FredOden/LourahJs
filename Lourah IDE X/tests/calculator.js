
var oc = {
  onClick: (v) => console.log(v.getText())
  };

var calc = {
  ll : {
    class : "android.widget.LinearLayout"
    , content : {
      bt1 : {
        class : "android.widget.Button"
        , attributes : {
          setText : "'1'"
          ,setOnClickListener : {
            onClick:(v) => Activity.reportError(v.getText())
            }
          }
        }
      , bt2 : {
        class : "android.widget.Button"
        , attributes : {
          setText : "'2'"
          ,setOnClickListener : oc
          }
        }
      , bt3 : {
        class : "android.widget.Button"
        , attributes : {
          setText : "'3'"
          ,setOnClickListener : oc
          }
        }
      }
    }
  }

var vocabulary = {
  "1" : {
    default : "one"
    }
  }

Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");

var internationalizer = new Lourah.android.Internationalizer();
internationalizer.addVocabulary(vocabulary);


var calculator = (new Lourah.android.Overview(calc, internationalizer)).$();

Activity.setTitle("Calculator");
Activity.setContentView(calculator.ll);
