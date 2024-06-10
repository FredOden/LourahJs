/**
Reuters news application - by Lourah
free of use
powered by Reuters news Api : http://newsapi.org
*/


var frameworkDir = Lourah.jsFramework.parentDir();
var Toast = Packages.android.widget.Toast;

Activity.importScript(frameworkDir + "/Lourah.android.Overview.js");
Activity.importScript(frameworkDir + "/Lourah.http.GET.js");



var jsons  = {
  newsApis : { f :
    Lourah.jsFramework.dir()
    + "/newskeys.json"
    , o : {}
    }
  ,names : { f :
    Lourah.jsFramework.dir()
    + "/names.json"
    , o : {}
    }
  ,countries : { f :
    Lourah.jsFramework.dir()
    + "/countries.json"
    , o : {}
    }
  ,ui : { f :
    Lourah.jsFramework.dir()
    + "/ui.json"
    , o : {}
    }
  
  ,config: { f :
    Lourah.jsFramework.dir()
    + "/config.json"
    , o : {}
    }
  /**/
  };


var doubleSlashComment = new RegExp("\s*//[^*].*\n", "g");


for(var k in jsons) {
  var json = jsons[k];
  try {
    json.o = "" + Activity.path2String(json.f);
        
    /*
    json.o.replace(
        // /\s*\/\/[^*].*\n/g
        // /\s*\/\/[^*]*\n/g
      doubleSlashComment
        , ""
        );
    
    console.log(json.o);
    /**/
    
    /*
    if (k === "config") {
      console.log("config::<" + json.o + ">");
      }
    /**/
    
    json.o = JSON.parse(json.o);
    } catch (e) {
    Activity.reportError("News::Loading::" + json.f + "::" + e + "::" + e.stack);
    }
  }

var countries = jsons.countries.o;
var names = jsons.names.o;
var config = jsons.config.o;

var internationalizer = new Lourah.android.Internationalizer();
internationalizer.addVocabulary(jsons.ui.o.vocabulary);
//Activity.reportError(JSON.stringify(jsons.ui.o.vocabulary));
var welcome = new Toast(Activity.getApplicationContext());
welcome.setView(
  (new Lourah.android.Overview(jsons.ui.o.welcome, internationalizer)).$().msg
  );
welcome.setDuration(Toast.LENGTH_LONG);
welcome.setGravity(Packages.android.view.Gravity.CENTER_VERTICAL, 0, 0);

welcome.show();

var newsApi = jsons.newsApis.o.newsapi;
var editions =  (new Lourah.android.Overview(jsons.ui.o.editions, internationalizer)).$();;
var main = (new Lourah.android.Overview(jsons.ui.o.main)).$();
var all =  (new Lourah.android.Overview(jsons.ui.o.articles)).$();

all.panel.addView(main.scroll);

(function() {

    var y;
    all.panel.setOnTouchListener({
        onTouch: (view, motionEvent) => {
          try {
            if (motionEvent.getActionMasked() === Packages.android.view.MotionEvent.ACTION_DOWN) {
              y = motionEvent.getY(0);
              }
            if (motionEvent.getActionMasked() === Packages.android.view.MotionEvent.ACTION_UP) {
              if (motionEvent.getY(0) > y) {
                Toast.makeText(Activity.getApplicationContext(),
                  internationalizer.translate("@refreshing"), Toast.LENGTH_LONG).show();
                }
              }
            return true;
            } catch(e) {
            Activity.reportError("onTouch::error::" + e);
            }
          }
        });
    })();


Lourah.jsFramework.setOnBackButtonListener(() => {
    //main.list.removeAllViews();
    //Activity.setContentView(editions.panel);
    return false;
    });

/*
Lourah.jsFramework.setAndroidOnHandlers({
    onResume : () => Activity.reportError("ON RESUME!")
    ,onStart : () => Activity.reportError("ON START")
    ,onRestart : () => Activity.reportError("ON RESTART")
    ,onPause : () => Activity.reportError("ON PAUSE")
    ,onStop : () => Activity.reportError("ON STOP")
    ,onDestroy : () => Activity.reportError("ON DESTROY")
    });

Lourah.jsFramework.setAndroidOnHandler("onStop", () => Activity.reportError("Stoped now !!!"));
*/

Activity.setTitle(internationalizer.translate("@title") + " - " + newsApi.banner);



