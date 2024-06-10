Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');

var first = true;
var initial;

var movePane = (pane, me) => {
  var f = pane.getFrame();
  if (first) {
    initial = [f.x, f.y];
    first = false;
    }
  var x, y;
  if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
    [x, y] = initial;
    } else {
    [x, y] = [
      f.x + me.getX() - f.width/2
      ,f.y + me.getY() - f.height/2
      ];
    }

  pane.setFrame(
    x
    ,y
    ,f.width
    ,f.height
    );
  pane.updateFrame();
  return true;
  };


var screen = new Lourah.android.games.Screen(Activity);

var pane0 = new Lourah.android.games.Screen.Pane();


pane0.setFrame(100, 100, 500, 500);

var paint = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.WHITE
    ,textSize : 40
    });

var paintLetter = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.BLUE
    ,textSize : 150
    });

var paintMotion = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.GREEN
    ,textSize : 70
    });



pane0.setHandler((pane) => {
    var canvas = pane.getCanvas();

    pane.setOnTouchListener(movePane);

    var layer = new Lourah.graphics.g2d.Layer(pane);
    canvas.drawColor(android.graphics. Color.RED);
    layer.setViewPortY(-50,50);
    layer.setViewPortX(-20,20);
    layer.addLabel("Layer/pane0", [-10,20], paint);
    layer.setRotation(0,0,Math.PI/3);

    var s = layer.createSerial([[-10,10],[10,10],[10,-10],[-10,-10]]);
    s.draw(paint, true);
    layer.drawLabels();
    pane.rotate(30);
    pane.flush();
    });

screen.addPane(pane0);

var pane1 = new Lourah.android.games.Screen.Pane();
pane1.setFrame(350, 150, 800, 1000, pane0);



pane1.setHandler((pane) => {
    var canvas = pane.getCanvas();
    pane.setOnTouchListener((pane, motionEvent) => {
        //console.log("pane1::" + motionEvent.toString);
        canvas.drawColor(
          android.graphics.Color.YELLOW
          ,android.graphics.PorterDuff.Mode.SRC_IN
          );
        canvas.drawText("Motion"
          , motionEvent.getX()
          ,motionEvent.getY()
          ,paintMotion
          );
        pane.flush();

        return true;
        });
    canvas.drawColor(android.graphics. Color.YELLOW);
    canvas.drawText("pane1", 10, 50, paint);
    for(var i = 0; i < 360; i+=10) {
      pane.rotate(-2*i);
      pane.flush();
      java.lang.Thread.sleep(10);
      }
    });
screen.addPane(pane1);

var pane2 = new Lourah.android.games.Screen.Pane();
pane2.setFrame(100, 100, 400, 400);
pane2.setHandler((pane) => {
    var canvas = pane.getCanvas();

    pane.setOnTouchListener(movePane);

    for(var i = 0; i < 360; i+=10) {

      canvas.drawColor(
        android.graphics.Color.TRANSPARENT
        ,android.graphics.PorterDuff.Mode.SRC_IN
        );

      canvas.drawText(i, 135, 260, paintLetter);
      //canvas.drawCircle(200, 200, 20, paintLetter);
      pane.rotate(i);
      pane.flush();
      java.lang.Thread.sleep(10);
      }
    });
screen.addPane(pane2);


var paintBorderLight = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.STROKE
    ,color: android.graphics.Color.LTGRAY
    ,strokeWidth: 10
    });

var paintBorderDark = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.STROKE
    ,color: android.graphics.Color.DKGRAY
    ,strokeWidth: 10
    });



var cells= [];

