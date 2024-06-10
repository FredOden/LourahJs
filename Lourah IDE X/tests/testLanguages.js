Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.widget.Tokenizer.js');
Activity. importScript(Lourah.jsFramework.parentDir() + '/Overview.js');
Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.ide.Languages.NEW.js');
Lourah. jsFramework. setOnBackButtonListener(
  () => false
  );

var s = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    
    ,$sv : {
      class: "android.widget.ScrollView"
      ,$mec: {
        class: "android.widget.MultiAutoCompleteTextView"
        }
      }
    
    ,$bt: {
      class: "android.widget.Button"
      ,setText: "'button'"
      ,setOnClickListener: {
        onClick: (v) => {
          try {
            setLanguage("x.js");
            console.log("clicked");
            } catch(e) {
            Activity.reportError("onClick::" + e + "::" + e.stack);
            }
          }
        }
      }
    }
  };

var screen = Lourah.android.Overview.buildFromSugar(s);

var setLanguage = (f) => {
        for(l in Lourah.ide.Languages) {
          if (Lourah.ide.Languages[l].re.exec(f)) {
            language = Lourah.ide.Languages[l].language;
            if (language.completion) language.completion(screen.$mec);
            return;
            } else {
            language = Lourah.ide.DefaultLanguage;
            }
          }
        }


Activity.setTitle("test Languages");
Activity.setContentView(screen.$ll);



















