Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");


function OnTouchInhibitTwoPointers() {
  this.onTouch = (v, me) => {
    return !(me.getPointerCount() === 2);
    }
  }

function OnTouchScaleListener() {
  var MotionEvent = android.view.MotionEvent;
  var STEP = 200;
  var ratio = 1;
  var base = {
    ratio: null
    ,distance: null
    ,center: null
    };
  var view;

  this.onTouch = (v, me) => {
    view = v;
    //console.log("onTouch");
    if (me.getPointerCount() === 2) {
      return manageTwoPointers(me);
      }
    return true;
    }

  function manageTwoPointers(me) {
    //console.log("manageTwoPointers:" + MotionEvent.actionToString(me.getAction()));

    view.requestFocus();
    
    if ((me.getAction() & MotionEvent.ACTION_MASK) === MotionEvent.ACTION_POINTER_DOWN) {
      base.distance = getDistance(me);
      base.ratio = ratio;
      base.center = {
        x:(me.getX(0) + me.getY(0))/2
        ,y:(me.getY(0) + me.getY(1))/2
        };
      //console.log("base::" + [base.distance, base.ratio, base.center.x, base.center.y]);
      } else {
      if (me.getAction() !== MotionEvent.ACTION_MOVE) {
        return false;
        }
      var distance = getDistance(me);
      /*console.log("distances::"
        + [
          distance
          ,base.distance
          ,distance - base.distance
          ]
        );
      */
      var multi = Math.pow(
        2
        ,((distance - base.distance)/STEP)
        );

      ratio = Math.min(
        10
        ,Math.max(
          .1
          ,base.ratio * multi
          )
        );
      //console.log("scaling view::ratio::" + ratio);
      try {
        view.setScaleX(ratio);
        view.setScaleY(ratio);
        view.setPivotX(base.center.x);
        view.setPivotY(base.center.y);
        } catch(e) {
        console.log("scaling view::error::" + e);
        }
      }

    return false;
    }

  function getDistance(me) {
    /*
    console.log("getDistance::("
        + [ me.getX(0), me.getY(0) ]
        + ")::("
        + [ me.getX(1), me.getY(1) ]
        + ")"
      );
    */
    var dx = me.getX(0) - me.getX(1);
    var dy = me.getY(0) - me.getY(1);
    return Math.sqrt(dx*dx + dy*dy);
    }
  }


var $screen = Lourah.android.Overview.buildFromSugar(
  {
    $sv: {
      class: "android.widget.ScrollView"
      , $ll: {
        class: "android.widget.LinearLayout"
        ,$iv: {
          class: "android.widget.ImageView"
          , setFocusable: true
          , setFocusableInTouchMode: true
          }
        }
      }
    }
  );

var imgFile = new java.io.File("/storage/emulated/0/DCIM/Camera/IMG_20200705_144343.jpg");
if(imgFile.exists()) {
  console.log("load::" + imgFile.getAbsolutePath());
  myBitmap = android.graphics.BitmapFactory.decodeFile(imgFile.getAbsolutePath());
  //ImageView myImage = (ImageView) findViewById(R.id.imageviewTest);
  $screen.$iv.setImageBitmap(myBitmap);
  } else {
  console.log("image not found");
  }

Lourah.jsFramework.setOnBackButtonListener(() => false);

Activity.setTitle(Lourah.jsFramework.name());
Activity.setContentView($screen.$sv);

try {
  $screen.$iv.setOnTouchListener(
    new OnTouchScaleListener()
    );
  
  /*
  $screen.$sv.setOnTouchListener(
    new OnTouchInhibitTwoPointers()
    );
  */
  
  } catch (e) {
  console.log("setOnTouchListener::error"
    + e
    + "::"
    + e.stack
    );
  }
