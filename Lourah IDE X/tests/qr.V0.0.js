var Lourah = Lourah || {};
Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Lourah.graphics.g2d.js"
  );

(function () {
    Lourah.utils = Lourah.utils || {};
    if (Lourah.utils.QR) return;

    alignmentPatternLocations = [
      null
      // Version Number
      , [6, 18] // 2
      , [6, 22] // 3
      , [6, 26] // 4
      , [6, 30] // 5
      , [6, 34] // 6
      , [6, 22, 38] // 7
      , [6, 24, 42] // 8
      , [6, 26, 46] // 9
      , [6, 28, 50] //10
      , [6, 30, 54] //11
      , [6, 32, 58] //12
      , [6, 34, 62] //13
      , [6, 26, 46, 66] //14
      , [6, 26, 48, 70] //15
      , [6, 26, 50, 74] //16
      , [6, 30, 54, 78] //17
      , [6, 30, 56, 82] //18
      , [6, 30, 58, 86] //19
      , [6, 34, 62, 90] //20
      , [6, 28, 50, 72, 94] //21
      , [6, 26, 50, 74, 98] //22
      , [6, 30, 54, 78, 102] //23
      , [6, 28, 54, 80, 106] //24
      , [6, 32, 58, 84, 110] //25
      , [6, 30, 58, 86, 114] //26
      , [6, 34, 62, 90, 118] //27
      , [6, 26, 50, 74, 98, 122] //28
      , [6, 30, 54, 78, 102, 126] //29
      , [6, 26, 52, 78, 104, 130] //30
      , [6, 30, 56, 82, 108, 134] //31
      , [6, 34, 60, 86, 112, 138] //32
      , [6, 30, 58, 86, 114, 142] //33
      , [6, 34, 62, 90, 118, 146] //34
      , [6, 30, 54, 78, 102, 126, 150] //35
      , [6, 24, 50, 76, 102, 128, 154] //36
      , [6, 28, 54, 80, 106, 132, 158] //37
      , [6, 32, 58, 84, 110, 136, 162] //38
      , [6, 26, 54, 82, 110, 138, 166] //39
      , [6, 30, 58, 86, 114, 142, 170] //40
      ];


    patterns = {
      finder:  [
        [ 8, 8, 8, 8, 8, 8, 8]
        ,[8, 7, 7, 7, 7, 7, 8]
        ,[8, 7, 8, 8, 8, 7, 8]
        ,[8, 7, 8, 8, 8, 7, 8]
        ,[8, 7, 8, 8, 8, 7, 8]
        ,[8, 7, 7, 7, 7, 7, 8]
        ,[8, 8, 8, 8, 8, 8, 8]
        ]
      , alignment: [
        [ 12, 12, 12,12, 12]
        ,[12, 11, 11, 11, 12]
        ,[12, 11, 12, 11, 12]
        ,[12, 11, 11, 11, 12]
        ,[12, 12, 12, 12, 12]
        ]
      };


    function getQRAttributes(version) {
      if (version < 1 || version > 40) {
        throw "Lourah.utils.QR::error::," + version + " is invalid version number (should be 2 up to 40)";
        }
      return {
        size: 21 + 4*(version - 1)
        , alignmentPatternLocation: alignmentPatternLocations[version - 1]
        }
      }

    Lourah.utils.QR = function (version) {
      var attributes = getQRAttributes(version);
      this.getVersion = () => version;
      this.getAttributes = () => attributes;
      var modules = new Array(attributes.size * attributes.size);

      for (var i = 0; i < modules.length; i++) { modules[i] = -1; }

      function setAt(x, y, val) {
        modules[y*attributes.size + x] = val;
        }

      function getAt(x, y) {
        return modules[y*attributes.size + x];
        }

      function placePatternAt(px, py, pattern) {
        for(var y = 0; y < pattern.length; y++) {
          for(var x = 0; x < pattern[y].length; x++) {
            setAt(px + x, py + y, pattern[y][x]);
            }
          }
        }

      /**
      place the finders

      */
      [
        [0,0]
        , [attributes.size - 7, 0]
        , [0, attributes.size - 7]
        ].forEach((p) => placePatternAt(
          p[0], p[1]
          ,patterns.finder
          )
        );
      /**
      separators
      */
      [ [0,7]
        , [attributes.size - 8, 7]
        , [0, attributes.size - 8]
        ].forEach((p) => placePatternAt(
          p[0], p[1]
          ,[[0,0,0,0,0,0,0,0]]
          )
        );
      [ [7,0]
        ,[attributes.size - 8, 0]
        ,[7, attributes.size - 8]
        ].forEach((p) => placePatternAt(
          p[0], p[1]
          , [
            [0]
            ,[0]
            ,[0]
            ,[0]
            ,[0]
            ,[0]
            ,[0]
            ,[0]
            ]
          )
        );

      /**
      place alignment patterns
      */
      function placeAlignPatternAt(px, py) {
        pattern = patterns.alignment;
        for(var y = 0; y < pattern.length; y++) {
          for(var x = 0; x < pattern[y].length; x++) {
            setAt(px + x - 2, py + y -2, pattern[y][x]);
            }
          }
        }

      if (version > 1) {
        for(var iy = 0; iy < attributes.alignmentPatternLocation.length; iy++) {
          for(var ix = 0; ix < attributes.alignmentPatternLocation.length; ix++) {
            if (ix === 0 && (iy === 0 || iy === attributes.alignmentPatternLocation.length - 1)) {
              continue;
              }
            if (ix === attributes.alignmentPatternLocation.length - 1 && iy === 0) {
              continue;
              }
            var x = attributes.alignmentPatternLocation[ix];
            var y = attributes.alignmentPatternLocation[iy];
            //console.log("x::" + x + "::y::" + y);
            placeAlignPatternAt(x, y);
            }
          }
        }
      /**
      format information Area
      */
      [
        [0, 8]
        ,[attributes.size - 8, 8]
        ].forEach((p) => placePatternAt(
          p[0], p[1]
          , [[2, 2, 2, 2, 2, 2, 2, 2]]
          )
        );
      placePatternAt(8, 0, [
          [2],[2],[2],[2],[2],[2],[2],[2],[2]
          ]
        );
      placePatternAt(8, attributes.size - 7, [
          [2],[2],[2],[2],[2],[2],[2]
          ]
        );
      /**
      version information area
      only if version >= 7
      */
      if (version >= 7) {
        placePatternAt(attributes.size -8 -3, 0, [
            [3,3,3], [3,3,3],[3,3,3],[3,3,3],[3,3,3],[3,3,3]
            ]
          );
        placePatternAt(0, attributes.size -8 -3, [
            [3,3,3,3,3,3],[3,3,3,3,3,3],[3,3,3,3,3,3]
            ]
          );
        }
      /**
      place timing patterns
      */
      for(var x = 8; x < attributes.size - 8; x++) {
        setAt(x, 6, x%2?4:5);
        }
      for(var y = 8; y < attributes.size - 8; y++) {
        setAt(6, y, y%2?4:5);
        }
      /*"
      dark module
      */
      setAt(8, 4*version + 9, 6);
      /**
      compute bytes path
      */
      this.computeBytes = () => {
        var bytes = [];

        var count;
        var bx = attributes.size - 1;
        var by = attributes.size - 1;

        console.log("bx,by::" + [bx, by]);

        var yInc = -1;

        function nextBit(x, y, yInc, pos) {
          if (x < 0) throw "end at::" + [x,y];

          if (x % 2 === ((x < 6)?1:0)) {
            if (getAt(x - 1, y) === -1) {
              return {x:x-1, y:y, yInc:yInc, pos:pos+1};
              }
            if (getAt(x, y + yInc) === -1) {
              return {x:x, y:y + yInc, yInc:yInc, pos:pos+1};
              }
            throw "Dead end 1 at::" + [x,y];
            }

          var v = getAt(x + 1, y + yInc);

          var z = getAt(x, y + yInc);
          if (v !== -1) {
            if (z === -1) {
              return {x:x, y:y + yInc*((v === 5|| v===4)?2:1), yInc:yInc, pos:pos + 1};
              }
            }

          if (y + yInc < 0
            || y + yInc >= attributes.size
            || (
              v !== -1
              && v !== 4
              && v !== 5
              && v !== 11
              && v !== 12
              //&& v !== 3
              )
            ) {
            yInc = -yInc;

            //console.log("hit at::" + [x, y]);
            if (y - yInc >= attributes.size && x === 9) {
              //console.log("corner");
              return nextBit(x - 2, attributes.size - 8, yInc, pos);
              }
            return nextBit(x - 2, y - yInc, yInc, pos);
            //return {x:x - 2, y:y - yInc, yInc:yInc, pos:pos + 1};
            }

          if (v === -1) {
            return {x:x +1, y:y + yInc, yInc:yInc, pos:pos+1};
            }

          if (v === 4 || v === 5) {
            if (getAt(x + 1, y + 2*yInc) === -1) {
              return {x:x+1, y:y+2*yInc, yInc:yInc, pos:pos+1};
              }
            if (getAt(x + 1, y + 2*yInc) === 3) {
              return {x:x-2, y:0, yInc:-yInc, pos:pos+1};
              }
            return nextBit(x + 1, y + 2* yInc, yInc, pos);
            }
          /**/
          if (v === 11 || v === 12) {
            if (getAt(x + 1, y + 6*yInc) === -1) {
              return {x:x+1, y:y+6*yInc, yInc:yInc, pos:pos+1};
              }
            }

          var w = getAt(x-1, y);
          if (w === -1) {
            return {x:x -1, y:y, yInc:yInc, pos:pos+1};
            }

          if (w === 4 || w === 5) {
            return {x:x -2, y:y, yInc:yInc, pos:pos+1};
            }
          throw "Impossible End 2 at::" + [x,y];
          }

        var pos = 0;
        while(1) {
          var byte = (pos/8)>>0;
          bytes[byte] = bytes[byte] || [];
          bytes[byte].push([bx, by]);
          setAt(bx, by, byte%2?9:10);
          try {
            var b = nextBit(bx, by, yInc, pos);
            } catch(e) {
            console.log("computeBytes::" + e);
            break;
            }
          if (b.x < 0) break;
          bx = b.x;
          by = b.y;
          yInc = b.yInc;
          pos = b.pos;
          }
        };

      this.draw = (imageView) => {
        var display = Activity.getWindowManager().getDefaultDisplay();
        var width = (display.getWidth()*.8)|0;
        var c2d = new Lourah.graphics.g2d.Context(
          imageView
          , width
          , width
          );

        var paints = [
          new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          , new android.graphics.Paint()
          ];

        var colors = [
          android.graphics.Color.GRAY // -1 FREE
          ,android.graphics.Color.WHITE // 0 DATA OFF
          ,android.graphics.Color.BLACK // 1 DATADATA BIT ON
          ,android.graphics.Color.BLUE // 2 FORMAT INFO.AREA
          ,android.graphics.Color.GREEN // 3 VERSION INFO. AREA
          ,android.graphics.Color.CYAN // 4 TIMING LINE OFF
          ,android.graphics.Color.RED // 5 TIMING LINE ON
          ,android.graphics.Color.RED // 6 Black module
          ,android.graphics.Color.WHITE // 7 FINDER OFF
          ,android.graphics.Color.BLACK // 8 FINDER ON
          ,android.graphics.Color.YELLOW // 9 EVEN BYTE
          ,android.graphics.Color.MAGENTA // 10 ODD BYTE
          ,android.graphics.Color.WHITE // 11 ALIGN OFF
          ,android.graphics.Color.BLACK // 12 ALIGN ON
          ]

        paints.forEach((paint, i) => {
            paint.setStyle(android.graphics.Paint.Style.FILL);
            paint.setColor(colors[i]);
            });

        var canvas = c2d.getCanvas();
        var pSize = width/attributes.size;
        for(var x = 0; x < attributes.size; x++) {
          for (var y = 0; y < attributes.size; y++) {
            canvas.drawRect(
              x*pSize, y*pSize
              ,(x+1)*pSize, (y+1)*pSize
              ,paints[getAt(x, y) + 1]
              );
            }
          }
        }

      };


    })();

