/**
Demonstration of sugar format for Oveview
*/

var screen;

function bt(text) {
  return {
    class:"android.widget.Button"
    ,setText: "'" + text + "'"
    ,setOnClickListener:onClick
    }
  }

var s = {
  $main: {
    class: "android.widget.LinearLayout"
    ,setOrientation : android.widget.LinearLayout.VERTICAL
    ,$display : {
      class: "android.widget.TextView"
      ,setBackgroundColor : android.graphics.Color.LTGRAY
      ,setTextSize: 20
      ,setGravity: android.view.Gravity.RIGHT
      }
    ,$ll123:{
      class:"android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL
      ,$bt1: bt(1)
      ,$bt2: bt(2)
      ,$bt3: bt(3)
      ,$btPlus: bt("+")
      }
    ,$ll456:{
      class:"android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL
      ,$bt4: bt(4)
      ,$bt5: bt(5)
      ,$bt6: bt(6)
      ,$btMinus: bt("-")
      }
    ,$ll789:{
      class:"android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL
      ,$bt7: bt(7)
      ,$bt8: bt(8)
      ,$bt9: bt(9)
      ,$btMultiply: bt("*")
      }
    ,$ll0:{
      class:"android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL

      ,$bt0: bt(0)
      ,$btC: bt("CLR")
      ,$btEqual: bt("=")
      ,$btDivide: bt("/")
      }
    ,$llExtra0:{
      class:"android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL

      ,$btPoint: bt(".")
      ,$btE: bt("e")
      ,$btOP: bt("(")
      ,$btCP: bt(")")
      }
    }
  };


function onClick(v) {
  try {
    switch(v) {
      case screen.$btC: screen.$display.setText("");
      break;
      case screen.$btEqual:screen.$display.setText(
      "" + eval("" + screen.$display.getText())
      );
      break;
      default:screen.$display.setText(screen.$display.getText() + v.getText());
      break;

      }
    } catch(e) {
    Activity.reportError("onClick::" + e);
    }
  }

Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");


screen = Lourah.android.Overview.buildFromSugar(s);


Activity.setTitle("Overview.Sugar");
Activity.setContentView(screen.$main);
