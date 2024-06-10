
/*
 * (c) 2019 Frederic Oden - fred.oden@gmail.com
 */
var Lourah = Lourah || {};
(function () {
    Lourah.gds = Lourah.gds || {};
    // Check wether Lourah.gds.Amadeus Already loaded
    if (Lourah.gds.Amadeus) return;
    
    Lourah.gds.Amadeus = function(amadeusId) {
        this.getId = () => amadeusId;
        this.shopping = {
            flight_offer : (params, resolve, reject) => callApi(amadeusId, "/shopping/flight-offers", params, resolve, reject)
        };
    };
    
    Lourah.gds.Amadeus.Id = function(id) {
        this.getActivity = () => id.activity;
        this.getUser = () => id.user;
        this.getAppli = () => id.appli;
        this.getKey = () => id.key;
        this.getSecret = () => id.secret;
        this.getEndpoint = () => id.endpoint;
        this.getAuthorizationServer = () => id.authorizationServer;
        this.getLogger = () => id.logger;
        this.bearer = null;
        this.expiration = 0;
    };
    
    function log(id, text) {
        if (id.getLogger()) id.getLogger()(text);
    }
    
    var callApiDirectSync = new Packages.org.mozilla.javascript.Synchronizer(callApiDirect);
    
    function callApi(id, api, params, resolve, reject) {
    	log(id, "callApi::IN");
        var t = Lourah.jsFramework.createThread(() => {
            try {
                callApiDirectSync(id, api, params, resolve);
            } catch(e) {
                reject(e + "::" + e.stack + "::end!");
            }
       });
        t.start();
    }
    
    function callApiDirect(id, api, params, resolve) {
        log(id, "callApiDirect::callApiDirect(id," + api + "," + JSON.stringify(params) + ")");
        log(id, "callApiDirect::<<bearer='" + id.bearer + "'");
        log(id, "callApiDirect::<<expiration='" + id.expiration + "'");
        
        if (id.expiration < java.lang.System.currentTimeMillis()) {
            log(id, "callApiDirect::request authorization");
            
            var auth = JSON.parse(amadeusGetAuthorization(id));
            if (auth.state !== "approved") {
                throw "Amadeus authorization not approved:" + JSON.stringify(auth);
            }
            
            log(id, "auth.expires_in::<" + auth.expires_in + ">");
            log(id, "auth.expired_in millis::<" + (auth.expires_in - 1) * 1000 + ">");

            var now;
            id.expiration = (now = java.lang.System.currentTimeMillis())
                          + (parseInt(auth.expires_in) - 1)*1000;
            id.bearer = auth.access_token;
            log(id, "callApiDirect::>>bearer='" + id.bearer + "'");
            log(id, "callApiDirect::>>expiration=<" + id.expiration + ">::now::<" + now + ">");
        }
        
        log(id, "callApiDirect::do call api now::(" + api +",<" + JSON.stringify(params) + ">)")
        Lourah.jsFramework.createThread(() => { try { resolve(JSON.parse(
                httpGet(id, api, params)
                )); } catch (e) {
                log(id, "ThreadedGet::" + e + "::" + e.stack); }}).start();
    }
    
    function amadeusGetAuthorization(id) {
      return httpPost(id.getAuthorizationServer(), "",
      {
          grant_type : "client_credentials"
         ,client_id : id.getKey()
         ,client_secret : id.getSecret()
      });
    }
    
    function httpPost(endPoint, api, request) {
        var uriEncodedRequest = "";
        for(var field in request) {
            uriEncodedRequest +=  ((uriEncodedRequest)?"&":"") + field + "=" + request[field];
        }
        uriEncodedRequest = encodeURI(uriEncodedRequest);
        var url = new java.net.URL(endPoint + api);
        //var url = new java.net.URL("https://www.google.com");
        var http = java.net.HttpURLConnection(url.openConnection());
        http.setRequestMethod("POST");
        http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        http.setConnectTimeout(5000);
        http.setDoInput(true);
        http.setDoOutput(true);
        try {
          http.connect();
          } catch(e) {
          	throw e + "::" + e.stack + "::[" +http +"]::<" + uriEncodedRequest +">::(" + url.getPath() +  ")";
          }
        
        var os = http.getOutputStream();
        var writer = new java.io.BufferedWriter(
                new java.io.OutputStreamWriter(os, "UTF-8"));
        writer.write(uriEncodedRequest);
        writer.flush();
        writer.close();
        os.close();
        
        var status = http.getResponseCode();
        if (status === java.net.HttpURLConnection.HTTP_OK) {
            return httpResponse(http);
        }
        return null;
    }
    
    function httpResponse(http) {
        var br = new java.io.BufferedReader(
                    new java.io.InputStreamReader(
                        http.getInputStream()));
        var sb = "";
        var line;
        while((line = br.readLine()) !== null) {
            sb += line + "\n";
        }
        br.close();
        return sb;
    }
    
    function httpGet(id, api, request) {
        var uriEncodedRequest = "";
        var endPoint = id.getEndpoint();
        var bearer = id.bearer;
        for(var field in request) {
            uriEncodedRequest +=  ((uriEncodedRequest)?"&":"?") + field + "=" + request[field];
        }
        uriEncodedRequest = encodeURI(uriEncodedRequest);

        var url = new java.net.URL(endPoint + api + uriEncodedRequest);
        log(id, "httpGet::url::<" + url + ">");
        var http = java.net.HttpURLConnection(url.openConnection());
        http.setRequestMethod('GET');
        http.setRequestProperty("Authorization", "Bearer " + bearer);
        http.setConnectTimeout(5000);
        http.connect();
        
        var status = http.getResponseCode();
        log(id, "httpGet::status::" + status);
        var response = httpResponse(http);
        log(id, "httpGet::response::<" + response + ">");
                if (status === java.net.HttpURLConnection.HTTP_OK) {
            return response;
        }
        return null; 
    }
    
})();

