Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.GET.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.Color.js");


function DemoJs() {

var Toast = Packages.android.widget.Toast;
var Bitmap = Packages.android.graphics.Bitmap;
var Canvas = Packages.android.graphics.Canvas;
var Color = Lourah.graphics.Color;
var Paint = Packages.android.graphics.Paint;
var HttpURLConnection = Packages.java.net.HttpURLConnection;
var URL = Packages.java.net.URL;

var viewsName = Lourah.jsFramework.dir() + "/overview.json";

Lourah.jsFramework.setOnBackButtonListener(() => false);

function trace(msg) {
	Activity.runOnUiThread(new java.lang.Runnable({
	  run: () => Toast.makeText(Activity, JSON.stringify(msg), Toast.LENGTH_LONG).show()
	  }));
	}


var v = (new Lourah.android.Overview(JSON.parse(Activity.path2String(viewsName)))).$();

Activity.setTitle("DemoJs by Lourah");

Activity.setContentView(v.ll);

v.button.setOnClickListener({
  onClick: function(view) {
  	try {
        var bitmap = Bitmap.createBitmap(500, 600, Bitmap.Config.ARGB_8888);
        var canvas = new Canvas(bitmap);
        canvas.drawColor(Color.LTGRAY);
        var paint = new Paint();    
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLACK);
        canvas.drawCircle(103, 103, 50, paint);
        paint.setColor(Color.RED);
        canvas.drawCircle(100, 100, 50, paint);
        v.imageView.setImageBitmap(bitmap);
        var eur;
        Lourah.http.GET(
          "https://api.coinmarketcap.com/v2/ticker/1/?convert=EUR",
          function(response) {
          	try {
              	var oResponse = JSON.parse(response);
                  eur = oResponse.data.quotes["EUR"].price;
              	v.textView.setText("<<" + eur + ">>");
                  Lourah.http.GET(
                              "https://api.coinmarketcap.com/v2/ticker/1/?convert=IDR",
                              function(response) {
                              	var quotes = JSON.parse(response).data.quotes;
                                  var usd = quotes.USD.price;
                                  var idr = quotes.IDR.price;
                                  v.textView.setText("<<\n" 
                                     + "EURIDR=" + (idr/eur).toFixed(5) + "\n"
                                     + "EURUSD=" + (usd/eur).toFixed(5) + "\n"
                                     + "USDIDR=" + (idr/usd).toFixed(5) + "\n"
                                     + ">>");
                              	}
                  );
                  
                  
                } catch(e) {
                  Activity.reportError("httpCallback::" + e + "::" + e.stack);
                }
          	}
          );
        } catch(e) {
      	Activity.reportError("onClick::" + e + ":" + e.stack);
        }
      }
  });
  
v.editText.addTextChangedListener({
	
	afterTextChanged:function(e) {
		try {
		    v.button.setText(e);
		  } catch(e) {
			Activity.reportError("afterTextChanged::" + e + ":" + e.stack);
		  }
		}
	 ,  
     onTextChanged : function(s, start, before, count) {
     	try {
        	v.textView.setText(s + "," + start + "," + before + "," + count);
          } catch(e) {
            Activity.reportError("onTextChanged::" + e + ":" + e.stack);
          }
     	}

	});


(function() {
var Toast = Packages.android.widget.Toast;
var y;
v.textView.setOnTouchListener({
	onTouch: (view, motionEvent) => {
		try {
		  if (motionEvent.getActionMasked() === Packages.android.view.MotionEvent.ACTION_DOWN) {
			y = motionEvent.getY(0);
			}
		  if (motionEvent.getActionMasked() === Packages.android.view.MotionEvent.ACTION_UP) {
			if (motionEvent.getY(0) > y) {
			  Toast.makeText(Activity, "refreshing", Toast.LENGTH_LONG).show();
			  }
			}
		  return true;
		  } catch(e) {
			Activity.reportError("onTouch::error::" + e);
		  }
		}
	});
  })();

var Intent = Packages.android.content.Intent;
var Uri = Packages.android.net.Uri;

v.intent.setOnClickListener({
	onClick : () => {
		v.textView.setText("intent...");
		var url = "https://newsapi.org";
		var intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
		Activity.startActivity(intent);
		}
	});

      //var url = new URL('https://api.icndb.com/jokes/random');
      //var url = new URL('https://www.google.com');
      
      /*
      var sURL = "https://www.alphavantage.co/query";  
      sURL += "?apikey=TC1TOQVCBZRJ8UO6";
      sURL += "&function=CURRENCY_EXCHANGE_RATE";
      sURL += "&from_currency=EUR";
      sURL += "&to_currency=IDR";
      */
      
      
      //var sURL = "https://api.exchangeratesapi.io/latest?symbols=USD,GBP,IDR,RON";
      //var sURL = "https://apilayer.net/api/convert?from=EUR&to=IDR&amount=1";
      //var sURL = "https://api.coinmarketcap.com/v2/ticker/1/?convert=EUR";
      
      



}

DemoJs();