/*------------
for Overview plus
--------------*/

let setTypedValue = (v, typedValue) => android.util.TypedValue.applyDimension(
  typedValue,
  v
  ,Activity.getApplicationContext().getResources().getDisplayMetrics()
  );

let sp = v => setTypedValue(v, android.util.TypedValue.COMPLEX_UNIT_SP);
let dp = v => setTypedValue(v, android.util.TypedValue.COMPLEX_UNIT_DIP);
//let dp = v => v;
//let sp = dp;

var UI = {
  $root: {
    class: "android.widget.LinearLayout",
    setOrientation: android.widget.LinearLayout.VERTICAL
    ,setBackgroundColor: 0xfff0b0a0|0
    //setPadding: dp(16),
    ,$title: {
      class: "android.widget.TextView",
      setText: "'Cockpit décisionnel'"
      ,setTextSize: sp(12)
      ,setTypeface: android.graphics.Typeface.defaultFromStyle(android.graphics.Typeface.BOLD_ITALIC)

      ,_setPaddingBottom:(w, m, s) => { dp(12);
        console.log("#####hooked::" + m + "::");
        }
      },

    $scenarioLabel: {
      class: "android.widget.TextView",
      setText: "'Scénario :'",
      setTextSize: sp(13)
      },

    $scenario: {
      class: "android.widget.Spinner"
      //,setTextSize: sp(10)
      ,_setEntries: (w,m,translate) => {
        var spinnerArray = new java.util.ArrayList()
        spinnerArray.addAll(["'Optimiste'", "'Neutre'", "'Pessimiste'"].map(i => translate(eval(i))));

        var adapter = new android.widget.ArrayAdapter(
          Activity.getApplicationContext()
          ,android.R.layout.simple_spinner_dropdown_item|0
          //,$screen.$dropDown.getId()
          ,spinnerArray
          );
        w.setAdapter(adapter);
        }
      }
    ,
    /*
    $sep1: {
      class: "android.view.View",
      setLayoutHeight: dp(1),
      setLayoutWidth: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
      setBackgroundColor: 0xffCCCCCC,
      //setMarginTop: dp(8),
      //setMarginBottom: dp(8)
      setMargin: [dp(8), 0, dp(8), 0]
      },
    */
    $liquidityLabel: {
      class: "android.widget.TextView",
      setText: "'Liquidité'",
      setTextSize: sp(10)
      },

    $liquidity: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 60
      },

    $riskLabel: {
      class: "android.widget.TextView",
      setText: "'Risque'",
      setTextSize: sp(10)
      },

    $risk: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 40
      },

    $opportunityLabel: {
      class: "android.widget.TextView",
      setText: "'Opportunité'",
      setTextSize: sp(10)
      },

    $opportunity: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 50
      },

    $compute: {
      class: "android.widget.Button"
      ,setText: "'Évaluer'"
      ,setOnClickListener: {
	onClick: v => refresh()
      }
      //setMarginTop: dp(12)
      },
    $result: {
      class: "android.widget.LinearLayout",
      setOrientation: android.widget.LinearLayout.VERTICAL,
      //setBackground: "'#EEEEEE'",
      //setPadding: dp(12),
      //setMarginTop: dp(16),

      $score: {
        class: "android.widget.TextView",
        setText: "'Score : --'",
        setTextSize: sp(12)
        //,setTypeface: android.graphics.Typeface.BOLD
        },

      $recommendation: {
        class: "android.widget.TextView",
        setText: "'Recommandation : --'",
        setTextSize: sp(10)
        //setMarginTop: dp(8)
      ,setTypeface: android.graphics.Typeface.defaultFromStyle(android.graphics.Typeface.ITALIC)
        }
      }
   }
  };
