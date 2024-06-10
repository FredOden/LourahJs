function Logger(webView) {
	var history= [];
	var css = ".error {color:red;background-color:yellow;font-weight:bold;}";
	var header = "<!DOCTYPE html><head><style>"+css+"</style></head>";
	this.redraw = () => {
		var html = "<html>"+header + "<body>";
		for(var i = history.length; i>0; i--) {
			html += history[i-1] + "<br>";
		}
		html += "</body></html>";
		webView.loadData(
			html
			, "text/html; charset=utf-8"
			, "UTF-8"
		);
	}
	var push = new org.mozilla.javascript.Synchronizer((text, nature) => history.push('<span class="' + (nature?nature:"normal") + '">' + text + "</span>"));

	this.say = (text, nature) => {
		push(text, nature);
		this.redraw();
	}
	this.error = (text) => this.say(text, "error");
}
