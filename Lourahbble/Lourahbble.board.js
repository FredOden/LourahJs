var Lourahbble = Lourahbble || {};

Activity.importScript(Lourah.jsFramework.dir() + "/Logger.js");
Activity.importScript(Lourah.jsFramework.dir() + "/Bag.js");
Activity.importScript(Lourah.jsFramework.dir() + '/Lourahbble.fr.js');

(function () {
    if (Lourahbble.board) return;
    Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');
    const    L2={ color: android.graphics.Color.CYAN }
    ,L3={ color: android.graphics.Color.BLUE }
    ,W2={ color: android.graphics.Color.MAGENTA }
    ,W3={ color: android.graphics.Color.RED }
    ,__={ color: android.graphics.Color.parseColor("#ffeeeee0") }
    ;

    const ROWS = 15;
    const COLUMNS = 15;
    Lourahbble.board = {
      layout: [
         W3,__,__,L2,__,__,__,W3,__,__,__,L2,__,__,W3
        ,__,W2,__,__,__,L3,__,__,__,L3,__,__,__,W2,__
        ,__,__,W2,__,__,__,L2,__,L2,__,__,__,W2,__,__
        ,L2,__,__,W2,__,__,__,L2,__,__,__,W2,__,__,L2
        ,__,__,__,__,W2,__,__,__,__,__,W2,__,__,__,__
        ,__,L3,__,__,__,L3,__,__,__,L3,__,__,__,L3,__
        ,__,__,L2,__,__,__,L2,__,L2,__,__,__,L2,__,__
        ,W3,__,__,L2,__,__,__,W2,__,__,__,L2,__,__,W3
        ,__,__,L2,__,__,__,L2,__,L2,__,__,__,L2,__,__
        ,__,L3,__,__,__,L3,__,__,__,L3,__,__,__,L3,__
        ,__,__,__,__,W2,__,__,__,__,__,W2,__,__,__,__
        ,L2,__,__,W2,__,__,__,L2,__,__,__,W2,__,__,L2
        ,__,__,W2,__,__,__,L2,__,L2,__,__,__,W2,__,__
        ,__,W2,__,__,__,L3,__,__,__,L3,__,__,__,W2,__
        ,W3,__,__,L2,__,__,__,W3,__,__,__,L2,__,__,W3
        ]
    };

    Lourahbble.boad.Cell = function(idx, column, row, x, y) {
        var letter;
        var locked = false;
        this.idx = idx;
        this.setLocked = (lock) => locked = lock;
        this.isLocked = () => locked;
        this.getRow = () => row;
        this.getColumn = () => column;
        this.getPosition = () => [x, y];
        this.setLetter = (l) => {
          letter = l;
          if (l) letter.setCell(this);
          }
        this.getLetter = () => letter;
        this.layout = Lourahbble.board.layout[this.idx];
        }

    Lourahbble.board.Cell.Type = {
      L2:L2
      ,L3:L3
      ,W2:W2
      ,W3:W3
      ,__:__
      }


    var panesTo = {
      letter: new Map()
      };


    var screen = new Lourah.android.games.Screen(Activity);

    var screenWidth = 1.25* screen.getWidth();
    var screenHeight = screen.getHeight();

    const colMargin = 3;
    const rowMargin = 3;
    var colWidth = screenWidth/COLUMNS;
    var rowHeight = screenWidth/ROWS;
    var pw = colWidth - 2*colMargin;
    var ph = rowHeight - 2*rowMargin;
    var getColumn = (x) => Math.floor((x + centerCol)/posCol);
    var getRow = (y) => Math.floor((y + centerRow)/posRow);

    var cells = new Array(COLUMNS*ROWS);

    var [posCol, posRow] = [
      2*colMargin + pw
      ,2*rowMargin + ph
      ];
    var [centerCol, centerRow] = [
      pw/2 - colMargin
      ,ph/2 - rowMargin
      ];


    const backgroundColor = android.graphics.Color.parseColor("#ff00af00");

    var pBackground = new Lourah.android.games.Screen.Pane();
    pBackground.setFrame(0,0, screenWidth, screenWidth);

    function drawBackground(pane) {
      var canvas = pane.getCanvas();
      canvas.drawColor(backgroundColor);
      var paint = new android.graphics.Paint();
      paint.setStyle(android.graphics.Paint.Style.FILL);
      var idx = 0;
      for(var row = 0; row < ROWS; row++) {
        for (var column = 0 ; column < COLUMNS; column++) {
          paint.setColor(Lourahbble.board.layout[column + row*COLUMNS].color);
          var [x, y] = [
            colMargin + column*posCol
            ,rowMargin + row*posRow
            ]
          canvas.drawRect(
            x
            ,y
            ,x + pw
            ,y + ph
            ,paint
            )
          cells[idx] = new Lourahbble.board.Cell(idx, column, row, x, y);
          idx++;
          }
        }
      pane.flush();
      console.log("drawn background");
      }
    pBackground.setHandler((pane) => {
        drawBackground(pane);
        });
    screen.addPane(pBackground);

    const HAND_MAXLENGTH = 7;
    Lourahbble.board.dock = new (function() {
        var bag;
        this.setBag = (b) => bag = b;
        this.getBag = () => bag;
        var pane;
        var hand = [];
        var slots = new Array(HAND_MAXLENGTH);
        this.getSlots = () => slots;
        var src = new java.io.File(Lourah.jsFramework.dir() + "/1f648.png");
        var pane = new Lourah.android.games.Screen.Pane();
        var paneShadow = new Lourah.android.games.Screen.Pane();
        pane.setSource(src);
        pane.setFrame(
          4*colWidth
          ,16*rowHeight
          ,7*colWidth
          ,rowHeight
          );
        paneShadow.setFrame(
          4*colWidth - 15
          ,16*rowHeight + 15
          ,7*colWidth
          ,rowHeight
          );
        this.paint = (pane) => {
          pane.getCanvas().drawColor(android.graphics.Color.parseColor("#7f002f00"));
          pane.flush();
          }
        this.paintShadow = (pane) => {
          pane.getCanvas().drawColor(android.graphics. Color.LTGRAY);
          pane.flush();
          }

        this.placeLetterAt = (letter, idx) => {
          this.changeSlot(letter, idx);
          letter.getPane().setFrame(
            letter.getPane().initialPosition[0]
            ,letter.getPane().initialPosition[1]
            ,pw
            ,ph
            );
          }

        this.changeSlot = (letter, idx) => {
          letter.getPane().initialPosition = [
            colMargin + (idx + 4)*posCol
            ,rowMargin + 16*posRow
            ];
          slots[idx] = letter;
          letter.setSlotIndex(idx);
          }

        this.makeHand = () => {
          for (var i = hand.length; i < HAND_MAXLENGTH; i++) {
            if (!bag) throw "Lourahbble.board.dock::makeHand::no bag associated where to pick letters";
            var letter = bag.pickLetter();
            if (!letter.letter) continue;
            hand.push(letter);
            for(var j = 0; j < HAND_MAXLENGTH; j++) {
              if (!slots[j]) {
                var l = new Lourahbble.board.Letter(letter.letter, letter.weight);
                this.placeLetterAt(l, j);
                screen.addPane(l.getPane());
                break;
                }
              }
            }
          }
        pane.setHandler(this.paint);
        paneShadow.setHandler(this.paintShadow);
        screen.addPane(paneShadow);
        screen.addPane(pane);
        })();

    var play = new Lourah.android.games.Screen.Pane(android.widget.Button);
    play.setFrame(11*colWidth, 16*rowHeight -15, 3*colWidth, 1.5*rowHeight);
    var bPlay = play.getView();
    bPlay.setText("@Play");
    bPlay.setOnClickListener((view) => {
        console.log("clicked");
        });
    
    screen.addPane(play);
    
    var bag = new Lourah.android.games.Screen.Pane();


    var tw = new Lourah.android.games.Screen.Pane(android.webkit.WebView);
    tw.setFrame(100, screenHeight - 350, screenWidth -200, 350);
    tw.setHandler(
      pane => {
        var border = new android.graphics.drawable.GradientDrawable();
        border.setColor(android.graphics. Color.argb(255,16,16,16)); //white background
        border.setStroke(1, android.graphics. Color.RED); //black border with full opacity
        Lourah. jsFramework. uiThread(() => {
            try {
              if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.JELLY_BEAN) {
                pane.getView().setBackgroundDrawable(border);
                } else {
                pane.getView().setBackground(border);
                }
              try {
                pane.getView().setVerticalScrollBarEnabled(true);
                //pane.getView().setMovementMethod(new android.text.method.ScrollingMovementMethod());
                } catch(e) {
                console.log("scrolling::" + e);
                }
              pane.getView().setVisibility(android.widget.TextView.VISIBLE);
              } catch(e) {
              console.log("WebView::" + e);
              }
            });
        }
      );
    screen.addPane(tw);

    var letterBackgroundColor = android.graphics.Color.parseColor("#fffffff0");
    var letterShadowBackgroundColor = android.graphics.Color.parseColor("#ff7f7f70");

    Lourahbble.board.Letter = function(letter, weight) {
      var pane = new Lourah.android.games.Screen.Pane();
      panesTo.letter.set(pane, this);
      var slotIndex;
      pane.setFrame(0,screenWidth + 100,pw,ph);
      this.setSlotIndex = (idx) => slotIndex = idx;
      this.getSlotIndex = () => slotIndex;
      this.getPane = () => pane;
      var cell;
      this.setCell = (c) => {
        if (!c && cell) cell.setLetter();
        cell = c;
        }
      this.getCell = () => cell;
      this.paint = () => {
        var canvas = pane.getCanvas();
        var rectF = new android.graphics.RectF(3, 0, canvas.getWidth() -3, canvas.getHeight() -3);
        var rectFShadow = new android.graphics.RectF(0, 3, canvas.getWidth() -3, canvas.getHeight() -3);
        var paintBackground = new android.graphics.Paint();
        paintBackground.setColor(letterShadowBackgroundColor);
        paintBackground.setStyle(android.graphics.Paint.Style.FILL);
        canvas.drawRoundRect(rectFShadow, 20, 20, paintBackground);
        paintBackground.setColor(letterBackgroundColor)
        canvas.drawRoundRect(rectF, 20, 20, paintBackground);
        var paintLetter = new android.graphics.Paint();
        paintLetter.setColor(android.graphics.Color.BLACK);
        paintLetter.setStyle(android.graphics.Paint.Style.FILL);
        //paintLetter.setColor(android.graphics.Color.MAGENTA);
        var [width, height] = [canvas.getWidth(), canvas.getHeight()];
        var fullSize = (width + height)/2;
        paintLetter.setTextSize(.7*fullSize);
        paintLetter.setStrokeWidth(0);
        paintLetter.setTextAlign(android.graphics.Paint.Align.CENTER);
        paintLetter.setShadowLayer(10, -7, 7, android.graphics.Color.GRAY);
        paintLetter.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);

        var [xText, yText] = [
          .7*width/2
          , .9*height/2
          - (
            paintLetter.descent()
            +
            paintLetter.ascent()
            )/2
          ];

        canvas.drawText(letter, xText, yText, paintLetter);
        paintLetter.setTextSize(.45*fullSize);
        paintLetter.setShadowLayer(0,0,0,0);
        paintLetter.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        [xText, yText] = [
          1.5*width/2
          , 1.5*height/2
          - (
            paintLetter.descent()
            +
            paintLetter.ascent()
            )/2
          ];
        canvas.drawText("" + weight, xText, yText, paintLetter);
        pane.rotate(2);
        pane.flush();
        }

      //this.initialPosition = undefined;

      this.onTouchListener = (pane, me) => {
        pane.getView().getParent().requestDisallowInterceptTouchEvent(true);
        this.setCell();
        var f = pane.getFrame();
        var [tx, ty] = [
          f.x + me.getX() - f.width/2
          ,f.y + me.getY() - f.height/2
          ];

        if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
          var [row, column] = [getRow(ty), getColumn(tx)];
          [tx, ty] = pane.initialPosition;
          var idx = column + row*COLUMNS;
          if (idx < cells.length && !cells[idx].getLetter()) {
            cells[idx].setLetter(this);
            [tx, ty] = cells[idx].getPosition();
            /*
            [
              colMargin + column*(2*colMargin + pw)
              ,rowMargin + row*(2*rowMargin + ph)
              ];
            /**/
            }
          //moving in the dock ?
          if (row === 16 && column > 3 && column < 11) {
            var slots = Lourahbble.board.dock.getSlots();
            var letter = panesTo.letter.get(pane);
            var slotIndex = column - 4;
            var letterToReplace = slots[slotIndex];
            if (letterToReplace) {
              (letterToReplace.getCell()?Lourahbble.board.dock.changeSlot
                :Lourahbble.board.dock.placeLetterAt)(letterToReplace, letter.getSlotIndex());
              var p = letterToReplace.getPane();
              p.updateFrame();
              }
            Lourahbble.board.dock.placeLetterAt(letter, slotIndex);
            pane.getView().bringToFront();
            pane.updateFrame();
            return true;
            }
          }
        pane.setFrame(
          tx
          ,ty
          ,f.width
          ,f.height
          )
        pane.getView().bringToFront();
        pane.updateFrame();
        return true;
        }

      pane.setHandler((pane) => {
          var f = pane.getFrame();
          pane.initialPosition = [f.x, f.y];
          pane.setOnTouchListener(this.onTouchListener);
          this.paint();
          });
      //screen.addPane(pane);
      }


    Lourahbble.board.status = tw.getView();
    Lourahbble.board.screen = screen;
    })();

Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. setTitle("Test Lourahbble");
var sv = new android.widget.HorizontalScrollView(Activity.getApplicationContext());
sv.addView(Lourahbble.board.screen.getLayout());
Activity. setContentView(sv);

var logger = new Logger(Lourahbble.board.status);

logger.say("hello");
logger.error("ow crash");

Lourahbble.board.dock.setBag(new Bag(Lourahbble.fr));
Lourahbble.board.dock.makeHand();
