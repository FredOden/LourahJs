var Lourah = Lourah || {};

(function () {
    Lourah.covid19 = Lourah.covid19 || {};
    if (Lourah.covid19.Simulator) return;
    
    Lourah.covid19.Simulator = function () {
      }
    
    var dudeData = {
      birth:1900
      ,bmi:[18.5, 35] // body mass index
      };
    
    var cityData = {
      population: [20, 50000000]
      }
   
    var topography = {
      altitude : [-300, 8000]
      ,slop: [0, 90]
      ,step: 10
      ,level: 10
      ,angular: Math.PI/8
      }
    
    Lourah.covid19.Simulator.Dude = function () {
      };
    
    Lourah.covid19.Simulator.Map = function(we, sn) {
      var map = new Array(we * ns);
      this.build = () => {
        var p = [we/2, sn/2];
        
        }
      };
    
    
    })();

console.log("you're dead !");