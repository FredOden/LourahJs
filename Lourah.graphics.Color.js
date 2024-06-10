/**
* Lourah.graphics.Color to manage int Color
* fROM android API O
*/
var Lourah = Lourah || {};
(function () {
    Lourah.graphics = Lourah.graphics || {};
    if (Lourah.graphics.Color) return;
    
    Lourah.graphics.Color = function () {
      throw "Lourah.graphics.Color constructor unimplemented ... For future use with int/long color management";
      };
    
    Lourah.graphics.Color.WHITE = android.graphics.Color.WHITE;
    Lourah.graphics.Color.BLACK = android.graphics.Color.BLACK;
    Lourah.graphics.Color.GRAY = android.graphics.Color.GRAY;
    Lourah.graphics.Color.LTGRAY = android.graphics.Color.LTGRAY;
    Lourah.graphics.Color.DKGRAY = android.graphics.Color.DKGRAY;
    Lourah.graphics.Color.BLUE = android.graphics.Color.BLUE;
    Lourah.graphics.Color.CYAN = android.graphics.Color.CYAN;
    Lourah.graphics.Color.GREEN = android.graphics.Color.GREEN;
    Lourah.graphics.Color.MAGENTA = android.graphics.Color.MAGENTA;
    Lourah.graphics.Color.RED = android.graphics.Color.RED;
    Lourah.graphics.Color.TRANSPARENT = android.graphics.Color.TRANSPARENT;
    Lourah.graphics.Color.YELLOW = android.graphics.Color.YELLOW;
    
    Lourah.graphics.Color.argb = (a, r, g, b) => {
      return (a & 0xff) << 24
      | (r & 0xff) << 16
      | (g & 0xff) << 8
      | (b & 0xff)
      ;
      }
   
    //android.graphics.Color.argb = Lourah.graphics.Color.argb;
    
    Lourah.graphics.Color.alpha = (intColor) => (intColor >> 24) & 0xff;
    Lourah.graphics.Color.red = (intColor) => (intColor >> 16) & 0xff;
    Lourah.graphics.Color.green = (intColor) => (intColor >> 8) & 0xff;
    Lourah.graphics.Color.blue = (intColor) => (intColor) & 0xff;
    
    })();


