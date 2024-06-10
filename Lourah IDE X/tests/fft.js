Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");

function audioPlayer(pathName)
{ //set up MediaPlayer
  console.log("audioPayer::" + pathName);
  var mp = new android.media.MediaPlayer();
  try {
    mp.setDataSource(pathName);
    mp.prepare();
    mp.start();
    }
  catch (e) {
    e.printStackTrace();
    }
  }


var frequencies = [ 440, 880, 1000, 2000, 4000, 8000 ];
const MAX_POINTS = 1024;
const F_SAMPLING = 64*1024;
const K = 2*Math.PI/F_SAMPLING;
var x = new Array(MAX_POINTS);
for(var i = 0; i < MAX_POINTS - 1; i++) {
  x[i] = 0;
  }
var count = 0;
for(var i = 0; i < MAX_POINTS - 1; i++) {
  for(var j = 0; j < frequencies.length; j++) {
    x[i] = x[i] + Math.sin(K*i*frequencies[j]);
    count++;
    }
  }

console.log("count::" + count);


/*
audioPlayer(Lourah.jsFramework.dir()
  + "/file_example_MP3_5MG.mp3");
*/

var s = {
  $ll: {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL

    ,setLayoutParams:new android.widget.LinearLayout.LayoutParams(
      android.widget.LinearLayout.LayoutParams.FILL_PARENT
      ,android.widget.LinearLayout.LayoutParams.FILL_PARENT
      )

    ,$buttons: {
      class: "android.widget.LinearLayout"
      ,setOrientation: android.widget.LinearLayout.HORIZONTAL
      ,$play: {
        class: "android.widget.Button"
        ,setText: "'Play'"
        ,setOnClickListener: {
          onClick: (v) => {
            try {
              mp.start();
              } catch(e) {
              Activity.reportError("$play::" + e + "::" + e.stack);
              }
            }
          }
        }
      ,$pause: {

        class: "android.widget.Button"
        ,setText: "'Pause'"
        ,setOnClickListener:{onClick:(v) => {
            try {
              mp.pause();
              } catch(e) {
              Activity.reportError("$pause::" + e + "::" + e.stack);
              }
            }}

        }
      ,$stop: {
        class: "android.widget.Button"
        ,setText: "'Reset'"
        ,setOnClickListener:{onClick:(v) => {
            try {
              mp.seekTo(0);

              } catch(e) {
              Activity.reportError("$stop::" + e + "::" + e.stack);
              }
            }}
        }
      }
    ,$sv : {
      class: "android.widget.ScrollView"
      ,$equalizer: {
        class: "android.widget.LinearLayout"
        ,setOrientation: android.widget.LinearLayout.VERTICAL
        //,setHeight: android.widget.LinearLayout.LayoutParams.FILL_PARENT

        ,setLayoutParams:new android.widget.LinearLayout.LayoutParams(
          android.widget.LinearLayout.LayoutParams.MATCH_PARENT
          ,2000//android.widget.LinearLayout.LayoutParams.MATCH_PARENT
          )


        ,$bars: {
          class: "android.widget.LinearLayout"
          ,setOrientation: android.widget.LinearLayout.VERTICAL

          ,setLayoutParams:new android.widget.LinearLayout.LayoutParams(
            android.widget.LinearLayout.LayoutParams.MATCH_PARENT
            ,2000//android.widget.LinearLayout.LayoutParams.MATCH_PARENT
            )

          /*
          ,$master: {
            class:"android.widget.SeekBar"
            ,setMax:3000
            ,setRotation:270
            ,setProgress:1500
            ,setLayoutParams:new android.widget.LinearLayout.LayoutParams(
              500 //android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
              ,1000 //android.widget.LinearLayout.LayoutParams.FILL_PARENT
              )
            }
          */
          }
        }
      }
    }
  };

var b = {
  $lband: {
    class:"android.widget.LinearLayout"
    ,$label: {
      class:"android.widget.TextView"
      }
    ,$band: {
      class:"android.widget.SeekBar"
      }
    ,$text: {
      class:"android.widget.TextView"
      }
    }
  };

var screen = Lourah.android.Overview.buildFromSugar(s);


Lourah.jsFramework.setOnBackButtonListener(
  () => {
    mp.stop();
    mp.release();
    return false;
    }
  );


Activity.setTitle("FFT by Lourah");
Activity.setContentView(screen.$ll);

const pathName = Lourah.jsFramework.root() + "/Documents/Alain Bashung - Gaby oh Gaby.mp3";

var mp = new android.media.MediaPlayer();
try {
  mp.setDataSource(pathName);
  mp.prepare();
  //mp.start();
  }
catch (e) {
  e.printStackTrace();
  }

var audioSessionId = mp.getAudioSessionId();
var equalizer = new android.media.audiofx.Equalizer(0, audioSessionId);
equalizer.setEnabled(true);
var nbOfBands = equalizer.getNumberOfBands();
console.log("nbOfBands::" + nbOfBands);
var bands = new Array(nbOfBands);
for(var i = 0; i < nbOfBands; i++) {
  var fs = equalizer.getBandFreqRange(i);
  var ls = equalizer.getBandLevelRange();
  bands[i] = {
    level:equalizer.getBandLevel(i)
    ,fRange: [fs[0], fs[1]]
    ,lRange: [ls[0], ls[1]]
    }
  console.log("band::" + i + "::" + JSON.stringify(bands[i]));
  var bandUi = Lourah.android.Overview.buildFromSugar(b);
  bandUi.$band.setTag(i);
  var meanLog = Math.sqrt(bands[i].fRange[0]*bands[i].fRange[1]);
  bandUi.$label.setText("" + ((bands[i].fRange[0]/1000)|0));

  bandUi.$band.setOnSeekBarChangeListener({

      onProgressChanged:(v) => {
        try {
          var i = v.getTag()|0;
          var level = v.getProgress() + bands[i].lRange[0];
          equalizer.setBandLevel(i, level);
          bands[i].ui.$text.setText("" + level);

          //console.log(":::::" + [ v.getTag(), v.getProgress()]);
          } catch(e) {
          console.log("onProgressChanged::" + e + "::" + e.stack);
          }
        }
      ,onStartTrackingTouch: (v) => {}
      ,onStopTrackingTouch: (v) => {}
      }
    );

  bands[i].ui = bandUi;
  bands[i].idx = i;
  bandUi.$band.setMax(bands[i].lRange[1] - bands[i].lRange[0]);

  bandUi.$band.setProgress(bands[i].level - bands[i].lRange[0]);

  
  screen.$bars.addView(bandUi.$lband);

  var lp = bandUi.$band.getLayoutParams();
  lp.height = 100;
  lp.width = 900;
  }
