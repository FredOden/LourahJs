var ipAddress = null;
try {
  for (var en = java.net.NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
    var intf = en.nextElement();
    for (var enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {
      var inetAddress = enumIpAddr.nextElement();
      if (!inetAddress.isLoopbackAddress()) {
        ipAddress = inetAddress.getHostAddress().toString();
        console.log("interface::" + intf.getName() + "ipAddress::" + ipAddress);
        }
      } 
    }
  } catch (ex) {
  console.log("ip::" + ex);
  }