function getNews(country) {

  Activity.setContentView(all.panel);

  all.edition.setText(country + " edition:");



  var code = "00";
  for(var k in names) {
    if (names[k] == country) {
      code = k;
      break;
      }
    }


  var request = newsApi.endpoint + "/top-headlines"
  + "?country=" + code + "&apikey=" + newsApi.key;

  //Activity.reportError("request::" + request);

  Lourah.http.GET(
    request
    ,
    response => {
      try {
        //Activity.reportError("response::" + response);

        try {
          var o = JSON.parse(response);
          } catch(e) {
          /**
          It is probably a html "error" response
          */
          var news = (new Lourah.android.Overview(jsons.ui.o.webnews, internationalizer)).$();
          news.webview.getSettings().setJavaScriptEnabled(true);
          news.webview.loadData(response, "text/html; charset=utf-8", "UTF-8");
          //news.webview.loadUrl(request);
          news.share.setText(request);
          news.share.setOnClickListener({
              onClick: () => {
                try {
                  var shareIntent = new android.content.Intent(android.content.Intent.ACTION_SEND);
                  shareIntent.setType("text/plain");
                  shareIntent.putExtra(android.content.Intent.EXTRA_TEXT, request);
                  Activity.startActivity(android.content.Intent.createChooser(shareIntent,
                      internationalizer.translate("@shareWith")));
                  } catch(e) {
                  Activity.reportError("share news::" + e + "::" + e.stack);
                  }
                }
              });
          Activity.setContentView(news.view);
          return;
          }

        //Activity.reportError(o.status + "::" + o.totalResults);

        o.articles.forEach(article => {
            var headline = (new Lourah.android.Overview(jsons.ui.o.headline)).$();
            headline.title.setText(article.title);
            headline.description.setText(article.source.name + "-" + article.publishedAt +"\n" + article.description);
            main.list.addView(headline.row);

            try {
              headline.title.setOnClickListener(function(view){
                  try {
                    var news = (new Lourah.android.Overview(jsons.ui.o.webnews, internationalizer)).$();
                    news.webview.getSettings().setJavaScriptEnabled(config.news.webView.javascriptEnabled === "true");
                    news.webview.loadData("<html><body>loading : <b>" + article.url + "</b>...</body></html>", "text/html; charset=utf-8", "UTF-8");
                    news.webview.loadUrl(article.url);
                    news.share.setOnClickListener({
                        onClick: () => {
                          try {
                            var shareIntent = new android.content.Intent(android.content.Intent.ACTION_SEND);
                            shareIntent.setType("text/plain");
                            shareIntent.putExtra(android.content.Intent.EXTRA_TEXT, article.url);
                            Activity.startActivity(android.content.Intent.createChooser(shareIntent,
                                internationalizer.translate("@shareWith")));
                            } catch(e) {
                            Activity.reportError("share news::" + e + "::" + e.stack);
                            }
                          }
                        });
                    Lourah.jsFramework.setOnBackButtonListener(() => {
                        Activity.setContentView(all.panel);
                        Lourah.jsFramework.setOnBackButtonListener(() => {
                            main.list.removeAllViews();
                            Activity.setContentView(editions.panel);
                            Lourah.jsFramework.setOnBackButtonListener(() => false);
                            return true;
                            });
                        return true;
                        });


                    Activity.setContentView(news.view);
                    } catch(e) {
                    Activity.reportError("LoadNews::onClick::" + e + "::" + e.stack);
                    }
                  });
              } catch(e) {
              Activity.reportError("LoadNews::webview" + e + "::" + e.stack);
              }
            });
        } catch(e) {
        Activity.reportError("LoadNews::" + e + "::" + e.stack);
        }

      }
    , config.http.request.headers
    );
  }


function selectEdition() {
  Activity.setContentView(editions.panel);

  var rowSize = 2;
  keys = countries.sort();
  for(var i = 0; i<keys.length; i++) {
    var k = keys[i];
    var idx = i%rowSize;
    var tableRow;
    if (idx === 0) {
      tableRow = new Packages.android.widget.TableRow(Activity.getApplicationContext());
      editions.table.addView(tableRow);
      }
    var bt = new Packages.android.widget.Button(Activity.getApplicationContext());
    bt.setText(names[k.toUpperCase()]);
    bt.setShadowLayer(6.0, 5.0, 5.0, Packages.android.graphics.Color.GRAY);
    bt.setTextSize(20);
    bt.setBackgroundColor(0x00ffffff|0);
    tableRow.addView(bt);
    bt.setOnClickListener(function(v) {
        getNews(v.getText());
        Lourah.jsFramework.setOnBackButtonListener(() => {
            main.list.removeAllViews();
            Activity.setContentView(editions.panel);
            Lourah.jsFramework.setOnBackButtonListener(() => false);
            return true;
            });
        });

    }

  }

function shareNews() {
  Toast.makeText(Activity.getApplicationContext(), "Sharing...", Activity, Toast.LENGTH_LONG).show();
  }

selectEdition();
