Activity.importScript(
Lourah.jsFramework.parentDir()
+ "/Lourah.widget.Tokenizer.js"
);

var Lourah = Lourah || {};
(function () {
    Lourah.ide = Lourah.ide || {};
    if (Lourah.ide.Languages) return;
    
    
    Lourah.Supported = {};

    Activity.importScript(
      Lourah.jsFramework.parentDir()
      + "/Lourah.ide.Languages.javascript.js"
      );
    
    Activity.importScript(
      Lourah.jsFramework.parentDir()
      + "/Lourah.ide.Languages.glsl.js"
      );
    

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
        ,language : Lourah.Supported.javascript
        }
      ,glsl: {
        re : /.*[.](glsl)$/
        ,language : Lourah.Supported.glsl
        }
      ,html: {
        re : /.*[.](htm)|(html)$/
        ,language : html
        }
      }

    Lourah.ide.DefaultLanguage = text;

    })();
