var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Overview === undefined) {
  (function() {
    var Class = Packages.java.lang.Class;
    var Constructor = Packages.java.lang.Constructor;
    var Method = Packages.java.lang.Method;
    var NoSuchMethodException = Packages.java.lang.NoSuchMethodException;

    /**
     * ============================================================================
     * @module Lourah.android.Overview
     * @title Declarative Android UI Builder (Reflection + Sugar + Hooks)
     *
     * @purpose
     *   Provide a declarative mechanism to build Android UIs using JavaScript objects.
     *   Overview instantiates widgets through Java reflection, applies attributes,
     *   executes hook functions, and recursively builds view hierarchies.
     *
     * @architecture
     *   - Reflection-based widget instantiation
     *   - Attribute application using eval() for Android constants
     *   - Hook system for inline custom logic (keys starting with "_")
     *   - Recursive construction of child views
     *   - Flat-map registry for direct widget access
     *
     * @api
     *   new Overview(descriptor, internationalizer?)
     *   Overview#getJSONView(key, view)
     *   Overview#getViews()
     *   Overview#$(key)
     *   Overview.Sugar
     *   Overview.buildFromSugar()
     *
     * @usage
     *   var view = Lourah.android.Overview.buildFromSugar(UI, i18n);
     *   Activity.setContentView(view.$root);
     *   view.$button.setOnClickListener(...);
     *
     * @notes
     *   This is the low-level engine used by the Sugar DSL.
     *   Sugar is the recommended entry point for UI definitions.
     * ============================================================================
     */

    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Internationalizer.js");

    Lourah.android.Overview = function(views, internationalizer) {
      var widgets = {};
      var views;
      var vtop;

      /**
       * ============================================================================
       * === Instantiation & Translation ===========================================
       * ============================================================================
       *
       * The translator is either the provided Internationalizer or an identity function.
       */
      var translate = (internationalizer === undefined)
        ? s => s
        : internationalizer.translate;

      /**
       * ============================================================================
       * === Instantiation of a Single Widget ======================================
       * ============================================================================
       *
       * Creates and configures a widget from its descriptor.
       *
       * Descriptor fields:
       *   - class: Java class name or direct reference
       *   - attributes: setter methods (values eval()'d)
       *   - content: nested child descriptors
       *   - hooks: keys starting with "_" execute custom JS logic
       */
      this.getJSONView = function(key, view) {
        var cl;
        var widget;
        try {

          /**
           * === Class Resolution ===
           * Supports both string class names and direct Java class references.
           */
          cl = view["class"];
          if (typeof cl === "string" || cl instanceof String) {
            cl = Class.forName(cl);
            var cons = cl.getConstructor(Packages.android.content.Context);
            widget = cons.newInstance(Activity.getApplicationContext());
          } else {
            widget = new cl(Activity.getApplicationContext());
          }
        } catch(e) {
          widgets[key] = view;
          return view;
        }

        /**
         * ============================================================================
         * === Attribute Application ==================================================
         * ============================================================================
         */
        if (view.attributes) {
          for (var method in view.attributes) {
            var value = view.attributes[method];

            /**
             * === Hook Execution ======================================================
             * Hooks are inline JS functions stored under keys starting with "_".
             */
            if (method.charAt(0) == '_') {
              try {
                hookAction(widget, method, value, translate);
              } catch (e) {
                console.log("hook::" + method + "::" + value + "::" + e);
              }
              continue;
            }

            /**
             * === Setter Invocation ===================================================
             * Supports single values and arrays (spread as multiple arguments).
             */
            if (value instanceof Array) {
              try {
                widget[method].apply(widget, value.map(v => translate(eval(v))));
              } catch(e) {
                console.log("widget array apply::" + method + "::[" + value + "]::" + e);
              }
            } else {
              try {
                widget[method](translate(eval(value)));
              } catch(e) {
                console.log("widget::" + method + "::" + value + "::" + e);
              }
            }
          }
        }

        /**
         * ============================================================================
         * === Child View Construction ===============================================
         * ============================================================================
         */
        if (view.content) {
          for (var contained in view.content) {
            widget.addView(this.getJSONView(contained, view.content[contained]));
          }
        }

        /**
         * === Registry Integrity Check ==============================================
         */
        if (widgets[key]) throw "widget key::" + key + "::already defined::" + JSON.stringify(widgets[key]);
        widgets[key] = widget;
        return widget;
      }

      /**
       * Build all top-level widgets.
       */
      for(var key in views) {
        this.getJSONView(key, views[key]);
      }

      /**
       * Return raw descriptor.
       */
      this.getViews = () => views;

      /**
       * ============================================================================
       * === Flat-Map Accessor ======================================================
       * ============================================================================
       *
       * Returns a widget by key, or the entire registry if no key is provided.
       */
      this.$ = key => {
        if (key === undefined) return widgets;
        if (widgets[key]) return widgets[key];
        throw new java.lang.JavaException("cannot find '" + key + "' in this view::" + JSON.stringify(views));
      }
    }

    /**
     * ============================================================================
     * === Hook Engine =============================================================
     * ============================================================================
     *
     * Executes a hook function stored under a key starting with "_".
     */
    function hookAction(widget, hook, hookScript, translator) {
      let hooked = "(" + hookScript + ")(widget,hook,translator);";
      eval(hooked);
    }

    /**
     * ============================================================================
     * @section Sugar DSL
     * @description
     *   Sugar is a compact syntax for describing UI trees.
     *   Keys starting with "$" represent child views.
     *   All other keys are treated as attributes.
     * ============================================================================
     */
    Lourah.android.Overview.Sugar = function (sugarForm) {

      /**
       * ============================================================================
       * === Sugar Parser ===========================================================
       * ============================================================================
       *
       * Converts Sugar syntax into canonical Overview descriptors.
       */
      var parse = (o) => {
        try {
          var ov = {};
          for(item in o) {
            if (item.match(/[\$].*/)) {
              ov.content = ov.content || {};
              ov.content[item] = parse(o[item]);
              continue;
            }
            if (item === "class") {
              ov.class = o.class;
              continue;
            }
            ov.attributes = ov.attributes || {};
            ov.attributes[item] = o[item];
          }
          return ov;
        } catch(e) {
          Activity.reportError("Lourah::android::Overview::Sugar::error::" + e + "::" + e.stack);
        }
      };

      /** Return canonical content descriptor */
      this.getContent = () => parse(sugarForm).content;
    }

    /**
     * ============================================================================
     * === Factory: Sugar → Overview → Flat-Map ====================================
     * ============================================================================
     */
    Lourah.android.Overview.buildFromSugar = function(sugar, internationalizer) {
      return (new Lourah.android.Overview(
        (new Lourah.android.Overview.Sugar(sugar, internationalizer)).getContent()
      )).$();
    }
  })();
}

