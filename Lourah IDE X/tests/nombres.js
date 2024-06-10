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
  ]


function translateCDU(number) {
  var n = number % 1000
  var c = Math.floor(n/100);

  var dix = n % 100;
  var dz = dizaines[Math.floor(dix/10)];
  var u = dix % 10;
  var et = " ";
  if (dz.charAt(0) === "*") {
    u += 10;
    dz = dz.substr(1);
    }
  if (dz.charAt(0) === "&") {
    if (u % 10 === 1) {
      et = " et ";
      }
    dz = dz.substr(1);
    }
  return (((c>0)? ((c===1)?"cent ":vingt[c] + " cent "):"") + dz + et + vingt[u]);
  }

const milles=[
  ""
  ," mille"
  ," million"
  ," milliard"
  ];

function translate(n) {
  var number=n;
  var ret = "";
  for(var i = 0;number > 0;number = Math.floor(number/1000)) {
    var c;
    var cdu = translateCDU(c = (number % 1000));
    if (c > 0) cdu += milles[i];
    if (i>0 && c > 1) {
      cdu += "s";
      }
    ret = cdu + " " + ret;
    i++;
    }
  return ret.replace(/\s+/g, " ");
  }

function translateAmount(currency, subCurrency, weight, amount) {
  var cents = (Math.round(amount * weight)) % weight;
  var integer = Math.floor(amount);
  var ret = translate(integer) + " " + currency;
  if (integer > 1) ret += "s";
  if (cents > 0) ret += " et " + translate(cents) + " " + subCurrency;
  if (cents > 1) ret += "s";
  return ret.replace(/\s+/g, " ");
  }

console.log(translateAmount("Euro", "Centime", 100, 91201467811.236));
