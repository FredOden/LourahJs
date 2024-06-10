var Lourah = Lourah || {};
(function () {

    Lourah.view = Lourah.view || {};
    if (Lourah.view.GestureDetector) return;

    function GestureDetector() {
      }

    GestureDetector.OnTouchScaleDetector = function(scaleListener) {
      var MotionEvent = android.view.MotionEvent;
      var step = scaleListener.step || 200;
      var range = scaleListener.range || [.2, 8];
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
            x:(me.getX(0) + me.getX(1))/2
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
            ,((distance - base.distance)/step)
            );

          ratio = Math.min(
            range[1]
            ,Math.max(
              range[0]
              ,base.ratio * multi
              )
            );
          //console.log("scaling view::ratio::" + ratio);

          try {
            scaleListener.onTouchScale(
              view
              ,me
              ,ratio
              ,base.center
              )
            } catch(e) {
            throw ("scalelistener.onScale::error::" + e);
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
      };


    function OnTouchInhibitTwoPointers() {
      this.onTouch = (v, me) => {
        return !(me.getPointerCount() === 2);
        }
      }

    Lourah.view.GestureDetector = GestureDetector;

    })();
