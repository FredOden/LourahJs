var Lourah = Lourah || {};

(function () {
    Lourah.music = Lourah.music || {};
    var sampleRate = 8000;
    var numSamples = sampleRate;
    var TWO_PI = Math.PI * 2;
    var notes = [
      261.63//sampleRate
      ,277.18//sampleRate
      ,293.66//sampleRate
      ,311.13//sampleRate
      ,329.63//sampleRate
      ,349.23//sampleRate
      ,369.99//sampleRate
      ,392.00//sampleRate
      ,415.30//sampleRate
      ,440.00//sampleRate
      ,466.16//sampleRate
      ,493.88//sampleRate
      ,0 //silence
      ]; //440; // hz

    /*
    var generatedSnd = new java.lang.reflect.Array.newInstance(
      java.lang.Byte.TYPE, (2 * numSamples)|0);
    //new Array(2 * numSamples);
    handler = new android.os.Handler();
    var audioTrack;
    var play = false;
    */

    Lourah.music.NOTES = {
      "C" : 0, "B#": 0,
      "C#": 1, "Db": 1,
      "D" : 2,
      "D#": 3, "Eb": 3,
      "E" : 4, "Fb": 4,
      "F" : 5, "E#": 5,
      "F#": 6, "Gb": 6,
      "G" : 7,
      "G#": 8, "Ab": 8,
      "A" : 9,
      "A#": 10, "Bb": 10,
      "B": 11, "Cb": 11,
      "_": 12, "-" : 12
      };

    Lourah.music.DURATIONS = {
      "O" : 64
      , "o" : 32
      , "*" : 16
      , "'" : 8
      , '"' : 4
      , ":" : 2
      , "!" : 1
      };

    Lourah.music.Player = function (instrument, orchestra) {
      /**
      sampling: generate .1 second play for 1 note
      */
      var tempo = orchestra.getTempo();
      var deciSize = orchestra.getDeciSize();
      var millis = 1000/sampleRate;
      console.log("millis::" + millis);
      function sampling(note, octave) {
        var k = (Math.pow(2, octave - 3) * TWO_PI * note)/sampleRate;
        //console.log("k::" + k + "::" + octave + "::" + note);
        var sound = new java.lang.reflect.Array.newInstance(
          java.lang.Short.TYPE, (64*deciSize)|0
          );

        var idx = 0;
        var f = instrument.getFShape();
        for(var i = 0; i < 64*deciSize; i++) {
          dval = f(k * i, i * millis);
          sound[i] = (dval * 32767)|0;
          }
        return sound;
        }

      var at = 0;

      this.init = () => {
        at = 0;
        }

      var sound;

      var currentDuration = Lourah.music.DURATIONS["O"];


      var currentOctave = 3;
      this.reset = () => {
        sound = undefined;
        currentDuration = Lourah.music.DURATIONS["O"];
        }

      /*
      O,3,A#
      O duration : O o * ' "
      3 octave
      A# note
      */

      function decodeTone(note) {
        if (!sound) {
          sound = [];
          }
        var n = note.split(",");
        var duration;
        var octave;
        var tone;
        var pointed;

        pointed = false;

        for(var i = 0; i < n.length; i++) {
          duration = Lourah.music.DURATIONS[n[i]];
          if (duration) {
            currentDuration = duration;
            continue;
            }
          octave = parseInt(n[i], 10);
          if (!isNaN(octave)) {
            currentOctave = octave;
            continue;
            }
          
          if (n[i] === ".") {
            pointed = true;
            continue;
            }
          
          tone = Lourah.music.NOTES[n[i]];
          }

        duration = currentDuration;
        octave = currentOctave

        if (pointed) duration = (duration/2)*3;
        return {
          duration:duration
          ,octave:octave
          ,tone:tone
          };
        }


      this.play = (phrase) => {
        var tones = phrase.split(";");
        for(var i = 0; i < tones.length; i++) {
          var d = decodeTone(tones[i]);
          if (!isNaN(d.tone)) {
            
            /*
            console.log(
              "d::"
              + JSON.stringify(d)
              );
            */
            
            if (!instrument.sounds[d.tone][d.octave]) {
              instrument.sounds[d.tone][d.octave]
              =
              sampling(notes[d.tone], d.octave)
              ;
              }
            orchestra.combine(instrument.sounds[d.tone][d.octave]
              , d.duration
              , at);
            at += d.duration;
            }
          }
        }
      };

    Lourah.music.Orchestra = function () {
      var audioTrack = new android.media.AudioTrack(
        android.media.AudioManager.STREAM_MUSIC,
        sampleRate,
        android.media.AudioFormat.CHANNEL_OUT_MONO,
        android.media.AudioFormat.ENCODING_PCM_16BIT,
        numSamples,
        android.media.AudioTrack.MODE_STREAM
        );


      var timer = 0;
      var tempo;
      var deciSize;
    

      this.begin = () => {
        timer = 0;
        console.log("audioTrack::" + audioTrack);
        audioTrack.play();
        }

      this.setTempo = (t) => {
        tempo = t;
        deciSize = (sampleRate * convertDuration(1))|0;
        }

      this.getDeciSize = () => deciSize;


      this.setTempo(120);

      this.getTempo = () => tempo;

      function convertDuration(duration) {
        var rate = (60/tempo)*(duration/16);
        return rate;
        }
      
      this.convertDuration = convertDuration;
      

      var combined = [];

      this.combine = function(sound, duration, bloc) {
        for(var i = 0; i < duration; i++) {
          var iBloc = bloc + i;
          if (!combined[iBloc]) {
            combined[iBloc] = new java.lang.reflect.Array.newInstance(
              java.lang.Short.TYPE, deciSize|0
              );
            }
          var offset = deciSize*i;
          for(var k = 0; k < deciSize; k++) {
            combined[iBloc][k] =
            (combined[iBloc][k]
              + sound[offset + k])>>1;
            }
          }
        //console.log("combined created::" + duration + "::" + bloc);
        }

      //var opus;
      this.compile = () => {
        /*
        opus = new java.lang.reflect.Array.newInstance(
          java.lang.Short.TYPE, (combined.length*deciSize)|0
          );

        for(var i = 0; i < combined.length; i++) {
          //console.log("combined::length::" + combined.length);
          //audioTrack.write(combined[i], 0, combined[i].length);
          //audioTrack.flush();
          for(var j = 0; j < deciSize; j++) {
            opus[i*deciSize + j] = combined[i][j];
            }
          }
        console.log("opus::length::" + opus.length);
        */
        }

      this.play = () => {
        for(var i = 0; i < combined.length; i++) {
          audioTrack.write(combined[i], 0, deciSize);
          }
        }

      this.end = () => {
        audioTrack.flush();
        audioTrack.stop();
        audioTrack.release();
        }
      };

    Lourah.music.Instrument = function(fShape, envelop) {
      this.sounds = Array(notes.length);
      this.getFShape = () => (x, t) => {
        var l = fShape(x);
        if (envelop) {
          l = envelop.apply(l, t);
          }
        return l;
        }
      for(var iNote = 0; iNote < notes.length; iNote++) {
        for(var octave = 0; octave < 12; octave ++) {
          if (octave === 0) this.sounds[iNote] = new Array(12);
          }
        }
      };

    Lourah.music.OpusPlayer = function(opus) {
      orchestra = new Lourah.music.Orchestra();
      orchestra.setTempo(opus.tempo);
      this.learn = () => {
        orchestra.begin();
        opus.players.forEach(player => {
            player.p = new Lourah.music.Player(
              opus.instruments[player.instrument]
              ,orchestra
              );
            player.p.init();
            player.p.play(player.part);
            });
        orchestra.compile();
        }

      this.play = () => {
        orchestra.play();
        }

      this.dismiss = () => {
        orchestra.end();
        }
      }

    Lourah.music.Envelop = function(attack, decay, sustain, release) {
      this.apply = (level, at) => {
        if (at < attack.duration) {
          return level * attack.level*at/attack.duration;
          }
        if (at < decay.duration) {
          return (
            level * (attack.level + (decay.level - attack.level)*(at - attack.duration)/(decay.duration - attack.duration))
            );
          }
        if (at < sustain.duration) {
          return (
            level * (decay.level + (sustain.level - decay.level)*(at - decay.duration)/(sustain.duration - decay.duration))
            );
          }
        if (at < release.duration) {
          return (
            level * (sustain.level - sustain.level*(at - sustain.duration)/(release.duration - sustain.duration))
            );
          }
        return 0;
        }
      }


    })();

