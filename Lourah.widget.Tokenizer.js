var Lourah = Lourah || {};
(function () {
    Lourah.widget = Lourah.widget || {};
    if (Lourah.widget.Tokenizer) return;

    function Tokenizer(arraySeparators) {

      //console.log("Tokenizer::[" + arraySeparators + "]");
      function matchSeparators(char) {
        try {
          return arraySeparators.indexOf(
            String.fromCharCode(char)
            ) > -1;
          } catch(e) {
          Activity.reportError("matchSepatators::" + e + "::" + e.stack);
          }
        }

      this.findTokenEnd = function(charSequence, cursor) {
        //console.log("end::cursor::" + cursor + "::<" + charSequence + ">");
        try {

          var i = cursor;
          var len = charSequence.length();
          for (;i < len; i++) {
            if (matchSeparators(
                charSequence.charAt(i)
                )) {
              //console.log("end::" + i + "::<" + charSequence + ">");
              return i;
              }
            }
          return len;
          } catch(e) {
          Activity.reportError("Tokenizer::findTokenEnd::" + e + "::" + e.stack);
          }
        };

      this.findTokenStart = function(charSequence, cursor) {
        try {
          var i = cursor;
          for(;i > 0; i--) {
            if (matchSeparators(
                charSequence.charAt(i - 1)
                )) {
              //console.log("start::" + (i - 1) + "::<" + charSequence + ">");
              return i;
              }
            }
          return 0;
          } catch(e) {
          Activity.reportError("Tokenizer::findTokenStart::" + e + "::" + e.stack);
          }
        };

      this.terminateToken = function(charSequence) {
        try {
          //console.log("terminate::<" + charSequence + ">");
          return charSequence;
          } catch(e) {
          Activity.reportError("Tokenizer::terminateToken::" + e + "::" + e.stack);
          }
        };
      }

    Tokenizer.Separators = {
      SPACES: [' ', '\t', '\n', '\r' ]
      ,PUNCTUATION: [' ', '\t', '\n', '\r', ',', '.', ';' ]
      ,JAVA: " \t\r\n,.;:?*+-/()[]{}=|&".split("")
      }

    //console.log("JAVA_SEPARATORS::" + JAVA_SEPARATORS);

    Tokenizer.buildSpacesTokenizer = function () {
      try {
        return new Tokenizer(Tokenizer.Separators.SPACES);
        } catch (e) {
        Activity.reportError("Tokenizer::buildWhiteTokenizer::" + e + "::" + e.stack);
        }
      }

    Tokenizer.buildPunctuationTokenizer = function () {
      try {
        return new Tokenizer(Tokenizer.Separators.PUNCTUATION);
        } catch (e) {
        Activity.reportError("Tokenizer::buildPonctuationTokenizer::" + e + "::" + e.stack);
        }
      }

    Tokenizer.buildJavaTokenizer = function () {
      try {
        return new Tokenizer(Tokenizer.Separators.JAVA);
        } catch (e) {
        Activity.reportError("Tokenizer::buildPonctuationTokenizer::" + e + "::" + e.stack);
        }
      }

    Lourah.widget.Tokenizer = Tokenizer;
    })();
