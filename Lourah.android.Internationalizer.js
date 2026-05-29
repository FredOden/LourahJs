var Lourah = Lourah || {};
Lourah.android = Lourah.android || {};
if (Lourah.android.Internationalizer === undefined) {
  (function() {

    /**
     * ============================================================================
     * @module Lourah.android.Internationalizer
     * @title Lightweight i18n Engine for LourahJS (Vocabulary + Symbolic Keys)
     *
     * @purpose
     *   Provide a simple, efficient internationalization mechanism for LourahJS
     *   applications running on Android. The engine translates strings based on:
     *     - Device locale (language + country)
     *     - One or more vocabulary objects
     *     - Symbolic keys such as "@Open", "@Save", "@Quit", etc.
     *     - A deterministic resolution order
     *     - A translation cache for performance
     *
     * @architecture
     *   - Maintains an ordered list of vocabularies
     *   - Uses java.util.Locale for language and country detection
     *   - Performs translation lookup with fallback rules
     *   - Caches resolved translations until locale changes
     *
     * @i18n
     *   "i18n" is a numeronym for "internationalization":
     *     - i = first letter
     *     - n = last letter
     *     - 18 = number of letters in between
     *   This convention is widely used in software engineering.
     *
     * @symbols
     *   The Internationalizer supports symbolic UI keys such as:
     *     "@Open", "@Save", "@SaveAs", "@Quit", "@About", "@Preferences", ...
     *
     *   These keys are treated as *semantic identifiers* rather than literal text.
     *   They must appear exactly as-is in the vocabulary:
     *
     *     {
     *       "@Open": { "fr": "Ouvrir", "default": "Open" },
     *       "@Save": { "fr": "Enregistrer", "default": "Save" }
     *     }
     *
     *   Any UI component (Sugar, Overview, menus, dialogs…) may use these symbols.
     *   The Internationalizer simply resolves them like any other string.
     *
     * @vocabulary
     *   Vocabulary files define all translatable strings for a given language.
     *   They follow this structure:
     *
     *     {
     *       "<key>": {
     *         "<language>": "<translation>",
     *         "<language-country>": "<translation>",
     *         "default": "<fallback>"
     *       },
     *       ...
     *     }
     *
     *   - <key> can be:
     *       - a literal string: "Hello", "Cancel", "Retry"
     *       - a symbolic key: "@Open", "@Save", "@Quit", "@About"
     *
     *   - <language> is a two-letter ISO code: "fr", "en", "es", ...
     *   - <language-country> is a language + country code: "fr-FR", "fr-CA", ...
     *   - "default" is used as a fallback when no locale-specific entry matches.
     *
     * @usage
     *   var i18n = new Lourah.android.Internationalizer();
     *   i18n.addVocabulary(Lourah.android.Vocabulary.fr);
     *   var label = i18n.translate("@Open");
     *
     * @notes
     *   - Multiple vocabularies can be added; they are searched in insertion order.
     *   - Symbolic keys ("@Open", "@Save", ...) decouple UI semantics from text.
     *   - The Internationalizer does not interpret keys; it just looks them up.
     *   - Cache is cleared automatically when locale changes.
     * ============================================================================
     */

    function Internationalizer() {
      var vocabularies = [];  // ordered list of vocabulary objects
      var cache = {};         // translation cache, reset on locale change
      var locale;
      var k_language;         // e.g. "fr"
      var k_language_country; // e.g. "fr-FR"

      /**
       * ============================================================================
       * === Locale Management ======================================================
       * ============================================================================
       *
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
       * ============================================================================
       * === Vocabulary Registration ================================================
       * ============================================================================
       *
       * Adds a vocabulary to the translation chain.
       * Multiple vocabularies can be added; they are searched in insertion order.
       *
       * @param {Object} vocabulary - A map of original strings to locale-keyed translations.
       */
      this.addVocabulary = function(vocabulary) {
        vocabularies.push(vocabulary);
      };

      /**
       * ============================================================================
       * === Translation Engine =====================================================
       * ============================================================================
       *
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