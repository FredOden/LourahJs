var Lourah = Lourah || {};
(function () {
    Lourah.utils = Lourah.utils || {};
    Lourah.utils.math = Lourah.utils.math || {};
    if (Lourah.utils.math.interpolation) return;
    Lourah.utils.math.interpolation = {};


    const cosineInterpolator = (p1, p2, x) => {
      const mu2 = (1 - Math.cos((x - p1[0])/(p2[0] - p1[0]) * Math.PI))/ 2;
      return (p1[1] * (1 - mu2)) + (p2[1] * mu2);
      };
    
    const linearInterpolator = (p1, p2, x) => {
      const mu2 = (x - p1[0])/(p2[0] - p1[0]);
      return (p1[1] * (1 - mu2)) + (p2[1] * mu2);
      };


    /**
    Interval object is created to generate curves
    from sets of points with the same x set
    so it is making easy to compare 2 curves.
    for example:

    var interval = new Interval(0, 10, 1);
    var curve1 = interval.apply(setOfMesuredPoints1);
    var curve2 = interval.apply(setOfMesuredPoints2);

    each point is a two members array 0 for x
    and 1 for y
    
    the two "measured" sets includes the
    "interval" (otherwise an error is thrown)
     but each has it own number of points

    curve1 and curve2 each contains 10 elements
    and can be processed for example to measure
    the difference:

    var delta = 0;
    for(var i = 0; i < curve1.length; i++) {
      delta += (curve2[i][1] - curve2[i][1]);
      }

    etc...
    **/


    function Interval(xMin, xMax, xStep, interpolator) {
     
      interpolator = interpolator || cosineInterpolator;
      this.apply = (points) => {
        if (xMin < points[0][0]) throw "xMin::" + xMin + " lower of minimum bound::" + points[0][0];
        if (xMax > points[points.length - 1][0]) throw "xMin::" + xMin + " above maximum bound::" + points[points.length-17][0];
        var iP = 0;
        var curve = [];
        for (var x = xMin; x < xMax; x += xStep ) {
          try {
          while (x > points[iP+1][0]) {
            iP++;
            }
          curve.push([x, interpolator(points[iP], points[iP+1], x)]);
            } catch(e) {
            console.log("glitch at x::" + x + ", iP::" + iP);
            }
          }
        return curve;
        }
      }


    Lourah.utils.math.interpolation = {
      Interval: Interval
      };
    })();