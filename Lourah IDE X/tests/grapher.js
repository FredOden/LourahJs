Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.g2d.js");

var screen = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    ,$llFormula: {
      class: "android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL
      ,$llxyz: {
        class: "android.widget.LinearLayout"
        ,setOrientation: android.widget.LinearLayout.VERTICAL
        ,$x: {
          class: "android.widget.EditText"
          ,setHint: "'enter x formula'"
          ,setWidth: 800
          }
        ,$y: {
          class: "android.widget.EditText"
          ,setHint: "'enter y formula'"
          ,setWidth: 800
          }
        ,$z: {
          class: "android.widget.EditText"
          ,setHint: "'enter z formula'"
          ,setWidth: 800
          }
        }
      ,$draw: {
        class: "android.widget.Button"
        ,setText: "'Draw'"
        ,setOnClickListener: {
          onClick: v => drawFormula()
          }
        }
      }
    ,$sv: {
      class: "android.widget.ScrollView"
      ,$graph: {
        class: "android.widget.ImageView"
        }
      }
    }
  }

var $screen = Lourah.android.Overview.buildFromSugar(screen);


Activity.setTitle("Grapher by Lourah");
Activity.setContentView($screen.$ll);

const CUBE_SIZE = 100;

var [xMin, xMax] = [yMin, yMax] =[zMin, zMax] =
[ -CUBE_SIZE, CUBE_SIZE];


function drawFormula() {
  try {
    
    var x = new Function("t", "return " + $screen.$x.getText().toString());
    var y = new Function("t", "return " + $screen.$y.getText().toString());
    var z = new Function("t", "return " + $screen.$z.getText().toString());

    
    function parametric(t) {
      var p3d = [x(t), y(t), z(t)];
      //console.log("p3d::" + t + "::[" + p3d + "]");
      return layer.getP2d(p3d);
      }
    
    var c2d = new Lourah.graphics.g2d.Context($screen.$graph);
    var layer = c2d.createLayer();
    var c = c2d.getCanvas();
    layer.setCamera([0, 0, 100000]);
    layer.setTranslation([
        -c.getWidth()/8
        , -c.getHeight()/4,
        0
        ]);
    layer.setRotation(Math.PI/8, -Math.PI/8, 0);
    layer.setViewPortX(xMin, xMax);
    layer.setViewPortY(yMin, yMax);
    layer.setViewPortZ(zMin, zMax);
    
    var colorCurve = android.graphics.Color.BLUE;
    var colorAxis = android.graphics.Color.GRAY;
    
    var paintCurve = Lourah.graphics.g2d.buildPaint({
        color: colorCurve
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 5
        ,textSize:40
        });

    var pAxis = Lourah.graphics.g2d.buildPaint({
        color: colorAxis
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });
    
    //pAxis.setARGB(255, 0, 255, 0);

    var pGridUnit = Lourah.graphics.g2d.buildPaint({
        color: colorAxis
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 0.5
        ,textSize:40
        });

    var pText = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.RED
        ,style: android.graphics.Paint.Style.FILL
        ,textSize:20
        });

    layer.createAxisX({
        min:xMin
        ,max:xMax
        ,unit:10
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis)
    .createAxisY({
        min:yMin
        ,max:yMax
        ,unit:10 //Math.floor(yAxis.max/10)
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis)
    .createAxisZ({
        min:zMin
        ,max:zMax
        ,unit:10 //Math.floor(yAxis.max/10)
        //,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis);
    
    var path = new android.graphics.Path();
    var [tMin, tMax, tStep] = [-CUBE_SIZE, CUBE_SIZE, .01];
    for(t = tMin; t <= tMax; t+= tStep) {
      var p = parametric(t);
      if (path.isEmpty()) {
        path.moveTo(p[0], p[1]);
        } else {
        path.lineTo(p[0], p[1]);
        }
      }
    
    layer.getCanvas().drawPath(path, paintCurve);
    
    layer.drawLabels();

    } catch(e) {
    Activity.reportError("grapher::error::" + e + "::" + e.stack);
    }
  }
