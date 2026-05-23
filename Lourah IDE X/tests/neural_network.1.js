// Helper functions for function composition
function pipe(...fns) {
  //console.log("in pipe:" + fns);
  return x => fns.reduce((v, f) => f(v), x);
  }
const map = fn => arr => arr.map(fn);
const reduce = (fn, initial) => arr => arr.reduce(fn, initial);

// Activation functions and their derivatives
const sigmoid = x => 1 / (1 + Math.exp(-x));
const relu = x => Math.max(0, x);
const sigmoidDerivative = x => {
  const sx = sigmoid(x);
  return sx * (1 - sx);
  };
const reluDerivative = x => x > 0 ? 1 : 0;

// Create random weights and bias
const createRandomArray = length => Array.from(
  { length },
  () => Math.random() * 2 - 1
  );
// Neuron functions
function createNeuron(numInputs, activation, activationDerivative) {
  
  activation = activation?activation:sigmoid;
  activationDerivative = activationDerivative?activationDerivative:sigmoidDerivative;
  
  const state = {
    weights: createRandomArray(numInputs),
    bias: Math.random() * 2 - 1,
    lastInput: null,
    lastOutput: null,
    lastActivation: null
    };

  const activate = inputs => {
    state.lastInput = inputs;
    const weightedSum = state.weights.reduce((sum, weight, i) => sum + weight * inputs[i], 0) + state.bias;
    state.lastActivation = weightedSum;
    state.lastOutput = activation(weightedSum);
    return state.lastOutput;
    };

  const updateWeights = (learningRate, delta) => {
    state.weights = state.weights.map((weight, i) => weight - learningRate * delta * state.lastInput[i]);
    state.bias -= learningRate * delta;
    };

  const getState = () => ({
      lastOutput: state.lastOutput,
      lastActivation: state.lastActivation,
      weights: state.weights
      });

  return {
    activate,
    updateWeights,
    getState,
    activationDerivative
    };
  };

// Layer functions
const createLayer = (numInputs, numNeurons, activation, activationDerivative) => {
  const neurons = Array.from(
    { length: numNeurons },
    () => createNeuron(numInputs, activation, activationDerivative)
    );

  const forward = inputs => neurons.map(neuron => neuron.activate(inputs));

  const backward = (nextLayerDeltas, learningRate) => {
    const layerDeltas = neurons.map((neuron, i) => {
        const neuronState = neuron.getState();
        const delta = neuron.activationDerivative(neuronState.lastActivation) * nextLayerDeltas[i];
        neuron.updateWeights(learningRate, delta);
        return neuronState.weights.map(weight => weight * delta);
        });

    // Sum up the deltas for each input
    return layerDeltas[0].map((_, inputIndex) =>
      layerDeltas.reduce((sum, neuronDeltas) => sum + neuronDeltas[inputIndex], 0)
      );
    };

  const getNeurons = () => neurons;

  return {
    forward,
    backward,
    getNeurons
    };
  };

// Neural network functions
const createNeuralNetwork = (layerSizes, activations, activationDerivatives) => {
  const layers = layerSizes.slice(1).map((size, i) =>
    createLayer(layerSizes[i], size, activations[i], activationDerivatives[i])
    );

  const forward = inputs => layers.reduce(
    (layerInput, layer) => layer.forward(layerInput),
    inputs
    );

  const backward = (target, learningRate) => {
    let deltas = layers[layers.length - 1].getNeurons().map((neuron, i) => {
        const state = neuron.getState();
        return (state.lastOutput - target[i]) * neuron.activationDerivative(state.lastActivation);
        });

    for (let i = layers.length - 1; i >= 0; i--) {
      deltas = layers[i].backward(deltas, learningRate);
      }
    };

  const train = (inputs, targets, epochs, learningRate) => {
    for (let epoch = 0; epoch < epochs; epoch++) {
      const totalLoss = inputs.reduce((loss, input, i) => {
          const output = forward(input);
          backward(targets[i], learningRate);
          return loss + mse([output], [targets[i]]);
          }, 0);

      if (epoch % 10000 === 0) {
        console.log(`Epoch ${epoch}, Average Loss: ${totalLoss / inputs.length}`);
        }
      }
    };

  const predict = input => forward(input);

  return {
    forward,
    backward,
    train,
    predict
    };
  };

// Loss function
const mse = (predicted, actual) =>
predicted.reduce((sum, p, i) => sum + Math.pow(p - actual[i], 2), 0) / predicted.length;

// Data normalization functions
const normalizeData = (data, min, max) => data.map(value => (value - min) / (max - min));
const denormalizeData = (normalizedValue, min, max) => normalizedValue * (max - min) + min;

// Prepare data function
const prepareData = data => {
  const getMinMax = index => ({
      min: Math.min.apply(null, data.map(d => d[index])),
      max: Math.max.apply(null, data.map(d => d[index]))
      });

  const size = getMinMax(0);
  const bedrooms = getMinMax(1);
  const price = getMinMax(2);

  const normalizedInputs = data.map(d => [
      normalizeData([d[0]], size.min, size.max).slice(),
      normalizeData([d[1]], bedrooms.min, bedrooms.max).slice()
      ]);

  const normalizedTargets = data.map(d =>
    normalizeData([d[2]], price.min, price.max)
    );

  var ret =  {
    normalizedInputs,
    normalizedTargets,
    size,
    bedrooms,
    price
    };
  //console.log("ret:" + JSON.stringify(ret));
  return ret;
  };

// Example usage with house price prediction
const houseData = [
  [1400, 3, 200000],
  [1600, 3, 230000],
  [1700, 3, 245000],
  [1875, 4, 275000],
  [1100, 2, 180000],
  [2350, 4, 320000],
  [2100, 4, 305000],
  [1500, 3, 215000],
  [3000, 5, 400000],
  [2400, 5, 380000],
  ];

// Create and train the network
const housePriceNN = createNeuralNetwork([2, 4, 1], [relu, sigmoid], [reluDerivative, sigmoidDerivative]);
const { normalizedInputs, normalizedTargets, size, bedrooms, price } = prepareData(houseData);
housePriceNN.train(normalizedInputs, normalizedTargets, 1000, 0.1);

//console.log("did train");


// Create prediction function
const predictHousePrice = pipe(
  house => [
    normalizeData([house[0]], size.min, size.max).slice(),
    normalizeData([house[1]], bedrooms.min, bedrooms.max).slice()
    ],
  housePriceNN.predict,
  prediction => denormalizeData(prediction[0], price.min, price.max),
  Math.round
  );

// Test the network with new houses
console.log("\nPredictions:");
[
  [1550, 3],
	[1400, 3],
  [2000, 4],
  [1200, 2],
  [2500, 5]
  ].forEach(house => {
    const prediction = predictHousePrice(house);
    console.log(`House with ${house[0]} sq ft and ${house[1]} bedrooms: $${prediction}`);
    //console.log(JSON.stringify(prediction));
    });

console.log("Serialised:" + JSON.stringify(housePriceNN));
