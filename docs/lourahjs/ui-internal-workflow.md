---
title: UI Internal Workflow
parent: LourahJS
nav_order: 6
---

# UI Internal Workflow  
How LourahJS Builds Android Interfaces Internally

This page explains the complete internal workflow used by LourahJS to transform a declarative UI description (Sugar DSL or Overview descriptor) into a fully functional Android interface.

It covers:

- the transformation pipeline  
- reflection and widget instantiation  
- attribute binding  
- hook execution  
- i18n resolution  
- the flat‑map widget registry  

---

## 🧩 1. Global Overview of the Pipeline

The UI engine follows a deterministic multi‑stage pipeline:

```
Sugar DSL
    ↓
Overview.Sugar (conversion)
    ↓
Overview (descriptor processing)
    ↓
Widget instantiation (Reflection)
    ↓
Attribute binding (setters)
    ↓
Hook execution
    ↓
Internationalizer (i18n)
    ↓
Android Views (runtime)
```

Each stage is independent and modular.

---

## 🧪 2. Stage 1 — Sugar DSL (optional)

If the UI is written using Sugar DSL, the first step is conversion.

### What Sugar DSL does

- resolves `$identifiers`
- maps attributes to setters
- prepares hook functions
- evaluates Android constants
- builds a clean Overview descriptor

Sugar DSL is a human‑friendly layer on top of Overview.

See: **[Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)**

---

## 🧱 3. Stage 2 — Overview.Sugar Conversion

`Overview.Sugar` transforms Sugar into a strict Overview descriptor.

Example:

```javascript
$btn: {
  class: "android.widget.Button",
  text: "'@Open'"
}
```

Becomes:

```javascript
{
  $btn: {
    class: "android.widget.Button",
    text: "'@Open'",
    _hooks: { onClick: "(w)=>..." }
  }
}
```

This descriptor is then passed to the Overview engine.

---

## 🏗️ 4. Stage 3 — Overview Descriptor Processing

Overview receives a JSON‑like descriptor:

```javascript
{
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "android.widget.LinearLayout.VERTICAL",
    content: { ... }
  }
}
```

Overview performs:

- validation  
- recursive traversal  
- widget creation  
- attribute binding  
- hook registration  
- flat‑map population  

See: **[Overview](ca://s?q=Send_full_Overview_file)**

---

## 🪞 5. Stage 4 — Reflection & Widget Instantiation

Overview uses Java Reflection to instantiate widgets:

```
Class.forName("android.widget.Button")
```

Then:

```
new Button(Activity)
```

Reflection allows:

- dynamic class loading  
- support for any Android widget  
- zero hard‑coded widget list  

---

## ⚙️ 6. Stage 5 — Attribute Binding

Every key that is not `$` or `_` becomes a setter:

```
text → setText()
gravity → setGravity()
orientation → setOrientation()
```

Values are evaluated via `eval()` to support:

- Android constants  
- symbolic keys  
- dynamic expressions  

Example:

```
"android.view.Gravity.CENTER"
```

---

## 🪝 7. Stage 6 — Hook Execution

Hooks are JavaScript functions stored as strings:

```javascript
_onClick: "(w) => console.log('clicked')"
```

Overview executes them at the right moment, passing:

```
(widget, parent, root)
```

Hooks allow:

- event handling  
- initialization logic  
- dynamic UI updates  

---

## 🌍 8. Stage 7 — Internationalizer (i18n)

Before setting text, Overview checks if the value is a symbolic key:

```
"@Open"
```

If yes, it calls:

```
i18n.translate("@Open")
```

Resolution order:

```
1. cache
2. fr-FR
3. fr
4. default
5. original key
```

See:  
- **[Internationalizer](ca://s?q=Send_full_Internationalizer_file)**  
- **[Vocabulary Format](ca://s?q=Send_full_Vocabulary_file)**  
- **[Symbolic Keys](ca://s?q=Send_full_Symbolic_Keys_file)**

---

## 🗂️ 9. Stage 8 — Flat‑Map Widget Registry

Overview stores all widgets in a flat map:

```javascript
view.$("btnSave")
```

This allows:

- instant access to any widget  
- no need to traverse the tree  
- clean separation between UI and logic  

The flat‑map is one of the most powerful features of LourahJS.

---

## 🔄 10. Full Example of the Workflow

### Sugar DSL

```javascript
$btn: {
  class: "android.widget.Button",
  text: "'@Save'",
  _onClick: "(w)=>Activity.toast('Saved')"
}
```

### After Overview.Sugar

```
descriptor = {
  $btn: {
    class: "android.widget.Button",
    text: "'@Save'",
    _onClick: "(w)=>Activity.toast('Saved')"
  }
}
```

### After Overview

- Button instantiated  
- `setText()` called  
- hook attached  
- widget added to flat‑map  
- symbolic key translated  

### Final UI

A fully functional Android button with:

- translated label  
- click handler  
- direct access via `view.$("btn")`

---

## 🧭 11. Related Pages

- **[Overview](ca://s?q=Send_full_Overview_file)**  
- **[Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)**  
- **[Internationalizer](ca://s?q=Send_full_Internationalizer_file)**  
- **[Vocabulary Format](ca://s?q=Send_full_Vocabulary_file)**  
- **[Symbolic Keys](ca://s?q=Send_full_Symbolic_Keys_file)**
