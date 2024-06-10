/**
Shape recognition algorithm
/**/

var Lourah = Lourah || {};
var _p = android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.O?(c) => c:android.graphics.Color.pack;

(function () {

    Lourah.shape = Lourah.shape || {};
    if (Lourah.shape.recognition) return;

    Lourah.shape.recognition = {
      version : "0.0.1"
      };

    function isBorderTrivial(iColor) {
      return iColor !== -1;
      }

    var isBorder = isBorderTrivial;

    function scan(bitmap, res) {
      var s = [];
      for (var x = 0; x < bitmap.getWidth(); x+=res) {
        for(var y = 0; y < bitmap.getHeight(); y+=res) {
          var iPixelColor = bitmap.getPixel(x, y);
          if (isBorder(iPixelColor)) {
            s.push([x, y]);
            }
          }
        }
      var G = [s[0][0], s[0][1]];
      for (var i = 1; i < s.length; i++) {
        G[0] += s[i][0];
        G[1] += s[i][1];
        }

      G[0] = G[0]/s.length;
      G[1] = G[1]/s.length;
      const toDeg = 180/Math.PI;
      for (i = 0; i < s.length; i++) {
        var [x, y] = [
          s[i][0] - G[0]
          , s[i][1] - G[1]
          ];

        var r = Math.sqrt(
          x*x
          + y*y
          );

        var t = Math.atan2(x, y)*toDeg;

        s[i] = [x, y, r, t<0?(t+360):t];
        //console.log("s::[" + i + "]::" + s[i]);
        }
      s.sort((a,b) => a[3] - b[3]);
      var mRhos = 0;
      for (i = 0; i < s.length; i++) {
        mRhos += s[i][2];
        
        }
      mRhos = mRhos / s.length;
      
      var invMRhos = 1/mRhos;
      var polar = [];
      
      polar[0] = [
        s[s.length - 1][3] - 360
        , s[s.length - 1][2]*invMRhos
        ];
      
      for(i = 0; i < s.length; i++) {
        polar[i+1] = [
          s[i][3]
          , s[i][2] * invMRhos
          ];
        }
      
      polar[s.length + 1] = [
        polar[1][0] + 360
        , polar[1][1]
        ];
      
      
      /*
      var i = 0;
      for(var a = 0; a < 360; a++) {
        
        }
      /**/
      
      return {
        P: s       // set of points
        , G: G     // Barycentre
        , R: mRhos // mean distance from G
        , Polar: polar
        }
      }

    Lourah.shape.recognition.scan = scan;

    })();
