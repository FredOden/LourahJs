---
title: Internationalizer
parent: LourahJS
nav_order: 11
---

# Internationalizer  
Symbolic Key Translator for LourahJS

The **Internationalizer module** provides a simple but powerful i18n system based on *symbolic keys* and *vocabularies*.

It replaces strings like:

```
'@Hello'
'@Menu.File.Open'
```

with the correct translation depending on the active language.

---

## 🎯 Purpose

Internationalizer provides:

- symbolic key resolution  
- vocabulary loading  
- automatic integration with Overview  
- fallback to `"default"` language  
- dynamic language switching  

---

## 🧱 Vocabulary Structure

A vocabulary is a plain JavaScript object:

```javascript
{
  "@Hello": {
    "fr": "Bonjour",
    "en": "Hello",
    "default": "Hello"
  },
  "@Menu.File.Open": {
    "fr": "Ouvrir",
    "en": "Open",
    "default": "Open"
  }
}
```

---

## 🔧 Usage

### 1. Create an instance

```javascript
var i18n = new Internationalizer();
```

### 2. Add a vocabulary

```javascript
i18n.addVocabulary({
  "@Hello": { fr: "Bonjour", default: "Hello" }
});
```

### 3. Resolve a key manually

```javascript
i18n.translate("@Hello");  // → "Bonjour"
```

### 4. Automatic resolution in Overview

```javascript
text: "'@Hello'"
```

Overview detects the `'@...'` pattern and calls:

```
i18n.translate("@Hello")
```

---

## 🔄 Resolution Rules

1. If the key exists in the vocabulary → return the language entry  
2. If the language entry does not exist → return `"default"`  
3. If `"default"` does not exist → return the key itself  

---

## 🔥 Example with Overview

```javascript
var layout = {
  $root: {
    class: "android.widget.TextView",
    text: "'@Hello'"
  }
};

var view = Overview.buildFromSugar(layout, i18n);
```

---

## 📚 Related Pages

- **[Vocabulary Format](ca://s?q=Reenvoyer_vocabulary_md)**  
- **[Symbolic Keys](ca://s?q=Reenvoyer_symbols_md)**  
- **[Overview](ca://s?q=Reenvoyer_overview_md)**  
- **[UI Internal Workflow](ca://s?q=Reenvoyer_ui_internal_workflow)**
