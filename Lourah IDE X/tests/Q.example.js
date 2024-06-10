Activity.importScript(Lourah.jsFramework.parentDir() + "/$Q.js");

var say = (text) => {Lourah.jsFramework.mainThread(() => console.log(text)); return text};

var active = java.lang.Thread.activeCount();


say("active::Begin::" + active);

function rand(max) {
  return Math.floor(
    Math.random()
    * Math.floor(max)
    );
  }

function f(qt) {
  while(1) {
    //say(qt.getIndex() + "::wait...");
    var msg = qt.waitMessage();
    say(qt.getIndex() + "::gotMessage::" + msg);
    java.lang.Thread.sleep(rand(100));
    if (msg === "Stop") {
      break;
      }
    }
  qt.setValue("F");
  }


function g(qt) {
  try {
    //java.lang.Thread.sleep(10);
    for(var m = 0; m < 10; m++) {
      var msg = qt.getService() + "::hi" + m + "::" + qt.getIndex();
      qt.postMessage(f, msg);
      //say("posted::" + msg);
      //java.lang.Thread.sleep(rand(200));
      }
    java.lang.Thread.sleep(5000);
    qt.postMessage(f, "Stop", true);
    qt.setValue("G");
    } catch(e) {
    Activity.reportError(
      "g::"
      + e
      + "::"
      + e.stack
      );
    }
  }

function h(qt) {
  say("h");
  }
//var t = (f) => {var thread;(thread = Lourah.jsFramework.createThread(f)).start(); return thread;};

var a = $Q.arrayFactory([g, g, f]);
var b = $Q.arrayFactory([f, g]);

a.setQThreadListener({
    onChangeValue: (qt, i, v) => say(i + "::" + qt.getValue())
    ,onStart: (qt, i) => say(i + "::" + "started")
    ,onStop: (qt, i) => say(i + "::" + "stoped")
    ,onBeforeChangeValue : (qt, i, before, after) => say(i + "::"  + before + "->" + after)
    });

b.startAll();
a.startAll();


say("active::started::" + java.lang.Thread.activeCount());
/*
say("a::[" + a + "]");

say(a.length);
*/
