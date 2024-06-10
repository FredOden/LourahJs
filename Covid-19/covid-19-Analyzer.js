Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.dir() + "/Lourah.covid19.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.g2d.js");

var now = new Date();
var ext = 0;

var screen = {
  $ll : {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    ,$sv : {
      class: "android.widget.ScrollView"
      ,$ll0: {
        class: "android.widget.LinearLayout"
        ,setOrientation : android.widget.LinearLayout.VERTICAL
        ,$ll00 : {
          class: "android.widget.LinearLayout"
          ,setOrientation : android.widget.LinearLayout.HORIZONTAL
          ,$ll1 : {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.HORIZONTAL
            ,$date: {
              class: "android.widget.EditText"
              ,setTextSize: 12
              ,setText: "'" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "/" + ext +"'"
              }
            ,$go: {
              class: "android.widget.Button"
              ,setText: "'Compute'"
              ,setTextSize: 12
              ,setOnClickListener: {
                onClick:v => compute()
                }
              }
            }
          ,$ll2 : {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.HORIZONTAL
            ,$country: {
              class: "android.widget.EditText"
              ,setHint: "'specify country'"
              ,setEnabled: false
              ,setTextSize: 12
              }
            ,$show: {
              class: "android.widget.Button"
              ,setText: "'Report'"
              ,setEnabled: false
              ,setTextSize: 12
              ,setOnClickListener: {
                onClick:v => doReport()
                }
              }
            }
          }
        ,$llPalmares: {
          class: "android.widget.LinearLayout"
          ,setOrientation:android.widget.LinearLayout.HORIZONTAL
          ,$bDeaths: {
            class: "android.widget.Button"
            ,setText: "'Palmares Deaths'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares("Deaths")
              }
            }
          ,$bCases: {
            class: "android.widget.Button"
            ,setText: "'Palmares Cases'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares("Cases")
              }
            }
          }
        ,$status: {
          class: "android.widget.TextView"
          ,setTextSize: 10
          }
        ,$sv0: {
          class: "android.widget.ScrollView"
          ,$ll11: {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.VERTICAL
            ,$c2d: {
              class: "android.widget.ImageView"
              }
            ,$cPalmares: {
              class: "android.widget.ImageView"
              }
            }
          }
        }
      }
    }
  };

var $screen = Lourah.android.Overview.buildFromSugar(screen);

/*
var contexts = {
  Cases: new Context2d($screen.$cCases)
  ,Deaths: new Context2d($screen.$cDeaths)
  };
*/


Activity.setTitle("Covid-19 Analyzer 1.0");
Activity.setContentView($screen.$ll);

function setStatus(status) {
  var s = $screen.$status;
  s.setText(s.getText() + status + "\n");
  }

function setStatusCat(status) {
  var s = $screen.$status;
  s.setText(s.getText() + status);
  }

function clearStatus() {
  $screen.$status.setText("");
  }

var report;




function compute() {


  var r = $screen.$date.getText().toString().split("/");


  report = new Lourah.covid19.Report(r[2], r[1], r[0], r[3]);
  $screen.$country.setEnabled(true);
  $screen.$show.setEnabled(true);
  $screen.$bDeaths.setEnabled(true);
  $screen.$bCases.setEnabled(true);
  }

function doReport() {
  try {
    clearStatus();
    setStatus("kind::total(daycount)::pondRate%(1)::dayRate% + forecast in 1,2,3,4,5,10 days from rates");
    //["France", "Italy", "Spain", "Germany", "United_States_of_America", "Switzerland"]
    var country = $screen.$country.getText().toString();
    setStatus("#" + country + "::");
    var data = report.getData(country);
    var last = data[data.length - 1].computed;
    ["Cases", "Deaths"].forEach(kind => {
        var meanMeanPonderated = 0;
        var weight = 0;
        for(var mmpi = 0; mmpi < 3; mmpi++) {
          var d = data[data.length - 1 - mmpi].computed;
          var c = d[kind].count; //data[data.length - 1 - mmpi][kind];
          meanMeanPonderated += (d[kind].mean.ponderated - 1)*c;
          console.log(kind + "::" + mmpi + "::" + meanMeanPonderated);
          weight += c;
          }
        meanMeanPonderated = 1 + meanMeanPonderated/weight;
        console.log("meanMeanPonderated::" + meanMeanPonderated);
        last[kind].mean.meanPonderated = meanMeanPonderated;
        setStatus(" " + kind + "::"
          + last[kind].total + "(+"  + last[kind].count + ")"
          + "::"
          + ((last[kind].mean.meanPonderated - 1)*100).toFixed(2) + "%"
          + "::"
          + ((last[kind].progression -1)*100).toFixed(2) + "%"
          );

        setStatusCat("  P forecast:");
        [1,2,5,7,10].forEach(day => {
            setStatusCat(day + ":" + (Math.floor(
                  Number(last[kind].total)
                  *Math.pow(Number(last[kind].mean.meanPonderated), day)
                  ))
              + ", "
              );
            });
        setStatusCat("\n  D forecast:");
        [1,2,5,7,10].forEach(day => {
            setStatusCat(day + ":" + (Math.floor(
                  Number(last[kind].total)
                  *Math.pow(Number(last[kind].progression), day)
                  ))
              + ", "
              );
            });
        setStatus("");
        });
    setStatus(" (1)pondRate: calculated ponderated mean of daily rate since beginning of statistical data");
    graph(last, data);

    } catch(e) {
    setStatus("doReport::Error::" + e + "::" + e.stack);
    }
  }

