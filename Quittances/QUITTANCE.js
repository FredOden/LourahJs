/* Quittance */
Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.utils.text.number.Stringifier.js');

function Quittance() {
  var owner = {};
  var tenant ={};
  var html="";
  var month;
  var load = (file)=> {
    try {
      var sowner = (Activity.path2String(file));
      return Function ('return ' + sowner)();
      } catch(e) {
      Activity.reportError("Quittance::load::" + e + "::" + e.stack);
      }
    }
  var loadHtml = (file) => {
    try {
      var f = new java.io.File(file);
      if (!f.exists()) throw "LoadHtml::" + file + " does not exist";
      return Activity.path2String(file);
      } catch(e) {
      return "Can't load temlate::" + e;
      }
    }

  this.getOwner = () => owner;
  this.setOwner = (ownerFile) => owner = load(ownerFile);

  this.getTenant = () => tenant;
  this.setTenant = (tenantFile) => tenant = load(tenantFile);

  this.getHtml = () => html
  this.setHtml = (htmlFile) => html = loadHtml(htmlFile);

  this.getQuittance = () => {
    var q = html;
    for(o of [owner, tenant]) {
      for(item in o) {
        q = q.replaceAll("@" + o.kind + "." + item, o[item]);
        }
      }
    console.log("tenant.rent::" + tenant.rent);
    var textAmount = Lourah.utils.text.number.Stringifier.translateAmount(
        "fr"
        , "Euro"
        , "Centime"
        , 100
        , Number (tenant.rent)
        );
    console.log("textAmount::<" + textAmount + ">");
    q = q.replaceAll(
      "@textAmount"
      , "<< " + textAmount + " >>"
      );
    return q;
    }

  this.toString = () => {
    return JSON.stringify(this);
    }
  };

try {
  var q = new Quittance();
  q.setOwner(Lourah. jsFramework. dir() + "/FREDERIC.ODEN.owner");
  q.setTenant(Lourah. jsFramework. dir() + "/MELANIE.CASTEL.tenant");
  q.setHtml(Lourah. jsFramework. dir() + "/QUITTANCE.html");
  console.log("<" + q + ">");
  //console.log("html<" + q.getHtml() + ">");
  } catch (e) {
  console.log("What the bug::" +e);
  }




//var html = "<head><title>Quittance</title><style>html {font-size:10px}</style></head><body><b>" + q + "</b></body>";


function pdf2Path(doc, path) {
  var f = new java.io.File(path);
  var fos = new java.io.FileOutputStream(f);
  try {
    doc.writeTo(fos);
    doc.close();
    } catch(e) { Activity.reportError("pdf2Path::<" + path +">::" + e + "::" + e.stack); }
  }

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
//const CM = 28;
//const footer_height = CM;

var ll = new android.widget.LinearLayout(Activity.getApplicationContext());
ll.setOrientation(android.widget.LinearLayout.VERTICAL);
var webView = new android.webkit.WebView(Activity.getApplicationContext());
webView.setInitialScale(100);
var bGeneratePdf = new android.widget.Button(Activity.getApplicationContext());
bGeneratePdf.setText("Generate PDF");
bGeneratePdf.setOnClickListener((v) => generatePdf());
ll.addView(webView);
ll.addView(bGeneratePdf);

Activity.setTitle("Quittance V0000");
Activity.setContentView(ll);

webView.loadData(
  q.getQuittance()
  , "text/html; charset=utf-8"
  , "UTF-8"
  );


function generatePdf() {
  var document = new android.graphics.pdf.PdfDocument();

  // crate a page description
  var pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(
    A4_WIDTH
    , A4_HEIGHT
    , 1).create();

  // start a page
  var page = document.startPage(pageInfo);

  webView.draw(page.getCanvas());

  document.finishPage(page);

  pdf2Path(document, Lourah.jsFramework.dir() + "/q.pdf");
  };
/**/
