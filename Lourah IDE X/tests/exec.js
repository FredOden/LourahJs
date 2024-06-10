var t = java.lang.System.currentTimeMillis();
var d = new java.util.Date(t);
var formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var stamp = formatter.format(d) + "." + ("00" + (t%1000)).slice(-3);
console.log("stamp::" + stamp);
//var stamp = d.toString();// d.toISOString().replace("T"," ").replace("Z", "");
android.util.Log.d("LOURAH.LOGGER", "Here I am the debug::" + stamp);
android.util.Log.i("LOURAH.LOGGER", "WHAT");

var exec = command => java.lang.Runtime.getRuntime().exec(command);
var process = exec(
  [
    "logcat"
    ,"-T"
    ,"" + stamp + ""
    ,"-d"
    ,"-s"
    ,"-v", "long"
    ,"LOURAH.LOGGER:*"]
  );
var s = Activity.inputStream2String(
  process.getInputStream()
  );
var e = Activity.inputStream2String(
  process.getErrorStream()
  );
console.log("s::" + s);
console.log("e::" + e);