function Cell(i, xStep, yStep, targets) {
  var pane = new Lourah.android.games.Screen.Pane();
  pane.setFrame(i*xStep, screen.getHeight() - 2*yStep, .9*xStep, yStep);
  pane.setName("Cell");
  var canvas;
  var targetPanes = [];

  var paintText;
  var paintBackground = (new Lourah.android.graphics.Paint()).$({
      setStyle: android.graphics.Paint.Style.FILL
      ,setColor: android.graphics.Color.parseColor('#ff00ff7f')
      ,setShadowLayer: [1,-10,10,android.graphics.Color.BLACK]
      });
  
  
  var xText, yText;

  this.onResize = (xStep, yStep) => {
    
    canvas = pane.getCanvas();
    
    paintText =  (new Lourah.android.graphics.Paint()).$({
        setStyle: android.graphics.Paint.Style.FILL
        ,setColor: android.graphics.Color.MAGENTA
        ,setTextSize: (xStep + yStep) /2
        ,setStrokeWidth: 0
        ,setTextAlign: android.graphics.Paint.Align.CENTER
        ,setShadowLayer: [20, -10, 10, android.graphics.Color.BLACK]
        });


    [xText, yText] = [
      canvas.getWidth()/2
      , canvas.getHeight()/2
      - (
        paintText.descent()
        +
        paintText.ascent()
        )/2
      ];
    /**/
    };


  this.getPane = () => pane;

  var initialPosition;

  this.addTargets = (t) => targetPanes = targetPanes.concat(t);

  this.addTargets(targets);
  //console.log("Cell(" + [i, i*xStep,screen.getHeight() - 2*yStep] + ")");

  this.paintCell = (text) => {
    if (!canvas) this.onResize(xStep, yStep);
    
    canvas.drawRect(5, 0, canvas.getWidth() -5, canvas.getHeight() -5, paintBackground);
    canvas.drawText(text, xText, yText, paintText);

    pane.rotate(i);
    pane.flush();
    }

  pane.setHandler((pane) => {
      var f = pane.getFrame();
      initialPosition = [f.x, f.y];

      pane.setOnTouchListener((pane, me) => {
          var x, y;
          var f = pane.getFrame();
          if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
            [x, y] = initialPosition;
            if (targetPanes) {
              //console.log("targetPanes.length::" + targetPanes.length);
              for(var idx = 0; idx < targetPanes.length; idx++) {
                //console.log("try::" + idx + "::" + targetPanes[idx].getName());
                var tf = targetPanes[idx].getFrame();
                var [rx, ry] = [me.getRawX(), me.getRawY()]
                /*
                console.log("check target::" + idx
                  + "::" + [rx, ry]
                  + "::" + [tf.x, tf.y]
                  + "::" + [tf.x + tf.width, tf.y + tf.height]
                  );
                */
                if (rx < tf.x || rx > (tf.x + tf.width)) continue ;
                if (ry < tf.y || ry > (tf.y + tf.height)) continue;
                //console.log("matched::" + idx);
                var tn = targetPanes[idx].getName();
                //console.log("tn::<" + tn + ">");
                if (tn === "Cell") {
                  //console.log("target is Cell");
                  [x, y] = [tf.x, tf.y];
                  [tf.x, tf.y] = initialPosition;

                  targetPanes[idx].setFrame(
                    tf.x
                    ,tf.y
                    ,tf.width
                    ,tf.height
                    );
                  targetPanes[idx].updateFrame();
                  }
                else {
                  [x, y] = [
                    tf.x + (tf.width - f.width)/2
                    ,tf.y + (tf.height - f.height)/2
                    ];
                  }
                break;
                }
              }
            } else {
            [x, y] = [
              f.x + me.getX() - f.width/2
              ,f.y + me.getY() - f.height/2
              ];
            }
          pane.setFrame(
            x
            ,y
            ,f.width
            ,f.height
            );
          //console.log(i + "::" + android.view.MotionEvent.actionToString(me.getAction()) + "(" + [x,y] + ")");
          pane.getView().bringToFront();
          pane.updateFrame();
          return true;
          });
      this.paintCell(i);
      });
  screen.addPane(pane);
  }


const MAX_CELLS = 10;

var [xStep, yStep] = [
  Math.floor(screen.getWidth()/MAX_CELLS)
  ,Math.floor(screen.getHeight()/MAX_CELLS)
  ];

var targets = [];
for (var i = 0; i < MAX_CELLS; i++) {
  var c;
  cells.push((c = new Cell(i, xStep, yStep, [pane0, pane1])));
  targets.push(c.getPane());
  }

cells.forEach((cell) => {cell.addTargets(targets);})


Activity.setTitle("gametest.js");
Activity.setContentView(screen.getLayout())
