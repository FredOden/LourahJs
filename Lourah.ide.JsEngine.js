var Lourah = Lourah || {};
(function () {
Lourah.ide = Lourah.ide || {};
if (Lourah.ide.JsEngine) return;

Lourah.ide.JsEngine = function() {
	var cx = org.mozilla.javascript.Context.enter();
	var errorReporter = undefined;
	var script = "unknown";
	
	cx.setOptimizationLevel(-1);
	scope = cx.initStandardObjects();
	
	this.addProperty = (property, value) => {
		org.mozilla.javascript.ScriptableObject.putProperty(scope, property, value);
		};
	
	this.setErrorReporter = (er) => {
		errorReporter = er;
		cx.setErrorReporter(errorReporter);
		};
	
	this.setScript = (s) => {
		script = s;
		}
		
	this.finalize = () => {
		org.mozilla.javascript.Context.exit();
		}
	
	this.eval = (jss) => {
		//if (!errorReporter) throw "Lourah::ide:JsEngine::Unimplemented ErrorReporter";
		try {
			  cx.evaluateString(scope, jss, script, 1, null);
			} catch(e) {
				throw "Lourah::ide:JsEngine::" + e;
			}
		};
	};
})();