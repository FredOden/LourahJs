/**
Ftp demo
*/
Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.socket.Server.js');
Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');

(function () {
    Lourah.ftp = Lourah.ftp || {};
    if (Lourah.ftp.Protocol) return;

    Lourah.ftp.Protocol = function() {

      function exec(command) {
        var process = java.lang.Runtime.getRuntime().exec(command);
        }

      function byteCopy(inputStream, outputStream, byteBufferSize) {
        var c;
        var count = 0;
        //var dos = ouputStream;//new java.net.DataOutputStream(outputStream);
        //var dis = inputStream;//-new java.net.DataInputStream(inputStream);
        var size = Math.min(1020*1024, byteBufferSize?byteBufferSize:4096);
        var ba = buildByteArray(size);

        while((c = inputStream.read(ba)) !== -1) {
          console.log("byteCopy::" + count + "::read::" + c + " bytes");
          outputStream.write(ba, 0, c);
          outputStream.flush();
          console.log("byteCopy::" + count + "::wrote::" + c + " bytes");
          count++;
          }
        //outputStream.flush();
        }

      
      function buildJavaTypeArray(javaType, length) {
        var jta = java.nio[javaType + "Buffer"].allocate(length);
        return jta.array();
        }

      function buildByteArray(size) {

        /*
        var bb = java.nio.ByteBuffer.allocate(
          size
          );

        return bb.array();
        /**/
        return buildJavaTypeArray("Byte", size);
        }


      function pathCompiler(path) {
        
        var pFile = new java.io.File(path);
        if (!pFile.exists()) {
          console.log("not exists::" + path);
          throw path + " does not exist";
          }
     
        folders = path.split("/");
        
        if (!pFile.isDirectory()) {
          console.log("folders::POP");
          folders.pop();
          throw path + " is not a diretcory";
          }
        
        console.log("folders::[" + folders + "]")
        for(var i = 0; i < folders.length; i++) {
          if (folders[i] === "..") {
            if (i > 0) folders[i - 1] = null;
            folders[i] = null;
            }
          if (folders[i] === ".") {
            folders[i] = null;
            }
          }
        var compiled = "/";
        for(var i = 0; i < folders.length; i++) {
          if (folders[i]) {
            compiled += (i === 0?"":"/") + folders[i];
            }
          }

        var f = new java.io.File(compiled);

        if (!f.exists()) throw compiled + " does not exist";
        if (!f.isDirectory()) {
          throw compiled + " is not a directory"
          }

        return compiled;
        }

      function PeerSocket(active, address, port) {
        this.getAddress = () => address;
        this.getPort = () => port;
        this.isActive = () => active;
        }

      this.onServerInit = function() {
        console.log("onServerInit");
        }


      var ipAddress = "ip not found";
      var interfaces = java.net.NetworkInterface.getNetworkInterfaces();
      while(interfaces.hasMoreElements()) {
        var iface = interfaces.nextElement();
        if (iface.isLoopback() || !iface.isUp()) {
          continue;
          }

        var addresses = iface.getInetAddresses();
        while(addresses.hasMoreElements()) {
          var address = addresses.nextElement();
          console.log("" + iface.getDisplayName() + " " + address.getHostAddress());
          }

        }
      /**/



      this.clientHandler = function(inputStream, outputStream, clientSocket) {
        try {
          var cwd = Lourah.jsFramework.root(); //java.lang.System.getProperty("user.dir");
          console.log("cwd::" + cwd);
          var ipAddr = clientSocket.getLocalAddress().getHostAddress();

          var pw = new java.io.PrintWriter(
            outputStream
            );
          var ibr = new java.io.BufferedReader(
            new java.io.InputStreamReader(
              inputStream
              )
            );

          var active = true;
          var clientPeer = {};
          console.log("client connected");
          pw.print("220-demo.ftp.js on Lourah.ftp.Protocol\r\n");
          pw.print("220 (c) 2020, Lourah.\r\n");
          pw.flush();
          var cmd;
          do {
            cmd = ibr.readLine();
            console.log("cmd::<" + cmd + ">");
            if(cmd) {
              var tokens = ("" + cmd).split(" ");
              console.log("tokens::[" + tokens + "]");
              switch(tokens[0].toUpperCase()) {
                case "USER": {
                  pw.println("331 " + tokens[1] + " OK\r");
                  } break;

                case "PASS": {
                  pw.println("200 " + tokens[1] + " OK\r");
                  } break;

                case "PORT": {
                  active = true;
                  ports = tokens[1].split(",").map(p => Number(p));
                  clientPeer.port = ports[4]*256 + ports[5];
                  clientPeer.address = ports.slice(0, 4.).join(".");
                  pw.println("200 Ok Port:" + clientPeer.port + "@:" + clientPeer.address + "\r");
                  } break;

                case "PASV": {
                  try {
                    clientPeer.serverSocket = new java.net.ServerSocket(0);
                    clientPeer.port = clientPeer.serverSocket.getLocalPort();
                    clientPeer.address = ipAddr; //clientPeer.serverSocket.getLocalSocketAddress().getAddress().getHostAddress();
                    //console.log("hostAddress::<" + clientPeer.address + ">");
                    //console.log("local ip::<" + java.net.InetAddress.getLocalHost() + ">");
                    console.log("Passive on::" + clientPeer.address + ":" + clientPeer.port);
                    var ipPortArray = []; //clientPeer.address.split(",");
                    /*
                    for (var i = 0; i < 4; i++) {
                      ipPortArray[i] = clientPeer.address[i];
                      }
                    /**/
                    ipPortArray = ("" + clientPeer.address).split(".");
                    ipPortArray.push(
                      ((clientPeer.port|0) & 0x0000ff00) >> 8
                      , (clientPeer.port|0) & 0x000000ff
                      )
                    console.log("   Reply:" + ipPortArray);
                    active = false;
                    pw.println("227 Entering Passive Mode (" + ipPortArray + ")\r");
                    } catch(e) {
                    pw.println("450 " + e + "\r");
                    }
                  } break;

                case "LIST": {
                  try {
                    var files = [];
                    var socket;
                    pw.println("150 Opening connection\r");
                    if (active) {
                      socket = new java.net.Socket(
                        clientPeer.address, clientPeer.port
                        );
                      } else {
                      socket = clientPeer.serverSocket.accept();
                      }
                    
                    var process = java.lang.Runtime.getRuntime().exec(
                       ["ls", "-la", cwd]
                      );
                                         
                    byteCopy(
                      process.getInputStream()
                      ,socket.getOutputStream()
                      ); 

                    process.getInputStream().close();
                    socket.close();
                    if (active) clientPeer = {};
                    pw.println("200 Listing completed\r");
                    } catch(e) {
                    pw.println("450 " + e + "\r");
                    }
                  } break;

                case "RETR": {
                  try {
                    var fin;
                    var socket;
                    var f = new java.io.File(cwd +"/" + tokens[1]);
                    if (!f.exists()) throw "" + f.getName() + " does not exist";
                    if (f.isDirectory()) throw "" + f.getName() + " is a directory";

                    pw.println("150 Opening connection\r");
                    
                    if (active) {
            
                      socket = new java.net.Socket(
                        clientPeer.address, clientPeer.port
                        );
                      } else {
                      socket = clientPeer.serverSocket.accept();
                      }

                    console.log("retreive::" + f.getPath());
                    fin = new java.io.FileInputStream(f);
                    byteCopy(
                      fin
                      ,socket.getOutputStream()
                      ,f.length()
                      );
                    
                    fin.close(); fin = null;
                    socket.close(); socket = null;
                    //clientPeer = {};
                    pw.println("200 receive completed\r");
                    } catch(e) {
                    pw.println("450 " + e + "\r");
                    } finally {
                    if (fin) fin.close();
                    if (socket) socket.close();
                    if (active) clientPeer = {};
                    }
                  } break;

                case "CWD": {


                  try {
                    var dirExp = ("" + cmd).substr(4).trim();
                    cwd = pathCompiler(
                      dirExp.charAt(0) === "/" ? dirExp:cwd + "/" + dirExp
                      );
                    pw.println(console.log("250 " + cwd + " is new working directory\r"));
                    } catch(e) {
                    pw.println("450 " + e + "\r");
                    }
                  } break;

                case "PWD": {
                  pw.println("250 " + cwd + "\r");
                  } break;

                case "TYPE": {
                  pw.println("200 type is " + tokens[1] + "\r");
                  } break;

                case "SYST": {
                  pw.println("215 UNIX Type: L8\r");
                  } break;

                case "SIZE": {
                  try {
                    var f = new java.io.File(tokens[1]);
                    pw.println("213 " + f.length() +"\r");
                    } catch (e) {
                    pw.println("550 " + e + "\r");
                    }
                  } break;

                case "QUIT": {
                  pw.println("200 bye bye\r");
                  } break;

                default: {
                  pw.println("502 <" + cmd + "> Not implemented, server in construction\r.");

                  }
                }
              pw.flush();
              }
            } while(cmd);
          console.log("client disconnected");
          } catch(e) {
          console.log("Lourah.ftp.Protocol::clientHandler::" + e + e.stack);
          }
        }
      }

    })();

