
function Player(username, userType) {
  var wallets = {};
  var coups = [];
  var hand = new Array(7);
  this.addWallet = (wallet) => wallets[wallet.getCurrency()] = wallet;
  this.getUser = () => username;
  this.getScore = () => score;
  this.getCoups = () => coups;
  this.pickLetters = (bag) => {
    if (bag.length === 0) return;
    for(var i = 0; i<hand.length; i++) {
      if (!hand[i]) {
        hand[i] = bag.pickLetter();
        }
      }
    };
  }

Player.HUMAN = "Human";
Player.MACHINE = "Machine";
