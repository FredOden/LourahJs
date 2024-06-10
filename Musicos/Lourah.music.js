var Lourah = Lourah || {};

(function () {
	if (Lourah.music) return;
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
	    var fullRange = 64*deciSize;
	    
	    var count = 0;
      console.log("millis::" + millis);
      console.log("fullRange::" + fullRange);
      function sampling(note, octave) {
	      var start = java.lang.System.currentTimeMillis();
        var k = (Math.pow(2, octave - 3) * TWO_PI * note)/sampleRate;
        //console.log("k::" + k + "::" + octave + "::" + note);
        var sound = new java.lang.reflect.Array.newInstance(
          java.lang.Short.TYPE, (fullRange)|0
          );

        var idx = 0;
        var f = instrument.getFShape();
        for(var i = 0; i < fullRange; i++) {
          dval = f(k * i, i * millis);
          sound[i] = (dval * 32767)|0;
          }
	      var top = java.lang.System.currentTimeMillis() - start;
	      count++;
	      console.log("Sampling::" + count + "::<" + octave + note + ">::" + top);
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
              player.instrument
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
