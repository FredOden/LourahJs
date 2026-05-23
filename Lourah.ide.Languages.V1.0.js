Activity.importScript(
Lourah.jsFramework.parentDir()
+ "/Lourah.widget.Tokenizer.js"
);

var Lourah = Lourah || {};
(function () {
    Lourah.ide = Lourah.ide || {};
    if (Lourah.ide.Languages) return;

    var javascript = {
      id : {
        name: "javascript"
        ,version: "1.0"
        }
      ,colorizations : {
        keywords : {
          re :  /\b(typeof|new|this|in|of|for|while|do|continue|break|continue|switch|case|if|else|return|class|var|const|let|function)\b/g
          , foregroundColor : 0xffef5050|0
          }

        ,sugars : {
          re : /(=>)/g
          , foregroundColor : 0xffff5050|0
          , style : android.graphics.Typeface.BOLD
          }

        ,classes : {
          re : /\b[A-Z][A-Za-z0-9_$]*\b/g
          , foregroundColor : 0xff00afaf|0
          , style : android.graphics.Typeface.BOLD
          }

        ,constants : {
          re : /\b(undefined|null|true|false|Infinity)\b/g
          , foregroundColor : 0xff009f00|0
          }

        ,errors : {
          re : /\b(try|catch|finally|throw)\b/g
          , foregroundColor : 0xffff0000|0
          }

        ,numbers : {
          re:/\b((?:0x[0-9a-f]+)|(?:\d*[.]?\d+(?:(?:[E|e][+\-]?)\d*[.]?\d+)?))\b/g
          //re : /\b(0x[0-9a-f]+)|(\d*[.]?\d+[E|e]?[+\-]?\d*)\b/g
          , foregroundColor : 0xff7f7fff|0
          }

        ,strings : {
          re : /(".*?")|('.*?')|([\/].*?[\/])/g
          , foregroundColor : 0xffbfbf00|0
          , style : android.graphics.Typeface.BOLD_ITALIC
          }

        ,comments : {
          re : /(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm
          , foregroundColor : 0xff7f7f7f|0
          , backgroundColor : 0xff1f1f1f|0
          }
        }
      ,indentations : {
        block : {
          in : /{/g
            ,out : /}/g
          }
        ,list : {
          in : /\(/g
            ,out : /\)/g
          }
        ,array : {
          in : /\[/g
            ,out : /\]/g
          }
        }
      ,completion: (multiAutoCompleteTextView) => {
        var spinnerArray = new java.util.ArrayList();

        spinnerArray.addAll([
            "try"
            ,"catch"
            ,"finally"
            ,"throw"
            ,"try {} catch(e) {}"
            ,'try {} catch(e) { Activity.reportError("@::" + e + "::" + e.stack); }'
            ,"try {} catch(e) {} finally {}"
            ,"for"
            ,"for ( ; ; ) {}"
            ,"for ( in ) {\}"
            ,"for (var i = 0; i < .length; i++) {}"
            ,"function"
            ,"function () {}"
            ,"if () {}"
            ,"else"
            ,"if () {} else {}"
            ,"else {}"
            ,"while"
            ,"while () {}"
            ,"( function () {})();"
            ,"console.log();"
            ,"var"
            ,"var /* object */ = {}"
            ,"var /* array */ = []"
            ,"/* field */:, /* field */:"
            ,"case"
            ,"default"
            ,"instanceof"
            ,"typeof"
            ,"class"
            ,"switch () { case : break;}"
            ,"break"
            ,"continue"
            ,"return"
            ,"undefined"
            ,"null"
            ,"true"
            ,"false"
            ,"this"
            ,"this./* method */ = () => {};"
            ,"this. toString = () => {var toString = ''; return toString; };"
            ,"this. get@ = () => { return @; };"
            ,"this. set@ = (v) => { @ = v; return this;};"
            ,"() => {/* arrow */}"
            ,"void"
            ,"Activity"
            ,"Activity. importScript()"
            ,"Activity. importScript(Lourah.jsFramework.parentDir() + '/');"
            ,"Activity. importScript(Lourah.jsFramework.dir() + '/');"
            ,"Activity. getApplicationContext()"
            ,"Activity. reportError()"
            ,"Activity. setTitle()"
            ,"Activity. setContentView()"
            ,"JSON.stringify()"
            ,"JSON.parse()"
            ,"map((item) => {})"
            ,"forEach((item) => {})"
            ,"Object. keys()"
            ,"sort((a, b) => {})"
            ,"sort()"
            ,"length"
            ,"new"
            ,"Date"
            ,"String"
            ,"android"
            ,"android.widget"
            ,"android.widget. TextView"
            ,"android.widget. LinearLayout"
            ,"android.widget. EditText"
            ,"android.widget. AutoCompleteTextView"
            ,"android.widget. MultiAutoCompleteTextView"
            ,"android.widget. ScrollView"
            ,"android.widget. HorizontalScrollView"
            ,"android.widget. CheckBox"
            ,"android.widget. RadioButton"
            ,"android.widget. Button"
            ,"android.widget. Spinner"
            ,"android.widget. ImageView"
            ,"android.view. View"
            ,"android.graphics. Color"
            ,"Lourah.graphics. Color"
            ,"Lourah.android.Overview. buildFromSugar()"
            ,"setOnClickListener"
            ,"onClick"
            ,"{ onClick: (view) => {} }"
            ,"java"
            ,"java.lang"
            ,"java.io"
            ].sort());

        var aLourah = [ "Lourah" ];
        for(var k in Lourah) {
          aLourah.push("Lourah. " + k);
          for(var kk in Lourah[k]) {
            aLourah.push("Lourah. " + k + ". " + kk);
            }
          }
        spinnerArray.addAll(aLourah.sort());
        
        var adapter = new android.widget.ArrayAdapter(
          Activity.getApplicationContext()
          ,android.R.layout.simple_spinner_dropdown_item|0
          //,$screen.$dropDown.getId()
          ,spinnerArray
          );


        multiAutoCompleteTextView.setAdapter(adapter);
        multiAutoCompleteTextView.setThreshold(2);
        multiAutoCompleteTextView.setDropDownHeight(300);
        multiAutoCompleteTextView.setTokenizer(
          //new android.widget.MultiAutoCompleteTextView.CommaTokenizer()
          //Lourah.widget.Tokenizer.buildPunctuationTokenizer()
          new Lourah.widget.Tokenizer(
            Lourah.widget.Tokenizer.Separators.JAVA
            )
          );
        /**/

        }
      };

    var html = {
      id : {
        name: "html"
        ,version: "0.1 beta"
        }
      ,colorizations: {
        tag : {
          re: /<.*?>/gm
          , foregroundColor : 0xffff0000|0
          }
        ,attributes : {
          re : /(".*?")|('.*?')/g
          ,foregroundColor : 0xffbfbf00|0
          , style : android.graphics.Typeface.ITALIC

          }
        }
      , indentations : {
        block: {
          in : /<.*?>/g
          ,out : /<\/.*?>/g
          }
        }
      };

    var text = {
      id : {
        name: "rough text"
        ,version: "1.0"
        }
      ,colorizations : {}
      ,indentations : {}
      };

    Lourah.ide.Languages = {
      javascript: {
        re : /.*[.](js)|(json)|(JS)|(JSON)$/
        ,language : javascript
        }
      ,html: {
        re : /.*[.](htm)|(html)$/
        ,language : html
        }
      }

    Lourah.ide.DefaultLanguage = text;

    })();
