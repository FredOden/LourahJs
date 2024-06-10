var Lourah = Lourah || {};
(function () {
    Lourah.covid19 = Lourah.covid19 || {};

    var country = 6;
    var dateMDY = 0;
    var cases = 4;
    var deaths = 5;

    function csv2js(fCsv) {
      try {
        var scsv = Activity.path2String(
          Lourah.jsFramework.root()
          + "/Download/"
          + fCsv
          );
        var lines = scsv.split('\r\n');
        var roughfields = lines[0].split(',');
        var fields = [];
        roughfields.forEach(field => {
            //console.log('"'+field.charAt(0) +'"');
            fields.push(((new String(field)).charAt(0)).toUpperCase() + field.slice(1))
            });
        var js = {};

        //console.log(scsv.length());

        for(var i = 1; i < lines.length; i++) {
          var items = lines[i].split(',');
          //console.log("country::" + items[country]);
          if (!js[items[country]]) {
            js[items[country]] = [];
            }
          jItem = {};
          items.forEach((item, ii) => {
              /*
              if (ii ===0) {
                var date = item.split('/');
                if (date.length !== 3) {
                  date = item.split('-');
                  }
        
                jItem[fields[ii]] = (new Date(date[2], date[0] - 1, date[1])).getTime();
                return;
                }
              */
              jItem[fields[ii]] = item;
              });
          
          jItem.DateRep = (new Date(
              jItem.Year
              ,jItem.Month - 1
              ,jItem.Day)).getTime();
          
          js[items[country]].push(jItem)
          }
        return js;
        } catch (e) {
        Activity.reportError("csv2js::error::" + e + "::" + e.stack);
        }
      }

    function buildReportName(day, month, year, ext) {
      var radix = "COVID-19-geographic-disbtribution-worldwide-YYYY-MM-DDEE.csv";
      radix = radix.replace("YYYY", ""+year);
      radix = radix.replace("MM", ("0" + month).slice(-2));
      radix = radix.replace("DD", ("0" + day).slice(-2));
      radix = radix.replace("EE",
        (("" + ext) === "0")?"":("_" + ext)
        );
      return radix;
      }


    Lourah.covid19.Report = function(day, month, year, ext) {
      var report = buildReportName(day, month, year, ext);
      console.log("report::" + report);
      var js = csv2js(report);
      //console.log("js::" + js["Afghanistan"]);
      this.addData = (country, cases, deaths) => {
        js[country].push({
            DateRep: new Date()
            ,Cases: cases
            ,Deaths : deaths
            });
        }
      
      this.getCountries = () => Object.keys(js).sort();

      this.getData = (country) => {
        //console.log(country +"::" + js[country]);
        js[country].sort((a, b) => a.DateRep - b.DateRep);
        var limit = 35;
        var data = js[country];
        for(var i = 0; i < data.length; i++) {
          data[i].computed = {
            Cases: {}
            ,Deaths: {}
            ,Cross: {} // cases to deaths ratios
            };
          var computed = data[i].computed;
          ["Cases", "Deaths"].forEach(
            kind => {
              if (i === 0) {
                computed[kind] = {
                  count : Number(data[i][kind])
                  ,total : Number(data[i][kind])
                  ,progression: 1
                  }
                return;
                }
              var total = Number(data[i][kind]) + data[i-1].computed[kind].total;
              computed[kind] = {
                count : Number(data[i][kind])
                ,total : Number(data[i][kind]) + data[i-1].computed[kind].total
                , progression : (
                  data[i-1].computed[kind].total
                  ?Number(
                    (
                      Number(data[i][kind])
                      +
                      data[i-1].computed[kind].total
                      )
                    )/data[i - 1].computed[kind].total
                  :1)

                }
              if (false && kind === "Cases") console.log("--" + kind + "[" + i + "] ::"
                + computed[kind].total
                + "::"
                + computed[kind].count
                + "::"
                + computed[kind].progression
                );

              var mean = {
                rough:0
                ,ponderated:0
                }
              var ponderation = 0;
              for(var j = 0 /*data.length - limit*/; j <= i; j++) {
                //if (isNaN(data[j].computed[kind].progression)) continue;
                mean.rough += Number(data[j].computed[kind].progression);
                mean.ponderated += Number(
                  data[j].computed[kind].progression
                  * data[j].computed[kind].total
                  );
                ponderation += data[j].computed[kind].total;
                }
              //console.log("p::" + data[i].computed[kind].progression);
              mean.rough = mean.rough/limit;
              mean.ponderated = mean.ponderated/ponderation;

              if (false && kind === "Cases") {
                console.log("---ponderated::" + mean.ponderated +"::" + ponderation);
                }

              computed[kind].mean = mean;
              //console.log(i + "::" + mean.rough + "::" + mean.ponderated);
              }
            );
          }
        return data;
        }
      };
    Lourah.covid19.Country = function(country, data) {
      }
    })();
