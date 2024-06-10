
(function(jsApp, v) {
  Lourah.jsFramework.setOnBackButtonListener(() => {
	return false;
	});
	
  try {
    Lourah.app = {
    	 version : v
        ,module  : jsApp
    	};
    Activity.importScript(Lourah.jsFramework.dir() + jsApp);
  } catch(e) {
    Activity.reportError(jsApp + "::" + e);
  }
})("/lourahIDEX.js", "v0.1");