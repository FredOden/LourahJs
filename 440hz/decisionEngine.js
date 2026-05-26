// decisionEngine.js
var DecisionEngine = (function() {

  function computeScore(context) {
    // Exemple : score = pondération simple
    var score =
        context.liquidity * 0.4 +
        context.risk       * -0.3 +
        context.opportunity * 0.3;

    return Math.round(score);
  }

  function buildRecommendation(score, context) {
    if (score > 70) {
      return "Position confortable : possibilité d’augmenter les placements à moyen terme.";
    } else if (score > 40) {
      return "Situation correcte : privilégier la liquidité, surveiller le risque.";
    } else {
      return "Situation tendue : réduire le risque, renforcer la trésorerie court terme.";
    }
  }

  function evaluate(context) {
    var score = computeScore(context);
    var recommendation = buildRecommendation(score, context);
    return {
      score: score,
      recommendation: recommendation
    };
  }

  return {
    evaluate: evaluate
  };
})();

