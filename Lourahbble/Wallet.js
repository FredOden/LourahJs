Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.io.js');

function Wallet(currency, owner, implementer) {
  var implementation = new implementer(currency, owner);

  var account = {
    balance:0
    ,operations: []
    }

  //if (!implementation) throw "Wallet::implementation::A Wallet implementation is required";
  for(method of ["post", "load"]) {
    //console.log("method::" + implementation [method]);
    if (!implementation[method]) throw "Wallet::implementation::" + implementation + "::is not a Wallet, has no method " + method;
    }

  var operate = function(movement, amount, reason) {
    var operation = {
      movement:movement
      ,amount:amount
      ,reason:reason
      ,timestamp: java.lang.System.currentTimeMillis()
      };
    account.operations.push(operation);
    implementation.post(account);
    }
  this.debit = function(amount, reason, reconciliate) {
    account.balance -= amount;
    reconciliate || operate("debit", amount, reason);
    }
  this.credit = function(amount, reason, reconciliate) {
    account.balance += amount;
    reconciliate || operate("credit", amount, reason);
    }
  
  this.checkBalance = function(reconciliate) {
    if (reconciliate) {
      var balance = account.balance;
      account.balance = 0;
      for(operation of account.operations) {
        this[operation.movement](operation.amount, null, true);
        }
      if (account.balance !== balance) {
        throw "Wallet::checkBalance::"
        + "can't reconciliate actual balance <" + balance + "> "
        + "from operations computed balance <" + account.balance + ">"
        }
      }
    return account.balance;
    }

  this. getCurrency = () => { return currency; };
  this. getUsername = () => { return username; };
  this.toString = () => JSON.stringify(account);
  try {
    account = implementation.load();
    } catch(e) {}
  }


Wallet.JSONWallet = function(currency, owner) {
  var path = Lourah.jsFramework.dir() + "/" + currency + "." + owner + ".json";

  this.load = () => JSON.parse(Activity.path2String(path));

  this.post = (account) => Lourah.io.string2Path(JSON.stringify(account), path);

  this.toString = () => JSON.stringify(json);
  }


/*
var wallet = new Wallet("THB", "Pipov", Wallet.JSONWallet);
var o = wallet.credit(10, "win");
o = wallet.debit(3, "lose");


console.log("ops::" + wallet);
console.log("balance::" + wallet.checkBalance(true));
/**/
