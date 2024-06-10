var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Internationalizer === undefined) {
(function() {
function Internationalizer() {
	var vocabularies = [];
	var cache = {};
	var locale;
	var k_language;
	var k_language_country;
	this.setLocale = function(l) {
		locale = l;
		k_language = locale.getLanguage();
		k_language_country= k_language + "-" + l.getCountry();
		cache = {};
		//Activity.reportError("Internationalizer::locale::" + k_locale);
		};
	this.addVocabulary = function(vocabulary) {
		vocabularies.push(vocabulary);
		};
	this.translate = function(string) {
		if (cache[string]) return cache[string];
		cache[string] = string;
		for(var i = 0; i < vocabularies.length; i++) {
			var rought = vocabularies[i][string];
			if (rought && rought[k_language]) {
				cache[string] = rought[k_language];
                return cache[string];
                }
			if (rought && rought[k_language_country]) {
				cache[string] = rought[k_language_country];
                return cache[string];
                }
            if (rought && rought.default) {
				cache[string] = rought.default;
                return cache[string];
                }
			}
		return cache[string];
		};
	this.setLocale(java.util.Locale.getDefault());
	}

Lourah.android.Internationalizer = Internationalizer;
})();
}