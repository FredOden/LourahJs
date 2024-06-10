Activity.importScript(Lourah.jsFramework.dir() + "/Lourah.music.js");

var menuetK6 = [
  //"4,O,C;"
  "4,o,C;',E;C;"  + "C#;D;o,D;" + "D;',F;D;" + "D#;E;o,E;"
  + "*,E;',E;G;F#;A;" + "G;D;*,D,.;',D#;" + "E;C;3,B;A;G;F#;" + "*,F#;o,G;"

  //,"3,o,-;E;"
  ,"3,*,-;E;C;" + "-;B;G;" + "-;B;G;" + "-;4,C;3,C;"
  +"*,-;A;A;" + "G;G;G;" + "A;B;D;" + "G;D;2,G;"

  , "o,,3,G;',B;G;" + "G;F#;o,F#;" +"F;',4,D;3,F;" + "F;E;o,E;"
  + "*,A;',A;4,C;3,B;4,D;" + "C;E;3,*,G,.;',G#;" + "A;F;E;D;C;2,B;" + "*,B;3,o,C;"

  , "*,-;2,B;G;" + "-;3,F;2,A;" + "-;3,D;2,B;" + "-;3,C;2,C;"
  + "3,F;F;F;" + "E;E;E;" + "F;G;2,G;" + "3,C;2,G;C"
  ]

var piano = new Lourah.music.Envelop(
  {level: 1, duration: 10}
  ,{level: .6, duration: 10}
  ,{level: .4, duration: 170}
  ,{duration: 752}
  );

function square(x) {
  if (Math.sin(x) > 0) return 1;
  return -1;
  }

function multiF(x) {
  var f = Math.sin;
  return (
    1.2*f(x)
    + .06*f(2*x)
    + .05*f(3*x)
    + .05*f(4*x)
    + .03*f(5*x)
    + .08*f(x/2)
    + .05*f(x/3)
    )/1.47;
  }

var spectre = [
  14.74
  ,4
  ,3
  ,1.85
  ,1.4
  ,1.15
  ,1.6
  ,1.15
  ,1.0
  ,0.7
  ,0.3
  ];

function Spectrum(s) {
  var weight = 0;
  var B = 2*Math.PI/s.length;
	var phases = [];
  for(var i = 0; i < s.length; i++) {
    weight += s[i];
	  phases.push(i * B);
    }

  this.shape = (x) => {
    var r = 0;
    for(var i = 0; i < s.length; i++) {
      r += s[i] * Math.sin((i+1)*x + phases[i]);
      }
    return r/weight;
    }
  }

var sPiano = new Spectrum(spectre);
var clavier = new Lourah.music.Instrument(sPiano.shape, piano)

var pippoAnthem = {
  tempo: 120
  ,players: [
    {
      instrument: clavier
      ,part: menuetK6[0].repeat(1) + menuetK6[2].repeat(1)
      }
    ,{
      instrument: clavier
      ,part: menuetK6[1].repeat(1)+ menuetK6[3].repeat(1)
      }
    ]
  }


var opus = new Lourah.music.OpusPlayer(pippoAnthem);

opus.learn();
if (true) opus.play();
//opus.play();
opus.dismiss();
