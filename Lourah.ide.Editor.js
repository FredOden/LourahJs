var Lourah = Lourah || {};
(function () {
    Lourah.ide = Lourah.ide || {};
    if (Lourah.ide.Editor) return;

    Activity.importScript(Lourah.jsFramework.parentDir() + "/android.app.Dialog.js");

    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Overview.js");
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ide.Languages.NEW.js");
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.ide.JsEngine.js");




    Lourah.ide.Editor = function() {

      var saved = true;
      var filename = null;
      var colorize = true;
      var cwd = Lourah.jsFramework.parentDir();
      var colorizationPass = -1;

      this.isSaved = () => saved;
      this.getFilename = () => filename;

      var editor = (new Lourah.android.Overview({
            widget : {
              class : "android.widget.ScrollView"
              ,content : {
                ll : {
                  class : "android.widget.LinearLayout"
                  , attributes : {
                    setOrientation : android.widget.LinearLayout.VERTICAL
                    }
                  , content : {
                    hl : {
                      class: "android.widget.LinearLayout"
                      ,attributes : {
                        setOrientation : android.widget.LinearLayout.HORIZONTAL
                        ,setPadding : [0, 0, 0, 0]
                        }
                      ,content: {
                        hln : {
                          class: "android.widget.HorizontalScrollView"
                          ,content : {
                            ln : {
                              class: "android.widget.EditText"
                              , attributes : {
                                setTextColor: 0xffbfa090|0
                                ,setBackgroundColor : android.graphics.Color.BLACK
                                ,setEnabled : false
                                ,setTextSize : 12
                                ,setTypeface : android.graphics.Typeface.MONOSPACE
                                //,setMaxWidth : 44*3
                                ,setGravity : android.view.Gravity.RIGHT
                                ,setPadding : [0, 5, 0, 0]
                                //,setEms : 2
                                }
                              }
                            }
                          }
                        ,hsv : {
                          class : "android.widget.HorizontalScrollView"
                          ,content: {
                            et : {
                              class : "android.widget.MultiAutoCompleteTextView"
                              ,attributes : {
                                setTextColor: android.graphics.Color.WHITE
                                ,setBackgroundColor : android.graphics.Color.BLACK
                                ,setTypeface : android.graphics.Typeface.MONOSPACE
                                ,setTextSize : 12
                                ,setEms : 80
                                ,setPadding : [5, 0, 0, 0]
                                ,setInputType : android.text.InputType.TYPE_NULL
                                | android.text.InputType.TYPE_CLASS_TEXT
                                | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE
                                | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
                                }
                              }
                            }
                          }
                        }
                      }

                    ,tv : {
                      class : "android.widget.TextView"
                      ,attributes : {
                        setTextColor : android.graphics.Color.WHITE
                        ,setBackgroundColor : android.graphics.Color.BLUE
                        }
                      }
                    }
                  }
                }
              }

            }
          )).$();

      var mpadding = 20;
      var menu = (new Lourah.android.Overview({
            widget : {
              class : "android.widget.GridLayout"
              , attributes : {
                setOrientation : android.widget.LinearLayout.HORIZONTAL
                ,setBackgroundColor : 0xff000000|0
                //,setGravity : android.view.Gravity.RIGHT

                }
              , content : {
                file : {
                  class: "android.widget.TextView"
                  ,attributes: {
                    setText: "'@File'"
                    ,setBackgroundColor : 0xff000000|0
                    ,setTextColor : 0xff00ff00|0
                    ,setPadding : [mpadding, 0, mpadding, 0]
                    ,setClickable : true
                    }
                  }
                ,edit : {
                  class: "android.widget.TextView"
                  ,attributes: {
                    setText: "'@Edit'"
                    ,setBackgroundColor : 0xff000000|0
                    ,setTextColor : 0xff00ff00|0
                    ,setPadding : [mpadding, 0, mpadding, 0]
                    ,setClickable : true
                    }
                  }
                ,search : {
                  class: "android.widget.TextView"
                  ,attributes: {
                    setText: "'@Search'"
                    ,setBackgroundColor : 0xff000000|0
                    ,setTextColor : 0xff00ff00|0
                    ,setPadding : [mpadding, 0, mpadding, 0]
                    ,setClickable : true
                    }
                  }
                ,exec : {
                  class: "android.widget.TextView"
                  ,attributes: {
                    setText: "'@Exec'"
                    ,setBackgroundColor : 0xff000000|0
                    ,setTextColor : 0xff00ff00|0
                    ,setPadding : [mpadding, 0, mpadding, 0]
                    ,setClickable : true
                    }
                  }
                ,about : {
                  class: "android.widget.TextView"
                  ,attributes: {
                    setText: "'@About'"
                    ,setBackgroundColor : 0xff000000|0
                    ,setTextColor : 0xff00ff00|0
                    ,setPadding : [mpadding, 0, mpadding, 0]
                    ,setClickable : true
                    }
                  }
                }
              }
            })).$();

      var searchBar = (new Lourah.android.Overview({
            widget: {
              class: "android.widget.LinearLayout"
              ,attributes:{
                setOrientation: android.widget.LinearLayout.HORIZONTAL
                }
              ,content: {
                search: {
                  class: "android.widget.EditText"
                  , attributes: {
                    setTextColor: android.graphics.Color.WHITE
                    ,setBackgroundColor : android.graphics.Color.BLACK
                    ,setPadding : [5, 0, 0, 0]
                    ,setTypeface : android.graphics.Typeface.MONOSPACE
                    ,setTextSize : 12
                    }
                  }
                ,bsearch : {
                  class: "android.widget.TextView"
                  , attributes: {
                    setText: '"-o"'
                    ,setPadding : [5, 0, 0, 0]
                    }
                  }
                ,bprev : {
                  class: "android.widget.TextView"
                  , attributes: {
                    setText: '"<-"'
                    ,setPadding : [5, 0, 0, 0]
                    }
                  }
                ,bnext : {
                  class: "android.widget.TextView"
                  , attributes: {
                    setText: '"->"'
                    ,setPadding : [5, 0, 0, 0]
                    }
                  }
                ,bexit : {
                  class: "android.widget.TextView"
                  , attributes: {
                    setText: '"X"'
                    ,setPadding : [5, 0, 0, 0]
                    }
                  }
                }
              }
            })).$();




      var frame = (new Lourah.android.Overview({
            widget : {
              class : "android.widget.LinearLayout"
              , attributes : {
                setOrientation : android.widget.LinearLayout.VERTICAL
                }
              , content : {
                title : {
                  class: "android.widget.TextView"
                  , attributes : {
                    setText: "'@Scratch'"
                    ,setTextColor: 0xffff002f|0
                    ,setBackgroundColor: 0xff2f2f2f|0
                    ,setGravity: android.view.Gravity.CENTER
                    }
                  }
                ,menu : menu.widget
                //,search: searchBar.widget
                ,editor : editor.widget
                }
              }
            })).$();


      this.getWidget = () => frame.widget;
      this.getFrame = () => frame;
      this.getEditor = () => editor;

      editor.et.addTextChangedListener({
          beforeTextChanged : (s, start, count, after) => {
            try {
              beforeChange(s, start, count, after);
              } catch(e) {
              Activity.reportError("identation::" + e + "::" + e.stack);
              }
            }
          , onTextChanged : (s, start, before, count) => {
            try {
              onChange(s, start, before, count);
              } catch(e) {
              Activity.reportError("identation::" + e + "::" + e.stack);
              }
            }
          , afterTextChanged : (s) => {
            //Activity.reportError("et::" + s);
            try {


              //Activity.reportError("afterTextChanged::" + colorizationPass);
              colorSyntax(s);
              numberLines(s);

              saved = false;

              //editor.et.invalidate();//@optim
              } catch(e) {
              Activity.reportError("colorSyntax::" + e + "::" + e.stack);
              }

            }
          });

      var newLine = -1;
      var space = ' '.repeat(2);
      var nl = '\n';

      var language = Lourah.ide.DefaultLanguage;

      this.getLanguage = () => language;


      function beforeChange(s, start, count, after) {
        //log("beforeChsnge::" + start + "::" + count + "::" + after + "::s::'" + s + "'");
        newLine = -1;
        }

      function onChange(s, start, before, count) {
        //log("onChsnge::" + start + "::" + before + "::" + count);
        if (count >= before) {
          //log("onChange::at::(" + start + "," + before + "," + count + ")");
          var jss = "" + s.subSequence(start + before, start + count).toString();
          //log("  onChange::insert::'" + jss + "'::s::'" + s + "'");
          if (jss === nl) {
            //log("onChange::newline::at::" + (start + before));
            newLine = start+before;
            }
          }
        }

      function indent(s, at) {

        var depth = 0;
        var str = s.toString();
        for(var i in language.indentations) {
          var indentation = language.indentations[i];
          var match_in = indentation.in.exec(str);
          var idx;
          var d = 0;
          while(match_in && (idx = (indentation.in.lastIndex - match_in[0].length)) < at) {
            d++;
            match_in = indentation.in.exec(str);
            }
          indentation.in.lastIndex = 0;
          var match_out = indentation.out.exec(str);
          while(match_out && (idx = indentation.out.lastIndex - match_out[0].length) < at) {
            d--;
            match_out = indentation.out.exec(str);
            }
          indentation.out.lastIndex = 0;
          if (d > 0) depth += d;
          }

        if (depth <= 0) return;

        var spaces = space.repeat(depth);
        //colorize = false;
        s.insert(at + 1, spaces);
        }


      function colorSyntax(s) {

        if (!colorize) return;

        colorizationPass++;

        if (newLine !== -1) {
          indent(s, newLine);
          return;
          }



        var spans;

        function SpanCollection(sstring) {
          var spannableString = sstring;
          var collection = {};
          function setKey(from, to) {
            return from + "," + to;
            }

          this.addSpan = (from, to, span) => {
            collection[setKey(from, to)] = span;
            };

          this.wasSpanAt = (from, to) => {
            var was = false;
            var k;
            if (collection[k = setKey(from, to)]) {
              was = true;
              delete collection[k];
              }
            return was;
            };

          this.purge = () => {
            var keys = Object.keys(collection);
            //Activity.reportError("remove::" + keys.length);
            for(var i = 0; i < keys.length; i++) {
              spannableString.removeSpan(collection[keys[i]]);
              }
            };
          }

        var start = java.lang.System.currentTimeMillis();
        spans=s.getSpans(0, s.length(), android.text.style.ForegroundColorSpan);
        var foregroundColorSpans = new SpanCollection(s);
        for(var i=0; i<spans.length; i++){
          var span = spans[i];
          //Activity.reportError("span::" + s.getSpanStart(span) + "::" + s.getSpanEnd(span));
          foregroundColorSpans.addSpan(s.getSpanStart(span), s.getSpanEnd(span), span);
          //s.removeSpan(spans[i]);
          }

        var backgroundColorSpans = new SpanCollection(s);
        spans=s.getSpans(0, s.length(), android.text.style.BackgroundColorSpan);
        for(var i=0; i<spans.length; i++){
          var span = spans[i];
          backgroundColorSpans.addSpan(s.getSpanStart(span), s.getSpanEnd(span), span);
          //s.removeSpan(spans[i]);
          }

        var styleSpans = new SpanCollection(s);
        spans=s.getSpans(0, s.length(), android.text.style.StyleSpan);
        for(var i=0; i<spans.length; i++){
          var span = spans[i];
          styleSpans.addSpan(s.getSpanStart(span), s.getSpanEnd(span), span);
          //s.removeSpan(spans[i]);
          }
        //Activity.reportError("time1::" + (java.lang.System.currentTimeMillis() - start));

        var str = s.toString();
        for (var f in language.colorizations) {
          var family = language.colorizations[f];
          var matches = family.re.exec(str);

          if (matches) {
            for(;;) {
              var idx = family.re.lastIndex - matches[0].length;
              if(family.foregroundColor) {
                if (!foregroundColorSpans.wasSpanAt(idx, family.re.lastIndex)) {
                  s.setSpan(
                    new android.text.style.ForegroundColorSpan(
                      family.foregroundColor)
                    ,idx
                    ,family.re.lastIndex
                    ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
                    );
                  }
                }

              if(family.backgroundColor)
              if (!backgroundColorSpans.wasSpanAt(idx, family.re.lastIndex))
              s.setSpan(
                new android.text.style.BackgroundColorSpan(
                  family.backgroundColor)
                ,idx
                ,family.re.lastIndex
                ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
                );


              if(family.style)
              if (!styleSpans.wasSpanAt(idx, family.re.lastIndex))
              s.setSpan(
                new android.text.style.StyleSpan(family.style)
                ,idx
                ,family.re.lastIndex
                ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
                );



              matches = family.re.exec(str);
              if (!matches) break;
              }

            }
          }
        //Activity.reportError("time2::" + (java.lang.System.currentTimeMillis() - start));
        foregroundColorSpans.purge();
        backgroundColorSpans.purge();
        styleSpans.purge();
        //Activity.reportError("time3::" + (java.lang.System.currentTimeMillis() - start));
        }

      function numberLines(s) {
        if (!colorize) return;
        var n = (s.toString().match(/\r?\n/g) || '').length;
        var sl = "";
        for(var i = 0; i<=n; i++) {
          sl += (i + 1) + ((i<n)?'\n':'');
          }
        editor.ln.setEms(Math.max(2,(n).toString().length - 1));
        editor.ln.setText(sl);
        }


      this.setLanguage = (f) => {
        for(l in Lourah.ide.Languages) {
          if (Lourah.ide.Languages[l].re.exec(f)) {
            language = Lourah.ide.Languages[l].language;
            if (language.completion) language.completion(editor.et);
            return;
            } else {
            language = Lourah.ide.DefaultLanguage;
            }
          }
        }

      this.getLanguage = () => language;
      this.setFilename = (fname) => {
        filename = fname;
        frame.title.setText(fname?fname.getName():"@Scratch");
        this.setLanguage(fname?fname.getName():"x.js");
        }

      this.render = () => {
        try {
          colorSyntax(editor.et.getText());
          } catch(e) {
          Activity.reportError("Lourah::ide::Editor::render::error" + e);
          }
        }

      this.load = (f, fConfirm) => {
        if (!saved && fConfirm && !fConfirm(filename)) {
          return false;
          }

        var content = "";
        if (f) {
          content = Activity.path2String(f);
          }
        this.setLanguage(f?f:"x.js");
        editor.et.setText(content);
        saved = true;
        this.setFilename(f);
        return true;
        };

      this.new = (fConfirm) => this.load(null, fConfirm);

      this.beautify = () => {
        colorize = false;
        var text = editor.et.getText().toString();
        editor.et.setText("");
        var lines = text.split('\n');
        var s = editor.et.getText()
        for(var i = 0; i < lines.length; i++) {
          var l = lines[i].trim();
          if (l.length() !== 0) indent(s, s.length() - 1);//editor.et.getSelectionEnd() - 1);
        //else l = ' ';
        s.insert(
          s.length()
          ,l +  '\n'
          );
        }
      colorize = true;
      this.render();
      }


    Lourah.ide.string2Path = (string, path) => {
      //Activity.reportError("Lourah.ide.string2Path::" + path);
      //return;
      var bw = new java.io.BufferedWriter(
        new java.io.OutputStreamWriter(
          new java.io.FileOutputStream(path)
          , "UTF-8")
        );
      try {
        bw.write(string);
        } catch(e) {
        throw("Lourah.ide.Editor::string2Path::" + e + "::" + e.stack);
        } finally {
        bw.close();
        }
      };

    this.saveAs = (f, fConfirm) => {
      if (fConfirm && !fConfirm(f)) {
        return false;
        }
      Lourah.ide.string2Path(editor.et.getText(), f);
      this.setFilename(f);
      saved = true;
      this.setLanguage(filename);
      // then perform colorization
      this.render();
      };

    this.save = (fConfirm) => this.saveAs(filename, fConfirm);

    var mhBeautify = (instance) => {
      try {
        instance.beautify();
        } catch(e) {
        Activity.reportError("beautify::error::" + e + "::" + e.stack);
        }
      }

    var mhNew = (instance) => {
      try {
        if (!saved) {
          var question = new Lourah.android.app.Dialog.Question(Activity, "@Confirm", "@FileNotSaved", "@Yes", "@No");
          question.ask((q) => {
              instance.load(undefined, fn => q.getAnswer());
              });
          } else {
          instance.load(undefined);
          }
        } catch(e) {
        Activity.reportError("mhNew::error::" + e + "::" + e.stack);
        }
      }

    var mhSaveAs = (instance) => {
      try {
        var chooser = new Lourah.android.app.Dialog.Chooser(Activity, cwd, true);
        chooser.ask(sad => {
            if (!sad.getFilename()) return;
            if (sad.getFilename().exists()) {
              var q = new Lourah.android.app.Dialog.Question(Activity, "@Warning", "@File::" + sad.getFilename() + "::Already exists\ndo you want to overwrite ?", "@Yes", "@No");
              q.ask(q => {
                  instance.saveAs(sad.getFilename(), fn => q.getAnswer());
                  cwd = sad.getCwd();
                  });
              return;
              }
            instance.saveAs(sad.getFilename());
            cwd = sad.getCwd();
            //Activity.reportError("mhSaveAs::" + sad.getFilename());
            });
        } catch(e) {
        Activity.reportError("mhSaveAs::error::" + e + "::" + e.stack);
        }
      }

    var mhSave = (instance) => {
      if (filename) {
        instance.save();
        } else {
        mhSaveAs(instance);
        }
      }

    var mhOpenRough = (instance) => {
      try {
        var chooser = new Lourah.android.app.Dialog.Chooser(Activity, cwd, false);
        chooser.ask(sad => {;
            if (!sad.getFilename()) return;
            instance.load(sad.getFilename());
            instance.setFilename(sad.getFilename());
            cwd = sad.getCwd();
            });
        } catch(e) {
        Activity.reportError("mhOpenRoug::error::" + e + "::" + e.stack);
        }
      }

    var mhOpen = (instance) => {
      if (!saved) {
        var question = new Lourah.android.app.Dialog.Question(Activity, "@Open", "@FileNotSaved::" + (filename?filename:"@Scratch file") + "::do you want fo continue?", "@Yes", "@No");
        question.ask((q) => {
            if (q.getAnswer()) {
              mhOpenRough(instance);
              }
            });
        } else {
        mhOpenRough(instance);
        }
      }

    var mhRun = (instance) => {
      var rootView;
      try {
        js = new Lourah.ide.JsEngine();
        var jsEngine = new Lourah.ide.JsEngine();
        js.addProperty("___out___", console);
        js.addProperty("__jsFramework__", Lourah.jsFramework);
        js.addProperty("__Activity__", Activity);
        js.addProperty("__cwd__", cwd);
        js.addProperty("__jsEngine__", jsEngine);
        js.addProperty("__filename__", filename);
        js.addProperty("__script__", editor.et.getText());

        var capsule = encapsulator.toString();
        capsule = capsule.slice(
          capsule.indexOf('{') + 1
            ,capsule.lastIndexOf('}')
          );
        js.setScript("encapsulator()");
        js.eval(capsule);
        //Activity.reportError("js.finalize");
        //js.finalize();
        }
      catch (e) {
        Activity.reportError("mhRun::error::" + e + "::" + e.stack);
        }
      finally {
        try {
          //Activity.setContentView(rootView);
          } catch(e) {
          Activity.reportError("mhRun::finally::error::" + e);
          }
        }
      }


    var mhClose = (instance) => {
      try {
        if (!saved) {
          var question = new Lourah.android.app.Dialog.Question(Activity, "@Close", "@FileNotSaved::" + (filename?filename:"@Scratch file") + "::do you want fo continue?", "@Yes", "@No");
          question.ask(question => {
              if (question.getAnswer()) {
                frame.widget.getParent().removeView(frame.widget);
                }
              });
          } else {
          frame.widget.getParent().removeView(frame.widget);
          }
        } catch(e) {
        Activity.reportError("mhClose::error::" + e);
        }
      }


    var mhSearchReplace = (instance) => {
      var search = new Lourah.android.app.Dialog.Search(Activity, "@Search", editor.et.getText().toString());
      search.show({
          onSearch:(f) => {
            instance.render();
            f.forEach(e => {
                editor.et.getText().setSpan(
                  new android.text.style.BackgroundColorSpan(
                    android.graphics.Color.rgb(0,128,0))
                  ,e.at
                  ,e.at + e.length
                  ,android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
                  );
                });
            }
          ,onOccurence:(f) => editor.et.setSelection(f.at, f.at + f.length)
          });
      }

    var console = null;


    this.getConsole = () => console;
    this.setConsole = view => console = view;
    this.clearConsole = () => console.setText("Console:");


    function encapsulator() {
      (function () {
          try {
            function ActivityEmulator(activity) {
              var dialog;
              var backButtonListener;

              var contentView;

              __Activity__.errorReporter = {
                report:function(msg) {console.log(msg);}
                };

              var builder;


              this.init = () => {
                builder = builder || new android.app.AlertDialog.Builder(activity, android.R.style.Theme_DeviceDefault_DialogWhenLarge);
                }
              //_dialog = builder.create();

              this.setTitle = title => {
                this.init();
                var foregroundColorSpan = new android.text.style.ForegroundColorSpan(android.graphics.Color.DKGRAY);

                // Initialize a new spannable string builder instance
                var titleText = "IDEX::" + title;
                var ssBuilder = new android.text.SpannableStringBuilder(titleText);

                // Apply the text color span
                ssBuilder.setSpan(
                  foregroundColorSpan,
                  0,
                  titleText.length,
                  android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                  );

                builder.setTitle(ssBuilder); return this;
                }
              this.setContentView = view => {
                this.init();
                if (contentView) {
                  contentView.getParent().removeView(contentView);
                  dialog.setContentView(view);
                  //console.log("dialog.setContentView");
                  } else {
                  builder.setView(view)
                  //console.log("bulder.setView");
                  }
                contentView = view;
                return this;
                }
              this.getBuilder = () => builder;
              this.setButton = button => {
                builder[button.getKind()](
                  button.getText()
                  ,{
                    onClick : (dialog, id) => {
                      try {
                        button.getOnClick()(this, button, dialog, id);
                        } catch(e) {
                        console.log("onClick::error::" + e + "::" + e.stack);
                        }
                      }
                    }
                  );
                };

              var shown = false;

              this.show = () =>  {
                if (contentView) {
                  try {
                    if (!dialog) dialog = builder.create();
                    dialog.show();
                    dialog.getWindow().setBackgroundDrawableResource(android.R.color.background_light);
                    if (!shown && backButtonListener) dialog.setOnKeyListener(backButtonListener);
                    shown = true;
                    try {
                      //android.os.Looper.loop();
                      } catch(ee) {
                      //console.log("show::ee::" + ee);
                      }
                    } catch(e) {
                    console.log("encapsulator::ActivityEmulator::show::error::" + e);
                    }
                  }
                }

              this.__setOnBackButtonListener = (f) => {
                try {
                  // console.log("__setOnBackButtonListener::" + f);
                  var bbl = {
                    onKey: (d, keyCode, keyEvent) => {
                      //console.log("cancelListener::call::" + f);
                      if (keyCode === android.view.KeyEvent.KEYCODE_BACK
                        && keyEvent.getAction() !== android.view.KeyEvent.ACTION_DOWN) {
                        if (!f()) {
                          dialog.cancel();
                          //console.log("cancelListener::called::false");
                          return false;
                          } else {
                          //console.log("cancelListener::called:;true");
                          return true;
                          }
                        }
                      //console.log("cancelListener::called");
                      return true;
                      }
                    };
                  if (shown) dialog.setOnKeyListener(bbl);
                  else backButtonListener = bbl;
                  } catch(e) {
                  console.log("AvtivityEmulator::__setOnBackButtonListener::error::" + e);
                  }
                }

              this.reportError = (err) => console.log("Activity::error::" + err);
              this.path2String = (path) => __Activity__.path2String(path);
              this.inputStream2String = (inputStream) => __Activity__.inputStream2String(inputStream);
              this.getApplicationContext = () => __Activity__.getApplicationContext();
              this.getWindowManager = () => __Activity__.getWindowManager();
              this.getWindow = () => __Activity__.getWindow();
              this.startActivity = (activity) => __Activity__.startActivity(activity);
              this.getSystemService = (service) => __Activity__.getSystemService(service);
              this.finish = () => dialog.dismiss();
              this.importScript = (p2s) => {
                try {
                  __jsEngine__.eval(__Activity__.path2String(p2s));
                  } catch(e) {
                  __Activity__.reportError("encapsulator::Activity::importScript::" + e + "::" + e.stack);
                  }
                }
              };

// @changed 20200224 : log from any thread
            console = {
              log:(txt) => {
                __Activity__.runOnUiThread(
                  new java.lang.Runnable({
                      //run: () => ___out___.setText(___out___.getText() + '\n' + txt)
                      run: () => ___out___.append('\n' + txt)
                      })
                  );
                }
              };
            var Lourah = {};
            Lourah.jsFramework = __jsFramework__;
            Lourah.jsFramework.dir = () => __cwd__;

            var Activity = new ActivityEmulator(__Activity__);

            Lourah.jsFramework.setOnBackButtonListener = (f) => {
              //console.log("setOnBackButtonListener::" + f);
              Activity.__setOnBackButtonListener(f);
              };

            __jsEngine__.addProperty("console", console);
            __jsEngine__.addProperty("Activity", Activity);
            __jsEngine__.addProperty("Lourah", Lourah);
            __jsEngine__.setScript(__filename__?__filename__:"@Scratch");
            __jsEngine__.eval(__script__.toString() + "\n;Activity.show();");

            } catch(e) {
            Activity.reportError("encapsulator::error::" + e + "::" + e.stack);
            }
          })();
      }


    this.type = "Lourah.ide.Editor";

    var menuHandlers = {
      file : [
        ["@New", mhNew]
        ,["@Open", mhOpen]
        ,["@Save", mhSave]
        ,["@SaveAs", mhSaveAs]
        ,["@Close" , mhClose]
        ]
      , edit : [
        ["@Undo", () => {}]
        ,["@Paste" , () => {}]
        ,["@Beautify", mhBeautify]
        ]
      , search : [
        ["@SearchReplace", mhSearchReplace]
        ]

      , exec : [
        ["@Run", mhRun ]
        ,["@ClearConsole", (instance) => instance.clearConsole() ]
        ]

      , about : [
        ["@CopyrightLourah" , () => {}]
        ]
      };

    var ppm = {};

    Object.keys(menuHandlers).forEach(item => {
        ppm[item]= new android.widget.PopupMenu(Activity.getApplicationContext(), menu[item]);
        menu[item].setOnClickListener({onClick:view => ppm[item].show()});


        //Activity.reportError(item.getText() + "::" + ppm[item]);
        for(var idx = 0; idx < menuHandlers[item].length; idx++) {
          var ss = new android.text.SpannableString(menuHandlers[item][idx][0]);

          var end = ss.length();
          ss.setSpan(
            new android.text.style.RelativeSizeSpan(0.85)
            , 0
            , end
            , android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            );


          ppm[item].getMenu().add(
            android.view.Menu.NONE
            ,idx
            ,android.view.Menu.NONE
            ,ss // menuHandlers[item][idx][0]
            );
          }

        ppm[item].setOnMenuItemClickListener({
            onMenuItemClick: (menuItem) => {
              try {
                menuHandlers[item][menuItem.getItemId()][1](this);
                return true;
                } catch(e) {
                Activity.reportError("onMenuItemClick::error::" + e + "::" + e.stack);
                }
              }
            });
        });
    this.render();
    }
  })();
