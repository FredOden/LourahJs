Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.utils.pdf.js');
Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.io.js');

var PdfDocument = Lourah.utils.pdf.PdfDocument;
var pDoc = new PdfDocument();
pDoc.addObject(new PdfDocument.Record("Catalog", { "/Type": "/Catalog", "/Pages": "&{Pages}" }));
pDoc.addObject(new PdfDocument.Record( "Pages", {"/Type": "/Pages"
	, "/Kids": "[&{Page}]"
	, "/Count": 1
	, "/MediaBox": "[0 0 595 842]"
}));
pDoc.addObject(new PdfDocument.Record( "Page", {
	"/Type": "/Page"
	,"/Parent": "&{Pages}"
	,"/Resources": "&{Resources}"
	,"/Contents": "&{Content}"
}));
pDoc.addObject(new PdfDocument.Record("Fonts", { 
	"/F1": "&{F1}"
	,"/F2": "&{F2}"
}));
pDoc.addObject(new PdfDocument.Record("Resources", {
	"/Font": "&{Fonts}"
}));
// !!! NEVER FORGET: Subtype WITH t LOWER CASE !!!
pDoc.addObject(new PdfDocument.Record("F1", {
	"/Type": "/Font"
	,"/Subtype": "/Type1"
	,"/BaseFont": "/Times-Roman"
	,"/Encoding": "/WinAnsiEncoding"
}));
pDoc.addObject(new PdfDocument.Record("F2", {
	"/Type": "/Font"
	,"/Subtype": "/Type1"
	,"/BaseFont": "/Courier-BoldOblique"
	,"/Encoding": "/WinAnsiEncoding"
}));
var fontSize = 36;
var [top, bottom] = [
	700 + 48 -6
	,700 -10
];
var middle = (top + bottom)/2
pDoc.addObject(new PdfDocument.Record("Content"
	, { "/Length": "/Length" }
	, new PdfDocument.Stream()
	.add((new PdfDocument.OperatorSequence())
		.q()
		.w(2)
		.m(60, top).l(450, top)
		.m(60, bottom). l(450, bottom)
		.S()
		.RG(0, 1, 0).w(48)
		.m(451, middle).l(650, middle)
		.S().Q()
	)
	/**/
	.add(new PdfDocument.OperatorSequence()
		.BT().Tf("/F1", fontSize).rg(.75, .3, .2)
		.Tm(1, 0, 0, 1, 60, 700)
		.Tj(PdfDocument.toHexString("Yep, Mr FRÉDÉRIC ODEN!"))
		.Td(0, -45).Tf("/F2", 28)
		.rg(0, 1, 1).Tj(PdfDocument.toHexString("ça c'est bon"))
		.ET()
	)
	.add("BT")
	.add("0 0 0.5 rg")
	.add("30 60 Td")
	.add("/F2 16 Tf")
	.add("16 TL")
	.add("(the quick brown fox jumps)Tj 1 1 (over the lazy dog)\" 1 1(that's it.)\"")
	.add("1 0 0 RG 30 44 200 32 re S")
	.add("ET")
));

var pdf = pDoc.generate();
Lourah.io.string2Path(pdf, Lourah.jsFramework.dir() + "/pdf.pdf");
console.log("pdf::" + pdf);

function toHexString(str) {
	var h ="<";
	for(var i = 0; i<str.length; i++) {
		h += str.charCodeAt(i).toString(16);
	}
	h += ">";
	return h;
}

function textAt(x, y, text) {
	return "1 0 0 1 " + x + " " + y + " Tm\n" + toHexString(text) + "Tj";
}
