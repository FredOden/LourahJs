Activity.setTitle(Lourah.jsFramework.name());

Lourah.jsFramework.setOnBackButtonListener(() => {
    return false;
    });

Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Amadeus.js");

function titledEdit(name, label, def) {
  var o = {
    class : "android.widget.LinearLayout"
    ,attributes : {
      setOrientation : android.widget.LinearLayout.HORIZONTAL
      }
    ,content : {}
    };

  o.content["$" + name + "$t"] = {
    class : "android.widget.TextView"
    ,attributes : {
      setText : (label)?label:name
      //,setWidth : android.view.ViewGroup.LayoutParams.WRAP_CONTENT
      }
    }

  o.content["$" + name] = {
    class : "android.widget.EditText"
    ,attributes : {
      setText : (def)?def:"''"
      }
    }

  return o;
  }

var board = (new Lourah.android.Overview({
      ll : {
        class : "android.widget.LinearLayout"
        ,attributes : {
          setOrientation : android.widget.LinearLayout.VERTICAL
          }
        ,content : {
          scroll : {
            class : "android.widget.ScrollView"
            ,content : {
              tv : {
                class : "android.widget.TextView"
                ,attributes: {
                  setTextColor: android.graphics.Color.GREEN
                  ,setBackgroundColor : android.graphics.Color.BLACK
                  } // attributes
                } // tv
              } // content

            } // scroll
          ,teOrigin : titledEdit("origin", "'@Origin'")
          ,teDestination : titledEdit("destination", "'@Destination'")
          ,tePax : titledEdit("pax", "'@NbPax'", "'1'")
          ,teDeparture : titledEdit("departure", "'@DepartureDate'")
          ,bRequest : {
            class : "android.widget.Button"

            ,attributes : {
              setText : "'search flights'"
              } // attributes

            } // request

          ,bTest : {
            class : "android.widget.Button"

            ,attributes : {
              setText : "'test data'"
              } // attributes

            } // bTest

          //,title : titledEdit("'title'")
          } // content
        } // ll
      })).$();



Activity.setContentView(board.ll);

function log(text) {
  Activity.runOnUiThread(new java.lang.Runnable({
        run: () => board.tv.setText(board.tv.getText() + "\n" + text)
        }));
  }

var aID = new Lourah.gds.Amadeus.Id({
  activity:Activity
  , user: "your.email@mail.xx"
  , appli: "Your appli"
  , key:"A key"
  , secret:"The secret See amadeus documentation"
  , authorizationServer:"https://test.api.amadeus.com/v1/security/oauth2/token"
  , endpoint:"https://test.api.amadeus.com/v2"
  , logger:log
    }
  );

var amd = new Lourah.gds.Amadeus(aID);

board.bRequest.setOnClickListener(function(view) {
    try {
      var r = {
        originLocationCode : "" + board.$origin.getText()
        ,destinationLocationCode : "" + board.$destination.getText()
        ,departureDate : "" + board.$departure.getText()
        ,adults : "" + board.$pax.getText()
        };

      log("request::" + r.origin);

      amd.shopping.flight_offer(
        /*
        { origin : r.origin
          , destination : "CGK"
          , departureDate : "2019-10-15"
          , adults : 2 }
        */
        r

        , flightOffersSaver
        , (e) => log("rejected::" + e)
        );

      } catch(e) {
      log("bRequest::catched::" + e + "::" + e.stack);
      }

    });

board.bTest.setOnClickListener(function(view) {
    try {
      var jsonText = Activity.path2String(Lourah.jsFramework.dir() + "/offers.json");
      flightOffersHandler(JSON.parse(jsonText));
      } catch(e) {
      log("bTest::catched::" + e + "::" + e.stack);
      }
    });

function flightOffersSaver(offers) {
  log("flightOfferSaver::offers::" + JSON.stringify(offers));
  var bw = new java.io.BufferedWriter(
    new java.io.FileWriter(
      Lourah.jsFramework.dir()
      + "/offers.json"));
  try {
    bw.write(JSON.stringify(offers));
    log("flightOfferSaver::saved::" + offers.data.length + "offers");
    } catch(e) {
    log("flightOfferSaver::" + e + "::" + e.stack);
    } finally {
    bw.close();
    }
  }

function getHoursMinutes(date) {
  }


function flightOffersHandler(offers) {
  log("flightOfferHzndler::got " + offers.data.length + " offers:");
  for(var iOffer = 0; iOffer < offers.data.length; iOffer++) {
    var offer = offers.data[iOffer];
    log("-Offer Id:" + offer.id);
    for(var iItem = 0; iItem < offer.offerItems.length; iItem++) {
      var item = offer.offerItems[iItem];
      for(var iService = 0; iService < item.services.length; iService++) {
        var service = item.services[iService];
        for(var iSegment = 0; iSegment < service.segments.length; iSegment++) {
          var fs = service.segments[iSegment].flightSegment;
          var start = new Date(fs.departure.at);
          var stop = new Date(fs.arrival.at);
          log(" "
            + fs.departure.iataCode
            + (fs.departure.terminal? "-"+fs.departure.terminal: "")
            + " "
            + ("0" + start.getUTCHours()).slice(-2)
            + ":" + ("0" + start.getUTCMinutes()).slice(-2)
            +"->"
            + fs.arrival.iataCode
            +  (fs.departure.terminal? "-"+fs.departure.terminal: "")
            + " " + ("0" + stop.getUTCHours()).slice(-2)
            + ":" + ("0" + stop.getUTCMinutes()).slice(-2)
            +" " + fs.carrierCode + ("000" + fs.number).slice(-4)
            + " " + fs.duration
            );
          }
        log (". ==> Price:" + item.price.total + " / taxes:" + item.price.totalTaxes);
        //log(JSON.stringify(service));
        }
      }
    }
  }
