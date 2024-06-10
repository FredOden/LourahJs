Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");

var cityPair = {
  "departure":{"iataCode":"BOD","terminal":"B","at":"2020-01-22T07:15:00+01:00"},
  "arrival":{"iataCode":"ORY","terminal":"2","at":"2020-01-22T11:30:00+01:00"}
  };

var departure = new Date(cityPair.departure.at);
var arrival = new Date(cityPair.arrival.at);

function LDate(str) {
  var jsDate = new Date(str);
  var sTime = new Lourah.utils.text.SearchString(str);
  var hours, minutes, seconds;
  var tz = 0;
  sTime.search(/T(\d\d):(\d\d):(\d\d)/g)
  .walk(match => (
      [hours, minutes, seconds]
      = [match.$(1), match.$(2), match.$(3) ]
      ))
  .search(/[\+\-]([^\+^\-]+)$/g)
  .walk(match => tz = match.$(1));
  this.getJsDate = () => jsDate;
  this.getHours = () => hours;
  this.getMinutes = () => minutes;
  this.getSeconds = () => seconds;
  this.getTz = () => tz;

  }

function CSV(file, fields) {
  var csv = new Lourah.utils.text.SearchString(Activity.path2String(file));
  //console.log("CSV::length::" + csv.toString().length());
  this.findByField = (field, query, f) => {
    var iField = fields.indexOf(field);
    if (iField === -1)
    throw new Error("CSV::findByField::'" + field + "' is not part of field list [" + fields + "]");
    sre = "\\n";
    for(var i = 0; i < fields.length; i++) {
      var sep = (i === fields.length - 1)?",[^\\n]+\\n":",";
      if (i === iField) {
        sre += '"' + query + '[^,]*"' + sep;
        } else {
        sre += "[^,]+" + sep;
        }
      }
    //console.log("sre::" + sre);
    var re = new RegExp(sre, "g");
    //console.log("re::" + re);
    csv.search(re)
    .walk(f)
    };
  }

var lDate = new LDate(cityPair.departure.at);

console.log("ldate::dep::" + [lDate.getHours(), lDate.getMinutes(), lDate.getSeconds()] + "::(" + lDate.getTz() + ")");

var airports = new CSV(Lourah.jsFramework.dir() + "/airports-extended.dat"
  , [
    "id"
    ,"name"
    ,"city"
    ,"country"
    ,"iata"]);

airports.findByField("iata", cityPair.departure.iataCode,
  (m) => console.log("found::" + m.$(0)));




