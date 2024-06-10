Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.http.GET.js');

(function () {
    Lourah.covid19 = Lourah.covid19 || {};
    Lourah.covid19.owid = Lourah.covid19.owid || {};
    if (Lourah.covid19.owid.Data) return;

    let endPoint = "https://covid.ourworldindata.org/data/";

    const owid = {
      csv : "owid-covid-data.csv"
      ,timestamp: "owid-covid-data-last-updated-timestamp.txt"
      ,dataDir: Lourah.jsFramework.dir() + "/data/"
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
        }
      
      this.getData = (fData, reject) => {
        getCSV(
          (fCSV) => {
            let jsData = null;
            try {
              jsData = Lourah.covid19.owid.Data.csv2js(fCSV);
              } catch(e) {
              reject("Lourah.covid19.owid.Data::getData::csv2js::" + e);
              }
            fData(jsData);
            }
          , reject
          )
        }

      }

    const csvFields = {
      iso_code: false
      //,continent: false
      //,location: toKey("Country")
      ,date:["DateRep"]
      ,total_cases: ["Cases", "total"]
      ,new_cases: ["Cases", "count"]
      ,new_cases_smoothed: ["Cases", "smoothed"]
      ,total_deaths:["Deaths", "total"]
      ,new_deaths:["Deaths", "count"]
      ,new_deaths_smooth:["Deaths", "smoothed"]
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
      //,new_tests,total_tests
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
      let sCsv = "" + Activity.path2String(
        fCsv.getAbsolutePath()
        );
      lCsv = sCsv.split('\n');

      let fields = lCsv[0].split(',');

      //console.log("fields::" + fields);
      let jCountry;
      let e;
      let iCountry = fields.indexOf("location");
      ///console.log("iCountry::" + iCountry);


      let iFields = [];
      for(let i = 0; i<fields.length; i++) {
        if (csvFields[fields[i]]) {
          iFields.push({
              i:i|0
              ,f:csvFields[fields[i]]
              });
          }
        }

      let i0 = 0;
      let iField;

      for (let i = 1; i < lCsv.length; i++) {
        let values = lCsv[i].split(',');
        let sCountry = values[iCountry];

        if (!js[sCountry]) {
          js[sCountry] = [];
          jCountry = js[sCountry];
          //i0 = i;
          }

        e = {
          Cases:{}
          ,Deaths:{}
          };

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
      let stop = java.lang.System.currentTimeMillis();
      console.log("convert::csv2js::" + (stop - start) + " ms");
      return js; 
      };

    Lourah.covid19.owid.Data = Data;
    })();

/*

var ocd = new Lourah.covid19.owid.Data();

ocd.getData(
   (data) => {
      var countries = Object.keys(data);
      for (let i = 0; i < countries.length; i++) {
        console.log(countries[i] + "::" + data[countries[i]].length);
        }
      }
  , (e) => {
    Activity.reportError("REJECT::" + e)
    }
  );








/**/
