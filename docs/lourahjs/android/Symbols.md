---
title: Symbolic Keys
parent: LourahJS
nav_order: 4
---

# Symbolic Keys  
Semantic Identifiers for UI Text

## 1. Summary
Symbolic keys are lightweight semantic identifiers used throughout LourahJS to represent UI concepts independently of any specific language.  
They are simple strings beginning with `@`, such as:

```
@Open
@Save
@SaveAs
@Quit
```

Symbolic keys allow UI definitions to remain **language‑agnostic**, while translations are handled separately by the **Internationalizer**.

---

## 2. Purpose
Symbolic keys exist to solve a fundamental problem:  
UI text should not be hard‑coded inside UI descriptors.

They provide:

- **semantic clarity** (meaning over wording)  
- **centralized translation management**  
- **cleaner UI descriptors**  
- **easy language switching**  
- **consistent terminology across the app**  

Instead of writing:

```
text: "'Open file'"
```

You write:

```
text: "'@Open'"
```

And the Internationalizer resolves the correct translation.

---

## 3. Concepts

### What is a symbolic key?
A symbolic key is a string starting with `@` that represents a UI concept:

```
@Open
@Save
@SaveAs
@Quit
@Preferences
```

### Why the `@` prefix?
It ensures:

- no collision with literal text  
- easy detection by the Internationalizer  
- clear semantic meaning  

### Where are symbolic keys used?
Everywhere UI text appears:

- buttons  
- menus  
- dialogs  
- labels  
- titles  
- tooltips  

---

## 4. Usage Example

### Vocabulary definition

```javascript
{
  "@Save": {
    "fr": "Enregistrer",
    "default": "Save"
  },
  "@Quit": {
    "fr": "Quitter",
    "default": "Quit"
  }
}
```

### UI descriptor

```javascript
{
  $btnSave: {
    class: "android.widget.Button",
    text: "'@Save'"
  }
}
```

### Runtime translation

```javascript
i18n.translate("@Save");  // → "Enregistrer" (fr)
```

---

## 5. Best Practices

- Use symbolic keys for **all** UI labels  
- Keep symbolic keys **short and meaningful**  
- Use PascalCase or CamelCase after the `@`  
- Group related keys in the same vocabulary file  
- Avoid embedding literal text in UI descriptors  

Good:

```
@OpenFile
@SaveAs
@Preferences
```

Avoid:

```
@openfile
@saveasplease
@button1
```

---

## 6. Notes & Caveats

- Symbolic keys are **case‑sensitive**  
- They must match exactly between UI and vocabulary  
- They are not automatically namespaced (keep them unique)  
- They do not support pluralization or formatting by themselves  

---

## 7. Related Pages

- Internationalizer  
- Vocabulary Format  
- Overview  
- Sugar DSL
