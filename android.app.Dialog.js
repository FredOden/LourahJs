var Lourah = Lourah || {};
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
Lourah.getActivity = () => Activity;
(function() {

    var Activity = Lourah.getActivity();
    try {
      Activity = __Activity__
      } catch (e) {}
    Lourah.android = Lourah.android || {};
    Lourah.android.app = Lourah.android.app || {};
    if (Lourah.android.app.Dialog) return;
    Lourah.android.app.Dialog = function(activity) {
      var builder = new android.app.AlertDialog.Builder(Activity);
      this.setTitle = title => {builder.setTitle(title); return this;}
      this.setView = view => {builder.setView(view); return this;}
      this.setMessage = message => {builder.setMessage(message); return this;}
      this.getBuilder = () => builder;
      this.setButton = button => {
        builder[button.getKind()](
          button.getText()
          ,{
            onClick : (dialog, id) => {
              button.getOnClick()(this, button, dialog, id);
              }
            }
          );
        };

      this.show = (fAsynchronousCallBack) => {
        try {
          var dialog = builder.create();

          if (!fAsynchronousCallBack) {
            dialog.setOnCancelListener({
                onCancel: (dialog) => {
                  //do whatever you want the back key to do

                  throw false;
                  }
                });
            }

          dialog.show();
          return this;
          } catch(e) {
          activity.reportError("Lourah::android::app::Dialog::show::" + e + "::" + e.stack);
          }
        }
      };

    Lourah.android.app.Dialog.Button = function(kind, text, onClick) {
      this.getKind = () => kind;
      this.getText = () => text;
      this.getOnClick = () => onClick;
      };

    Lourah.android.app.Dialog.Button.POSITIVE = "setPositiveButton";
    Lourah.android.app.Dialog.Button.NEGATIVE = "setNegativeButton";
    Lourah.android.app.Dialog.Button.NEUTRAL = "setNeutralButton";


    Lourah.android.app.Dialog.Question = function(Activity, title, message, textOk, textCancel) {
      var callBack = undefined;
      var d = new Lourah.android.app.Dialog(Activity);
      var answer = undefined;
      d.setTitle(title);
      d.setMessage(message);
      d.setButton(new Lourah.android.app.Dialog.Button(
          Lourah.android.app.Dialog.Button.POSITIVE
          ,textOk?textOk:"YES"
          ,(me, clicked, d, i) => {
            answer = true;
            if (!callBack) {
              throw true;
              } else {
              try {
                callBack(this);
                } catch(e) {
                Activity.reportError("Dialog.Question::Lourah.android.app.Dialog.Button.POSITIVE::" + e + "::" + e.stack);
                }
              }
            }
          ));
      d.setButton(new Lourah.android.app.Dialog.Button(
          Lourah.android.app.Dialog.Button.NEGATIVE
          ,textCancel?textCancel:"NO"
          , (me, clicked, d, i) => {
            answer = false;
            if (!callBack) {
              throw false;
              } else {
              try {
                callBack(this);
                } catch(e) {
                Activity.reportError("Dialog.Question::Lourah.android.app.Dialog.Button.NEGATIVR::" + e + "::" + e.stack);
                }
              }
            }
          ));

      this.ask = (f) =>  {
        if (f) callBack = f;
        d.show(f);

        if (!callBack) {
          try {
            if (android.os.Looper.myLooper() === null) {
              android.os.Looper.prepare();
              }
            android.os.Looper.loop();
            } catch(choice) {
            //android.os.Looper.quit();
            } finally {
            d = undefined;
            }
          }
        }

      this.getAnswer = () => answer;
      }

    Lourah.android.app.Dialog.Custom =  function(activity, title, view) {
      var dialog = new Lourah.android.app.Dialog(activity);
      dialog.setTitle(title);
      dialog.setView(view);
      this.show = () => dialog.show(() => true);
      }

    Lourah.android.app.Dialog.Search = function(activity, title, text) {
      var sugar = {
        $main:{
          class: "android.widget.LinearLayout"
          , setOrientation: android.widget.LinearLayout.VERTICAL
          , $pattern: {
            class : "android.widget.EditText"
            ,setHint : "'text or pattern to search'"
            ,setTextColor : android.graphics.Color.WHITE
            ,setHintTextColor : android.graphics.Color.LTGRAY
            }
          , $lbuttons: {
            class: "android.widget.LinearLayout"
            , setOrientation: android.widget.LinearLayout.HORIZONTAL
            ,$prev : {
              class: "android.widget.Button"
              , setText: "'<-'"
              , setEnabled: false
              , setOnClickListener : { onClick: onClick }
              }
            ,$search: {
              class: "android.widget.Button"
              , setText: "'Search'"
              , setOnClickListener : { onClick: onClick }
              }
            ,$next: {
              class: "android.widget.Button"
              , setText: "'->'"
              , setEnabled: false
              , setOnClickListener : { onClick: onClick }
              }
            }
          }
        };

      var view;

      var custom = new Lourah.android.app.Dialog.Custom(
        Activity
        ,title
        ,(view = Lourah.android.Overview.buildFromSugar(sugar)).$main
        );

      var found = [];

      var currentIndex = -1;

      var handlers = {};


      function onClick(v) {
        switch(v) {
          case view.$search: {
            try {

              var pattern = view.$pattern.getText().toString();


              if (pattern.length() === 0) {
                view.$prev.setEnabled(false);
                view.$next.setEnabled(false);
                return;
                }

              //console.log("search...::'" + text + "';;" + pattern.length());
              


              var aFound;
              var re = new RegExp(pattern, "g");
              var i = 0;
              while (aFound = re.exec(text)) {
                //console.log("aFound::" + aFound);
                found[i] = {
                  at: re.lastIndex - aFound[0].length
                  ,length: aFound[0].length
                  ,found: aFound[0]
                  ,index:i
                  };
                //console.log("found::"+i + "::" + JSON.stringify(found[i]));
                i++;
                //if (i===10) break;
                currentIndex = -1;
                view.$prev.setEnabled(true);
                view.$next.setEnabled(true);
                }

              handlers.onSearch(found);
              } catch(e) {
              Activity.reportError("Lourah.android.app.Dialog.Search::onSearch::" +  e + "::" + e.stack);
              }
            }
          break;
          case view.$prev:
          try {
            if (currentIndex === -1) currentIndex = 0;
            currentIndex = (found.length + currentIndex -1)%found.length;
            handlers.onOccurence(found[currentIndex]);
            } catch(e) {
            Activity.reportError("Lourah.android.app.Dialog.Search::onNext::" +  e + "::" + e.stack);
            }
          break;
          case view.$next:
          try {
            currentIndex = (currentIndex + 1)%found.length;
            handlers.onOccurence(found[currentIndex]);
            
            } catch(e) {
            Activity.reportError("Lourah.android.app.Dialog.Search::onNext::" +  e + "::" + e.stack);
            }
          break;
          default: console.log("out of Africa");
          break;
          }

        }

      this.show = (h) => {
        handlers = h;
        custom.show();
        }
      };
/*
    s = new Lourah.android.app.Dialog.Search(Activity, "@Search", "the quick brown fox jumps over the lazy dog");
    s.show({
        onSearch:(f) => console.log("onSearch::" + JSON.stringify(f))
        ,onOccurence:(f) => console.log("onOccurence::" + JSON.stringify(f))
        });
*/

    var sf = {
      ll : {
        class: "android.widget.LinearLayout"
        , attributes: {
          setId : android.view.View.generateViewId()
          ,setOrientation : android.widget.LinearLayout.VERTICAL
          }
        , content: {
          filename: {
            class: "android.widget.EditText"
            ,attributes: {
              setTextColor : android.graphics.Color.WHITE
              ,setHint : "'enter filename'"
              //,setVisibility : android.view.View.GONE
              }
            }
          ,hls: {
            class: "android.widget.HorizontalScrollView"
            ,content : {
              hl: {
                class : "android.widget.LinearLayout"
                ,attributes: {
                  setOrientation : android.widget.LinearLayout.HORIZONTAL
                  }
                }
              }
            }
          }
        }
      }

    var lf = {
      sv : {
        class: "android.widget.ScrollView"
        ,content: {
          ll : {
            class: "android.widget.LinearLayout"
            ,attributes: {
              setId : android.view.View.generateViewId()
              ,setOrientation : android.widget.LinearLayout.VERTICAL
              }
            }
          }
        }
      }


    Lourah.android.app.Dialog.Chooser = function(activity, dir, save) {
      var callBack = undefined;
      var saveLayout = (new Lourah.android.Overview(sf)).$();
      var listLayout = (new Lourah.android.Overview(lf)).$();

      if (!dir) dir = Lourah.jsFramework.dir();

      var pwd = dir;


      var dialog = new Lourah.android.app.Dialog(activity);
      var filename = undefined;
      dialog.setTitle(save?"Save as ...":"Open ...");
      dialog.setView(saveLayout.ll);
      if (!save) saveLayout.filename.setVisibility(android.view.View.GONE);

      try {

        saveLayout.ll.addView(listLayout.sv);
        saveLayout.filename.addTextChangedListener({
            beforeTextChanged: () => {}
            ,onTextChanged: () => {}
            ,afterTextChanged: (text) => {
              saveLayout.filename.setTag(pwd + "/" + text);
              }
            });



        var flb = new FileListBox(listLayout.ll
          ,f => {
            if (!f.isDirectory()) {
              saveLayout.filename.setText(f.getName().toString());
              saveLayout.filename.setTag(f.getPath().toString());
              } else {
              flb.chdir(f.getPath());
              path.chdir(f.getPath());
              saveLayout.filename.setText("");
              saveLayout.filename.setTag(null);
              pwd = f.getPath();
              }
            });
        flb.chdir(dir);

        var path = new PathList(saveLayout.hl
          ,d => {
            try {
              flb.chdir(d);
              path.chdir(d);
              saveLayout.filename.setText("");
              saveLayout.filename.setTag(null);
              pwd = d;
              } catch(e) {
              Activity.reportError("Path::chdir::error" + e);
              }
            });
        path.chdir(dir);

        } catch(e) {
        Activity.reportError("adapter<?>::error::" + e);
        }


      dialog.setButton(new Lourah.android.app.Dialog.Button(
          Lourah.android.app.Dialog.Button.POSITIVE
          ,save?"Save":"Open"
          ,(dialog, button, d, i) => {
            //activity.reportError("DialogSave::save::" + saveLayout.filename.getText());
            if (!saveLayout.filename.getTag()) {
              return;
              }
            filename = new java.io.File(saveLayout.filename.getTag());
            if (callBack) {
              try {
                callBack(this);
                } catch(e) {
                Activity.reportError("Dialog.Chooser::Lourah.android.app.Dialog.Button.POSITIVE::" + e + "::" + e.stack);
                }
              } else {
              //if (!filename) filename = pwd + "/" + saveLayout.filename.getText();
              throw true;
              }
            }
          ));

      dialog.setButton(new Lourah.android.app.Dialog.Button(
          Lourah.android.app.Dialog.Button.NEGATIVE
          ,"Cancel"
          ,() => {
            filename = undefined;
            if (callBack) {
              try {
                callBack(this);
                } catch(e) {
                Activity.reportError("Dialog.Chooser::Lourah.android.app.Dialog.Button.NEGATIVE::" + e + "::" + e.stack);
                }
              } else {
              //if (!filename) filename = pwd + "/" + saveLayout.filename.getText();
              throw false;
              }
            }
          ));

      this.ask = (f) =>  {
        callBack = f;
        dialog.show(f);
        if(!f) {
          try {

            if (android.os.Looper.myLooper() === null) {
              android.os.Looper.prepare();
              }
            android.os.Looper.loop();
            } catch(choice) {
            } finally {
            dialog = undefined;
            //android.os.Looper.quit();
            }
          }
        }
      this.getFilename = () => filename;
      this.getCwd = () => pwd;
      }


    function FileListBox(container, handler) {
      var selected = undefined;
      var folderIcon = android.R.drawable.ic_menu_more; //arrow_down_float;
      var fileIcon = android.R.drawable.ic_menu_save;
      var pwd = undefined;

      this.chdir = (dir) => {
        container.removeAllViews();
        var folder = new java.io.File(dir);
        folder.listFiles().sort(
          (a,b) => (a.isDirectory()?"0"+a:"1"+a).localeCompare(b.isDirectory()?"0"+b:"1"+b)
          ).forEach(file => this.addItem(file));
        }

      this.addItem = (file) => {
        var tv = new android.widget.TextView(Activity);
        tv.setTextColor(android.graphics.Color.WHITE);
        tv.setBackgroundColor(android.graphics.Color.BLACK);
        tv.setText(file.getName().toString());
        tv.setCompoundDrawablesWithIntrinsicBounds(
          file.isDirectory()?folderIcon:fileIcon
          , 0, 0, 0);
        tv.setGravity(android.view.Gravity.CENTER_VERTICAL);
        container.addView(tv);
        tv.setOnClickListener({
            onClick: (v) => {
              try {
                if (selected) selected.setBackgroundColor(android.graphics.Color.BLACK);
                v.setBackgroundColor(android.graphics.Color.MAGENTA);
                handler(file);
                selected = v;
                } catch(e) {
                Activity.reportError("OnClick::error::" + e);
                }
              }
            });
        }
      }

    function PathList(container, handler) {
      var pwd = undefined;
      this.chdir = (dir) => {
        var folder = "";
        container.removeAllViews();
        dir.split("/").forEach(d => {
            folder = folder + d + "/";
            var vd = new android.widget.TextView(Activity);
            //vd.setEnabled(false);
            vd.setText(d);
            vd.setTag(folder);
            var tv = new android.widget.TextView(Activity);
            //tv.setEnabled(false);
            tv.setText("/");
            vd.setTextColor(android.graphics.Color.CYAN);
            tv.setTextColor(android.graphics.Color.MAGENTA);
            vd.setBackgroundColor(android.graphics.Color.BLACK);
            tv.setBackgroundColor(android.graphics.Color.BLACK);
            container.addView(tv);
            container.addView(vd);
            vd.setOnClickListener({
                onClick: v => {
                  handler(v.getTag());
                  //Activity.reportError(v.getText() + "::" + v.getTag());
                  }
                });
            });
        }
      }

    function ls(folderName) {
      var folder = new java.io.File(folderName);
      var files = folder.listFiles();
      return files;
      }

    //var f = ls(Lourah.jsFramework.dir());
    //Activity.reportError("files::"+ f.length);


    })();
