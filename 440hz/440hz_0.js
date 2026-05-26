Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');

Activity.importScript(Lourah.jsFramework.dir() + "/decisionEngine.js");
Activity.importScript(Lourah.jsFramework.dir() + "/ui.js");

var Overview = Lourah.android.Overview;

// Construction de l’UI
var view = Overview.buildFromSugar(UI);
//console.log(JSON.stringify(view));

Activity.setContentView(view.$root);


// Accès direct via les noms $xxx
var scenario     = view.$scenario;
var liquidity    = view.$liquidity;
var risk         = view.$risk;
var opportunity  = view.$opportunity;
var compute      = view.$compute;
var scoreView    = view.$score;
var recView      = view.$recommendation;

function buildContext() {
  var scen = scenario.getSelectedItem().toString().toLowerCase();

  var ctx = {
    liquidity: liquidity.getProgress(),
    risk: risk.getProgress(),
    opportunity: opportunity.getProgress(),
    scenario: scen
  };

  console.log("scénario:" + scen);
  
  if (scen === "optimiste") {
    ctx.opportunity += 10;
    ctx.risk -= 5;
  } else if (scen === "pessimiste") {
    ctx.opportunity -= 10;
    ctx.risk += 10;
  }

  ctx.opportunity = Math.max(0, Math.min(100, ctx.opportunity));
  ctx.risk        = Math.max(0, Math.min(100, ctx.risk));

  return ctx;
}

Activity.setTitle("440hz the perfect wave");
//Activity.setContentView(view);


function refresh() {
  console.log("refresh");
  
  try {
  var ctx = buildContext();
  var result = DecisionEngine.evaluate(ctx);

  scoreView.setText("Score : " + result.score);
  recView.setText("Recommandation : " + result.recommendation);
  
    } catch(e) {
    console.log("refresh::" + e);
    }
}

//compute.setOnClickListener(new dandroid.view.View.OnClickListener({
//  onClick: refresh
//}));

//refresh();


