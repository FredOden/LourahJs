var Lourah = Lourah || {};

(function () {

  Lourah.music = Lourah.music || {};

  // ============================================================
  // CONFIGURATION GLOBALE
  // ============================================================

  var sampleRate = 22050;
  var numSamples = sampleRate;
  var TWO_PI = Math.PI * 2;

  // Racine de persistance
  var PERSIST_ROOT = "/storage/emulated/0/LourahJS/Musicos/";

  // ============================================================
  // NOTES (fréquences de base)
  // ============================================================

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

  // ============================================================
  // UTILITAIRES
  // ============================================================

  function clamp(v) {
    if (v > 1.0) return 1.0;
    if (v < -1.0) return -1.0;
    return v;
  }

  function limit(v) {
    return Math.tanh(v * 1.5);
  }

  // ============================================================
  // TABLE SINUS RAPIDE
  // ============================================================

  var SIN_SIZE = 4096;
  var SIN = new Float32Array(SIN_SIZE);

  for (var i = 0; i < SIN_SIZE; i++) {
    SIN[i] = Math.sin(2 * Math.PI * i / SIN_SIZE);
  }

  function fastSin(x) {
    var idx = (x * (SIN_SIZE / (2 * Math.PI))) | 0;
    return SIN[idx & (SIN_SIZE - 1)];
  }

  // ============================================================
  // PERSISTANCE : création dossier + lecture/écriture PCM
  // ============================================================

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

  function loadPCM(path, size) {
    var f = new java.io.File(path);
    var expected = size * 2;

    if (f.length() !== expected) return null;

    var fis = new java.io.FileInputStream(f);
    var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, expected);
    var read = fis.read(bytes);
    fis.close();

    if (read !== expected) return null;

    var buf = new java.lang.reflect.Array.newInstance(java.lang.Short.TYPE, size);

    var idx = 0;
    for (var i = 0; i < size; i++) {
      var b1 = bytes[idx++] & 0xFF;
      var b2 = bytes[idx++] & 0xFF;

      var v = (b2 << 8) | b1;
      if (v > 32767) v -= 65536;

      buf[i] = v;
    }

    return buf;
  }

  // ============================================================
  // NOM DE NOTE
  // ============================================================

  function noteNameFromIndex(i) {
    return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][i];
  }
  
  // ============================================================
  // SPECTRE, INHARMONICITÉ, DETUNE, TIMBRE
  // ============================================================

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

