var Lourah = Lourah || {};
(function() {
Lourah.user = Lourah.user || {};

if (Lourah.user.Login) return;

Lourah.user.Login = function (app) {
	var etc = Lourah.jsFramework.parentDir() + "/etc";
	var passwd = etc + "/passwd";
	var session;
	
	this.signup = (user, password) => {
		var login = sha256(user);
		var sword = sha256(password);
		createUser(passwd, login, sword);
		}
		
	this.signin = (user, askPassword) {
		var login = sha256(user);
		var sword = sha256(askPassword(user));
		var session = getUser(passwd, user, sword);
		}
		
	
	}


function Passwd(passwd) {
	this.createUser = (u, p) => {
		try {
		    var f = new java.io.File(passwd);
		    var record = {};
			record[u] = p;
			record.data = {};
		    }
		catch(e) {
			}
		};
	}

function sha256(base) {
	try {
		var digest = java.security.MessageDigest.getInstance("SHA-256");
		var hash = digest.digest(new java.lang.String(base).getBytes("UTF-8"));
		var hexString = new java.lang.StringBuffer();
		for(var i = 0; i < hash.length; i++) {
			var hex = java.lang.Integer.toHexString(0xff & hash[i]);
			if (hex.length() === 1) hexString.append('0');
			hexString.append(hex);
			}
		return String(hexString.toString());
		}
	catch(e) {
		}
	}

})();
/*
public static String sha256(String base) {
    try{
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(base.getBytes("UTF-8"));
        StringBuffer hexString = new StringBuffer();

        for (int i = 0; i < hash.length; i++) {
            String hex = Integer.toHexString(0xff & hash[i]);
            if(hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }

        return hexString.toString();
    } catch(Exception ex){
       throw new RuntimeException(ex);
    }
}
*/