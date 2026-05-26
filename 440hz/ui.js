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
    setOrientation: android.widget.LinearLayout.VERTICAL,
    //setPadding: dp(16),

    $title: {
      class: "android.widget.TextView",
      setText: "'Cockpit décisionnel'"
      //,setTextSize: sp(22)Typeface.defaultFromStyle(Typeface.BOLD);
      ,setTypeface: android.graphics.Typeface.defaultFromStyle(android.graphics.Typeface.BOLD)

      ,_setPaddingBottom: dp(12)
    },

    $scenarioLabel: {
      class: "android.widget.TextView",
      setText: "'Scénario :'",
      setTextSize: sp(16)
    },

    $scenario: {
      class: "android.widget.Spinner",
      setEntries: ["'Optimiste'", "'Neutre'", "'Pessimiste'"]
    },

    $sep1: {
      class: "android.view.View",
      setLayoutHeight: dp(1),
      setLayoutWidth: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
      setBackgroundColor: "'#CCCCCC'",
      setMarginTop: dp(8),
      setMarginBottom: dp(8)
    },

    $liquidityLabel: {
      class: "android.widget.TextView",
      setText: "'Liquidité'",
      setTextSize: sp(14)
    },

    $liquidity: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 60
    },

    $riskLabel: {
      class: "android.widget.TextView",
      setText: "'Risque'",
      setTextSize: sp(14)
    },

    $risk: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 40
    },

    $opportunityLabel: {
      class: "android.widget.TextView",
      setText: "'Opportunité'",
      setTextSize: sp(14)
    },

    $opportunity: {
      class: "android.widget.SeekBar",
      setMax: 100,
      setProgress: 50
    },

    $compute: {
      class: "android.widget.Button",
      setText: "'Évaluer'",
      setMarginTop: dp(12)
    },

    $result: {
      class: "android.widget.LinearLayout",
      setOrientation: android.widget.LinearLayout.VERTICAL,
      setBackground: "'#EEEEEE'",
      //setPadding: dp(12),
      setMarginTop: dp(16),

      $score: {
        class: "android.widget.TextView",
        setText: "'Score : --'",
        setTextSize: sp(18)
        //,setTypeface: android.graphics.Typeface.BOLD
      },

      $recommendation: {
        class: "android.widget.TextView",
        setText: "'Recommandation : --'",
        setTextSize: sp(14),
        setMarginTop: dp(8)
      }
    }
  }
};