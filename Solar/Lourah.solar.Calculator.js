/**
 * Solar calculator
 *
 * all features to get reliable information
 * about enery and light / time
 * based on latitude and longitude
 *
 **/
var Lourah = Lourah || {};

(function () {
	Lourah.solar = Lourah.solar || {};
	if (Lourah.solar.Calculator) return;

	const TWO_PI = 2 * Math.PI;


	const EARTH = {
		RADIUS: 6371009.7714
		, ROTATION : {
			SPEED: 7.2921150*Math.pow(10, -5) // radian/secondo
		}
		, ORBIT: {
			PERIOD: //365.2422*24*3600*1000
			//31556925.2547245*1000  //2606342
			//1000 * 365.256363004 * 24 * 3600 // milliseconds
			//1000*(365.242374 * (24*3600))
			// source
			// https://media4.obspm.fr/public/ressources_lu/pages_mesure-temps/mctc-definition-annee.html
			(365*24*3600 + 5*3600 + 48*60 +45)*1000 +1980 //365 jours 5h 48m 45s pour revenir dans la direction de ce point. C'e
			//(365*24*3600 + 6*3600 + 53*60 +53)*1000 //Terre mettra 365 jours 6h 13m 53s pour y revenir. On appelle cette durée l'année anomalistique.
			,RADBYSEC: TWO_PI/this.PERIOD
			,EQUATION: (theta) => 147098291/(0.016711236*Math.cos(theta) + 1)
			,UTC: (t) => new Date(Date.UTC(2024, 0, 1, 0, 0, 0 + t))
			,DEQUINOX: t => Date.UTC(2024,2,20,3,6,21,t)
		}

	}

	const T = t => {
		let dt = t - T0;
		let rho = EARTH.ORBIT.EQUATION(EARTH.ORBIT.RADBYSEC*dt);
		
	}

	const RADTOSEC = 24*3600/Math.PI;
	const TROPIC = (23*3600 + 26*60 + 17.231)/(180*3600);
	
	const INCIDENCE = t => Math.sin(
		TROPIC*Math.sin(EARTH.ORBIT.RADBYSEC*EARTH.ORBIT.DEQUINOX(t))

	);

	function Day(t) {
		this.at(lat) = -RADTOSEC*.Math.arccos(Math.tan(lat)*Math.tan(Math.arcsin(INCIDENCE(t))));
	}

	function Calculator () {
	};

	function Spot(latitude, longitude) {
	}

	for(var i = 0; i < 5; i++) {
		//console.log(EARTH.ORBIT.UTC(i*EARTH.ORBIT.PERIOD));
		console.log(new Date(EARTH.ORBIT.DEQUINOX(i*EARTH.ORBIT.PERIOD)));
	}

	Lourah.solar.Calculator = Calculator;
})();

