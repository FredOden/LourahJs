var Lourah = Lourah || {};
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.util.js");
(function () {
    Lourah.http = Lourah.http || {};
    if (Lourah.http.Server) return;

    var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

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

    var HttpServer = (function () {
        function PublicHttpServer() {
          throw new Error("the constructor is private, please use HttpServer.create(...)");
          }

        var HttpServer = function(inetSocketAddr, backlog) {
          var executor = null;

          var serverSocket = -1;
          var pathHandlers;
          var pathSorted;
          var self = this;
          this.createContext = path => {
            console.log("createContext::" + path);
            }
          this.setExecutor = (e) => {
            executor = e;
            }
          this.getExecutor = () => executor;

          this.setPathHandlers = new Synchronizer(ph => {
              pathHandlers = ph;
              pathSorted = Object.keys(ph).sort((a, b) => b.length - a.length);
              });


          var serverProcessor = new ServerProcessor(inetSocketAddr,backlog, executor);

          var threadServer = new java.lang.Thread(
            serverProcessor
            );


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

          function ClientProcessor(client) {
            this.run = () => processClient(client);
            }

          function ServerProcessor() {
            var stopped = true;
            var serverSocket;

            this.setStopped = new Synchronizer(
              (stop) => {stopped = stop
                if (stop && serverSocket) {
                  try {
                    } catch(e) {
                    console.log("ServerProcessor::setStopped::" + e + "::" + e.stack);
                    }
                  }
                }
              );

            this.getStopped = new Synchronizer(
              () => stopped
              );

/*
            this.run_0 = () => {
              var attempt = "none";

              try {
                attempt = "create serverSocket";
                serverSocket = new java.net.ServerSocket(inetSocketAddr.getPort(), backlog);
                console.log("started");
                while(!stopped) {
                  attempt = "accept clientSocket";
                  //console.log("wait for accept");
                  var clientSocket = serverSocket.accept();
                  //console.log("accepted");

                  if (java.lang.Thread.currentThread().isInterrupted()) {
                    serverSocket.close();
                    stopped = true;
                    console.log("threadServer::!!!INTERRUPTED!!!");
                    }

                  executor.execute(
                    new ClientProcessor(clientSocket)
                    );
                  }
                attempt = "closing serverSocket";
                serverSocket.close();
                attempt = "shutdown executor";
                executor.shutdownNow();
                } catch(e) {
                console.log("HttpServer::threadServer::error::" + attempt + "::" + e + "::" + e.stack);
                try {
                  serverSocket.close();
                  } catch (ee) {
                  console.log("HttpServer::serverSocketClose::" + ee + "::" + ee.stack);
                  }
                stopped = true;
                }
              }
*/
            
            this.run = () => {
              var clientSocket;
              try {
                serverSocket = new java.net.ServerSocket(inetSocketAddr.getPort(), backlog);
                console.log("new run started");
                while(1) {
                  clientSocket = serverSocket.accept();
                  executor.execute(
                    new ClientProcessor(
                      clientSocket
                      )
                    );
                  }
                }
              catch(e) {
                executor.shutdownNow();
                //stopped = true;
                console.log("threadServer::stopped::" + e + "::" + e.stack);
                try {
                  serverSocket.close();
                  } catch(e) {}
                serverSocket = null;
                }
              }
            
            this.terminate = () => {
              if (serverSocket) {
                serverSocket.close();
                }
              }
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

          function processClient(client) {
            //console.log("processClient");
            try {
              var responseMessage = Lourah.http.util.buildResponse(client.getOutputStream());
              var requestMessage = Lourah.http.util.buildRequest(client.getInputStream());

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
              client.close();
              } catch(e) {
              console.log("processClient::error::" + e + "::" + e.stack);
              }
            }

          this.stop = () => {
            serverProcessor.setStopped(true);
            //threadServer.interrupt();
            try {
              serverProcessor.terminate();
              } catch(e) {
              console.log("threadServer::ServerProcessor::stop::" + e + "::" + e.stack);
              }
            }

          this.start = () => {
            if (!serverProcessor.getStopped()) {
              console.log("HttpServer::start::error::Cannot start HttpServer: already running");
              return;
              }
            serverProcessor.setStopped(false);
            threadServer.start();
            }
          };


        HttpServer.prototype = PublicHttpServer.prototype;

        PublicHttpServer.create = function(inetSocketAddr, backLog) {
          return new HttpServer(inetSocketAddr, backLog);
          };

        return PublicHttpServer;
        })();



    Lourah.http.Server = function(socketPort, executor, pathHandlers) {
      var port = socketPort;
      var stopped = true;
      var httpServer = null;
      if (!executor) {
        executor =
        java.util.concurrent.Executors.newCachedThreadPool();
        }

      // DONT USE ONLY FOR SSL
      // HERE AS AN EXAMPLE
      //var keyManager = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());

      this.setPort = (sPort) => port = sPort;
      this.getPort = () => port;

      this.setExecutor = (ex) => executor = ex;
      this.getExecutor = () => executor;
      
      this.setPathHandlers = (ph) => {
        pathHandlers = ph;
        httpServer.setPathHandlers(pathHandlers);
        }
      
      this.updatePathHandlers = (ph) => {
        pathHandlers = pathHandlers || {};
        for(k in ph) {
          pathHandlers[k] = ph[k];
          }
        httpServer.setPathHandlers(pathHandlers);
        }
      
      this.getPathHandlers = () => pathHandlers;

      var openServer = (p) => {
        try {
          return HttpServer.create(
            new java.net.InetSocketAddress(p)
            , 0
            );
          } catch(e) {
          throw "Lourah.http.Server::openServer::error" + e;
          }
        }

      //var pathHandlers = {};

      /*
      this.setPathHandler = (path, h) => {
        pathHandlers[path] = h;
        }
      */

      this.init = () => {
        httpServer = openServer(port);
        //httpServer.setPathHandlers(pathHandlers);
        httpServer.setExecutor(executor);
        }

      this.start = () => {
        try {
          this.stop();
          } catch(e) {}
        try {
          stopped = false;
          if (!pathHandlers || pathHandlers === {}) {
            throw "no pathHandlers specified, cannot start";
            }
          httpServer.start();
          } catch(e) {
          console.log("Lourah.http.Server::start::" + e);
          }
        }

      this.stop = () => {
        httpServer.stop();
        }
      
      
      
      this.init();
     
      }
    })();
