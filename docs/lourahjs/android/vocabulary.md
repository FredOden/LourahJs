---
title: Vocabulary Format
parent: LourahJS
nav_order: 3
---

# Vocabulary Format  
Translation Dictionaries for LourahJS

## 1. Summary
A vocabulary is a JavaScript object that maps:

- literal strings  
- symbolic keys  

to translations for multiple locales.  
It is the core data structure used by the **Internationalizer** to resolve UI text.

---

## 2. Purpose
Vocabularies allow LourahJS applications to:

- override text per language or per region  
- centralize all translations  
- use symbolic keys for semantic UI labels  
- keep UI descriptors clean and language‑agnostic  

They are intentionally simple to keep the i18n engine lightweight.

---

## 3. Concepts

### Keys
There are two types of keys:

#### Literal Keys
These represent direct text:

```
"Hello"
"Cancel"
"Retry"
```

#### Symbolic Keys
These represent **semantic UI concepts**:

```
@Open
@Save
@Quit
@Preferences
```

Symbolic keys are recommended for all UI labels.

---

### Locales
Each vocabulary entry can define translations at three levels:

```
"fr"       → language
"fr-FR"    → language + country
"default"  → fallback
```

The Internationalizer resolves translations in this order:

```
1. language-country
2. language
3. default
4. original key
```

---

## 4. Structure

A vocabulary is a plain JavaScript object:

```javascript
{
  "<key>": {
    "<language>": "<translation>",
    "<language-country>": "<translation>",
    "default": "<fallback>"
  }
}
```

Example:

```javascript
{
  "@Open": {
    "fr": "Ouvrir",
    "fr-CA": "Ouvrir (Québec)",
    "default": "Open"
  }
}
```

---

## 5. Example

```javascript
{
  "@Open": {
    "fr": "Ouvrir",
    "fr-CA": "Ouvrir (Québec)",
    "default": "Open"
  },

  "Hello": {
    "fr": "Bonjour",
    "default": "Hello"
  },

  "@Quit": {
    "fr": "Quitter",
    "default": "Quit"
  }
}
```

This vocabulary supports:

- French (generic)  
- French (Canada)  
- default fallback  

---

## 6. Best Practices

- Always include a `"default"` translation  
- Use symbolic keys for all UI text  
- Keep vocabularies modular (one per feature/module)  
- Avoid mixing unrelated translations in the same file  
- Prefer short, meaningful symbolic keys (`@Open`, `@SaveAs`)  

---

## 7. Related Pages

- Internationalizer  
- Symbolic Keys  
- Overview  
- Sugar DSL
