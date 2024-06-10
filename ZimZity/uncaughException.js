
var setUncaughtExceptionHandler = function(f) {
	Packages.org.mozilla.javascript.Context.getCurrentContext().setErrorReporter(
		new JavaAdapter(
			Packages.org.mozilla.javascript.ErrorReporter,
			new function() {
				var handle = function(type) {
					return function(message,sourceName,line,lineSource,lineOffset) {
						f({
							type: type,
							message: String(message),
							sourceName: String(sourceName),
							line: line,
							lineSource: String(lineSource),
							lineOffset: lineOffset
						});
					};
				};

				["warning","error","runtimeError"].forEach(function(name) {
					this[name] = handle(name);
				},this);
			}
		)
	);
};

setUncaughtExceptionHandler(function(error) {
	Packages.java.lang.System.err.println("Caught exception: " + JSON.stringify(error,void(0),"    "));
});

