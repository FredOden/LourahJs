var Flights = Flights || {};

(function () {
    Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.utils.text.Search.js");

    Flights.utils = Flights.utils || {};
    
    if (Flights.utils.LocalDate) return;
    
    Flights.utils.LocalDate = function (str) {
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
      .walk(match => tz = match.$(1))
      .search(/(\d\d\d\d)-(\d\d)-(\d\d)T/g)
      .walk(match => (
          [year, month, day]
          = [match.$(1), match.$(2), match.$(3) ]
          ));
      this.getJsDate = () => jsDate;
      this.getHours = () => hours;
      this.getMinutes = () => minutes;
      this.getSeconds = () => seconds;
      this.getYear = () => year;
      this.getMonth = () => month;
      this.getDay = () => day;
      this.getTz = () => tz;

      }

    Flights.utils.openFlights = Flights.utils.openFlights || {};
    
    Flights.utils.openFlights.CSV = function (file, fields) {
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

    })();

/*
var cityPair = {"departure":{"iataCode":"BOD","terminal":"B","at":"2020-01-22T10:15:00+01:00"}};

var lDate = new Flights.utils.LocalDate(cityPair.departure.at);

console.log("ldate::dep::" + [lDate.getHours(), lDate.getMinutes(), lDate.getSeconds()] + "::(" + lDate.getTz() + ")");

var airports = new Flights.utils.openFlights.CSV(Lourah.jsFramework.dir() + "/airports-extended.dat"
  , [
    "id"
    ,"name"
    ,"city"
    ,"country"
    ,"iata"]);

airports.findByField("iata", cityPair.departure.iataCode,
  (m) => console.log("found::" + m.$(0)));

*/