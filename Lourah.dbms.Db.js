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
Lourah.dbms = Lourah.dbms || {};
if (Lourah.dbms.Db) return;

var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

function synchronize(f) {
	return new Synchronizer(f);
	}

function serialize(o) {
	return = JSON.stringify(o);
	}

function deserialize(buffer) {
	return JSON.parse(buffer);
	}
	
function writeFile(file, buffer) {
	var out = new java.io.BufferedWriter(
                new java.io.OutputStreamWriter(
                 new java.io.FileOutputStream(file)
                , "UTF-8"
                )
              );
    try {
       out.write(buffer);
       } finally {
       out.close();
       }
	}

function readFile(file) {
	var in = new java.io.BufferedReader(
                new java.io.OutputStreamReader(
                 new java.io.FileInputStream(file)
                , "UTF-8"
                )
              );
    var ret = "";
    try {
       var l;
       while(l = in.readLine()) {
       	ret += (l + "\n");
       	}
       } finally {
       in.close();
       return ret;
       }
	}



function Db(name, root) {
	var self = {
		root: root
		,name: name
		,tables: []
		,master : root + "/" + name
		,stamp : "not stamped"
		};
		
	this.getSelf = () => self;
	
	this.getName = () => self.name;
	this.getMasterDb = () => self.master + ".db";
	this.getTableDir = () => self.root + "/tables";
	
	this.toString = () => {
		return "Db(" + name + "," + root + ")::";
		};
		
	
	var save = () => {
		var ser = serialize(self);
		self.stamp = "saved:" + new Date();
		var fMaster = new java.io.File(this.getMasterDb());
		writeFile(fMaster, ser);
		};
	
	var load = () => {
		var ser;
		var fMaster = new java.io.File(this.getMasterDb());
		ser = readFile(fMaster);
		return deserialize(ser);
		};
		
	this.create = synchronize (() => {
		var dRoot = new java.io.File(root);
		if (! dRoot.exists()) {
			dRoot.mkdir();
			var dTables = new java.io.File(this.getTablesDir());
			dTables.mkdir();
			save();
			}
		});
		
	this.open = synchronize(() => {
		this.create();
		load();
		});
		
	this.addTable = synchronize(function(table) {
		for(var i = 0; i < self.tables.length; i++) {
			if (self.tables[i] === table.getSelf().name) {
				throw new Db.Exception(this, "addTable::table '" + table.getSelf().name + "' already exists"
				}
			}
		self.tables.push(table.getSelf().name);
		save();
		});
	}

function Table(db, name, serialized) {
  var self = {
  	name: name
      ,files: {
      	ser : db.getTablesDir() + "/" + name + ".def"
          ,idx : db.getTablesDir() + "/" + name + ".idx"
          ,key : db.getTablesDir() + "/" + name + ".key"
          ,dat : db.getTablesDir() + "/" + name + ".dat"
      	}
      ,keys: []
      ,lastId : -1
      ,db: db
      ,stamp: "not stamped"
  	};
  
  if (serialized) {
  	self = serialized;
  	}
  
 this.getSelf = () => self;

 var writeRecord = (obj) => {
 	var buffer = serialize(obj);
 	}

 var readRecord = (at) => {
 	}
 
 var deleteRecord = (at) => {
 	}

 this.create = synchronize(function(keysSpecs) {
  	if (self.db.getSelf().tables[name]) {
  	   throw new Db.Exception(this, "table already exists");
  	   }
  
      var tablesDir = new java.io.File(self.db.getTablesDir());
      if (!tablesDir.exists()) {
      	throw new Db.Exception(this, "create::corrupted db: no tables directory!");
      	}
      
      var f = {};
      
      for(k in self.files) {
         if (k !== "key") {
            f[k] = new java.io.File(self.files[k]);
            if (f[k].exists()) {
           	throw new Db.Exception(this, "create::corrupted db: there is already a definition file::'" + f[k] + "'");
               }
            } else {
            }
         }
  	});

  this.insert = (obj) => {
  	var iObj = { keys: {}, data : obj };
  	for(var k of keys) {
  	  if (!obj[k.name])) {
  	      throw new Db.Exception(this, "insert::missing key::'"+ k.name + "' for::" + JSON.stringify(obj));
  	      }
        if (k.uniq && this.exist(k, obj[k.name]) {
        	throw new Db.Exception(this, "insert::duplicate key::'" + k.name + "':'" + obj[k.name] + "' for::" + JSON.stringify(obj));
        	}
        iObj.keys[k] = obj[k];
        this.store(iObj);
    	}
      }
      
   this.update = (id, obj) => {
   	}
   
   this.delete = (id) => {
   	}
   
   this.create = (ks) => {
   	}

   this.findById = (id) {
   	return false;
   	}


   this.keysFileName = () => {
   	return this.getDb().getRoot() + name + ".keys";
   	}
   
   this.dataFileName = () => {
   	return this.getDb().getRoot() + name + ".data";
   	}
   
   this.toString = () => {
   	return this.getDb().toString() + "Table('" + name +"," + keys + '")::";
       }
   }

function Exception(prefix, message) {
	this.getMessage = () => (prefix + message);
	}

Lourah.dbms.Db = Db;
Louaah.dbms.Db.Table = Table;
Lourah.dbms.Db.Exception = Exception;

})();
