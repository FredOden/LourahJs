var Lourah = Lourah || {};
(function () {
    Lourah.http = Lourah.http || {};
    Lourah.http.js2xml = Lourah.http.js2xml || {};
    if (Lourah.http.js2xml.CSS) return;

    function ScopeCSSBuilder(scope, styles) {
      var attributes = {};
      this.set = (attribute, value) => {
        attributes [attribute] = value;
        return this;
        }
      this.add = (styles) => {
        for(k in styles) {
          this.set(k, styles[k]);
          }
        }
      this.toString = () => {
        var s = scope?(scope.toString() + "{"):'';
          for(var attribute in attributes) {
            s += attribute + ":" + attributes[attribute] + ";";
            }
          s += scope?"}":'';
        return s;
        }
      if (styles) this.add(styles);
      }

    function CSSBuilder(scopes) {
      var csss = {};

      this.add = (scopes) => {
        for(var scope in scopes) {
          csss[scope] = new ScopeCSSBuilder(scope, scopes[scope]);
          }
        }

      this.add(scopes);

      this.get = (scope) => csss[scope];

      this.toString = () => {
        var s = "";
        for(scope in csss) {
          s += csss[scope] + "\n";
          }
        return s;
        }
      }

    Lourah.http.js2xml.CSS = (scopes) => new CSSBuilder(scopes);
    })();
/*
var CSS = Lourah.http.js2xml.CSS;

var css = CSS({
    "h1, h2": {
      "background-color": "#7f7f7f"
      ,"text-align":"center"
      }
    ,div : {
      color: "blue"
      }
    });


css.get("h1, h2").set("width", "100px").set("background-color", "red");

console.log("css::" + css);
*/
/*
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.http.js2xml.J2X.js");

var J2X = Lourah.http.js2xml.J2X;
var E = J2X.E;
var J = J2X.J;

var xml = J2X(
  {
    html: {
      head: {
        style: [ ""
          + css
          + "\n"
          + CSS("p,div", {
              color: "green"
              })
          ]
        }
      ,body: {
        h1: J(
          E(
            {
              style: "" + CSS("",{width:"59px"})
              }
            ,"title"
            )
          )
        }
      }
    });

console.log("xml::" + xml);
*/
