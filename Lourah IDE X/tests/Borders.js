//Borders
Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');


let $screen = Lourah.android.Overview.buildFromSugar({
    $first: {
      class: android.widget.LinearLayout
      ,$buttonBox: {
        class: android.widget. LinearLayout
        , setOrientation: android.widget. LinearLayout.VERTICAL
        //, setBackground: $screen.$border
        ,$b0: {
          class: android.widget.Button
          ,setText: "'b0'"
          }
        ,$b1: {
          class: android.widget.Button
          ,setText: "'b1'"
          }
        ,$b2: {
          class: android.widget.Button
          ,setText: "'b2'"
          }
        }
      } // end $first
    
    ,$border: {
      class: android.graphics.drawable.Drawable
      ,draw: (canvas) => {
        console.log("onDraw");
        }
      }
    /**/
    });

let paintDrawable = new android.graphics.drawable.PaintDrawable(0xffff0000|0);
paintDrawable.setCornerRadius(2.0);

let shapeDrawable = new android.graphics.drawable.ShapeDrawable["()"]();

console.log("shapeDrawable::" + shapeDrawable.toString());

/**/
/*
let myDrawable = new JavaAdapter(
  android.graphics.drawable.Drawable
  , new function () {
    this.draw = (canvas) => {
      console.log("canvas::" + canvas);
      };
    this.onLevelChange=(level) => {
      return false;
      };
    this.setAlpha=(alpha) => {};
    this.setColorFilter=(cf) => {};
    this.getOpacity=() => 0;
    }
  
  );
/**/

$screen.$buttonBox["setBackground(android.graphics.drawable.Drawable)"]($screen.$border);


Activity.setTitle("Borders demo");
Activity.setContentView($screen.$first);

























