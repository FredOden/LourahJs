/**
Lourah FX - by the Bitcoin as pivot
*/

Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/http.js");

Activity.setTitle(Lourah.jsFramework.name());

coinMarketCapApi = {
  stage: "pro"
  
  ,none : {
    endPoint : ""
    ,key : ""
    }
  
  ,sandBox: {
    endPoint:"sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes"
    ,key: "place valid key here"
    }
  
  ,pro: {
    endPoint: "pro-api.coinmarketcap.com/v1/cryptocurrency/quotes"
    ,key: "place valid key here"
    }

  ,v1 : "sandbox-api.coinmarketcap.com/v1"
  ,get endPoint() { return "https://" + this[this.stage].endPoint; }
  ,get properties() { return {
    "X-CMC_PRO_API_KEY" : this[this.stage].key
    ,Accept: "application/json"
    }}
  }

var main = new Lourah.android.Overview(JSON.parse(Activity.path2String(Lourah.jsFramework.dir() + "/main.json")));
var rowOverview = JSON.parse(Activity.path2String(Lourah.jsFramework.dir() + "/row.json"));
var headerColor = 0xff00ff7f|0;

Activity.setContentView(main.$(). main);

var currencies = ["USD", "IDR", "TRY", "MXN" ]; //"MYR", "THB", "SGD" ;//, "CHF", "XAG", "XAU", "NOK", "JPY", "PLN", "GBP", "RON" ;
var rows = [];
var columns = [ "currency"
  ,"EUR"
  , "percent_change_1h"
  , "percent_change_24h"
  , "percent_change_7d"
  ];

var percents = [
  "percent_change_1h"
  , "percent_change_24h"
  , "percent_change_7d"
  ]

var header = new Lourah.android.Overview(rowOverview);

columns.forEach(
  (column, i) => {
    header.$()[column].setBackgroundColor(headerColor);
    if (i) header.$()[column].setGravity(android.view.Gravity.RIGHT);
    }
  );


//header.$().EUR.setBackgroundColor(headerColor);
//header.$().USD.setBackgroundColor(headerColor);

main.$().header.addView(header.$().row);

// false: means that back button will destroy the application
Lourah.jsFramework.setOnBackButtonListener(() => false);

function loadCurrencies() {

  currencies.forEach((currency) => {
      var row = new Lourah.android.Overview(rowOverview);
      
      columns.forEach(column => {
          row.$()[column].setText("_");
          row.$()[column].setGravity(android.view.Gravity.RIGHT);
          });
      
      row.$().currency.setText(currency);
      row.$().currency.setBackgroundColor(headerColor);

      
      //row.$().EUR.setText("-");
      //row.$().EUR.setGravity(android.view.Gravity.RIGHT);
      //row.$().USD.setText("-");
      //row.$().USD.setGravity(android.view.Gravity.RIGHT);
      main.$().table.addView(row.$().row);

      rows.push(row);
      });


  main.$().fx.setOnClickListener({
      onClick : updateCurrencies
      }
    );

  Lourah.jsFramework.setAndroidOnHandler("onRestart", updateCurrencies);
  updateCurrencies();
  }

function updateCurrencies(view) {
  var pivot = {};
  Lourah.http.GET(
    coinMarketCapApi.endPoint + "/latest?symbol=BTC&convert=EUR",
    function(response) {
      //console.log("response::" + "PIVOT" + "::<" + response + ">");
      try {
        var o = JSON.parse(response);
        pivot = o.data.BTC.quote;
        //pivot.USD = o.data.BTC.quotes.USD.price;
        //Activity.setTitle("pivot:" + pivot.EUR.toFixed(5) + "/" + pivot.USD.toFixed(5));
        rows.forEach((row) => {
            var currency = row.$().currency.getText();
            Lourah.http.GET(
              coinMarketCapApi.endPoint + "/latest?symbol=BTC&convert=" + currency,
              function(response) {
                //console.log("response::" + currency +"::<" + response + ">");
                try {
                  var oo = JSON.parse(response);
                  var r = row.$();
                  var q = oo.data.BTC.quote[currency];
                  r.EUR.setText((q.price/pivot.EUR.price).toFixed(4).toString());
                  percents.forEach(percent => {
                      r[percent].setText((
                        ((q[percent]/100+1)
                        /(pivot.EUR[percent]/100+1)
                        - 1)*100).toFixed(2).toString()
                        );
                      });
                  //row.$().USD.setText((oo.data.BTC.quotes[currency].price/pivot.USD).toFixed(4).toString());
                  } catch(e) {
                  Activity.reportError("httpRequest::" + currency + "::" + e + "::" + e.stack);
                  }
                }
              , coinMarketCapApi.properties
              //, (reply) => console.log(currency + "::" + reply)
              )
            }
          );
        }
      catch (e) {
        Activity.reportError("httpRequest::pivot::" + e + "::" + e.stack);
        }
      }
    , coinMarketCapApi.properties
    //, (reply) => console.log("Pivot::" + reply)
    );
  }

loadCurrencies();
