( function () {
    const ENERGY_FOR_1KELVIN_1LITER = 4184;
    function timeHeating(tFrom, tTo, waterVolume, power) {
      return (tTo - tFrom)
      *ENERGY_FOR_1KELVIN_1LITER
      *waterVolume/power;
      }
    
    function Autonomy(targetDuration, energyWh) {
      
      }
    
    function Device(length, width, height, density) {
      }
    
    console.log(timeHeating(10, 19, 25, 500)/60);
    console.log(timeHeating(17, 19, 25, 500)/60);
    })();