var Lourah = Lourah || {};
(function () {
Lourah.net = Lourah.net || {};
if (Lourah.net.ftp) return;
Lourah.net.ftp = {};
Lourah.net.ftp.DEFAULT_PORT = 21;
Lourah.net.ftp.Server = function(port) {
	port = port || Lourah.net.ftp.DEFAULT_PORT;
	var thread;
	var serverSocket = new java.net.ServerSocket(port);
	
	this.run = () => {
		try {
			for(;;) {
			   var client = new Lourah.net.ftp.Peer(this, socketServer.accept());
			   }
			} catch(e) {
			} finally {
				socketServer.close();
			}
		};
		
	this.start = () => {
		if (thread) return;
		thread = new java.lang.Thread({
			run : this.run
            });
		}
	};
	
Lourah.net.ftp.Peer = function(server, client) {
	
	}

})();