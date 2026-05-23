var Toast = Packages.android.widget.Toast;
var lourahJsFrameworkDir = "/LourahJsFramework";
var demoJsDir = lourahJsFrameworkDir + "/DemoJs/";
var viewsName = demoJsDir + "overview.json";


function trace(msg) {
	Activity.runOnUiThread(new java.lang.Runnable({
	  run: () => Toast.makeText(Activity, JSON.stringify(msg), Toast.LENGTH_LONG).show()
	  }));
	}
