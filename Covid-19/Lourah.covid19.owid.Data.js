Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.http.GET.js');

var Synchronizer = Packages.org.mozilla.javascript.Synchronizer;

(function () {
    Lourah.covid19 = Lourah.covid19 || {};
    Lourah.covid19.owid = Lourah.covid19.owid || {};
    if (Lourah.covid19.owid.Data) return;

    let endPoint = "https://covid.ourworldindata.org/data/";

    const owid = {
      csv : "owid-covid-data.csv"
      ,timestamp: "owid-covid-data-last-updated-timestamp.txt"
      ,dataDir: Lourah.jsFramework.root() + "/Download/covid19/"
      }

    function Data(ePoint) {
      if (ePoint) endPoint = ePoint;
      let dd = new java.io.File(owid.dataDir);
      if (!dd.exists()) {
        console.log("create directory::" + dd.getAbsolutePath());
        dd.mkdir();
        }
      if (!dd.isDirectory()) {
        throw "there is a snake in my boot::" + dd + "::is not a directory!";
        }

      let getCSV = (resolve, reject) => {
        //.console.log("dataDir::" + owid.dataDir);
        reject = reject || console.log;
        try {
          Lourah.http.GET(endPoint + owid.timestamp, (timestamp) => {
              timestamp = timestamp.trim();
              const fCSV = new java.io.File(dd + "/" + timestamp + ".csv");
              //console.log("fCSV::" + fCSV.getAbsolutePath());
              if (!fCSV.exists()) {
                //console.log("download::" + fCSV.getAbsolutePath());
                try {
                  Lourah.http.GET(endPoint + owid.csv, (csvData) => {
                      //console.log("csv::" + csvData.split("\n").length + "::lines::" + csvData.length + "::bytes");
                      let fw = null;
                      try {
                        fw = new java.io.FileWriter(fCSV);
                        fw.write(csvData);
                        } catch(e) {
                        reject("Lourah.covid19.owid.Data::getCSV::csv::download::" + e);
                        } finally {
                        if(fw) {
                          try {
                            fw.close();
                            resolve(fCSV);
                            } catch(e) {
                            reject("Lourah.covid19.owid.Data::getCSV::csv::download::close::" + e);
                            }
                          }
                        }
                      }
                    );
                  } catch(e) {
                  reject("Lourah.covid19.owid.Data::getCSV::csv::" + e);
                  }
                } else {
                try {
                  let t = new java.lang.Thread({
                      run: () => resolve(fCSV)
                      }
                    );
                  t.start();
                  } catch(e) {
                  reject("Lourah.covid19.owid.Data::getCSV::csv::read::" + e);
                  }
                }
              }
            );
          } catch(e) {
          reject("Lourah.covid19.owid.Data::getCSV::timestamp::" + e);
          }
        };

      jsData = null;
      this.loadData = (fData, reject) => {
        const self = this;
        getCSV(
          (fCSV) => {
            jsData = null;
            try {
              jsData = Lourah.covid19.owid.Data.csv2js(fCSV);
              /*
              let tCompiler = new java.lang.Thread({
                  run: () => {
                    try {
                      let start = java.lang.System.currentTimeMillis();
                      let countries = Object.keys(jsData);
                      for(var i = 0; i < countries.length; i++) {
                        console.log("compiling::" + countries [i]);
                        self.getData(countries[i]);
                        }
                      console.log(
                        "compile time::"
                        + (java.lang.System.currentTimeMillis() - start)
                        + " ms"
                        );
                      } catch(e) {
                      reject("Lourah.covid19.owid.Data::loadData::compiling::" + e + "::" + e.stack);
                      }
                    }
                  });
              tCompiler.start();
              /**/
              } catch(e) {
              reject("Lourah.covid19.owid.Data::loadData::csv2js::" + e);
              }
            fData(jsData);
            }
          , reject
          )
        };


      this.getData = new Synchronizer((country) => {
          //console.log(country +"::" + js[country]);
          //jsData[country].sort((a, b) => a.DateRep - b.DateRep);
          var limit = 35;
          var data = jsData[country];
          for(var i = 0; i < data.length; i++) {
            // check wether this country was already processed
            if (data[i].computed) return data;
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
          let last = data[data.length - 1];
          last.CountriesAndTerritories = country;
          let ymd = last.DateRep.split("-");
          last.Year = ymd[0];
          last.Month = ymd[1];
          last.Day = ymd[2];
          return data;
          });
      } // Data


    const csvFields = {
      iso_code: false
      ,continent: ["Continent"]
      //,location: toKey("Country")
      ,date:["DateRep"]
      //,total_cases: ["Cases", "total"]
      ,new_cases: ["Cases"] //, "count"]
      //,new_cases_smoothed: ["Cases", "smoothed"]
      //,total_deaths:["Deaths", "total"]
      ,new_deaths:["Deaths"] //, "count"]
      //,new_deaths_smooth:["Deaths", "smoothed"]
      //,total_cases_per_million
      //,new_cases_per_million
      //,new_cases_smoothed_per_million
      //,total_deaths_per_million
      //,new_deaths_per_million
      //,new_deaths_smoothed_per_million
      //,reproduction_rate,icu_patients
      //,icu_patients_per_million
      //,hosp_patients
      //,hosp_patients_per_million
      //,weekly_icu_admissions
      //,weekly_icu_admissions_per_million
      //,weekly_hosp_admissions
      //,weekly_hosp_admissions_per_million
      //,new_tests
      //,total_tests
      //,total_tests_per_thousand
      //,new_tests_per_thousand
      //,new_tests_smoothed
      //,new_tests_smoothed_per_thousand
      //,positive_rate
      //,tests_per_case
      //,tests_units
      //,total_vaccinations
      //,total_vaccinations_per_hundred
      //,stringency_index
      ,population:["Population"]
      //,population_density
      //,median_age
      //,aged_65_older
      //,aged_70_older
      //,gdp_per_capita
      //,extreme_poverty
      //,cardiovasc_death_rate
      //,diabetes_prevalence
      //,female_smokers
      //,male_smokers
      //,handwashing_facilities
      //,hospital_beds_per_thousand
      //,life_expectancy
      //,human_development_index
      }
    /**/


    Data.csv2js = (fCsv) => {
      let start = java.lang.System.currentTimeMillis();
      let js = {};
      let jContinents = {};

      function buildAreas() {
        /*
        let continents = Object.keys(jContinents);
        //console.log("continents::" + continents);
        for(let iContinent = 0; iContinent < continents.length; iContinent++) {
          let jContinent = jContinents[iContinent];
          if (jContinent === undefined || jContinent === "") continue;
          for(let i = 0; i < jContinent.length; i++) {
            let sContinent = jContinent[i];
            js[sContinent] = {};
            let jData = js[sContinent];
            }
          }
        /**/
        }

      try {
        let sCsv = "" + Activity.path2String(
          fCsv.getAbsolutePath()
          );
        lCsv = sCsv.split('\n');

        let fields = lCsv[0].split(',');
        let jCountry;
        let e;
        let iCountry = fields.indexOf("location");
        let iContinent = fields.indexOf("continent");
        let iFields = [];

        for(let i = 0; i<fields.length; i++) {
          if (csvFields[fields[i]]) {
            iFields.push({
                i:i|0
                ,f:csvFields[fields[i]]
                });
            }
          }


        let iField;

        for (let i = 1; i < lCsv.length; i++) {
          let values = lCsv[i].split(',');
          let sCountry = values[iCountry];
          let sContinent = values[iContinent];

          if (!js[sCountry]) {
            js[sCountry] = [];
            if (!jContinents[sContinent]) {
              jContinents[sContinent] = [];
              }
            jCountry = js[sCountry];
            jContinents[sContinent].push(sCountry);
            }

          e = {};

          for (let j = 0; j < iFields.length; j++) {
            iField = iFields[j].f;
            if (!iField[1]) {
              e[iField[0]] = values[iFields[j].i];
              } else {
              e[iField[0]][iField[1]] = values[iFields[j].i];
              }
            }
          jCountry.push(e); //[i - i0] = e;
          }
        buildAreas();
        } catch(e) {
        console.log("Data.csv2js::" + e + "::" + e.stack);
        }
      let stop = java.lang.System.currentTimeMillis();
      console.log("convert::csv2js::" + (stop - start) + " ms");
      return js;
      };

    Lourah.covid19.owid.Data = Data;
    })();
