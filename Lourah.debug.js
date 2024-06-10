Activity.importScript(Lourah.jsFramework.parentDir() + "/android.app.Dialog.js");
var Lourah = Lourah || {};

(function (){
    Lourah.debug = Lourah.debug || {};
    if (Lourah.debug.Bench) return;
    const currentTimeMillis = java.lang.System.currentTimeMillis;
    Lourah.debug.Bench = function (name) {
      var count = 0;
      var total = 0;
      var min = 0;
      var max = 0;
      this.reset = () => start = currentTimeMillis();
      this.tip = () => {
        last = currentTimeMillis();
        };
      this.top = (f) => {
        var r = null;
        var elapsed = 0;
        var o = {};
        if (f) {
          o = {
            name:name
            ,last:last
            ,start:start
            ,origin:origin
            ,bench:this
            };
          o.top = currentTimeMillis();
          r = f(o);
          } else {
          o.top = currentTimeMillis();
          }
        elapsed = o.top - last;
        last = currentTimeMillis();
        total += elapsed;
        if (count === 0) {
          min = max = elapsed;
          }
        else {
          if (elapsed < min) min = elapsed;
          if (elapsed > max) max = elapsed;
          }
        count++;

        start += (last - o.top);
        return r;
        };
      this.getCount = () => count;
      this.getTotal = () => total;
      this.getMin = () => min;
      this.getMax = () => max;
      this.getName = () => name;
      var origin = java.lang.System.currentTimeMillis();
      var start = origin;
      var last = start;
      this.toString = () => {
        return "name::" + name
        + "::total::" + total
        + "::count::" + count
        + "::mean::" + (total/count)
        + "::min,max::" + [min, max]
        ;
        };
      };

    Lourah.debug.BP = function() {
      var enabled = false;
      var name = "breakPoint";
      this.setEnabled = (status) => enabled = status;
      this.setName = (bpName) => name = bpName;
      this.BREAK = (f) => {
        if (!enabled) return;
        var tdb;
        var etbp = new Error(tbp = f());
        var qbp = new Lourah.android.app.Dialog.Question(
          Activity
          , "Debug::BREAK::" + name
          , "::" + tbp + "\nat::" + etbp.stack
          , "@Continue", "@Stop"
          );
        qbp.ask();
        if (!qbp.getAnswer()) throw new ReferenceError("Breakpoint stopped");
        }
      this.TRACE = (f) => {
        if (!enabled) return;
        console.log("Debug::TRACE::" + f());
        }
      };

    })();

/*
try {
  var bp = new Lourah.debug.BP();
  bp.setEnabled(true);
  var a = [];
  bp.TRACE(() => "a=" + a);
  var b = new Lourah.debug.Bench("Me");
  java.lang.Thread.sleep(100);
  b.top(b => console.log("::" + b.name+ "::" + (b.top - b.last)));
  java.lang.Thread.sleep(200);

  var c = new Lourah.debug.Bench("You");
  bp.BREAK(() => "c::" + JSON.stringify(c));
  b.top(b => console.log("::" + b.name + "::" + (b.top - b.last)));
  c.top(c => console.log("::" + c.name + "::" + (c.top - c.last)));
  java.lang.Thread.sleep(100);
  b.top(b => console.log("::" + b.name + "::" + (b.top - b.last) + "::" + (b.top - b.start)));
  c.top(b => console.log("::" + b.name + "::" + (b.top - b.last) + "::" + (b.top - b.start)));
  } catch(e) {
  console.log("catched::'" + e + "'");
  }

try {
  c.zz = "top";
  console.log(":c:zz::" + c.zz);
  } catch(e) {
  console.log("::error::" + e);
  }
*/