function doPalmares(kind) {
  try{
    var Color = Lourah.graphics.Color;
    drawPalmares([
        { name: "France", color: Color.CYAN }
        ,{ name: "Italy", color: Color.argb(255,0,128,0) }
        ,{ name: "Spain", color: Color.argb(255,255,140,0) }
        ,{ name: "Germany", color: Color.WHITE }
        ,{ name: "United_States_of_America", color: Color.MAGENTA }
        ,{ name: "Switzerland", color: Color.GRAY }
        ,{ name: "Belgium", color: Color.RED }
        ,{ name: "South_Korea", color: Color.argb(255,255,0,127)}
        ,{ name: "Netherlands", color: Color.argb(255,124,64,127)}
        ,{ name: "Romania", color: Color.argb(255,124,234,172)}
        ,{ name: "Sweden", color: Color.argb(255,124,34,172)}
        ,{ name: "Indonesia", color: Color.argb(255,24,134,172)}
        ]
      , kind
      );
    } catch(e) {
    setStatus("doPalmares::error::" + e + "::" + e.stack);
    }
  }

function graph(last, data) {
  var c2d = new Lourah.graphics.g2d.Context($screen.$c2d);
  display("Deaths", last, data, 0, Lourah.graphics.Color.BLACK, 7, 20, 0);
  display("Cases", last, data, 10000, Lourah.graphics.Color.BLUE, 7, 200, Math.PI/144, Lourah.graphics.Color.argb(127, 245, 245, 220));

  function display(kind, last, data, z, color, future, yUnit, rotate, background) {
    var layer = c2d.createLayer();

    var paintCurve = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pAxis = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pGridUnit = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 0.5
        ,textSize:40
        });

    var pText = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.RED
        ,style: android.graphics.Paint.Style.FILL
        ,textSize:40
        });

    var byMillion = (Number(last[kind].total)/data[data.length - 1].PopData2018)*1000000;

    var pond = (x) => (byMillion
      *Math.pow(Number(last[kind].mean.meanPonderated), x));

    var prog = (x) => (byMillion
      *Math.pow(Number(last[kind].progression), x));

    var maxY = Math.max(
      pond(future - 1),
      prog(future - 1)
      );

    var xAxis = {
      min:-20
      ,max:future - 1
      }
    var yAxis = {
      min:-maxY*.05
      ,max: maxY
      }

    //console.log(kind + "::xAxis::" + xAxis.min + "," + xAxis.max);
    //console.log(kind + "::yAxis::" + yAxis.min + "," + yAxis.max);

    layer.setRotation(0, -rotate, rotate);
    layer.setViewPortX(xAxis.min , xAxis.max);
    layer.setZ(z);
    layer.setViewPortY(yAxis.min, yAxis.max);

    if (background) {
      var pBackground = Lourah.graphics.g2d.buildPaint({
          color: background
          ,style: android.graphics.Paint.Style.FILL
          ,textSize:40
          });
      
      var corners = [
        layer.getP2d([xAxis.min, yAxis.max])
        ,layer.getP2d([xAxis.max, yAxis.max])
        ,layer.getP2d([xAxis.max, yAxis.min])
        ,layer.getP2d([xAxis.min, yAxis.min])
        ];
      
      var pathBackground = new android.graphics.Path();
      pathBackground.moveTo(corners[0][0], corners[0][1]);
      pathBackground.lineTo(corners[1][0], corners[1][1]);
      pathBackground.lineTo(corners[2][0], corners[2][1]);
      pathBackground.lineTo(corners[3][0], corners[3][1]);
      pathBackground.lineTo(corners[0][0], corners[0][1]);
      layer.getCanvas().drawPath(
        pathBackground
        ,pBackground
        );
      }

    layer.createAxisX({
        min:xAxis.min
        ,max:xAxis.max
        ,unit:5
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis)
    .createAxisY({
        min:yAxis.min
        ,max:yAxis.max
        ,unit:yUnit //Math.floor(yAxis.max/10)
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis);

    var curve = layer.createCurveFx(
      prog
      , xAxis.min
      , xAxis.max
      , xAxis.max - xAxis.min
      );

    curve.draw(paintCurve);
    curve = layer.createCurveFx(
      pond
      , xAxis.min
      , xAxis.max
      , xAxis.max - xAxis.min
      );

    curve.draw(paintCurve);


    var serial =[];
    var kMillion = 1000000/data[data.length - 1].PopData2018;
    for(var i = Math.max(data.length - 20,0); i < data.length; i++) {
      serial.push([i - data.length + 1, kMillion*data[i].computed[kind].total]);
      }

    var spots = layer.createSerial(serial);
    spots.draw(paintCurve);

    var d = data[data.length - 1];

    layer.addLabel(
      "" + (kMillion*d.computed[kind].total).toFixed(2)
      ,[
        serial[serial.length - 1][0] + 1
        ,serial[serial.length - 1][1]*1.02
        ]
      ,pText
      );

    layer.addLabel(
      d.CountriesAndTerritories
      + " - "
      + d.Day + "/" + d.Month + "/" + d.Year
      ,[xAxis.min ,yAxis.max * .85]
      ,paintCurve
      );


    layer.addLabel(
      kind + "/" + "Million"
      ,[xAxis.min*.9 ,yAxis.max * .80]
      ,paintCurve
      );

    layer.drawLabels();

    }
  }

