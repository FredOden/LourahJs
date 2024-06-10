var Lourah = Lourah || {};
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.util.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.socket.Server.js");
(function () {
    Lourah.http = Lourah.http || {};
    if (Lourah.http.Protocol) return;

    var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

    Lourah.http.Protocol = function(pathHandlers) {
      function HttpExchange(method
        ,uri
        ,protocol
        ,requestMessage
        ,responseMessage) {
        this.getMethod = () => method;
        this.getUri = () => uri;
        this.getProtocol = () => protocol;
        this.getRequestMessage = () => requestMessage;
        this.getResponseMessage = () => responseMessage;
        this.toString = () => {
          var s = "Exchange::{" + [
              method
              ,uri
              ,protocol
              ,requestMessage
              ,responseMessage
              ]
            + "}::Exchange";
          return s;
          }
        }
      
      var pathSorted = Object.keys(pathHandlers).sort((a, b) => b.length - a.length);

      function uri2js(juri) {
        var uri = "" + juri;
        var iQuery = uri.indexOf('?');
        if (iQuery === -1) {
          return { file: decodeURI(uri) + "/", query: {} };
          }
        var ret = {};
        ret.file = decodeURI(uri.substring(0, iQuery)) + "/";
        ret.query = {};
        var query = uri.substring(iQuery + 1);
        var params = query.split('&');
        for(var i = 0; i < params.length; i++) {
          param = params[i].split('=');
          ret.query[decodeURI(param[0])] = decodeURI(param[1]);
          }
        return ret;
        }


      var notFoundHandler = (exchange) => {
        var response = exchange.getResponseMessage();
        response.setResponseCode(404);
        response.getHeaders().set("Content-Type", "text/html");
        response.getHeaders().set("Charset", "UTF-8");
        response.setBody(
          "<html><header>"
          + "<title>" + exchange.getUri().file + " not found</title>"
          + "<style>div{text-align:center;color:#3f0000;font-size:2em;}</style>"
          + "</header><body><div>"
          + exchange.getUri().file + "<br>"
          + "notFound"
          + "</div></body></html>"
          )
        response.send();
        }

      this.getNotFoundHandler = () => notFoundHandler;
      this.setNotFoundHandler = (handler) => notFoundHandler = handler;

      this.clientHandler = function (inputStream, outputStream) {
        //console.log("processClient");
        try {
          var responseMessage = Lourah.http.util.buildResponse(outputStream);
          var requestMessage = Lourah.http.util.buildRequest(inputStream);

          requestMessage.load();

          var request = requestMessage.getCommand();
          if (! request) {
            return;
            }
          var tokens = java.util.StringTokenizer(request);
          var method = tokens.nextToken();
          var uri = uri2js(tokens.nextToken());
          var protocol = tokens.nextToken();

          var foundHandler = null
          for (var i = 0; i < pathSorted.length; i++) {
            if (uri.file.search(pathSorted[i] + "/") === 0) {
              foundHandler = pathHandlers[pathSorted[i]];
              break;
              }
            }


          var exchange = new HttpExchange(
            method
            ,uri
            ,protocol
            ,requestMessage
            ,responseMessage);

          //console.log("foundHandler::" + foundHandler);

          if (!foundHandler) {

            notFoundHandler(exchange);
            } else {
            foundHandler(exchange);
            }
          } catch(e) {
          console.log("Lourah.http.Protocol::clientHandler::error::" + e + "::" + e.stack);
          }
        }
      }
    })();
