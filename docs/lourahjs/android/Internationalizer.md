---
title: Internationalizer
parent: LourahJS
nav_order: 2
---

# Lourah.android.Internationalizer  
Lightweight i18n Engine for LourahJS

## 1. Summary
`Lourah.android.Internationalizer` is a minimal, fast, dependency‑free internationalization engine designed for LourahJS.  
It provides:

- automatic locale detection  
- vocabulary‑based translation  
- symbolic key resolution  
- multi‑vocabulary chaining  
- translation caching  

It is used by **Overview**, **Sugar DSL**, and any module requiring dynamic text translation.

---

## 2. Purpose
Android applications often need to adapt text dynamically based on the device language.  
This module provides a simple and efficient mechanism to:

- translate UI labels  
- manage symbolic keys  
- support multiple locales  
- override translations at different levels  

It avoids the complexity of full i18n frameworks while remaining powerful enough for real applications.

---

## 3. Concepts

### Locale
The module extracts the device locale using Java:

```
language: fr
country: FR
full: fr-FR
```

These values are used to resolve translations.

### Vocabulary
A vocabulary is a JavaScript object mapping keys to translations:

```javascript
{
  "@Open": { "fr": "Ouvrir", "default": "Open" }
}
```

### Symbolic Keys
Symbolic keys begin with `@` and represent **semantic UI concepts**:

```
@Open
@Save
@Quit
```

They allow UI text to be defined independently of language.

### Cache
Translations are cached for performance.  
The cache is cleared when the locale changes.

---

## 4. Architecture

### 4.1 Translation Resolution Order

```
1. Cache
2. Language-country (e.g., fr-FR)
3. Language (e.g., fr)
4. default
5. Original string
```

### 4.2 Vocabulary Chain
Multiple vocabularies can be added:

```
vocabulary1 → vocabulary2 → vocabulary3
```

The first matching translation wins.

### 4.3 Symbolic Key Handling
If a key starts with `@`, it is treated as a semantic identifier.  
This allows UI text to be changed globally by updating a single vocabulary entry.

---

## 5. API Reference

### new Internationalizer()
Creates a new Internationalizer instance and loads the device locale.

### setLocale(locale)
Changes the active locale and clears the translation cache.

### addVocabulary(vocabulary)
Adds a translation dictionary.  
Later vocabularies override earlier ones.

### translate(key)
Returns the translated string according to the resolution order.

---

## 6. Usage Example

```javascript
var i18n = new Lourah.android.Internationalizer();

i18n.addVocabulary({
  "@Open": { "fr": "Ouvrir", "default": "Open" },
  "Hello": { "fr": "Bonjour", "default": "Hello" }
});

console.log(i18n.translate("@Open"));  // → "Ouvrir"
console.log(i18n.translate("Hello"));  // → "Bonjour"
```

---

## 7. Best Practices

- Always use **symbolic keys** for UI labels  
- Group vocabularies by module or feature  
- Always provide a `"default"` fallback  
- Keep vocabulary files small and modular  
- Avoid embedding text directly in UI descriptors  

---

## 8. Notes & Caveats

- Keys must match exactly (case‑sensitive)  
- No pluralization engine is included  
- No ICU message formatting  
- Locale changes require manual `setLocale()` calls  

---

## 9. Related Pages

- Vocabulary Format  
- Symbolic Keys  
- Sugar DSL  
- Overview
