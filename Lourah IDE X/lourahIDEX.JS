Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ide.Editor.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/android.app.Dialog.js");
Activity.setTitle(
  "Lourah IDE X :: "
  + Lourah.app.version
  + "/"
  + Lourah.jsFramework.getRhinoVersion()
  + "@" + Lourah.jsFramework.getGenerated()
  + ", (c) 2019-2020 lourah.com");




var ide = (new Lourah.android.Overview({
      main: {
        class : "android.widget.LinearLayout"
        , attributes : {
          setOrientation : android.widget.LinearLayout.VERTICAL
          }
        ,content : {
          sv : {
            class : "android.widget.ScrollView"
            ,content : {
              ll : {
                class: "android.widget.LinearLayout"
                , attributes : {
                  setOrientation : android.widget.LinearLayout.VERTICAL
                  }

                ,content: {
                  status: {
                    class : "android.widget.EditText"
                    ,attributes : {
                      setText : "'Status...'"
                      ,setEnabled : true
                      ,setTextSize : 10
                      ,setTypeface : android.graphics.Typeface.MONOSPACE
                      ,setTextColor : android.graphics.Color.BLACK
                      ,setVerticalScrollBarEnabled : true
                      //,setTextIsSelectable : true
                      ,setMaxHeight : 300
                      ,setMovementMethod : new android.text.method.ScrollingMovementMethod()
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
          }
        }
      })).$();

try {
  Activity.getWindow().setSoftInputMode(
    android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
    );
  } catch(e) {
  Activity.reportError("setSoftInputMode::" + e);
  }

Activity.setContentView(ide.main);

Activity.getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);

//var menu = new android.view.MenuBuilder(Activity.getApplicationContext());

var editor = new Lourah.ide.Editor();
Lourah.jsFramework.setOnBackButtonListener(() => {
    if (editor.isSaved()) return false;
    var question = new Lourah.android.app.Dialog.Question(
      Activity
      , "@Quit Lourah IDE X"
      , "@fileNotSaved::" + editor.getFilename() + "::@DoYouWantToContinue?"
      , "@Yes"
      , "@No"
      );
    question.ask(q => {
        if (q.getAnswer()) Activity.finish();
        });
    return true;
    });
ide.main.addView(editor.getWidget());
editor.setLanguage("f.js");
editor.setConsole(ide.status);

ide.status.setText(
  "Load::"
  + Lourah.jsFramework.getRhinoVersion()
  + "-"
  + Lourah.jsFramework.getGenerated()
  + "\n"
  );
  
ide.status.append(JSON.stringify(editor.getLanguage().id) + "::" + JSON.stringify(editor));
//ide.status.setText(JSON.stringify(Lourah));

/*
Activity.onCreateOptionsMenu = function(menu) {
  menu.add(0, 1, "zztop");
  return true;
  }
*/
