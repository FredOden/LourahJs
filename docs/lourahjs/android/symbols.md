---
title: Symbolic Keys
parent: LourahJS
nav_order: 12
---

# Symbolic Keys  
The i18n Identifier System of LourahJS

Symbolic Keys are the foundation of the LourahJS internationalization system.  
They allow you to reference text **independently of any language**, using a stable identifier that is later resolved by the **Internationalizer**.

---

## 🎯 Purpose

Symbolic Keys provide:

- a **universal identifier** for UI text  
- a **language‑agnostic** way to write layouts  
- compatibility with **Overview** and **Sugar DSL**  
- automatic translation via **Internationalizer**  
- hierarchical naming for large applications  

---

## 🧩 Syntax

A symbolic key always starts with:

```
@
```

Examples:

```
'@Hello'
'@Menu.File.Open'
'@Dialog.Error.Network'
```

They are always written as **strings** in layouts:

```javascript
text: "'@Hello'"
```

---

## 🧱 Structure of a Symbolic Key

A symbolic key is composed of:

```
@Namespace.SubNamespace.Identifier
```

Examples:

- `@Hello`  
- `@Menu.File.Open`  
- `@Dialog.Warning.LowBattery`  

This structure allows you to organize your vocabulary logically.

---

## 🔄 Resolution Process

When Overview encounters a string starting with `'@'`, it calls:

```
i18n.translate(key)
```

The Internationalizer then:

1. Looks up the key in the vocabulary  
2. Selects the correct language entry  
3. Falls back to `"default"` if needed  
4. Returns the resolved string  

---

## 🧪 Example

### Vocabulary

```javascript
{
  "@Menu.File.Open": {
    fr: "Ouvrir",
    en: "Open",
    default: "Open"
  }
}
```

### Layout

```javascript
{
  class: "android.widget.Button",
  text: "'@Menu.File.Open'"
}
```

### Result (in French)

```
Ouvrir
```

---

## 🧠 Best Practices

- Use **hierarchical keys** for clarity  
- Always include a `"default"` entry  
- Avoid spaces in keys  
- Keep keys stable over time  
- Group related keys under a namespace  

Examples of good naming:

```
@Menu.File.Open
@Menu.File.Save
@Dialog.Error.Network
@Dialog.Error.Timeout
```

---

## 📚 Related Pages

- **[Internationalizer](ca://s?q=Reenvoyer_internationalizer_md)**