Activity.importScript(
  Lourah.jsFramework.parentDir()
  + "/Lourah.android.Overview.js"
  );


var $screen = Lourah.android.Overview.buildFromSugar({
    $top: {
      class: android.widget.LinearLayout
      ,setOrientation: android.widget.LinearLayout.VERTICAL
      ,$lVersion : {
        class: android.widget.LinearLayout
        ,setOrientation: android.widget.LinearLayout.HORIZONTAL
        ,$eVersion: {
          class: android.widget.EditText
          , setText: "'2'"
          //, setInputType: android.text.InputType.TYPE_CLASS_NUMBER
          , setEnabled: true
          , setWidth: 100
          }
        }
      ,$bDrawQR: {
        class: android.widget.Button
        ,setText: "'Draw'"
        ,setOnClickListener: {
          onClick: drawQR
          }
        }
      ,$bComputeQR: {
        class: android.widget.Button
        ,setText: "'Compute'"
        ,setOnClickListener: {
          onClick: computeQR
          }
        }
      ,$sv: {
        class: android.widget.ScrollView
        ,$qr: {
          class: android.widget.ImageView
          }
        }
      }
    });

var qr;

function drawQR() {
  try {
    qr = new Lourah.utils.QR(Number($screen.$eVersion.getText()));
    qr.draw($screen.$qr);
    } catch(e) {
    console.log("drawQR::" + e);
    }
  }

function computeQR() {
  try {
    qr.computeBytes();
    qr.draw($screen.$qr);
    } catch(e) {
    console.log("computeQR::" + e);
    }
  }

Activity. setTitle("Lourah QR Generator");
Activity. setContentView($screen.$top);

Lourah.jsFramework.setOnBackButtonListener(() => {
    return false;
    });


drawQR();






/**/
