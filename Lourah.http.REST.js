Lourah = Lourah || {};
(function () {

    Lourah.http = Lourah.http || {};

    if (Lourah.http.REST) return;

    Lourah.http.REST = function (endPoint, authorizationHandler) {
      apis = {};
      this.getEndPoint = () => endPoint;
      this.getAuthorizationHandler = () => authorizationHandler;
      this.addApi = (api, method, resolve, reject, defaultProperties) => {
        apis[api]= new Api(this, api, method);
        }
      this.getApi = () => apis[api];
      this.getApis = () => apis;
      }
    
    function Api(rest, api, method, defaultProperties) {
      this.getApi = () => api;
      this.getMethod = () => method;
      this.call = (parameters, properties) => {
        method.setRequest(rest, api, parameters);
        if (defaultProperties) method.setProperties(defaultProperties);
        if (properties) method.setProperties(properties);
        method.authentify(rest);
        method.do();
        }
      }

    Lourah.http.REST.Method = () => {
      var uriEncodedRequest = "";
      for(var field in request) {
        uriEncodedRequest +=  ((uriEncodedRequest)?"&":"") + field + "=" + request[field];
        }
      uriEncodedRequest = encodeURI(uriEncodedRequest);
      var url = new java.net.URL(endPoint + api);
      //var url = new java.net.URL("https://www.google.com");
      this.do = () => {
        var http = java.net.HttpURLConnection(url.openConnection());
        http.setRequestMethod("POST");
        //http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        for(var property in properties) {
          http.setRequestProperty(
            property,
            properties[property]
            );
          }
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
        var response = stream2String(http.getInputStream());
        var reject = stream2String(http.getErrorStream());
         }
      this.isOk = () => status === java.net.HttpURLConnection.HTTP_OK;
      this.getHttpRespondCode = () => status;
      this.getHttpUrlConnection = () => http;
      this.getResponse = () => response;
      this.getReject = () => reject;
      }

    function stream2String(stream) {
      try {
        var br = new java.io.BufferedReader(
          new java.io.InputStreamReader(
            stream));
        var sb = "";
        var line;
        while((line = br.readLine()) !== null) {
          sb += line + "\n";
          }
        br.close();
        return sb;
        } catch (e) {
        return "";
        }
      }

    Lourah.http.REST.get = (endPoint, api, request, bearer) => {
      var uriEncodedRequest = "";
      for(var field in request) {
        uriEncodedRequest +=  ((uriEncodedRequest)?"&":"?") + field + "=" + request[field];
        }
      uriEncodedRequest = encodeURI(uriEncodedRequest);

      var url = new java.net.URL(endPoint + api + uriEncodedRequest);
      var http = java.net.HttpURLConnection(url.openConnection());
      http.setRequestMethod('GET');
      http.setRequestProperty("Authorization", "Bearer " + bearer);
      http.setConnectTimeout(5000);
      http.connect();

      var status = http.getResponseCode();
      if (status === java.net.HttpURLConnection.HTTP_OK) {
        return stream2string(http.getInputStream());
        }
      return null;
      }

    })();

var rest = new Lourah.http.REST("https://api.rest.demo");
