/*
var obj {
  key1 : val1
  ,key2 : val2
  ...
  data {
    any json object
  }
}


*/

var Lourah = Lourah || {};

(function() {
if (Lourah.db) return;

function serialize(o) {
	return = JSON.stringify(o);
	}

function deserialize(buffer) {
	return JSON.parse(o);
	}
	

function db(name, root) {
	var tables = [];
	this.getRoot = () => root;
	this.getName = () => name;
	}

function Table(db, name, keys) {
  name = name;
  keys = keys;

  this.create = () => {
  	if (db.tables[name]) {
  	   throw Table.Exception("table already exists");
  	   }
  	}

  this.insert = (obj) => {
  	var iObj = { keys: {}, data : obj };
  	for(k in keys) {
  	  if (!obj(k)) {
  	      throw new Lourah.db.Exception("Table('" + name +"," + keys + '")::insert:: missing key for::" + JSON.stringify(obj));
  	  }
        iObj.keys[k] = obj[k];
        var s = serialize(iObj);
  	}
      
      
  }
}

Db.Exception = function(message) {
	this.getMessage = () => message;
	}

Table.Exception = function(message) {
	
	}

})();
