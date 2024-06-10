Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");


Lourah.jsFramework.setOnBackButtonListener(() => {
    return false;
    });


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
              tLocation : {
                class : "android.widget.TextView"
                ,attributes: {
                  setTextColor: android.graphics.Color.GREEN
                  ,setBackgroundColor : android.graphics.Color.BLACK
                  } // attributes
                } // tv

              } // scroll.content
            } // scroll
          ,tStatus : {
            class : "android.widget.TextView"
            ,attributes: {
              setTextColor: android.graphics.Color.BLUE
              ,setBackgroundColor : android.graphics.Color.GRAY
              } // attributes
            } // tStatus

          } // ll.content
        } // ll
      })).$();


Activity.setTitle("location by Lourah");

Activity.setContentView(board.ll);

var locations = [];
var i = 0;
var HERE = .1;
var skip = 0;

let $N = (x, precision) => Number.parseFloat(x).toFixed(precision)

var displayLocation = (location, extra) => {
  let when = java.lang.System.currentTimeMillis();
  locations.push({
      when: when
      ,location: location
      });
  
  var [distance, speed, duration] = [0, 0, 0];
  if (i) {
    distance = locations[i - 1].location.distanceTo(location);
    duration = (when - locations[i - 1].when)/1000;
    speed = 36*distance/duration;
    }

  board.tLocation.append(i + "::"
    + $N(location.getLatitude(), 5)
    + ","
    + $N(location.getLongitude(),5)
    + "::"
    + location.getProvider()
    + "::"
    + $N(distance, 2)
    +" m::"
    + $N(speed, 2)
    + " km/h("
    + $N(location.getSpeed(), 2)
    + " km/h)" 
    //+ " extra::" + extra
    + '\n');
  i++;
  }

var locate = location => {
  try {
    /*
    console.log("location::" + location);
    if (i !== -1 && locations[i].distanceTo(location) < HERE ) {
      board.tStatus.setText(skip++ + "::skip::" + i);
      return;
      }
    */
    if (("" + location.getClass().getCanonicalName()) === "java.util.ArrayList") {
      for(var l = 0; l < location.size(); l++) {
        //console.log("l::" + l);
        displayLocation(location.get(l), "["+l+"]");
        }
      }
    else {
      displayLocation(location);
      }
    } catch(e) {
    board.tLocation.setText("catch::" +i + "::" + e + "::<" + location.getClass().getCanonicalName() + ">::" + e.stack);
    //locate(location.get(0));
    }
  }

let locationListener = new android.location.LocationListener({
    onLocationChanged:location => locate(location)
    ,onProviderDisabled: provider => {
      board.tStatus.setText("providerDisabled::" + provider);
      }
    ,onProviderEnabled: provider => {
      board.tStatus.setText("providerEnabled::" + provider);
      }
    ,onStatusChanged : (provider, status, extras) => {
      board.tStatus.setText("::statusChanged::" + provider + "::"+ status);
      }
    ,onBind: intent => null
    }
  );

var locationManager = Activity.getSystemService(android.content.Context.LOCATION_SERVICE);
var isEnabled = {
  gps: locationManager.isProviderEnabled(
    android.location.LocationManager.GPS_PROVIDER
    )
  ,network: isNetworkEnabled = locationManager.isProviderEnabled(
    android.location.LocationManager.NETWORK_PROVIDER
    )
  }


board.tStatus.setText("isEnabled::" + JSON.stringify(isEnabled));

if (isEnabled.gps) {
  locationManager.requestLocationUpdates(
    android.location.LocationManager.GPS_PROVIDER,
    5000,
    1,
    locationListener);
  }

if (isEnabled.network) {
  locationManager.requestLocationUpdates(
    android.location.LocationManager.NETWORK_PROVIDER,
    5000,
    1,
    locationListener);
  }
