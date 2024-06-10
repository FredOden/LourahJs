Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");

var screen = (new Lourah.android.Overview({
      ll: {
        class: "android.widget.LinearLayout"
        , attributes: {
          setOrientation: android.widget.LinearLayout.VERTICAL
          }
        , content: {
          et: {
            class: "android.widget.EditText"
            , attributes: {}
            }
          , bt: {
            class: "android.widget.Button"
            , attributes: {
              setText: '"hit me"'
              }
            }
          }
        }
      })).$();

var alternate = (new Lourah.android.Overview({
      ll: {
        class: "android.widget.LinearLayout"
        , attributes: {
          setOrientation: android.widget.LinearLayout.VERTICAL
          }
        , content: {
          et: {
            class: "android.widget.TextView"
            , attributes: {
              setText: "'textview here'"
              }
            }
          , bt: {
            class: "android.widget.Button"
            , attributes: {
              setText: '"hit me again"'
              }
            }
          }
        }
      })).$();

Activity.setTitle("test");
Activity.setContentView(screen.ll);

screen.bt.setOnClickListener({
    onClick:v => {
      console.log(v.getText() + "::" + "clicked");
      try {
        Activity.setContentView(alternate.ll);
        } catch(e) {
        Activity.reportError(e);
        }
      }
    });


alternate.bt.setOnClickListener({
    onClick:v => {
      console.log(v.getText() + "::" + "clicked");
      try {
        Activity.setContentView(screen.ll);
        } catch(e) {
        Activity.reportError(e);
        }
      }
    });
