var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Internationalizer === undefined) {
  (function() {

    /**
     * Internationalizer
     *
     * A lightweight i18n (internationalization) engine for LourahJS on Android.
     * Translates strings based on the device locale, using one or more vocabulary
     * objects loaded at runtime.
     *
     * Vocabulary format:
     * {
     *   "Hello": {
     *     "fr": "Bonjour",
     *     "fr-FR": "Bonjour (France)",
     *     "default": "Hello"
     *   }
     * }
     *
     * Resolution order for a given string:
     *   1. Cache hit → return immediately
     *   2. Exact language+country match (e.g. "fr-FR")
     *   3. Language-only match (e.g. "fr")
     *   4. "default" fallback
     *   5. Original string unchanged
     *
     * @example
     * var i18n = new Lourah.android.Internationalizer();
     * i18n.addVocabulary(myStrings);
     * var label = i18n.translate("Hello"); // → "Bonjour" on a French device
     */
    function Internationalizer() {
      var vocabularies = [];  // ordered list of vocabulary objects
      var cache = {};         // translation cache, reset on locale change
      var locale;
      var k_language;         // e.g. "fr"
      var k_language_country; // e.g. "fr-FR"

      /**
       * Sets the active locale and clears the translation cache.
       * Called automatically with the device default locale on construction.
       *
       * @param {java.util.Locale} l - The locale to activate.
       */
      this.setLocale = function(l) {
        locale = l;
        k_language = locale.getLanguage();
        k_language_country = k_language + "-" + l.getCountry();
        cache = {};
      };

      /**
       * Adds a vocabulary to the translation chain.
       * Multiple vocabularies can be added; they are searched in insertion order.
       *
       * @param {Object} vocabulary - A map of original strings to locale-keyed translations.
       *
       * @example
       * i18n.addVocabulary({
       *   "Optimistic": { "fr": "Optimiste", "default": "Optimistic" },
       *   "Neutral":    { "fr": "Neutre",    "default": "Neutral" }
       * });
       */
      this.addVocabulary = function(vocabulary) {
        vocabularies.push(vocabulary);
      };

      /**
       * Translates a string using the active locale.
       * Results are cached for performance.
       *
       * Resolution order:
       *   1. Cache hit
       *   2. Language+country match (e.g. "fr-FR")
       *   3. Language-only match (e.g. "fr")
       *   4. "default" fallback
       *   5. Original string (untranslated)
       *
       * @param {string} string - The string to translate.
       * @returns {string} The translated string, or the original if no translation is found.
       */
      this.translate = function(string) {
        if (cache[string]) return cache[string];
        cache[string] = string; // default: return as-is

        for (var i = 0; i < vocabularies.length; i++) {
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

      // Initialize with the device's default locale
      this.setLocale(java.util.Locale.getDefault());
    }

    Lourah.android.Internationalizer = Internationalizer;
  })();
}
