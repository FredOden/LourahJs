var Lourah = Lourah || {};
(function () {
    Lourah.http = Lourah.http || {};
    Lourah.http.js2xml = Lourah.http.js2xml || {};
    /**
    element = {
      name: {
        _: {
          attribute: value
          , attribute: value
          }
        , $: text
        }
      ,name: text
      }
    */
    if (Lourah.http.js2xml.J2X) return;

    function J2X(element) {

      //console.log("J2X::enter::" + element);

      if (typeof element === "string"
        || element instanceof String) {
        //console.log("element is string");
        return (element);
        }

      if (!isNaN(element)) return element

      if (typeof element === "function") {
        return J2X(element());
        }

      var xml = "";
      for(var name in element) {

        if(!Array.isArray(element[name])) {
          element[name] = [ element[name] ];
          }

        try {
          for(var k = 0; k < element[name].length; k++) {
            var e = element[name][k];
            var begin = "<" + name;
            for (var attribute in e._) {
              begin += " " + attribute + '="' + e._[attribute] + '"';
              }
            if (e.S) {
              begin += ' style="';
              for (var style in e.S) {
                begin += style + ":" + e.S[style] + ';'
                }
              begin += '"';
              }
            begin += ">";
            var end= "</" + name + ">";
            //console.log("begin::" + begin);


            var content =(e.$ !== undefined?e.$:(e._ === undefined?e:""));
            if (content === undefined) {
              //console.log("content::undef");
              content = "";
              }


            if (!Array.isArray(content)) {
              //console.log("content::isNotArray::<" + content + ">");
              content = [ content ];
              }

            //console.log("  content::" + content);

            //console.log("end::" + end);


            for(var i = 0; i < content.length; i++) {
              //console.log("process::" + i + "::" + JSON.stringify(content));
              xml += begin + J2X(content[i]) + end;
              }
            }
          } catch (e) {
          console.log("J2X::error::" + begin + "::" + k + "::" + e + "::" + e.stack);
          pop   }
        }

      return xml;
      }


    Lourah.http.js2xml.J2X = J2X;

    function Element(attributes, content) {
      var J = [];

      this.E = (attributes, content) => {
        J.push({
            _: attributes === undefined?{}:attributes
            ,$: content === undefined?"":content
            }
          )
        return this;
        }
      this.get = () => J;
      this.E(attributes, content);
      }
    J2X.E = (attributes, content) => new Element(attributes, content);
    J2X.J = e => e.get();
    })();

var J2X = Lourah.http.js2xml.J2X;
var E = J2X.E;
var J = J2X.J;


/*
var xml = J2X({input:[
      {
        _:{type:'text', value:'1st'}
        ,$: ["first name", "Sister Act" ]
        }
      , "other"
      , {
        _:{type:"edit" ,name:"editor"}
        ,$: ["", ""]
        }
      ]
    });

console.log("xml::" + xml);
*/
/*
console.log("J2X.E::" +
  JSON.stringify(
    J(E({position:"bottom"}, "football"))
    )
  );


xml = Lourah.http.js2xml.J2X({
    html: {
      head: {
        title: "<this is a test?>"
        }
      ,body: {
        _: {
          title: "titre"
          ,version: "2.0"
          }
        ,$: {
          a: {
            _: {href:"stop"}
            ,$: "Stop server"
            }

          ,br: "oo"
          ,footer:
          J(E({position:"bottom"}, "football")
            .E({function:"weird"}, "rugby")
            )
          ,header1: J(E({char:"utf"},"chapter n°1<p>"))
          ,header2: [
            "zztop"
            ,{
              $:"guns&roses"
              ,_:{size:1000}
              }
            ]
          ,form: J(E({
                method: "POST"
                }
              ,{
                input: [
                  {
                    _:{type:"text" ,value:"1st"}
                    , $:"first name"
                    }
                  , "last name"
                  , "pseudo"
                  ]
                ,password: ["u"]
                }
              ))

          ,table: {
            _: {
              id: 122
              }
            ,$:{

              tr : J(E({kind:"Kompress"}, [
                    {th: J(E({align:"right"},["Id", "Name", "Amount"]))}
                    ,{td: [1, "hammer", 12.98]}
                    ,{td: [2, "screwdriver", 5.76]}
                    //,grinder()
                    ]))
              }
            }

          ,script: J2X.toString()

          }

        }

      }
    });


console.log("xml::" + xml);
*/
