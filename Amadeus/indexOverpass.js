Activity.setTitle(Lourah.jsFramework.name());

Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});
	
Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Overpass.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/http.js");

function titledEdit(name, label) {
	var o = {
	    class : "android.widget.LinearLayout"
	    ,attributes : {
		   setOrientation : android.widget.LinearLayout.HORIZONTAL
		   }
		,content : {}
	    };
	
	o.content["$" + name + "$t"] = {
		class : "android.widget.TextView"
		,attributes : {
			setText : (label)?label:name
			//,setWidth : android.view.ViewGroup.LayoutParams.WRAP_CONTENT
			}
		}
	
	o.content["$" + name] = {
		class : "android.widget.EditText"
		}
	
	return o;
	}
	
var board = (new Lourah.android.Overview({
	  ll : {
		class : "android.widget.LinearLayout"
	   ,attributes : {
		   setOrientation : android.widget.LinearLayout.VERTICAL
		   }
	   ,content : {
		   scroll : {
			  class : "android.widget.ScrollView"
			 ,content : {
				tv : {
				   class : "android.widget.TextView"
				   ,attributes: {
					   setTextColor: android.graphics.Color.GREEN
					   ,setBackgroundColor : android.graphics.Color.BLACK
					   }
					}
				}
				
			}
		   //,title : titledEdit("'title'")
		   }
		}
	})).$();
	


Activity.setContentView(board.ll);

function log(text) {
	board.tv.setText(board.tv.getText() + "\n" + text);
	}

var op = new Lourah.map.Overpass();

/*
var union = [
   new Lourah.map.Overpass.Node()
  ,new Lourah.map.Overpass.Way()
  ,new Lourah.map.Overpass.Rel()
   ];


union.forEach(u => {
   u.addCriteria(new Lourah.map.Overpass.Filter("name='Faleyras'"));
   //u.addCriteria(new Lourah.map.Overpass.Filter("tourism=hotel"));
   u.addCriteria(new Lourah.map.Overpass.Bbox(43.0, -1.0, 45.0, 1.0));
   });

union = union.map(u => new Lourah.map.Overpass.Statement(u));
*/

var city = new Lourah.map.Overpass.Node();
var bbox = new Lourah.map.Overpass.Bbox(43.0, -1.0, 45.0, 1.0);

city.addCriteria("[name='Ondong']");//.addCriteria(bbox);
hotels = new Lourah.map.Overpass.Node();
hotels.addCriteria("(around:10000)[tourism=hotel]");

op.addStatement(new Lourah.map.Overpass.Statement(city));
op.addStatement(new Lourah.map.Overpass.Statement(hotels));



log("op::" + op.getQuery());
log("op::" + op.getHttpRequest());

Lourah.http.GET(op.getHttpRequest(), response => {
	log("response::"+response);
	});