// ============================================================
  // TIMBRE — COMBINAISON SPECTRE + INHARMONICITÉ + DETUNE
  // ============================================================

  function Timbre(options) {
    this.spectrum = options.spectrum;
    this.inharmonicity = options.inharmonicity;
    this.detunes = options.detunes || [function (x) { return x; }];

    // Génère une wavetable complète
    this.sample = function (x) {
      var r = 0;

      for (var i = 0; i < this.detunes.length; i++) {
        var detuneFn = this.detunes[i];
        var stretchFn = this.inharmonicity;

        r += this.spectrum.sample(detuneFn(x), stretchFn);
      }

      return r / this.detunes.length;
    };
  }

  // ============================================================
  // PRÉCALCUL DE LA WAVETABLE
  // ============================================================

  function precomputeWaveform(timbre, size) {
    var table = new Float32Array(size);

    for (var i = 0; i < size; i++) {
      var x = (i / size) * TWO_PI;
      table[i] = timbre.sample(x);
    }

    return table;
  }

  // ============================================================
  // SPECTRE STEINWAY AMÉLIORÉ (14 PARTIELS)
  // ============================================================

  var spectreSteinway = [
    12.0, 7.5, 5.0, 3.5, 2.8,
    2.2, 1.8, 1.5, 1.2, 1.0,
    0.8, 0.7, 0.6, 0.5
  ];

  var pianoSpectrum = new Spectrum(spectreSteinway);

  // ============================================================
  // BRUIT DE MARTEAU AMÉLIORÉ
  // ============================================================

  function hammerNoise(t) {
    if (t > 8) return 0;
    var decay = 1 - (t / 8);
    return (Math.random() * 2 - 1) * decay * 0.22;
  }

  // ============================================================
  // RÉSONANCE DE TABLE D'HARMONIE AMÉLIORÉE
  // ============================================================

  function soundboardResonance(t) {
    var ts = t / 1000.0;
    return 1 + 0.10 * Math.sin(2 * Math.PI * 3 * ts) * Math.exp(-ts * 1.8);
  }

  // ============================================================
  // TIMBRE PIANO (INHARMONICITÉ + BATTEMENTS)
  // ============================================================

  var pianoTimbre = new Timbre({
    spectrum: pianoSpectrum,
    inharmonicity: Inharmonicity(0.0018),
    detunes: [
      function (x) { return x; },
      Detune(+3.2),
      Detune(-2.7)
    ]
  });
  
  // ============================================================
  // ENVELOPPE (ADSR) — VERSION PIANO AMÉLIORÉE
  // ============================================================

  Lourah.music.Envelop = function (attack, decay, sustain, release) {
    this.apply = function (level, at) {

      // ATTACK
      if (at < attack.duration) {
        return level * attack.level * at / attack.duration;
      }

      // DECAY
      if (at < decay.duration) {
        return level * (
          attack.level +
          (decay.level - attack.level) *
          (at - attack.duration) /
          (decay.duration - attack.duration)
        );
      }

      // SUSTAIN
      if (at < sustain.duration) {
        return level * (
          decay.level +
          (sustain.level - decay.level) *
          (at - decay.duration) /
          (sustain.duration - decay.duration)
        );
      }

      // RELEASE
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

  // ============================================================
  // ENVELOPPE PIANO AMÉLIORÉE
  // ============================================================

  var pianoEnv = new Lourah.music.Envelop(
    { level: 1.0, duration: 1 },     // attaque quasi instantanée
    { level: 0.65, duration: 120 },  // decay rapide
    { level: 0.40, duration: 700 },  // sustain doux
    { duration: 1600 }               // release naturel
  );

  // ============================================================
  // INSTRUMENT PIANO — WAVETABLE + BRUIT + RÉSONANCE + ADSR
  // ============================================================

  Lourah.music.Instrument = function (timbre, envelop, options) {
    options = options || {};
    this.cacheId = options.name || "instrument";

    this.waveSize = options.waveSize || 2048;
    this.waveTable = precomputeWaveform(timbre, this.waveSize);

    this.getFShape = function () {
      return function (base, t) {
        var v = base;

        // bruit de marteau
        v += hammerNoise(t);

        // résonance de table
        v *= soundboardResonance(t);

        // enveloppe ADSR
        if (envelop) v = envelop.apply(v, t);

        return v;
      };
    };

    // Cache des sons : 12 notes × 12 octaves
    this.sounds = Array(notes.length);
    for (var i = 0; i < notes.length; i++) {
      this.sounds[i] = new Array(12);
    }
  };

  // ============================================================
  // INSTRUMENT PIANO FINAL
  // ============================================================

  var pianoInstrument = new Lourah.music.Instrument(
    pianoTimbre,
    pianoEnv,
    {
      name: "piano",
      waveSize: 2048
    }
  );
  
  // ============================================================
  // ORCHESTRE — STREAMING AUDIO + COMBINE DYNAMIQUE
  // ============================================================

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

    this.getDeciSize = function () {
      return deciSize;
    };

    // tempo par défaut
    this.setTempo(120);

    // tableau dynamique de blocs audio
    var combined = [];

    // allocation dynamique : garantit qu'aucun trou n'existe
    function ensureCombined(size) {
      for (var i = combined.length; i < size; i++) {
        combined[i] = new java.lang.reflect.Array.newInstance(
          java.lang.Short.TYPE, deciSize
        );
      }
    }

    // mélange d'un son dans l'orchestre
    this.combine = function (sound, duration, bloc) {
      if (!sound) return;

      // s'assurer que tous les blocs existent
      ensureCombined(bloc + duration);

      var offset = 0;

      for (var i = 0; i < duration; i++) {
        var index = bloc + i;

        // gardefou : si un trou apparaît, on le comble
        if (!combined[index]) {
          combined[index] = new java.lang.reflect.Array.newInstance(
            java.lang.Short.TYPE, deciSize
          );
        }

        var buf = combined[index];
        var sOff = offset;

        for (var k = 0; k < deciSize; k++) {
          buf[k] = (buf[k] + sound[sOff++]) >> 1;
        }

        offset += deciSize;
      }
    };

    this.compile = function () {
      // rien à compiler, streaming direct
    };

    // lecture séquentielle des blocs
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
  
  // ============================================================
  // PLAYER — SAMPLING, CACHE, PARSEUR, LECTURE
  // ============================================================

  Lourah.music.Player = function (instrument, orchestra) {

    var deciSize = orchestra.getDeciSize();
    var millis = 1000 / sampleRate;

    var cache = instrument.sounds;

    // ------------------------------------------------------------
    // Génération + sauvegarde PCM
    // ------------------------------------------------------------
    function generateAndSave(toneIndex, octave, path, len) {

      if (toneIndex < 0 || toneIndex > 11) return null;

      var sound = new java.lang.reflect.Array.newInstance(
        java.lang.Short.TYPE, len
      );

      var f = instrument.getFShape();
      var freq = notes[toneIndex] * Math.pow(2, octave - 3);

      if (!freq || isNaN(freq)) return null;

      var waveTable = instrument.waveTable;
      var waveSize = instrument.waveSize;

      if (!waveTable || !waveSize) return null;

      var phase = 0;
      var phaseInc = (freq * waveSize) / sampleRate;

      if (!phaseInc || isNaN(phaseInc)) return null;

      for (var i = 0; i < len; i++) {

        var t = i * millis;

        var idx = phase | 0;
        if (idx < 0 || idx >= waveSize) {
          phase -= waveSize * ((phase / waveSize) | 0);
          idx = phase | 0;
        }

        var base = waveTable[idx];
        if (base === undefined) base = 0;

        var v = f(base, t);
        if (!v || isNaN(v)) v = 0;

        sound[i] = (limit(clamp(v)) * 32767) | 0;

        phase += phaseInc;
        if (phase >= waveSize) phase -= waveSize;
      }

      savePCM(path, sound);
      return sound;
    }

    // ------------------------------------------------------------
    // Sampling avec cache + persistance
    // ------------------------------------------------------------
    function sampling(toneIndex, octave) {

      if (toneIndex === undefined || toneIndex === null) return null;
      if (octave === undefined || octave === null) return null;

      var len = (64 * deciSize) | 0;
      var dir = PERSIST_ROOT + instrument.cacheId + "/";
      ensureDir(dir);

      var noteName = noteNameFromIndex(toneIndex);
      if (!noteName) return null;

      var path = dir + noteName + octave + ".pcm";

      var f = new java.io.File(path);

      if (f.exists()) {
        var buf = loadPCM(path, len);
        if (buf && buf.length === len) return buf;
        f.delete();
      }

      var generated = generateAndSave(toneIndex, octave, path, len);
      if (!generated || generated.length !== len) return null;

      return generated;
    }

    // ------------------------------------------------------------
    // Parseur de phrases musicales
    // ------------------------------------------------------------
    function parsePhrase(phrase) {

      var tones = phrase.split(";");
      var parsed = [];

      var currentDuration = Lourah.music.DURATIONS["O"];
      var currentOctave = 3;

      for (var i = 0; i < tones.length; i++) {

        var n = tones[i].split(",");
        var duration = null;
        var octave = null;
        var tone = null;
        var pointed = false;

        for (var j = 0; j < n.length; j++) {

          if (Lourah.music.DURATIONS[n[j]]) {
            currentDuration = Lourah.music.DURATIONS[n[j]];
            continue;
          }

          var o = parseInt(n[j], 10);
          if (!isNaN(o)) {
            currentOctave = o;
            continue;
          }

          if (n[j] === ".") {
            pointed = true;
            continue;
          }

          if (Lourah.music.NOTES[n[j]] !== undefined) {
            tone = Lourah.music.NOTES[n[j]];
            continue;
          }
        }

        duration = currentDuration;
        if (pointed) duration = (duration / 2) * 3;

        // silence si aucune note
        if (tone === null) {
          parsed.push({
            duration: duration,
            octave: currentOctave,
            tone: 12
          });
          continue;
        }

        parsed.push({
          duration: duration,
          octave: currentOctave,
          tone: tone
        });
      }

      return parsed;
    }

    // ------------------------------------------------------------
    // Initialisation
    // ------------------------------------------------------------
    this.init = function () { };

    // ------------------------------------------------------------
    // Lecture d'une phrase
    // ------------------------------------------------------------
    this.play = function (phrase) {

      var parsed = parsePhrase(phrase);

      var at = 0;

      for (var i = 0; i < parsed.length; i++) {

        var d = parsed[i];
        if (!d || isNaN(d.tone)) continue;

        // silence
        if (d.tone === 12) {
          at += d.duration;
          continue;
        }

        if (!cache[d.tone][d.octave]) {
          cache[d.tone][d.octave] = sampling(d.tone, d.octave);
        }

        var snd = cache[d.tone][d.octave];
        if (!snd) {
          at += d.duration;
          continue;
        }

        orchestra.combine(
          snd,
          d.duration,
          at
        );

        at += d.duration;
      }
    };
  };
  
  // ============================================================
  // OPUS PLAYER — GESTION MULTI-INSTRUMENTS
  // ============================================================

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

  // ============================================================
  // MENUET K6 — 4 VOIX
  // ============================================================

  var menuetK6 = [

    "4,o,C;',E;C;" + "C#;D;o,D;" + "D;',F;D;" + "D#;E;o,E;"
    + "*,E;',E;G;F#;A;" + "G;D;*,D,.;',D#;" + "E;C;3,B;A;G;F#;"
    + "*,F#;o,G;",

    "3,*,-;E;C;" + "-;B;G;" + "-;B;G;" + "-;4,C;3,C;"
    + "*,-;A;A;" + "G;G;G;" + "A;B;D;" + "G;D;2,G;",

    "o,,3,G;',B;G;" + "G;F#;o,F#;" + "F;',4,D;3,F;" + "F;E;o,E;"
    + "*,A;',A;4,C;3,B;4,D;" + "C;E;3,*,G,.;',G#;" + "A;F;E;D;C;2,B;"
    + "*,B;3,o,C;",

    "*,-;2,B;G;" + "-;3,F;2,A;" + "-;3,D;2,B;" + "-;3,C;2,C;"
    + "3,F;F;F;" + "E;E;E;" + "F;G;2,G;" + "3,C;2,G;C"
  ];

  // ============================================================
  // OPUS : pippoAnthem — 2 INSTRUMENTS PIANO
  // ============================================================

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

  // ============================================================
  // LANCEMENT FINAL
  // ============================================================

  var opus = new Lourah.music.OpusPlayer(pippoAnthem);
  opus.learn();
  opus.play();
  opus.dismiss();

})();
