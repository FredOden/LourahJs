Activity.importScript(Lourah.jsFramework.parentDir() + '/Overview.js'); 

var s = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget. LinearLayout .VERTICAL
    ,$tv : {
      class: "android.widget.TextView"
      ,setText: "'hello'" 
      }
    ,$b : {
      class: "android.widget.Button"
      ,setText: "'click me'"
      ,setOnClickListener : { 
        onClick: (view) => {
          $s.$tv.setText("clicked");
          }
        } 
      }
    }
  }

var $s = Lourah.android.Overview. buildFromSugar(s);

Activity.setTitle("test ide");
Activity.setContentView($s.$ll);
