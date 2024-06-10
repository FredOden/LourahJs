Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');
var DrawPad;
( function () {
    DrawPad = function (paint) {
      var pad = new Lourah.android.games.Screen.Pane();
      this.getPad = () => pad;
      var pencil = paint;
      var lastPoint;

      this.onTouchListener = function (pane, me) {
        var [x, y] = [me.getX(), me.getY()];
        canvas = pane.getCanvas();
        switch (me.getAction()) {
          case android.view.MotionEvent.ACTION_DOWN:
          lastPoint = [x, y];
          return true;
          break;
          case android.view.MotionEvent.ACTION_UP:
          return true;
          break;
          default:
          canvas.drawLine(
            lastPoint[0]
            , lastPoint[1]
            , x
            , y
            , pencil
            );
          lastPoint = [x, y];
          pane.flush();
          return true;
          break;
          }
      
        }
      
      }

    })();
