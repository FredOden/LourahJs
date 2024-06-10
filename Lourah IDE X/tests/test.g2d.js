Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Lourah.graphics.g2d.js"
  );

var turn = 0;
function test() {
  try {
    var c2d = new Lourah.graphics.g2d.Context($screen.$iv);
    var layer = c2d.createLayer();
    layer.setCamera([0, 0,1000]);
    layer.setRotation(0, 0, Math.PI/6 + turn);
    turn +=0.1

    layer.setViewPortX(-Math.PI, Math.PI);
    layer.setViewPortY(-1, 1);
    layer.setZ(1000-turn*1000);

    var pol = c2d.createLayer();
    pol.setViewPortX(-1, 1);
    pol.setViewPortY(-1, 1);
    pol.setRotation(turn, 0, 0);

    function ko(x) {
      return 30000*Math.pow(1.17, x);
      };

    var covid = c2d.createLayer();
    covid.setViewPortX(-3, 15);
    covid.setViewPortY(-100000, ko(16));
    covid.setRotation(turn, 0, Math.PI/144 + turn);
    covid.setZ(500);


    var p = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.BLUE
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pp = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.MAGENTA
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 5
        ,textSize:40
        });

    var pCovid = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.CYAN
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 5
        ,textSize:40
        });


    var pAxis = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.BLACK
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pGridUnit = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.BLACK
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 0.5
        ,textSize:40
        });

    var pText = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.RED
        ,style: android.graphics.Paint.Style.FILL
        ,textSize:40
        })

    var pLegend = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.MAGENTA
        ,style: android.graphics.Paint.Style.FILL
        ,textSize:280
        })


    
    covid.createAxisX({
        min:-3
        ,max:15
        ,unit:1
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis)
    .createAxisY({
        min:-100000
        ,max:ko(16)
        ,unit:50000
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis);




    var curve = layer.createCurveFx(
      (x) => Math.cos(3*x)
      , layer.getViewPorts().x.getMin()
      , layer.getViewPorts().x.getMax()
      ,1000
      );

    var polar = pol.createCurvePolar(
      (x) => Math.sin(3*x)
      , 0
      , 2*Math.PI
      ,1000
      );



    var exp = covid.createCurveFx(
      ko
      , -3
      , 15
      , 15
      );

    var serial =[];
    for(var i = -3; i < 12; i++) {
      serial.push([i, ko(i)]);
      }

    var spots = covid.createSerial(serial);

    // curve.draw(p);
    //polar.draw(pp);

    //covid.getCanvas().drawText("hi", 1000, 1000, pText);

    exp.draw(pCovid);
    spots.draw(p);
    covid.addLabel("France"
      ,[1, 250000, 0]
      ,pLegend
      );
    covid.drawLabels();




    console.log("test");
    } catch(e) {
    console.log("test::error::" + e + "::" + e.stack);
    }
  }




Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Overview.js"
  );

var screen = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    ,$test: {
      class: "android.widget.Button"
      ,setText: "'test'"
      ,setOnClickListener: {
        onClick: v => test()
        }
      }
    ,$sv: {
      class: "android.widget.ScrollView"
      ,$iv: {
        class: "android.widget.ImageView"
        }
      }
    }
  };

var $screen = Lourah.android.Overview.buildFromSugar(screen);


Activity.setTitle("Lourah.graphics.g2d::test");
Activity.setContentView($screen.$ll);
