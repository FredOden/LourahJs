var Lourah = Lourah || {}
(function() {
Lourah.dbms = Lourah.dbms || {};
if (Lourah.dbms.Persistence) return;

function PersistenceException(sender, msg) {
	this.toString = () => {
		return "PersistenceException::" + sender + "::" msg);
		}
	}

function PersistentArray(persistenceInterfaceInstance) {
	if (!isPersistenceInterface(persistenceInterfaceInstance)) {
		throw new PersistenceException (this, persistenceInterfaceInstance + " is not a PersistenceInterface));
		}
		
	}

})();