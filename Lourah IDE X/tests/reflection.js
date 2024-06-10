try {
  /*
  var Paint = JavaAdapter(android.graphics.Paint, {
      setColor: function (c) {
        console.log("setColor::" + c);
        }
      });
  */
  
  } catch(e) {
  Activity.reportError(e + "::" + e.stack);
  }
