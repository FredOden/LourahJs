var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

function Shell() {

  var sh;
  var outputStream;
  var inputStream;
  var sBuffer = "";
  var bStarted = false;
  var tReader;



  this.store = new Synchronizer(function (charCode) {
      console.log("charCode::" + charCode);
      });


  this.start = () => {
    try {
      tReader = new java.lang.Thread({
          run: () => {
            var i;
            var count = 10;
            console.log("thread started");
            try {
              (Synchronizer(function () {
                    sh = java.lang.Runtime.getRuntime().exec("sh");
                    outputStream = new java.io.DataOutputStream(sh.getOutputStream());
                    inputStream = sh.getInputStream();
                    bStarted = true;
                    console.log("thread initialized");
                    }))();
              while (bStarted && (i = inputStream.read()) != -1) {
                this.store(i);
                //java.lang.Thread.sleep(1000);
                console.log("count::" + count--);
                if (!count) break;
                }
              console.log("thread stopped::bStart::" + bStarted);
              }
            catch(e) {
              console.log("tReader::" + e);
              }
            }
          }, "tReader");

      tReader.start();
      } catch(e) {
      console.log("tReader::" + e);
      }
    }

  this.exec = Synchronizer(function (command) {
      try {
        outputStream.writeBytes(command);
        outputStream.flush();
        return command; //Activity.inputStream2String(sh.getInputStream());
        } catch(e) {
        console.log("Shell::do::" + e);
        }
      });

  this.end = Synchronizer(function () {
      try {
        console.log("Shell::end");
        outputStream.writeBytes("exit\n");
        outputStream.flush();
        bStarted = false;
        tReader.interrupt();
        console.log("Shell::end::interrupt");
        // Activity.inputStream2String(sh.getInputStream());
        //sh.waitFor();
        } catch (e) {
        console.log("Shell::end::" + e);
        }
      });
  //sh.waitFor();
  }

var s = new Shell();

s.start();

java.lang.Thread.sleep(20);

console.log(s.exec("ps -a\n"));

java.lang.Thread.sleep(1000);


console.log(s.end());
