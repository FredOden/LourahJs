var t = new java.lang.Thread({
    run: () => {
      try {
        var localHost = java.net.InetAddress.getLocalHost();
        var addr = localHost.getHostAddress();
        console.log("addr::" + localHost);
        var ss = new java.net.ServerSocket(0);
        console.log("ss::<" + ss.getInetAddress().getHostName() + ">");
        } catch(e) {
        console.log("ipAddr::" + e);
        }
      }
    });
t.start();
