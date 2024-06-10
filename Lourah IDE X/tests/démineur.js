Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');
Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.graphics.Color.js');

var Bitmap = Packages.android.graphics.Bitmap;
var Canvas = Packages.android.graphics.Canvas;
var Typeface = Packages.android.graphics.Typeface;
var Color = Lourah.graphics.Color;
var Paint = Packages.android.graphics.Paint;
var MotionEvent = Packages.android.view.MotionEvent;

var $screen = {
  $topll:{
    class: "android.widget.LinearLayout"
    , setOrientation: android.widget.LinearLayout.VERTICAL
    ,$header: {
      class: "android.widget.LinearLayout"
      , setOrientation: android.widget.LinearLayout.HORIZONTAL

      }

    ,$body: {
      class: "android.widget.ImageView"
      }


    ,$footer: {
      class: "android.widget.LinearLayout"
      , setOrientation: android.widget.LinearLayout.HORIZONTAL

      }
    }
  }

var screen = Lourah.android.Overview.buildFromSugar($screen);

function drawLetter(c, x, y, width, height, canvas, paint) {
  paint.setColor(Color.argb(192,255,255,255));
  canvas.drawRect(x+1, y+1, x + width - 1, y + height - 1, paint);
  paint.setColor(Color.argb(127, 32, 32, 32));
  paint.setStrokeWidth(10);
  canvas.drawLine(x+5, y+height-5, x + width-5, y+height-5, paint);
  canvas.drawLine(x+width-5, y+5, x+width-5, y+height, paint);


  paint.setColor(c.locked?Color.BLACK:Color.argb(255,0,144,0));

  paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
  paint.setTextSize(height*.75);
  canvas.drawText(c.l, x + width*.15, y + height*.65, paint);
  if (game.weights[c.l]) {
    paint.setTextSize(height*.3);
    canvas.drawText((" " + game.weights[c.l]).substr(-2), x + width*.55, y + height*.85, paint);
    }
  }

function drawCellBackground(row, col, width, height, canvas, paint) {
  if (cell(row, col).v === KO) return;
  paint.setColor(Color.GREEN);
  paint.setStyle(Paint.Style.STROKE);
  paint.setStrokeWidth(5);
  canvas.drawRect(width*col, height*row, width*(col+1), height*(row + 1), paint);
  paint.setStyle(Paint.Style.FILL);
  switch (cell(row, col).v) {
    case DL : paint.setColor(Color.CYAN);break;
    case TL : paint.setColor(Color.BLUE);break;
    case DW : paint.setColor(Color.MAGENTA);break;
    case TW : paint.setColor(Color.RED);break;
    case OK : paint.setColor(Color.LTGRAY);break;
    default: throw "error on cell value at (" + row + "," + col + ")::" + JSON.stringify(cell(row,col));return;
    }

  canvas.drawRect(width*col+1, height*row+1, width*(col+1)-1, height*(row + 1)-1, paint);

  }

function drawCell(row, col, width, height, canvas, paint) {
  if (cell(row,col).v !== KO && cell(row,col).l) {
    drawLetter(cell(row, col), width*col, height*row, width, height, canvas, paint);
    }
  }

function drawBackground(imageView) {
  if (! background) {
    log("create background");
    background = Bitmap.createBitmap(imageView.width, imageView.height, Bitmap.Config.ARGB_8888);
    var canvas = new Canvas(background);
    var paint = new Paint();
    paint.setColor(Color.BLUE);
    paint.setStyle(Paint.Style.STROKE);
    paint.setStrokeWidth(10);
    canvas.drawRect(0, 0, imageView.width, imageView.height, paint);
    var width = imageView.width/COLUMNS;
    var height = imageView.width/ROWS;
    for(var row = 0; row < ROWS+6; row++) {
      for(var col = 0; col < COLUMNS; col++) {
        drawCellBackground(row, col, width, height, canvas, paint);
        }
      }
    }
  return background;
  }
