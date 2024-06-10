function planet(g, mass) {
  if (object.mass) {
    return function() {
      return g * mass;
      }
    }
  }

var solarSystem = {
  earth : (o) => planet(9.81, o)
  ,jupiter : (o) => planet(24.95, o)
  };

function Thing (object) {
  this.weightOn = (planet) => {
      this.weight[planet] = solarSystem[planet](object.mass);
    }
  }


