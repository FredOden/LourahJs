var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Overview === undefined) {
  (function() {
      var Class = Packages.java.lang.Class;
      var Constructor = Packages.java.lang.Constructor;
      var Method = Packages.java.lang.Method;
      var NoSuchMethodException = Packages.java.lang.NoSuchMethodException;

      //Lourah.android.R = Lourah.android.R || {};

      Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Internationalizer.js");


      Lourah.android.Overview = function(views, internationalizer) {
        var widgets = {};
        var views;
        var vtop;
        var translate = (internationalizer === undefined)
        ?s => s
        :internationalizer.translate;

        this.getJSONView = function(key, view) {
          var cl;
          var widget;
          try {

            //cl = Class.forName(view["class"]);
            /**
            @20201026: class can be specified as a java class directly
            at the origin Lourah. android. Overview was
            intended for json files ...
            */
            cl = view["class"];
            if (typeof cl === "string" || cl instanceof String) {
              cl = Class.forName(cl);
              var cons = cl.getConstructor(Packages.android.content.Context);
              widget = cons.newInstance(Activity.getApplicationContext());
              }
            else {
              widget = new cl(Activity.getApplicationContext());
              }
            } catch(e) {
            widgets[key] = view;
            return view;
            }
          if (view.attributes) {
            for (var method in view.attributes) {
              var value = view.attributes[method];
              if (value instanceof Array) {
                widget[method].apply(widget, value.map(v => translate(eval(v))));
                } else {
                widget[method](translate(eval(value)));
                }
              }
            }

          if (view.content) {
            for (var contained in view.content) {
              widget.addView(this.getJSONView(contained, view.content[contained]));
              }
            }
          if (widgets[key]) throw "widget key::" + key + "::already defined::" + JSON.stringify(widgets[key]);
          widgets[key] = widget;
          return widget;
          }

        for(var key in views) {
          this.getJSONView(key, views[key]);
          }

        this.getViews = () => views;

        this.$ = key => {
          if (key === undefined) return widgets;
          if (widgets[key]) return widgets[key]
          throw new java.lang.JavaException("cannot find '" + key + "' in this view::" + JSON.stringify(views));
          }
        }
      
      Lourah.android.Overview.Sugar = function (sugarForm) {
        var parse = (o) => {
          try {
            var ov = {};
            for(item in o) {
              if (item.match(/[\$].*/)) {
                ov.content = ov.content || {};
                ov.content[item] = parse(o[item]);
                //console.log("ov::content::" + item + "::" + JSON.stringify(ov));
                continue;
                }
              if (item === "class") {
                ov.class = o.class;
                //console.log("ov::class::" + JSON.stringify(ov));
                continue;
                }
              ov.attributes = ov.attributes || {};
              ov.attributes[item] = o[item];
              //console.log("ov::attributes::" + item + "::" + o[item]);

              }
            //console.log(">>>::" + JSON.stringify(ov));
            return ov;
            } catch(e) {
            Activity.reportError("Lourah::android::Overview::Sugar::error::" + e + "::" + e.stack);
            //return parse({$error:{class:"android.widget.TextView", setText: "'" + e + "::" + e.stack + "'" }});
            }
          };


        this.getContent = () => parse(sugarForm).content;
        }

      Lourah.android.Overview.buildFromSugar = function(sugar, internationalizer) {
        return (new Lourah.android.Overview(
            (new Lourah.android.Overview.Sugar(sugar, internationalizer)).getContent()
            )).$();
        }
      })();
  }