function drawPalmares(countries, kind) {
  var c2d = new Lourah.graphics.g2d.Context($screen.$cPalmares);
  var layer = c2d.createLayer();
  var maxY = 0;
  countries.forEach(country => {
      country.serial = [];
      var data = report.getData(country.name);
      country.kMillion = 1000000/data[data.length - 1].PopData2018;
      country.data = data;
      //var last = data[data.length - 1].computed;
      var y;
      for(var i = Math.max(data.length - 20,0); i < data.length; i++) {
        y = country.kMillion*data[i].computed[kind].total;
        country.serial.push([i - data.length + 1, y]);
        if (y > maxY) maxY = y;
        }
      country.score = y;
      });

  var xAxis = {
    min:-20
    ,max:4
    }
  var yAxis = {
    min:-maxY*.05
    ,max: maxY*1.2
    }

  var yUnit = (kind === "Cases")?200:20;

  var pAxis = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.WHITE
      ,style: android.graphics.Paint.Style.STROKE
      ,strokeWidth: 3
      ,textSize:40
      });

  var pGridUnit = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.WHITE
      ,style: android.graphics.Paint.Style.STROKE
      ,strokeWidth: 0.5
      ,textSize:40
      });

  var pText = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.RED
      ,style: android.graphics.Paint.Style.FILL
      ,textSize:40
      });

  var pBackground = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.argb(255, 0, 0, 0)
      ,style: android.graphics.Paint.Style.FILL
      ,textSize:40
      });

  layer.getCanvas().drawRect(
    0
    , 0
    , c2d.getWidth()
    , c2d.getHeight()
    , pBackground
    )

  layer.setViewPortX(xAxis.min , xAxis.max);
  layer.setViewPortY(yAxis.min, yAxis.max);
  layer.createAxisX({
      min:xAxis.min
      ,max:xAxis.max
      ,unit:5
      ,paintGridUnit:pGridUnit
      ,paintTagUnit:pText
      }).draw(pAxis)
  .createAxisY({
      min:yAxis.min
      ,max:yAxis.max
      ,unit:yUnit //Math.floor(yAxis.max/10)
      ,paintGridUnit:pGridUnit
      ,paintTagUnit:pText
      }).draw(pAxis);

  countries
  .sort((a,b) => b.score - a.score)
  .forEach((country, i) => {
      var paintCurve = Lourah.graphics.g2d.buildPaint({
          color: country.color
          ,style: android.graphics.Paint.Style.STROKE
          ,strokeWidth: 3
          ,textSize:40
          });

      var spots = layer.createSerial(country.serial);
      spots.draw(paintCurve);
      var d = country.data[country.data.length - 1];
      layer.addLabel(
        "" + (country.kMillion*d.computed[kind].total).toFixed(2)
        ,[
          country.serial[country.serial.length - 1][0] + .7
          ,country.serial[country.serial.length - 1][1]*1.02
          ]
        ,paintCurve
        );
      layer.addLabel(
        country.name + ":" + country.score.toFixed(2)  + "(" + d.computed[kind].total + ")"
        ,[xAxis.min*.92, yAxis.max * (.82 - .035*i)]
        ,paintCurve
        );

      /*
      var pond = (x) => (country.kMillion*d.computed[kind].total
        *Math.pow(Number(d.computed[kind].mean.meanPonderated), x));
      var curve = layer.createCurveFx(
        pond
        , xAxis.min
        , xAxis.max
        , xAxis.max - xAxis.min
        );

      curve.draw(paintCurve);
      */
      });
  layer.addLabel(
    "Each country" + kind + " by Million(absolute value)"
    ,[xAxis.min*.95, yAxis.max * (.85)]
    ,pText
    );
  layer.drawLabels();
  }
