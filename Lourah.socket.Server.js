var Lourah = Lourah || {};
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.util.js");
(function () {
    Lourah.socket = Lourah.socket || {};
    if (Lourah.socket.Server) return;

    var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

    var SocketServer = (function () {
        function PublicSocketServer() {
          throw new Error("the constructor is private, please use SocketServer.create(...)");
          }

        var SocketServer = function(inetSocketAddr, backlog) {
          var executor = null;
          var clientHandler = null;

          var serverSocket = -1;

          var self = this;

          this.setExecutor = (e) => {
            executor = e;
            }

          this.setClientHandler = ch => clientHandler = ch;

          this.getExecutor = () => executor;

          var serverProcessor = new ServerProcessor(inetSocketAddr,backlog, executor);

          var threadServer = new java.lang.Thread(
            serverProcessor
            );

          function ClientProcessor(client, processClient) {
            this.run = () => {
              try {
                processClient(
                  client.getInputStream()
                  ,client.getOutputStream()
                  ,client);
                client.close();
                } catch(e) {
                console.log("ClientProcessor::run::" + e);
                }
              }
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


            this.run = () => {
              var clientSocket;
              try {
                serverSocket = new java.net.ServerSocket(inetSocketAddr.getPort(), backlog);
                console.log("ServerProcessor::thread::started");
                while(1) {
                  clientSocket = serverSocket.accept();
                  executor.execute(
                    new ClientProcessor(
                      clientSocket
                      , clientHandler
                      )
                    );
                  }
                }
              catch(e) {
                executor.shutdownNow();
                //stopped = true;
                console.log("ServerProcessor::thread::stopped::" + e + "::" + e.stack);
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


        SocketServer.prototype = PublicSocketServer.prototype;

        PublicSocketServer.create = function(inetSocketAddr, backLog) {
          return new SocketServer(inetSocketAddr, backLog);
          };

        return PublicSocketServer;
        })();

    /**
    Lourah.socket.Server:
    socketPort: port of server
    protocol: an object describing a protocol
    such as http, ftp, telnet or custom
    must have the clientHanler method
    with parameters:
    inputStream: for incoming data
    outputStream: for outgoing data
    socket: (not mandatory) to access
    specific property of communication channel
    executor: defaulted to java.util.concurrent.Executors.newCachedThreadPool()
    see java Executor and Executors
    */
    Lourah.socket.Server = function(socketPort, protocol, executor) {
      var port = socketPort;
      var socketServer = null;
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

      this.getProtocol = () => protocol;

      var openServer = (p) => {
        try {
          return SocketServer.create(
            new java.net.InetSocketAddress(p)
            , 0
            );
          } catch(e) {
          throw "Lourah.socket.Server::openServer::error" + e;
          }
        }

      this.init = () => {
        socketServer = openServer(port);
        socketServer.setExecutor(executor);
        if (!protocol || protocol === {}) {
          throw "Lourah.socket.Server::no protocol specified, cannot start";
          }
        if (!protocol.clientHandler || typeof protocol.clientHandler !== "function") {
          throw "Lourah.socket.Server::protocol.clientHandler not correctly specified, cannot start::" + protocol.clientHandler;
          }
        socketServer.setClientHandler(protocol.clientHandler);
        if (protocol.onServerInit && protocol.onServerInit === "function") {
          protocol.onServerInit(port, executor);
          }
        }

      this.start = () => {
        try {
          this.stop();
          } catch(e) {}
        try {
          socketServer.start();
          } catch(e) {
          console.log("Lourah.socket.Server::start::" + e);
          }
        }

      this.stop = () => {
        socketServer.stop();
        }

      this.init();

      }
    })();
