/**
the Http threaded module
*/
var Lourah = Lourah || {};
(function() {
    Lourah.http = Lourah.http || {};
    if (Lourah.http.GET) return;

    function stream2String(stream) {
      var br = new java.io.BufferedReader(
        new java.io.InputStreamReader(
          stream
          )
        );

      var sb = "";
      var line;
      while((line = br.readLine()) !== null) {
        sb += line + "\n";
        }

      br.close();
      return sb;
      }



    Lourah.http.GET = function(sURL, fCallback, properties, fDebug) {
      var t = Lourah.jsFramework.createThread(() => {
          try{
            var url = new java.net.URL(sURL);
            var http = java.net.HttpURLConnection(url.openConnection());
            http.setRequestMethod('GET');
            http.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            if (properties) {
              for(var property in properties) {
                //console.log("property::" + property + "::" + properties[property]);
                http.setRequestProperty(property, properties[property]);
                }
              }
            if (fDebug) {
              var map = http.getReq.uestProperties();
              var keys = map.keySet();
              for (var i = keys.iterator(); i.hasNext();) {
                var key = i.next();
                fDebug("Property::"
                  + key
                  + '::"'
                  + map.get(key)
                  + '"');
                }
              }

            http.setConnectTimeout(5000);
            http.connect();

            if (fDebug) fDebug("url::" + url);

            var status = http.getResponseCode();

            //if (status === java.net.HttpURLConnection.HTTP_OK) {
              var sb = stream2String(
                (status === java.net.HttpURLConnection.HTTP_OK)
                ?http.getInputStream()
                :http.getErrorStream()
                );
              if (fDebug) fDebug(sb);
              Lourah.jsFramework.mainThread(() => fCallback(sb));
              /*} else {
              if (fDebug) fDebug("http::responseCode::" + http.getResponseCode());
              Lourah.jsFramework.mainThread(() => fCallback("{" + http.getResponseMessage() + "}"));
              }*/
            } catch(e) {
            Activity.reportError("HttpURLConnection::" + e + ":" + e.stack);
            }
          }
        );

      t.start();
      }
    })();
