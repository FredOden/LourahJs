Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');

(function() {
    var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

    Lourah.utils = Lourah.utils || {};
    
    Lourah.utils.Process = function Process(command) {
      let process;
      let thread;
      let onResponseListener;

      function getStream(inputStream, messageHandler) {
        return new java.lang.Thread({
            run: () => {

              try {
                let br = new java.io.BufferedReader(
                  new java.io.InputStreamReader(
                    inputStream
                    )
                  );

                let line;
                while ((line = br.readLine()) !== null) {
                  //console.log("line::" + line);
                  messageHandler(line);
                  }

                console.log("getStream broken");
                } catch (e) {
                Activity.reportError("getStream::error::" + e + "::" + e.stack);
                }
              }
            });
        }

      function init() {
        thread = new java.lang.Thread({
            run: () => {
              try {
                process = java.lang.Runtime.getRuntime().exec(command);
                const stdin = getStream(process.getInputStream(), onResponseListener.inputStreamMessageHandler);
                const stderr = getStream(process.getErrorStream(), onResponseListener.errorStreamMessageHandler);
                stdin.start();
                stderr.start();
                stdin.join();
                stderr.join();
                } catch(e) {
                Activity.reportError("Interpreter::init::error::" + e + "::" + e.stack);
                }
              finally {
                console.log("Process::thread::finally ended");
                }
              }
            });
        }

      this.start = () => {
        if (!onResponseListener) {
          throw "Process::start::error::onResponseListener required";
          }
        if (!thread) {
          throw "Process::start::error::thread not initialized";
          }
        thread.start();
        };


      this.write = new Synchronizer((t) => {
          try {
            process.getOutputStream().write(t);
            process.getOutputStream().flush();
            } catch(e) { Activity.reportError("Interpreter::" + e + "::" + e.stack); }
          });

      this.setOnResponseListener = (onResponseListenerCustom) => {
        onResponseListener = onResponseListenerCustom;
        };

      init();
      }
    })();

const $screen = Lourah.android.Overview.buildFromSugar(
  {
    $main: {
      class: android.widget.LinearLayout
      ,setOrientation: android.widget.LinearLayout.VERTICAL
      ,$sv: {
        class: android.widget.ScrollView
        ,$terminal: {
          class: android.widget.MultiAutoCompleteTextView
          ,setBackgroundColor: android.graphics. Color.BLACK
          ,setTextColor: android.graphics. Color.WHITE
          ,setTextSize: 12
          }
        }
      }
    }
  );


Lourah.jsFramework.setOnBackButtonListener(() => false);

Activity.setTitle("jsTerminal");
Activity.setContentView($screen.$main);

const PATH= ""; //Lourah.jsFramework.parentDir() + "/usr/bin/";

let process = new Lourah.utils.Process([PATH + "sh"]); //, "-l", "/storage/emulated/0"]);
let interactive = true;

process.setOnResponseListener({

  inputStreamMessageHandler: (line) => {
    Lourah.jsFramework.uiThread(() => {
        interactive = false;
        $screen.$terminal.append("" + line + "\n");
        interactive = true;
        });
    }

  ,errorStreamMessageHandler: (line) => {
    Lourah.jsFramework.uiThread(() => {
        interactive = false;
        $screen.$terminal.append("<stderr>" + line + "\n");
        interactive = true;
        });
    }

  });


$screen.$terminal.addTextChangedListener({
  afterTextChanged: (sEditable) => {
    if (!interactive) return;
    //console.log("afterTextChanged::<" + sEditable + ">");
    }
  ,beforeTextChanged: (sCharSequence,
    iStart, iCount, iAfter
    ) => {
    if (!interactive) return;
    /*
    console.log(
      "sCharSequence::" + sCharSequence
      + "::iStart::" + iStart
      + "::iCount::" + iCount
      + "::iAfter::" + iAfter
      );
    /**/
    }
  ,onTextChanged: (sCharSequence, iStart, iBefore, iCount) => {
    try {
      if (!interactive) return;
      /*
      console.log(
        "sCharSequence::<" + ("" + sCharSequence).substr(iStart + iBefore, iCount) + ">"
        +"::iStart::" + iStart
        +"::iBefore::" + iBefore
        +"::iCount::" + iCount
        );
      /**/
      for(let i = iBefore; i < iCount; i++) {
        process.write(sCharSequence.charAt(iStart + i));
        }
      //process.write(("" + sCharSequence).substr(iStart + iBefore, iCount));
      } catch (e) {
      console.log("onTextChanged::error::" + e + "::" + e.stack
        +"::iStart::" + iStart
        +"::iBefore::" + iBefore
        +"::iCount::" + iCount
        );
      }
    }

  });


function JsTerminal(textView) {

  }

process.start();
