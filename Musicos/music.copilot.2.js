var Lourah = Lourah || {};

(function () {
  Lourah.music = Lourah.music || {};

  var sampleRate = 8000;
  var numSamples = sampleRate;
  var TWO_PI = Math.PI * 2;

  // ---------- Notes de base ----------
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

  // ---------- Table de sinus globale ----------
  var SIN_TABLE_SIZE = 4096;
  var SIN_TABLE = new Float32Array(SIN_TABLE_SIZE);
  for (var i = 0; i < SIN_TABLE_SIZE; i++) {
    SIN_TABLE[i] = Math.sin(2 * Math.PI * i / SIN_TABLE_SIZE);
  }

  function fastSin(x) {
    var idx = (x * (SIN_TABLE_SIZE / (2 * Math.PI))) | 0;
    idx &= (SIN_TABLE_SIZE - 1);
    return SIN_TABLE[idx];
  }

  // ---------- Modules spectre / timbre ----------

  function Spectrum(partials) {
    var weight = 0;
    for (var i = 0; i < partials.length; i++) weight += partials[i];

    this.sample = (x, stretchFn) => {
      var r = 0;
      for (var i = 0; i < partials.length; i++) {
        var n = i + 1;
        var s = stretchFn ? stretchFn(n) : n;
        r += partials[i] * fastSin(s * x);
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
      if (t > 5) return 0; // ~5 ms (avec t en ms)
      return amount * (Math.random() * 2 - 1) * (1 - t / 5);
    };
  }

  function Timbre(options) {
    var spectrum = options.spectrum;
    var stretch = options.inharmonicity || ((n) => n);
    var detunes = options.detunes || [(x) => x];

    this.sample = (x) => {
      var sum = 0;
      for (var i = 0; i < detunes.length; i++) {
        var dx = detunes[i](x);
        sum += spectrum.sample(dx, stretch);
      }
      return sum / detunes.length;
    };
  }

  function precomputeWaveform(timbre, resolution) {
    var table = new Float32Array(resolution);
    for (var i = 0; i < resolution; i++) {
      var x = TWO_PI * i / resolution;
      table[i] = timbre.sample(x);
    }
    return table;
  }

  // ---------- Player ----------

  Lourah.music.Player = function (instrument, orchestra) {
    var tempo = orchestra.getTempo();
    var deciSize = orchestra.getDeciSize();
    var millis = 1000 / sampleRate;

    function sampling(note, octave) {
      var sound = new java.lang.reflect.Array.newInstance(
        java.lang.Short.TYPE, (64 * deciSize) | 0
      );

      var f = instrument.getFShape();
      var waveTable = instrument.waveTable;
      var waveSize = instrument.waveSize || 1024;

      var freq = note * Math.pow(2, octave - 3);
      var phase = 0;
      var phaseInc = (freq * waveSize) / sampleRate;

      for (var i = 0; i < 64 * deciSize; i++) {
        var t = i * millis;
        var idx = phase | 0;
        if (idx >= waveSize) idx -= waveSize;
        var base = waveTable[idx];
        var dval = f(base, t);
        sound[i] = (dval * 32767) | 0;
        phase += phaseInc;
        if (phase >= waveSize) phase -= waveSize;
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
        var blocBuf = combined[iBloc];
        for (var k = 0; k < deciSize; k++) {
          blocBuf[k] = (blocBuf[k] + sound[offset + k]) >> 1;
        }
      }
    };

    this.compile = () => { /* optionnel */ };

    this.play = () => {
      for (var i = 0; i < combined.length; i++) {
        if (combined[i]) {
          audioTrack.write(combined[i], 0, deciSize);
        }
      }
    };

    this.end = () => {
      audioTrack.flush();
      audioTrack.stop();
      audioTrack.release();
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

  // ---------- Instrument (compatible API) ----------

  Lourah.music.Instrument = function (fShapeOrTimbre, envelop, options) {
    options = options || {};
    this.sounds = Array(notes.length);

    // Mode 1 : ancien comportement (fShape = fonction)
    if (typeof fShapeOrTimbre === "function") {
      var baseFunc = fShapeOrTimbre;
      this.waveTable = null;
      this.waveSize = 0;

      this.getFShape = () => (x, t) => {
        var l = baseFunc(x);
        if (envelop) {
          l = envelop.apply(l, t);
        }
        return l;
      };
    } else {
      // Mode 2 : nouveau comportement (timbre + wavetable)
      var timbre = fShapeOrTimbre;
      this.waveSize = options.waveSize || 1024;
      this.waveTable = precomputeWaveform(timbre, this.waveSize);
      var hammer = options.hammerNoise || null;

      this.getFShape = () => (base, t) => {
        var v = base;
        if (hammer) v += hammer(t);
        if (envelop) v = envelop.apply(v, t);
        return v;
      };
    }

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

  // ---------- Menuet K6 ----------

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

  // ---------- Piano Steinway : spectre + timbre + enveloppe ----------

  var spectreSteinway = [
    12.0,
    5.0,
    3.5,
    2.2,
    1.6,
    1.2,
    1.0,
    0.8,
    0.6,
    0.4,
    0.2
  ];

  var pianoSpectrum = new Spectrum(spectreSteinway);

  var pianoTimbre = new Timbre({
    spectrum: pianoSpectrum,
    inharmonicity: Inharmonicity(0.0007),
    detunes: [
      (x) => x,
      Detune(+1.2),
      Detune(-1.2)
    ]
  });

  var pianoEnv = new Lourah.music.Envelop(
    { level: 1.0, duration: 2 },
    { level: 0.75, duration: 160 },
    { level: 0.45, duration: 900 },
    { duration: 1800 }
  );

  var pianoInstrument = new Lourah.music.Instrument(
    pianoTimbre,
    pianoEnv,
    {
      waveSize: 1024,
      hammerNoise: HammerNoise(0.03)
    }
  );

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