var $screen = Lourah.android.Overview.buildFromSugar({
    $top: {
      class: android.widget.LinearLayout
      ,setOrientation: android.widget.LinearLayout.VERTICAL
      ,$bStartStop: {
        class: android.widget.Button
        ,setText: "'Start'"
        ,setOnClickListener: {
          onClick: startStop
          }
        }
      ,$sv: {
        class: android.widget.ScrollView
        ,$console: {
          class: android.widget.TextView
          , setBackgroundColor: android.graphics.Color.BLACK
          , setTextColor: android.graphics.Color.GREEN
          , setText: "'<console>'"
          }
        }
      }
    });


console.log = (t) => {
  var tNow = (new Date()).toLocaleTimeString().slice(0, 8);
  Lourah.jsFramework.uiThread(
    () => {
      $screen.$console.setText(
        $screen.$console.getText()
        + "\n"
        + tNow
        + "|"
        + t
        );
      }
    );
  return t;
  }


//try {
  var ftp = new Lourah.ftp.Protocol();
  var started = false;

  var ftpServer = new Lourah.socket.Server(
    2121
    , ftp
    );

  function startStop(v) {
    try {
      if (started) {
        v.setText("Stop");
        console.log("stopping server...");
        ftpServer.stop();
        started = false;
        } else {
        v.setText("Restart");
        console.log("starting server...");
        ftpServer.start();
        started = true;
        }
      } catch(e) {
      console.log("startStop::" + e);
      }
    }

  Activity. setTitle("Ftp Demo by Lourah");
  Activity. setContentView($screen.$top);

  Lourah.jsFramework.setOnBackButtonListener(() => {
      ftpServer.stop();
      return false;
      });

  //  } catch(e) {
  //  Activity.reportError("demo.ftp.js::" + e);
  //  }
