function Data() {}
function Private() {
  var data = new Data();
  this.getData = () => { return data; }; 
  } 

Private.prototype.setX = function (x) {
  this.getData().x = x;
  };

Private.prototype.getX = function () {
  return this.getData().x;
  };

var private = new Private();

private.getData().x = 37;

console.log(private.getX()); 