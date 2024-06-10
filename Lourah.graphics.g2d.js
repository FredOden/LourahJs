var Lourah = Lourah || {};

(function () {

    Activity.importScript(
      Lourah.jsFramework.parentDir()
      +
      "/Lourah.graphics.Color.js"
      );

    Activity.importScript(
      Lourah.jsFramework.parentDir()
      +
      "/Lourah.js3d.js"
      );
    Lourah.graphics = Lourah.graphics || {};
    Lourah.graphics.g2d = Lourah.graphics.g2d || {};
    if (Lourah.graphics.g2d.Context) return;

    var Paint = android.graphics.Paint;
    var Bitmap = android.graphics.Bitmap;
    var Canvas = android.graphics.Canvas;
    //var Color = android.graphics.Color;

    Lourah.graphics.g2d.buildPaint = (attributes) => {
      var paint = new Paint(Paint.ANTI_ALIAS_FLAG);
      if (attributes) {
        if (attributes.style) paint.setStyle(attributes.style);
        if (attributes.color) {
          paint.setARGB(
            attributes.color >> 24 & 0xff
            ,attributes.color >> 16 & 0xff
            ,attributes.color >> 8 & 0xff
            ,attributes.color & 0xff
            );
          //paint.setColor(attributes.color);
          }
        if (attributes.strokeWidth) paint.setStrokeWidth(attributes.strokeWidth);
        if (attributes.textSize) paint.setTextSize(attributes.textSize);
        if (attributes.typeface) paint.setTypeface(attributes.typeFace);
        }
      return paint;
      };

    function ViewPort(min, max, pixels) {
      var k = pixels/(max - min);
      this.getPixel = (t) => k*(t - min);
      this.pixelToPort = (px) => px/k ;//+ min;
      this.getMin = () => min;
      this.getMax = () => max;
      this.getSize = () => max - min;
      this.toString = () => {
        return "ViewPort::" + min + "::" + max + "::" + this.getSize();
        }
      }

    function CurveFx(layer, f, xMin, xMax, points) {
      var curve;
      var step = (xMax - xMin)/points;
      for(var x = xMin; x <= xMax; x += step) {
        var p = layer.getP2d([x, f(x)]);
        if (!curve) {
          curve = new android.graphics.Path();
          curve.moveTo(p[0], p[1]);
          } else {
          curve.lineTo(p[0], p[1]);
          }
        }
      this.draw = (paint) => {
        layer.getCanvas().drawPath(curve, paint);
        }
      this.getLayer = () => layer;
      }

    function CurvePolar(layer, f, tMin, tMax, angles) {
      var curve;
      var step = (tMax - tMin)/angles;
      for(var t = tMin; t <= tMax; t += step) {
        var rho = f(t);
        var p = layer.getP2d([rho*Math.cos(t), rho*Math.sin(t)]);
        if (!curve) {
          curve = new android.graphics.Path();
          curve.moveTo(p[0], p[1]);
          } else {
          curve.lineTo(p[0], p[1]);
          }
        }
      this.draw = (paint) => {
        layer.getCanvas().drawPath(curve, paint);
        }
      this.getLayer = () => layer;
      }

    function Serial(layer, points) {
      //console.log("layer::" + layer);
      if (!points) {
        points = [];
        }

      this.getPoints = () => points;
      this.draw = (paint, lineMode) => {

        var c = layer.getCanvas();
        var r = Math.max(c.getWidth(), c.getHeight()) * .003
        var curve;
        for(var i = 0; i < points.length; i++) {
          var center = layer.getP2d(points[i]);
          if (lineMode) {
            if (!curve) {
              curve = new android.graphics.Path();
              curve.moveTo(center[0], center[1]);
              } else {
              curve.lineTo(center[0], center[1]);
              }
            } else {
            //var center = layer.getP2d(points[i]);
            c.drawCircle(center[0], center[1], r, paint);
            c.drawLines([
                center[0] - 2*r, center[1], center[0] + 2*r, center[1]
                ,center[0], center[1] - 2*r, center[0], center[1] + 2*r
                ]
              ,paint
              )
            }
          }
        if (lineMode) c.drawPath(curve, paint);
        }
      this.getLayer = () => layer;
      }

    Axis.X = 0;
    Axis.Y = 1;
    Axis.Z = 2;

    function Label(layer, label, p3d, paint) {
      //console.log("Label::'" + label + "'::" + p3d);
      this.draw = () => {
        var p = layer.getP2d(p3d);

        layer.getCanvas().drawText(
          label
          , p[0]
          , p[1]
          ,paint
          );
        }
      }

    function Axis(layer, XYorZ, attributes) {
      var start = [0,0,layer.getZ()];
      var end = [0,0,layer.getZ()];
      var bar = {
        unit: .007
        ,subUnit: .01
        }

      var labelUnit;
      var viewPorts = layer.getViewPorts();
      //console.log("check::" + viewPorts[0]);

      function markUnit(p) {
        //if (p[XYorZ] === 0) return;
        var pUnit;
        if (XYorZ !== Axis.Y) {
          pUnit = [
            layer.getP2d([p[0], p[1] - viewPorts[1].getSize()*bar.unit, p[2]])
            ,layer.getP2d([p[0], p[1] + viewPorts[1].getSize()*bar.unit, p[2]])
            ,layer.getP2d([p[0], viewPorts[1].getMin(), p[2]])
            ,layer.getP2d([p[0], viewPorts[1].getMax(), p[2]])
            ];

          if (tagUnit) {
            var vTextSize = viewPorts[1].pixelToPort(tagUnit.getTextSize());
            var yOffset = p[1] - vTextSize;
            if (yOffset < viewPorts[1].getMin()) {
              yOffset = p[1] + vTextSize;
              }
            layer.addLabel(
              "" + p[XYorZ]
              , [p[0], yOffset, p[2]]
              , tagUnit
              );
            }
          } else {
          pUnit = [
            layer.getP2d([p[0] - viewPorts[0].getSize()*bar.unit, p[1], p[2]])
            ,layer.getP2d([p[0] + viewPorts[0].getSize()*bar.unit, p[1], p[2]])
            ,layer.getP2d([viewPorts[0].getMin(), p[1], p[2]])
            ,layer.getP2d([viewPorts[0].getMax(), p[1], p[2]])
            ];
          if (tagUnit) {
            var tag = "" + p[XYorZ];
            var vTextSize = viewPorts[0].pixelToPort(tagUnit.getTextSize());
            var vTextWidth = viewPorts[0].pixelToPort(tagUnit.measureText(tag));
            var xOffset = p[0] - vTextSize - vTextWidth;
            if (xOffset < viewPorts[0].getMin()) {
              xOffset = p[0] + vTextSize;
              }

            layer.addLabel(
              "" + p[XYorZ]
              , [xOffset, p[1], p[2]]
              , tagUnit
              );
            }

          }
        axis.moveTo(pUnit[0][0], pUnit[0][1]);
        axis.lineTo(pUnit[1][0], pUnit[1][1]);

        if (gridUnit) {
          gridUnit.moveTo(pUnit[2][0], pUnit[2][1]);
          gridUnit.lineTo(pUnit[3][0], pUnit[3][1]);
          }

        }

      start[XYorZ] = attributes.min;
      end[XYorZ] = attributes.max;
      var axis = new android.graphics.Path();
      var gridUnit;
      if (attributes.paintGridUnit) {
        gridUnit = new android.graphics.Path();
        }
      var tagUnit;
      if (attributes.paintTagUnit) {
        tagUnit = attributes.paintTagUnit;
        }
      var p = layer.getP2d(start);
      //console.log("start::" + start + "::" + p);
      axis.moveTo(p[0], p[1]);
      p = layer.getP2d(end);
      //console.log("end::" + end + "::" + p);
      axis.lineTo(p[0], p[1]);
      if (attributes.unit) {
        for(var t = 0; t <= attributes.max; t+= attributes.unit) {
          start[XYorZ] = t;
          markUnit(start);
          }
        for(var t = -attributes.unit; t >= attributes.min; t -= attributes.unit) {
          start[XYorZ] = t;
          markUnit(start);
          }
        }
      this.draw = (paint) => {
        layer.getCanvas().drawPath(axis, paint);
        if (gridUnit) {
          layer.getCanvas().drawPath(gridUnit, attributes.paintGridUnit);
          }
        return layer;
        }
      }

    Lourah.graphics.g2d.Layer = function Layer(c2d) {
      var viewPort = {};
      var rotation;
      var translation;
      var camera;
      var z = 0;
      var viewPorts = {};
      var labels = [];

      this.setRotation = (a, b, c) => {
        rotation = Lourah.js3d.rot(a, b, c);
        };

      this.setTranslation = (v) => {
        translation = v;
        };

      this.setCamera = (c) => {
        camera = c;
        };

      this.setZ = (zPlan) => z = zPlan;
      this.getZ = () => z;

      this.getP2d = (p) => {
        if (p[2] === undefined) {
          p[2] = z;
          }

        var px = [];
        p.forEach((c, i) => {
            px[i] = viewPorts[i]?viewPorts[i].getPixel(c):c;
            });

        var pt = Lourah.js3d.transform(
          px
          ,rotation
          ,translation
          );
        //console.log("--pt::" + pt);
        //console.log("--camera::" + camera);
        return Lourah.js3d.project(
          pt
          ,camera
          ,[c2d.getWidth(), c2d.getHeight()]
          )
        }

      this.getCanvas = () => c2d.getCanvas();

      this.setRotation(0, 0, 0);
      this.setTranslation([
          -c2d.getWidth()/2
          ,-c2d.getHeight()/2
          ,0
          ]);
      this.setCamera([0,0,10000]);

      this.setViewPortX = (min, max) => {
        viewPorts[0] = new ViewPort(min, max, c2d.getWidth());
        viewPorts.x = viewPorts[0];
        }

      this.setViewPortY = (min, max) => {
        viewPorts[1] = new ViewPort(min, max, c2d.getHeight());
        viewPorts.y = viewPorts[1];
        }

      this.setViewPortZ = (min, max) => {
        viewPorts[2] = new ViewPort(min, max,
          Math.sqrt(
            c2d.getWidth()*c2d.getWidth()
            + c2d.getHeight()*c2d.getHeight()
            ));
        viewPorts.z = viewPorts[2];
        }

      this.getViewPorts = () => viewPorts;

      this.createCurveFx = (f, xMin, xMax, points) => new CurveFx(this, f, xMin, xMax, points);
      this.createCurvePolar = (f, xMin, xMax, points) => new CurvePolar(this, f, xMin, xMax, points);
      this.createSerial = (points) => new Serial(this, points);
      this.createAxisX = (attribute) => new Axis(this, Axis.X, attribute);
      this.createAxisY = (attribute) => new Axis(this, Axis.Y, attribute);
      this.createAxisZ = (attribute) => new Axis(this, Axis.Z, attribute);
      this.addLabel = (label, p2d, paint) => labels.push(new Label(this, label, p2d, paint));
      this.drawLabels = () => labels.forEach(label => label.draw());
      }

    Lourah.graphics.g2d.Context = function(imageView, w, h) {
      var display = Activity.getWindowManager().getDefaultDisplay();
      var width = (w || (display.getWidth()))|0;
      var height = (h || (display.getHeight()))|0;

      var bitmap = Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
      imageView.setImageBitmap(bitmap);
      var canvas = new Canvas(bitmap);
      var paint = new Paint(
        Paint.ANTI_ALIAS_FLAG
        );
      this.getCanvas = () => canvas;
      this.getPaint = () => paint;
      this.getWidth = () => width;
      this.getHeight = () => height;
      this.createLayer = () => new Lourah.graphics.g2d.Layer(this);
      this.x = x => {

        }
      }
    })();
