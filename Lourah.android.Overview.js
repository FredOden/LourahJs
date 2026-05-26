var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Overview === undefined) {
  (function() {
    var Class = Packages.java.lang.Class;
    var Constructor = Packages.java.lang.Constructor;
    var Method = Packages.java.lang.Method;
    var NoSuchMethodException = Packages.java.lang.NoSuchMethodException;

    // Import the Internationalizer module for optional i18n support
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.android.Internationalizer.js");

    /**
     * Lourah.android.Overview
     *
     * A declarative UI builder for Android views driven by plain JavaScript objects (JSON-like).
     * It instantiates Android widgets, applies attributes, wires event hooks,
     * and builds a widget tree — all from a structured view descriptor.
     *
     * @param {Object} views         - A view descriptor object. Each key maps to a view definition
     *                                 containing a "class", optional "attributes", and optional "content".
     * @param {Object} internationalizer - Optional. An Internationalizer instance used to translate
     *                                    string values in attributes. If omitted, strings are used as-is.
     *
     * @example
     * var ov = new Lourah.android.Overview({
     *   myButton: {
     *     class: "android.widget.Button",
     *     attributes: { setText: "'Click me'" }
     *   }
     * });
     * var btn = ov.$("myButton");
     */
    Lourah.android.Overview = function(views, internationalizer) {
      var widgets = {};
      var views;
      var vtop;

      // Use identity function if no internationalizer is provided
      var translate = (internationalizer === undefined)
        ? s => s
        : internationalizer.translate;

      /**
       * Instantiates and configures a single Android widget from a view descriptor.
       *
       * The view descriptor supports:
       *   - "class"      : Android widget class (string or direct Java class reference)
       *   - "attributes" : map of setter method names to values.
       *                    Values are eval()'d so they can reference Android constants.
       *                    Array values are spread as multiple arguments.
       *                    Keys starting with '_' are treated as hooks (see hookAction).
       *   - "content"    : nested view descriptors, recursively built and added as child views.
       *
       * @param {string} key  - Unique identifier for this widget in the widgets registry.
       * @param {Object} view - The view descriptor object.
       * @returns {android.view.View} The constructed and configured Android view.
       */
      this.getJSONView = function(key, view) {
        var cl;
        var widget;
        try {
          /**
           * @20201026: "class" can be a string (Java class name) or a direct Java class reference.
           * Originally Overview was designed for JSON files where only strings are possible.
           */
          cl = view["class"];
          if (typeof cl === "string" || cl instanceof String) {
            // Instantiate from class name string via Java reflection
            cl = Class.forName(cl);
            var cons = cl.getConstructor(Packages.android.content.Context);
            widget = cons.newInstance(Activity.getApplicationContext());
          } else {
            // Direct Java class reference — instantiate directly
            widget = new cl(Activity.getApplicationContext());
          }
        } catch(e) {
          // If instantiation fails, store the raw descriptor and return it
          widgets[key] = view;
          return view;
        }

        // Apply attributes (setter methods) to the widget
        if (view.attributes) {
          for (var method in view.attributes) {
            var value = view.attributes[method];

            // Hook: keys starting with '_' trigger a hook action instead of a direct setter call
            if (method.charAt(0) == '_') {
              try {
                hookAction(widget, method, value, translate);
              } catch (e) {
                console.log("hook::" + method + "::" + value + "::" + e);
              }
              continue;
            }

            // Array value: spread as multiple arguments to the setter
            if (value instanceof Array) {
              try {
                widget[method].apply(widget, value.map(v => translate(eval(v))));
              } catch(e) {
                console.log("widget array apply::" + method + "::[" + value + "]::" + e);
              }
            } else {
              // Single value: call the setter directly
              try {
                widget[method](translate(eval(value)));
              } catch(e) {
                console.log("widget::" + method + "::" + value + "::" + e);
              }
            }
          }
        }

        // Recursively build and attach child views
        if (view.content) {
          for (var contained in view.content) {
            widget.addView(this.getJSONView(contained, view.content[contained]));
          }
        }

        // Ensure widget keys are unique in the registry
        if (widgets[key]) throw "widget key::" + key + "::already defined::" + JSON.stringify(widgets[key]);
        widgets[key] = widget;
        return widget;
      }

      // Build all top-level views from the descriptor
      for(var key in views) {
        this.getJSONView(key, views[key]);
      }

      /** Returns the raw views descriptor. */
      this.getViews = () => views;

      /**
       * Widget accessor.
       * @param {string} [key] - Widget key. If omitted, returns the full widgets map.
       * @returns {android.view.View|Object} The requested widget, or all widgets if no key given.
       * @throws {java.lang.JavaException} If the key is not found in the registry.
       */
      this.$ = key => {
        if (key === undefined) return widgets;
        if (widgets[key]) return widgets[key];
        throw new java.lang.JavaException("cannot find '" + key + "' in this view::" + JSON.stringify(views));
      }
    }

    /**
     * Executes a hook script on a widget.
     * Hook scripts are inline JS functions stored as attribute values for keys starting with '_'.
     * They receive the widget, the hook name, and the translator function as arguments.
     *
     * @param {android.view.View} widget     - The target widget.
     * @param {string}            hook       - The hook method name (e.g. '_setPaddingBottom').
     * @param {string|Function}   hookScript - The hook implementation (function or JS source string).
     * @param {Function}          translator - The active translation function.
     */
    function hookAction(widget, hook, hookScript, translator) {
      let hooked = "(" + hookScript + ")(widget,hook,translator);";
      eval(hooked);
    }

    /**
     * Lourah.android.Overview.Sugar
     *
     * A syntactic sugar layer over the Overview view descriptor format.
     * Allows writing UI definitions in a flattened, more readable JS object style,
     * where child views are identified by keys starting with '$', and all other keys
     * are treated as widget attributes.
     *
     * @param {Object} sugarForm - A sugar-style UI descriptor.
     *
     * @example
     * var sugar = new Lourah.android.Overview.Sugar({
     *   $root: {
     *     class: "android.widget.LinearLayout",
     *     setOrientation: android.widget.LinearLayout.VERTICAL,
     *     $title: {
     *       class: "android.widget.TextView",
     *       setText: "'Hello'"
     *     }
     *   }
     * });
     * var content = sugar.getContent();
     */
    Lourah.android.Overview.Sugar = function (sugarForm) {

      /**
       * Recursively converts a sugar object into a canonical Overview view descriptor.
       * - Keys starting with '$' become "content" entries (child views).
       * - The "class" key is preserved as-is.
       * - All other keys become "attributes" entries.
       *
       * @param {Object} o - A sugar-style view node.
       * @returns {Object} A canonical view descriptor { class, attributes, content }.
       */
      var parse = (o) => {
        try {
          var ov = {};
          for(item in o) {
            if (item.match(/[\$].*/)) {
              // '$xxx' keys are child views → goes into "content"
              ov.content = ov.content || {};
              ov.content[item] = parse(o[item]);
              continue;
            }
            if (item === "class") {
              ov.class = o.class;
              continue;
            }
            // All other keys are widget setter methods → goes into "attributes"
            ov.attributes = ov.attributes || {};
            ov.attributes[item] = o[item];
          }
          return ov;
        } catch(e) {
          Activity.reportError("Lourah::android::Overview::Sugar::error::" + e + "::" + e.stack);
        }
      };

      /** @returns {Object} The parsed canonical content descriptor (top-level children). */
      this.getContent = () => parse(sugarForm).content;
    }

    /**
     * Lourah.android.Overview.buildFromSugar
     *
     * Convenience factory: builds a complete widget map directly from a Sugar descriptor.
     * Combines Sugar parsing and Overview instantiation in one call.
     *
     * @param {Object} sugar            - A Sugar-style UI descriptor.
     * @param {Object} [internationalizer] - Optional Internationalizer instance.
     * @returns {Object} A flat map of all instantiated widgets, keyed by their '$xxx' names.
     *
     * @example
     * var view = Lourah.android.Overview.buildFromSugar(UI);
     * Activity.setContentView(view.$root);
     * var btn = view.$myButton;
     */
    Lourah.android.Overview.buildFromSugar = function(sugar, internationalizer) {
      return (new Lourah.android.Overview(
        (new Lourah.android.Overview.Sugar(sugar, internationalizer)).getContent()
      )).$();
    }
  })();
}
