var Lourah = Lourah || {};
(function () {
    Lourah.android = Lourah.android || {};
    Lourah.android.graphics = Lourah.android.graphics || {};
    if (Lourah.android.graphics.Paint) return;

    Lourah.android.graphics.Paint = function(fromPaint) {
      var paint = fromPaint?
      new android.graphics.Paint(fromPaint)
      :new android.graphics.Paint();

      this.set = (attributes) => {
        if (attributes) {
          for (var method in attributes) {
            var value = attributes[method];
            try {
              if (value instanceof Array) {
                paint[method].apply(paint, value.map(v => eval(v)));
                } else {
                paint[method](eval(value));
                }
              } catch(e) {
              Activity.reportError("Lourah.android.graphics.Paint::" + method + "::" + e + "::" + e.stack);
              }
            }
          }
        return paint;
        }
      this.$ = this.set;
      }
    })();
/*
var p = new Lourah.android.graphics.Paint();
p.$({
    setColor: android.graphics.Color.MAGENTA
    ,setShadowLayer: [10, 5, -5, android.graphics.Color.BLACK]
    ,setStyle: android.graphics.Paint.Style.FILL
    });
*/
