var Lourah = Lourah || {};

(function () {
  Lourah.music = Lourah.music || {};

  // ---------- Config global ----------
  var sampleRate = 22050;
  var numSamples = sampleRate;
  var TWO_PI = Math.PI * 2;

  // Racine de persistance
  var PERSIST_ROOT = "/storage/emulated/0/LourahJS/Musicos/";

  // ---------- Notes ----------
  var notes = [
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23,
    369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
    0
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
    "O": 64, "o": 32, "*": 16,
    "'": 8, '"': 4, ":": 2, "!": 1
  };

  // ---------- Utils : clamp + limiter ----------
  function clamp(v) {
    if (v > 1.0) return 1.0;
    if (v < -1.0) return -1.0;
    return v;
  }

  function limit(v) {
    return Math.tanh(v * 1.5);
  }

  // ---------- Sin Table ----------
  var SIN_SIZE = 4096;
  var SIN = new Float32Array(SIN_SIZE);
  for (var i = 0; i < SIN_SIZE; i++) {
    SIN[i] = Math.sin(2 * Math.PI * i / SIN_SIZE);
  }
  function fastSin(x) {
    var idx = (x * (SIN_SIZE / (2 * Math.PI))) | 0;
    return SIN[idx & (SIN_SIZE - 1)];
  }

  // ---------- Persistance PCM ----------
  function ensureDir(dir) {
    var f = new java.io.File(dir);
    if (!f.exists()) f.mkdirs();
  }

  function savePCM(path, pcmArray) {
    var f = new java.io.File(path);
    if (f.exists()) f.delete();
    var fos = new java.io.FileOutputStream(f);
    for (var i = 0; i < pcmArray.length; i++) {
      var v = pcmArray[i];
      fos.write(v & 0xFF);
      fos.write((v >> 8) & 0xFF);
    }
    fos.close();
  }

  // ---------- LECTURE PCM ULTRA‑RAPIDE ----------
  function loadPCM(path, size) {
    var f = new java.io.File(path);
    var expected = size * 2;

    if (f.length() !== expected) return null;

    var fis = new java.io.FileInputStream(f);

    // Lire tout le fichier d'un coup
    var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, expected);
    var read = fis.read(bytes);
    fis.close();

    if (read !== expected) return null;

    // Convertir en short[] signé
    var buf = new java.lang.reflect.Array.newInstance(java.lang.Short.TYPE, size);

    var idx = 0;
    for (var i = 0; i < size; i++) {
      var b1 = bytes[idx++] & 0xFF;
      var b2 = bytes[idx++] & 0xFF;

      var v = (b2 << 8) | b1;
      if (v > 32767) v -= 65536; // SIGNED

      buf[i] = v;
    }

    return buf;
  }

  // ---------- Noms de notes lisibles ----------
  function noteNameFromIndex(i) {
    return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][i];
  }

  // ---------- Piano hybride ----------
  function Spectrum(partials) {
    var weight = 0;
    for (var i = 0; i < partials.length; i++) weight += partials[i];

    this.sample = function (x, stretchFn) {
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
    return function (n) {
      return n * Math.sqrt(1 + B * n * n);
    };
  }

  function Detune(cents) {
    var ratio = Math.pow(2, cents / 1200);
    return function (x) {
      return x * ratio;
    };
  }

  function Timbre(options) {
    var spectrum = options.spectrum;
    var stretch = options.inharmonicity || function (n) { return n; };
    var detunes = options.detunes || [function (x) { return x; }];

    this.sample = function (x) {
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

  function hammerNoise(t) {
    if (t > 12) return 0;
    var decay = 1 - (t / 12);
    return (Math.random() * 2 - 1) * decay * 0.12;
  }

  function soundboardResonance(t) {
    var ts = t / 1000.0;
    return 1 + 0.04 * Math.sin(2 * Math.PI * 3 * ts) * Math.exp(-ts * 2);
  }

  // ---------- Player ----------
  Lourah.music.Player = function (instrument, orchestra) {
    var deciSize = orchestra.getDeciSize();
    var millis = 1000 / sampleRate;

    function generateAndSave(toneIndex, octave, path, len) {
      var sound = new java.lang.reflect.Array.newInstance(
        java.lang.Short.TYPE, len
      );

      var f = instrument.getFShape();
      var freq = notes[toneIndex] * Math.pow(2, octave - 3);

      var waveTable = instrument.waveTable;
      var waveSize = instrument.waveSize;
      var phase = 0;
      var phaseInc = (freq * waveSize) / sampleRate;

      for (var i = 0; i < len; i++) {
        var t = i * millis;
        var base = waveTable[phase | 0];
        var v = f(base, t);
        sound[i] = (limit(clamp(v)) * 32767) | 0;
        phase += phaseInc;
        if (phase >= waveSize) phase -= waveSize;
      }

      savePCM(path, sound);
      return sound;
    }

    function sampling(toneIndex, octave) {
      var len = (64 * deciSize) | 0;
      var dir = PERSIST_ROOT + instrument.cacheId + "/";
      ensureDir(dir);

      var noteName = noteNameFromIndex(toneIndex);
      var path = dir + noteName + octave + ".pcm";

      var f = new java.io.File(path);

      if (f.exists()) {
        var buf = loadPCM(path, len);
        if (buf !== null) return buf;
        f.delete(); // corrompu → on supprime
      }

      return generateAndSave(toneIndex, octave, path, len);
    }

    var at = 0;
    this.init = function () { at = 0; };

    var currentDuration = Lourah.music.DURATIONS["O"];
    var currentOctave = 3;

    function decodeTone(note) {
      var n = note.split(",");
      var duration, octave, tone, pointed = false;

      for (var i = 0; i < n.length; i++) {
        duration = Lourah.music.DURATIONS[n[i]];
        if (duration) { currentDuration = duration; continue; }

        octave = parseInt(n[i], 10);
        if (!isNaN(octave)) { currentOctave = octave; continue; }

        if (n[i] === ".") { pointed = true; continue; }

        tone = Lourah.music.NOTES[n[i]];
      }

      duration = currentDuration;
      if (pointed) duration = (duration / 2) * 3;

      return { duration: duration, octave: currentOctave, tone: tone };
    }

    this.play = function (phrase) {
      var tones = phrase.split(";");
      for (var i = 0; i < tones.length; i++) {
        var d = decodeTone(tones[i]);
        if (!isNaN(d.tone)) {
          if (!instrument.sounds[d.tone][d.octave]) {
            instrument.sounds[d.tone][d.octave] =
              sampling(d.tone, d.octave);
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

    var tempo, deciSize;
    this.begin = function () {
      audioTrack.play();
    };

    this.setTempo = function (t) {
      tempo = t;
      deciSize = (sampleRate * (60 / tempo) * (1 / 16)) | 0;
    };

    this.getDeciSize = function () { return deciSize; };
    this.setTempo(120);

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
        var buf = combined[iBloc];
        for (var k = 0; k < deciSize; k++) {
          buf[k] = (buf[k] + sound[offset + k]) >> 1;
        }
      }
    };

    this.compile = function () { };

    this.play = function () {
      for (var i = 0; i < combined.length; i++) {
        if (combined[i]) {
          audioTrack.write(combined[i], 0, deciSize);
        }
      }
    };

    this.end = function () {
      audioTrack.flush();
      audioTrack.stop();
      audioTrack.release();
    };
  };

  // ---------- Enveloppe ----------
  Lourah.music.Envelop = function (attack, decay, sustain, release) {
    this.apply = function (level, at) {
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

  // ---------- Instrument ----------
  Lourah.music.Instrument = function (timbre, envelop, options) {
    options = options || {};
    this.cacheId = options.name || "instrument";

    this.waveSize = options.waveSize || 2048;
    this.waveTable = precomputeWaveform(timbre, this.waveSize);

    this.getFShape = function () {
      return function (base, t) {
        var v = base;
        v += hammerNoise(t);
        v *= soundboardResonance(t);
        if (envelop) v = envelop.apply(v, t);
        return v;
      };
    };

    this.sounds = Array(notes.length);
    for (var i = 0; i < notes.length; i++) {
      this.sounds[i] = new Array(12);
    }
  };

  // ---------- OpusPlayer ----------
  Lourah.music.OpusPlayer = function (opus) {
    var orchestra = new Lourah.music.Orchestra();
    orchestra.setTempo(opus.tempo);

    this.learn = function () {
      orchestra.begin();
      opus.players.forEach(function (player) {
        player.p = new Lourah.music.Player(
          opus.instruments[player.instrument],
          orchestra
        );
        player.p.init();
        player.p.play(player.part);
      });
      orchestra.compile();
    };

    this.play = function () {
      orchestra.play();
    };

    this.dismiss = function () {
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

  // ---------- Piano hybride 22050 Hz ----------
  var spectreSteinway = [
    12.0, 5.0, 3.5, 2.2, 1.6,
    1.2, 1.0, 0.8
  ];

  var pianoSpectrum = new Spectrum(spectreSteinway);

  var pianoTimbre = new Timbre({
    spectrum: pianoSpectrum,
    inharmonicity: Inharmonicity(0.0007),
    detunes: [
      function (x) { return x; },
      Detune(+1.2),
      Detune(-1.2)
    ]
  });

  var pianoEnv = new Lourah.music.Envelop(
    { level: 1.0, duration: 3 },
    { level: 0.75, duration: 180 },
    { level: 0.45, duration: 900 },
    { duration: 1800 }
  );

  var pianoInstrument = new Lourah.music.Instrument(
    pianoTimbre,
    pianoEnv,
    {
      name: "piano",
      waveSize: 2048
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
        part: menuetK6[0] + menuetK6[2]
      },
      {
        instrument: "pippo",
        part: menuetK6[1] + menuetK6[3]
      }
    ]
  };

  var opus = new Lourah.music.OpusPlayer(pippoAnthem);
  opus.learn();
  opus.play();
  opus.dismiss();

})();