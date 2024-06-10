var Lourah = Lourah || {};
(function () {
	Lourah.utils = Lourah.utils || {};
	Lourah.utils.pdf = Lourah.utils.pdf || {};

	function PdfSource() {
		var source = "";
		var offset = 3;
		this.write = (content) => {
			var at = offset;
			source += content;
			offset += content.length;
			return at;
		}

		this.toString = () => {
			return source;
		}
	}

	PdfDocument.toHexString = (str) => {
		var h ="<";
		for(var i = 0; i<str.length; i++) {
			h += str.charCodeAt(i).toString(16);
		}
		h += ">";
		return h;
	}

	PdfDocument.OperatorSequence = function() {
		var operatorSequence = "";
		operator = (params, operation) => {
			operatorSequence += params.join(" ") + " " + operation + "\n";
			return this;
		}
		// Graphics state
		//   General
		this.w = (lineWidth) => operator([lineWidth], "w"); // set line width
		this.J = (lineCap) => operator([lineCap], "J"); // set cap style
		this.j = (lineJoin) => operator([lineJoin], "j"); // set join style
		this.M = (miterLimit) => operator([miterLimit], "M"); // set miter limit
		this.d = (dashArray, dashPhase) => operator([dashArray, dashPhase], "d"); // set dash pattern
		this.ri = (intent) => operator([intent], "ri"); // set color rendering intent
		this.gs = (dictName) => operator([dictName], "gs"); // set graphics state parameters
		//   Special
		this.q = () => operator([""], "q");
		this.Q = () => operator([""], "Q");
		this.cm = (a, b, c, d, e, f) => operator([a, b, c, d, e, f], "cm");
		// Images
		this.Do = (name) => operator([name], "Do");
		this.BI = () => operator([""], "BI");
		this.ID = () => operator([""], "ID");
		this.EI = () => operator([""], "EI");
		// Path
		//   Construction
		this.m = (x, y) => operator([x, y], "m");
		this.l = (x, y) => operator([x, y], "l");
		this.c = (x1, y1, x2, y2, x3, y3) => operator([x1, y1, x2, y2, x3, y3], "c");
		this.v = (x2, y2, x3, y3) => operator([x2, y2, x3, y3], "v");
		this.y = (x1, y1, x3, y3) => operator([x1, y1, x3, y3], "y");
		this.h = () => operator([""], "h");
		this.re = (x, y, width, height) => operator([x, y, width, height], "re");
		//  Clipping
		this.W = () => operator([""], "W");
		this.Wstar = this["W*"] = () => operator([""], "W*");
		//  Painting
		["S", "s", "f", "F", "f*", "B", "B*", "b", "b*", "n"].forEach(op => {
			this[op] = () => operator([""], op);
		});
		// Text
		// 
		this.BT = () => operator([""], "BT");
		this.ET = () => operator([""], "ET");
		//   state
		["Tc", "Tw", "Tz", "TL", "Tr", "Ts"].forEach(op => {
			this[op] = param => operator([param], op);
		});
		this.Tf = (font, size) => operator([font, size], "Tf");
		//  Positioning
		this.Td = (tx, ty) => operator([tx, ty], "Td");
		this.TD = (tx, ty) => operator([tx, ty], "TD");
		this.Tm = (a, b, c, d, e, f) => operator([a, b, c, d, e, f], "Tm");
		this.Tstar = this["T*"] = () => operator([""], "T*");
		//  Showing
		this.Tj = (string) => operator([string], "Tj");
		this["'"] = this.quote = (string) => operator([string], "'");
		this['"'] = this.quote = (wordSpacing, characterSpacing, string) => operator([wordSpacing, characterSpacing, string], '"');
		this.TJ = (array) => operator(array, "TJ");
		// Color
		//   Stroking, fill
		["CS", "cs"].forEach(op => this[op] = (colorSpace) => operator([colorSpace], op));
		["SC", "sc"].forEach(op => this[op] = (colorArray) => operator(colorArray, op));
		["SCN", "scn"].forEach(op => this[op] = (colorArray) => operator(colorArray, op));
		["G", "g"].forEach(op => this[op] = (gray) => operator([gray], op));
		["RG", "rg"].forEach(op => this[op] = (r, g, b) => operator([r, g, b], op));
		["K", "k"].forEach(op => this[op] = (c, m, y, k) => operator([c, m, y, k], op));
		// Misc
		//  Type 3 fonts
		this.dO = (wx, wy) => operator([wx, wy], "dO");
		this.di = (wx, wy, llx, lly, urx, ury) => operator([wx, wy, llx, lly, urx, ury], "di");
		//  Marked content
		this.MP = (tag) => operator([tag], "MP");
		this.DP = (tag, props) => operator([tag, props], "DP");
		this.BMC = (tag) => operator([tag], "BMC");
		this.DMC = (tag, props) => operator([tag, props], "DMC");
		this.EMC = () => operator([""], "EMC");
		//  Other
		this.sh = (name) => operator([name], "sh"); // paint shading to clipping path
		this.BX = () => operator([""], "BX"); // begin compatibility section
		this.EX = () => operator([""], "EX"); // end compatibility section
	/**/
		this.flush = () => operatorSequence;
		this.toString = () => operatorSequence;
		this.clear = () => { operatorSequence = ""; return this; };
	}

	PdfDocument.Stream = function() {
		var stream = [];
		this.add = (command) => {
			stream.push(command);
			return this
		}
		this.getLength = () => stream.join('\n').length; // + 1;
		this.toString = () => {
			var s = "";
			if (stream.length > 0) {
				s += "stream\n";
				s += stream.join('\n');
				s += "\nendstream\n";
			}
			return s;
		}
		
	}

	var names = {};
	
	PdfDocument.Record = function(name, record, stream) {
		names[name] = {name:name, record:this, ref:"" + (Object.keys(names).length + 1) + " 0 R"};
		this.toString = () => {
			var s = "<<";
			Object.keys(record).forEach(key => {
				var value = record[key];
				var match = String(record[key]).match(/(.*)&\{(.*)\}(.*)/);
				if (match !== null) {
					if (!names[match[2]]) throw "PdfDocument.Record::" + "No object ref in <" + value + ">";
					value = match[1] + names[match[2]].ref + match[3];
				}
				if (value === "/Length") {
					value = stream.getLength();
				}
				s += "     " + key + " " + value + "\n";
			});
			s += ">>\n";
			if (stream) s+=stream;
			return s;
		}
	}
	

	function PdfDocument() {
		var header = "%PDF-1.4\n%¥±ë\n\n";
		var offsetFrame = "0".repeat(10);
		var pdfSource;

		var objects = [];
		this.addObject = (object) => {
			objects.push({object:object, offset:-1});
		}

		this.setHeader = (h) => {
			header = h;
		}

		this.generate = () => {
			var pdf = new PdfSource();;
			var oBody = pdf.write(header);
			objects.forEach((object, index) => {
				object.offset = pdf.write(
					"" + (index + 1) + " 0 obj\n" + object.object + "endobj\n\n"
				);
			});
			var oXref = pdf.write("xref\n0 " + (objects.length + 1) + "\n");
			pdf.write(offsetFrame + " 65535 f \n");
			objects.forEach((object) => {
				pdf.write(String(object.offset).padStart(10, '0') + " 00000 n \n");
			});
			pdf.write("trailer\n<< /Root 1 0 R\n /Size " + (objects.length + 1) + "\n>>\n");
			pdf.write("startxref\n" + oXref + "\n%%EOF\n");
			pdfSource = pdf;;
			return pdf;
		}

		this.getPdfSource = () => pdfSource;

	}

	Lourah.utils.pdf.PdfDocument = PdfDocument;
})();
