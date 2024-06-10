Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.dir() + "/js3d.js");

var i = java.lang.System.currentTimeMillis();

var s = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    ,$sv : {
      class: "android.widget.ScrollView"
      ,$canvas: {
        class: "android.widget.ImageView"
        }
      }
    ,$bt: {
      class: "android.widget.Button"
      ,setText: "'testJs3d'"
      ,setOnClickListener: {
        onClick: (v) => {
          try {
            testJs3d(i, i+=Math.PI/360,0);
            } catch(e) {
            Activity.reportError("onClick::" + e + "::" + e.stack);
            }
          }
        }
      }
    }
  };

var screen = Lourah.android.Overview.buildFromSugar(s);


var camLeft = [5000, 3000, 40000];
var camFront = [0, 0, 40000];
var camRight = [-5000, 3000, 40000];

camLeft = camFront;
camRight = camFront;

var [t] = [[-00, -00, -00]];

delta = 75;
var tLeft = [-400, 0, 0];
var tRight = [200, 0, 0];

var display = Activity.getWindowManager().getDefaultDisplay();
var width = display.getWidth();  // deprecated
var height = (display.getHeight() *.8)|0;


function testJs3d(a, b, c) {

  var start = java.lang.System.currentTimeMillis();
  var bitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
  var canvas = new android.graphics.Canvas(bitmap);

  var renderer = new Lourah.js3d.Renderer(
    canvas.getWidth(),
    canvas.getHeight());

  var rot = Lourah.js3d.rot(a, b, c);
  var rot2 = Lourah.js3d.rot(a, b, c);

  var transform = (p, rotation, translation, camera) => (
    Lourah.js3d.toScreen(
      Lourah.js3d.to2d(
        Lourah.js3d.rotate(rotation,
          Lourah.js3d.translate(p, translation)
          )
        , camera)
      , [canvas.getWidth, canvad.getHeight()])
    );


  var [o, i, j, k] = [
    [[0, 0, 0], "O"]
    ,[[100, 0, 0], "I"]
    ,[[0, 100, 0], "J"]
    ,[[0, 0, 100], "K"]
    ];

  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


  [i,j,k].forEach(p => {
      renderer.line(o[0], p[0], [255,0,0,255], null, tLeft, camLeft);
      renderer.line(o[0], p[0], [0,255,255,255], null, tRight, camRight);
      });


  var co = [0, 128, 0, 255];
  var sz = 150;
  var sz2 = sz*2;
  var [a, b, c, d, e, f, g, h] = [
    [0, sz, -sz], [sz2, sz, -sz], [sz2, -sz, -sz], [0, -sz, -sz],
    [0, sz, sz], [sz2, sz, sz], [sz2, -sz, sz], [0, -sz, sz]
    ];

  [[a,b,c,d,a,e,f,g,h,e], [b,f], [c,g], [d,h]].forEach(s => {
      if (s.length > 2) {
        renderer.polyLine(s, co, rot, tLeft, camLeft);
        renderer.polyLine(s, co, rot, tRight, camRight);
        } else {
        renderer.line(s[0], s[1], co, rot, tLeft, camLeft);
        renderer.line(s[0], s[1], co, rot, tRight, camRight);
        }
      });


  //var curve = [];
  //var curveColor = [0, 0, 255, 255];

  /*
  var ii;
  var zz;
  for(zz = -5000; zz < 5000; zz+=1000)
  for(ii = -1000; ii < 1000; ii+=10) {
    curve.push([ii, 100*Math.sin(300*ii), zz]);
    }
  */

  //renderer.polyLine(curve, curveColor, rot, [0,0,0],camLeft);
  //renderer.txel(a,b,c, co, rot, tLeft, camLeft);
  //renderer.txel(b,c,f, co, rot, tLeft, c mkamLeft);


  console.log("draw::" + ((java.lang.System.currentTimeMillis() - start))/1000);



  var imageData = renderer.flush(bitmap);
  screen.$canvas.setImageBitmap(imageData);
  }

Activity.setTitle("Test Js3d");
Activity.setContentView(screen.$ll);
