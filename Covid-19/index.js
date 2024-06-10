Lourah. jsFramework. setOnBackButtonListener(() => false);
try {
  console = {
    log: () => {}
    };

  Activity.importScript(
    Lourah.jsFramework.dir()
    +
    "/covid-19-Analyzer V5.0.js"
    );
  } catch(e) {
  Activity.reportError("COVID-19::" + e + "::");
  }
