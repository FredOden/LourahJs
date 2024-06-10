var Lourah = Lourah || {};
( function () {
    
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.text = Lourah.utils.text || {};
    Lourah.utils.text.number = Lourah.utils.text.number || {};
    
    if (Lourah.utils.text.number.Stringifier) return;
    
    Lourah.utils.text.number.Stringifier = {};
    
    const vingt = [
      ""
      ,"un"
      ,"deux"
      ,"trois"
      ,"quatre"
      ,"cinq"
      ,"six"
      ,"sept"
      ,"huit"
      ,"neuf"
      ,"dix"
      ,"onze"
      ,"douze"
      , "treize"
      , "quatorze"
      , "quinze"
      , "seize"
      , "dix-sept"
      , "dix-huit"
      , "dix-neuf"
      ];

    const dizaines = [
      ""
      ,"*"
      ,"&vingt"
      ,"&trente"
      ,"&quarante"
      ,"&cinquante"
      ,"&soixante"
      ,"*&soixante"
      ,"quatre-vingt"
      ,"*quatre-vingt"
      ];

    const ET = " et ";
    
    const milles=[
      ""
      ," mille"
      ,"s million"
      ,"s milliard"
      ];

    const digits = [
      ""
      , "one"
      , "two"
      , "three"
      , "four"
      , "five"
      , "six"
      , "seven"
      , "eight"
      , "nine"
      , "ten"
      , "eleven"
      , "twelve"
      , "thirteen"
      , "fourteen"
      , "fifteen"
      , "sixteen"
      , "seventeen"
      , "eighteen"
      , "nineteen"
      ];
    
    const tenth = [
      ""
      , "*"
      , "twenty"
      , "thirty"
      , "forty"
      , "fifty"
      , "sixty"
      , "seventy"
      , "eighty"
      , "ninety"
      ];
    
    const thousands = [
      ""
      , " thousand"
      , "s million"
      , "s billion"
      ]
    
    const meta = {
      "fr" : {
        digits: vingt
        ,tenth: dizaines
        ,hundred: " cent "
        ,thousands: milles
        ,and: ET
        }
      ,"en": {
        digits: digits
        , tenth: tenth
        ,hundred: " hundred "
        , thousands: thousands
        , and: " and "
        }
      };
    

    function translateCDU(number, language) {
      var n = number % 1000
      var c = Math.floor(n/100);

      var dix = n % 100;
      var dz = meta[language].tenth[Math.floor(dix/10)];
      var u = dix % 10;
      var et = " ";
      if (dz.charAt(0) === "*") {
        u += 10;
        dz = dz.substr(1);
        }
      if (dz.charAt(0) === "&") {
        if (u % 10 === 1) {
          et = meta[language].and;
          }
        dz = dz.substr(1);
        }
      return (((c>0)? ((c===1)?meta[language].hundred :meta[language].digits[c] + meta[language].hundred):"") + dz + et + meta[language].digits[u]);
      }

    
    function translate(n, language) {
      var number=n;
      var ret = "";
      for(var i = 0;number > 0;number = Math.floor(number/1000)) {
        var c;
        var cdu = translateCDU(c = (number % 1000), language);
        var t = meta[language].thousands;
        if (c > 0) cdu += t[i].charAt(0) !== " "?t[i].substr(1):t[i];
        if (i>0 && c > 1 && t[i].charAt(0) !== " ") {
          cdu += t[i].charAt(0);
          }
        ret = cdu + " " + ret;
        i++;
        }
      return ret.replace(/\s+/g, " ");
      }

    Lourah.utils.text.number.Stringifier.translateAmount = function translateAmount(language, currency, subCurrency, weight, amount) {
      var cents = (Math.round(amount * weight)) % weight;
      var integer = Math.floor(amount);
      var ret = translate(integer, language) + " " + currency;
      if (integer > 1) ret += "s";
      if (cents > 0) ret += meta[language].and + translate(cents, language) + " " + subCurrency;
      if (cents > 1) ret += "s";
      return ret.replace(/\s+/g, " ");
      }

    }) ();

//console.log(Lourah.utils.text.number.Stringifier.translateAmount("en", "Dollar", "cent", 100, 91201467811.206));
//console.log(Lourah.utils.text.number.Stringifier.translateAmount("fr", "Euro", "Centime", 100, 91201467811.206));
