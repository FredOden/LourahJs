/**
Overpass api encapsulation
*/

var Lourah = Lourah || {};
(function () {
	Lourah.map = Lourah.map || {};
	if (Lourah.map.Overpass) return;
	
	
	Lourah.map.Overpass = function() {
		var url = "https://overpass.kumi.systems/api/interpreter";
		
		
		var settings = {
			 out : "json"
			,timeout : 180
			,maxsize : 536870912
			}
		var out = "body";
		
		var statements = [];
		
		this.setUrl = u => url = u;
		this.getUrl = () => url;
		//@@ manage global bbox
		//this.setBbox = (s, w, n, e) => bbox = "("+s+","+w+","+n+","+e+")";
        //this.getBbox = () => bbox;
		this.getOut = () => out;
		this.setOut = (kind) => out = kind;
		
		this.addStatement = (statement) => {
			statements.push(statement);
			};
			
		this.getQuery = () => {
			//var ret = url + "?data=";
			var ret = "";
			for(setting in settings) {
				ret += "[" + setting + ":" + settings[setting] + "]"
				}
			ret += ";";
			
			statements.forEach(
			   statement => ret += statement.toString()
			   )
			ret += "out " + out +";";
			return ret;
			};
			
		  this.getHttpRequest = () => {
			var ret = url + "?data=";
			ret += encodeURI(this.getQuery());
			return ret;
			}
			
	    }
	
	Lourah.map.Overpass.Bbox = function(s, w, n, e) {
		var bbox = [s, w, n, e];
		this.toString = () => "(" + bbox.join(',') + ")";
		};
		
	
		
	var Item = function(t) {
		var type = t;
		var criterias = [];
		this.addCriteria = (criteria) => {
           criterias.push(criteria);
           return this;
           };
		this.toString = () => {
			var ret = t;
			criterias.forEach((criteria) => ret += criteria.toString());
			return ret;
			}
		};
		
	Lourah.map.Overpass.Node = function() {
		return new Item("node");
		};
	Lourah.map.Overpass.Way = function() {
		return new Item("way");
		};
	Lourah.map.Overpass.Rel = function() {
		return new Item("rel");
		};
		
	Lourah.map.Overpass.Filter = function(sFilter) {
		var filter = sFilter;
		this.toString = () => "[" + filter + "]";
		}
		
	Lourah.map.Overpass.Statement = function(statement, resultSet) {
		//var type = "statement";
		this.toString = () => {
			var s = statement.toString();
			if (resultSet !== undefined) {
				s += "->." + resultSet;
				}
		    s += ";";
		    return s;
			}
		}
		
	Lourah.map.Overpass.Union = function(union) {
		this.toString = () => {
			var s = "(" 
			      + union.join("")
			      + ")";
			return s;
			}
		}

})();