/*
var o = new Lourah.music.Orchestra();

o.setTempo(150);

var sinus = new Lourah.music.Instrument(Math.sin);

var player = new Lourah.music.Player(sinus, o);
var player2 = new Lourah.music.Player(sinus, o);
var pippo = new Lourah.music.Player(sinus, o);


console.log("init::");
player.init();
player2.init();
pippo.init();
o.begin();
console.log("init::done");

player.play ("*,3,C;E;C;E;G;D;G;D;C;E;C;E;C;E;C;E");
player2.play("*,3,-;G;-;G;-;2,B;-;B;-;3,G;-;G;-;G;-;G");
pippo.play("*,4,G;E;o,E;*,F;D;o,D;*,C;D;E;F;G;G;o,G");
o.compile();
o.play();
o.end();
*/

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
  for(var i = 0; i < s.length; i++) {
    weight += s[i];
    }
  this.shape = (x) => {
    var r = 0;
    var B = 2*Math.PI/s.length;
    for(var i = 0; i < s.length; i++) {
      r += s[i] * Math.sin((i+1)*x + i * B);
      }
    return r/weight;
    }
  }

var sPiano = new Spectrum(spectre);

var pippoAnthem = {
  tempo: 120
  ,instruments: {
    pippo: new Lourah.music.Instrument(sPiano.shape, piano)
    }
  ,players: [
    {
      instrument: "pippo"
      ,part: menuetK6[0].repeat(1) + menuetK6[2].repeat(1)
      }
    ,{
      instrument: "pippo"
      ,part: menuetK6[1].repeat(1)+ menuetK6[3].repeat(1)
      }
    ]
  }


var opus = new Lourah.music.OpusPlayer(pippoAnthem);

opus.learn();
if (true) opus.play();
//opus.play();
opus.dismiss();
