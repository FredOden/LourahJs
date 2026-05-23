var Lourah = Lourah || {};

(function () {
  Lourah.music = Lourah.music || {};

  var sampleRate = 8000;
  var numSamples = sampleRate;
  var TWO_PI = Math.PI * 2;

  var notes = [
    261.63,
    277.18,
    293.66,
    311.13,
    329.63,
    349.23,
    369.99,
    392.00,
    415.30,
    440.00,
    466.16,
    493.88,
    0 // silence
  ];

  Lourah.music.NOTES = {
    "C": 0, "B#": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4, "Fb": 4,
    "F": 5, "E#": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11, "Cb": 11,
    "_": 12, "-": 12
  };

  Lourah.music.DURATIONS = {
    "O": 64,
    "o": 32,
    "*": 16,
    "'": 8,
    '"': 4,
    ":": 2,
    "!": 1
  };

  // ---------- Modules spectre / timbre ----------

  function Spectrum(partials) {
    var weight = partials.reduce((a, b) => a + b, 0);
    this.sample = (x, stretchFn) => {
      var r = 0;
      for (var i = 0; i < partials.length; i++) {
        var n = i + 1;
        var s = stretchFn ? stretchFn(n) : n;
        r += partials[i] * Math.sin(s * x);
      }
      return r / weight;
    };
  }

  function Inharmonicity(B) {
    return (n) => n * Math.sqrt(1 + B * n * n);
  }

  function Detune(cents) {
    var ratio = Math.pow(2, cents / 1200);
    return (x) => x * ratio;
  }

  function HammerNoise(amount) {
    return (t) => {
      if (t > 5) return 0; // 5 ms
      return amount * (Math.random() * 2 - 1) * (1 - t / 5);
    };
  }

  function Timbre(options) {
    var spectrum = options.spectrum;
    var stretch = options.inharmonicity || ((n) => n);
    var detunes = options.detunes || [(x) => x];
    var noise = options.noise || (() => 0);

    this.sample = (x, t) => {
      var sum = 0;
      for (var i = 0; i < detunes.length; i++) {
        var dx = detunes[i](x);
        sum += spectrum.sample(dx, stretch);
      }
      sum /= detunes.length;
      return sum + noise(t);
    };
  }

  // ---------- Player ----------

  Lourah.music.Player = function (instrument, orchestra) {
    var tempo = orchestra.getTempo();
    var deciSize = orchestra.getDeciSize();
    var millis = 1000 / sampleRate;

    function sampling(note, octave) {
      var k = (Math.pow(2, octave - 3) * TWO_PI * note) / sampleRate;
      var sound = new java.lang.reflect.Array.newInstance(
        java.lang.Short.TYPE, (64 * deciSize) | 0
      );

      var f = instrument.getFShape();
      for (var i = 0; i < 64 * deciSize; i++) {
        var t = i * millis;
        var dval = f(k * i, t);
        sound[i] = (dval * 32767) | 0;
      }
      return sound;
    }

    var at = 0;
    this.init = () => { at = 0; };

    var sound;
    var currentDuration = Lourah.music.DURATIONS["O"];
    var currentOctave = 3;

    this.reset = () => {
      sound = undefined;
      currentDuration = Lourah.music.DURATIONS["O"];
    };

    function decodeTone(note) {
      if (!sound) sound = [];
      var n = note.split(",");
      var duration;
      var octave;
      var tone;
      var pointed = false;

      for (var i = 0; i < n.length; i++) {
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
      octave = currentOctave;
      if (pointed) duration = (duration / 2) * 3;

      return {
        duration: duration,
        octave: octave,
        tone: tone
      };
    }

    this.play = (phrase) => {
      var tones = phrase.split(";");
      for (var i = 0; i < tones.length; i++) {
        var d = decodeTone(tones[i]);
        if (!isNaN(d.tone)) {
          if (!instrument.sounds[d.tone][d.octave]) {
            instrument.sounds[d.tone][d.octave] =
              sampling(notes[d.tone], d.octave);
          }
          orchestra.combine(
            instrument.sounds[d.tone][d.octave],
            d.duration,
            at
          );
          at += d.duration;
        }
      }
    };
  };

  // ---------- Orchestra ----------

  Lourah.music.Orchestra = function () {
    var audioTrack = new android.media.AudioTrack(
      android.media.AudioManager.STREAM_MUSIC,
      sampleRate,
      android.media.AudioFormat.CHANNEL_OUT_MONO,
      android.media.AudioFormat.ENCODING_PCM_16BIT,
      numSamples,
      android.media.AudioTrack.MODE_STREAM
    );

    var tempo;
    var deciSize;

    this.begin = () => {
      audioTrack.play();
    };

    this.setTempo = (t) => {
      tempo = t;
      deciSize = (sampleRate * convertDuration(1)) | 0;
    };

    this.getDeciSize = () => deciSize;
    this.setTempo(120);
    this.getTempo = () => tempo;

    function convertDuration(duration) {
      var rate = (60 / tempo) * (duration / 16);
      return rate;
    }

    this.convertDuration = convertDuration;

    var combined = [];

    this.combine = function (sound, duration, bloc) {
      for (var i = 0; i < duration; i++) {
        var iBloc = bloc + i;
        if (!combined[iBloc]) {
          combined[iBloc] = new java.lang.reflect.Array.newInstance(
            java.lang.Short.TYPE, deciSize | 0
          );
        }
        var offset = deciSize * i;
        for (var k = 0; k < deciSize; k++) {
          combined[iBloc][k] =
            (combined[iBloc][k] + sound[offset + k]) >> 1;
        }
      }
    };

    this.compile = () => { /* optionnel */ };

    this.play = () => {
      for (var i = 0; i < combined.length; i++) {
        audioTrack.write(combined[i], 0, deciSize);
      }
    };

    this.end = () => {
      audioTrack.flush();
      audioTrack.stop();
      audioTrack.release();
    };
  };

  // ---------- Instrument ----------

  Lourah.music.Instrument = function (timbre, envelop) {
    this.sounds = Array(notes.length);

    this.getFShape = () => (x, t) => {
      var l = timbre.sample(x, t);
      if (envelop) {
        l = envelop.apply(l, t);
      }
      return l;
    };

    for (var iNote = 0; iNote < notes.length; iNote++) {
      this.sounds[iNote] = new Array(12);
    }
  };

  // ---------- OpusPlayer ----------

  Lourah.music.OpusPlayer = function (opus) {
    var orchestra = new Lourah.music.Orchestra();
    orchestra.setTempo(opus.tempo);

    this.learn = () => {
      orchestra.begin();
      opus.players.forEach(player => {
        player.p = new Lourah.music.Player(
          opus.instruments[player.instrument],
          orchestra
        );
        player.p.init();
        player.p.play(player.part);
      });
      orchestra.compile();
    };

    this.play = () => {
      orchestra.play();
    };

    this.dismiss = () => {
      orchestra.end();
    };
  };

  // ---------- Enveloppe ----------

  Lourah.music.Envelop = function (attack, decay, sustain, release) {
    this.apply = (level, at) => {
      if (at < attack.duration) {
        return level * attack.level * at / attack.duration;
      }
      if (at < decay.duration) {
        return level * (
          attack.level +
          (decay.level - attack.level) *
          (at - attack.duration) /
          (decay.duration - attack.duration)
        );
      }
      if (at < sustain.duration) {
        return level * (
          decay.level +
          (sustain.level - decay.level) *
          (at - decay.duration) /
          (sustain.duration - decay.duration)
        );
      }
      if (at < release.duration) {
        return level * (
          sustain.level -
          sustain.level * (at - sustain.duration) /
          (release.duration - sustain.duration)
        );
      }
      return 0;
    };
  };

  // ---------- Définition du menuet ----------

  var menuetK6 = [
    "4,o,C;',E;C;" + "C#;D;o,D;" + "D;',F;D;" + "D#;E;o,E;"
    + "*,E;',E;G;F#;A;" + "G;D;*,D,.;',D#;" + "E;C;3,B;A;G;F#;" + "*,F#;o,G;",

    "3,*,-;E;C;" + "-;B;G;" + "-;B;G;" + "-;4,C;3,C;"
    + "*,-;A;A;" + "G;G;G;" + "A;B;D;" + "G;D;2,G;",

    "o,,3,G;',B;G;" + "G;F#;o,F#;" + "F;',4,D;3,F;" + "F;E;o,E;"
    + "*,A;',A;4,C;3,B;4,D;" + "C;E;3,*,G,.;',G#;" + "A;F;E;D;C;2,B;" + "*,B;3,o,C;",

    "*,-;2,B;G;" + "-;3,F;2,A;" + "-;3,D;2,B;" + "-;3,C;2,C;"
    + "3,F;F;F;" + "E;E;E;" + "F;G;2,G;" + "3,C;2,G;C"
  ];

  // ---------- Piano : spectre + timbre + enveloppe ----------

  var spectre = [
    14.74,
    4,
    3,
    1.85,
    1.4,
    1.15,
    1.6,
    1.15,
    1.0,
    0.7,
    0.3
  ];

  var pianoSpectrum = new Spectrum(spectre);

  var pianoTimbre = new Timbre({
    spectrum: pianoSpectrum,
    inharmonicity: Inharmonicity(0.0018),
    detunes: [
      (x) => x,
      Detune(+4),
      Detune(-4)
    ],
    noise: HammerNoise(0.15)
  });

  var pianoEnv = new Lourah.music.Envelop(
    { level: 1.0, duration: 3 },
    { level: 0.6, duration: 200 },
    { level: 0.3, duration: 600 },
    { duration: 1200 }
  );

  var pianoInstrument = new Lourah.music.Instrument(pianoTimbre, pianoEnv);

  // ---------- Opus ----------

  var pippoAnthem = {
    tempo: 120,
    instruments: {
      pippo: pianoInstrument
    },
    players: [
      {
        instrument: "pippo",
        part: menuetK6[0].repeat(1) + menuetK6[2].repeat(1)
      },
      {
        instrument: "pippo",
        part: menuetK6[1].repeat(1) + menuetK6[3].repeat(1)
      }
    ]
  };

  var opus = new Lourah.music.OpusPlayer(pippoAnthem);
  opus.learn();
  opus.play();
  opus.dismiss();

})();