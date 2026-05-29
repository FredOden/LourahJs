---
title: Sugar DSL
parent: LourahJS
nav_order: 5
---

# Sugar DSL  
Declarative Syntax for Android UI in LourahJS

## 1. Summary
The **Sugar DSL** is a lightweight declarative syntax that simplifies Android UI creation in LourahJS.  
It is a thin, human‑friendly layer on top of **Lourah.android.Overview**, designed to:

- reduce boilerplate  
- improve readability  
- keep UI definitions clean and structured  
- integrate seamlessly with symbolic keys and the Internationalizer  

Sugar DSL is the recommended way to define UI layouts in LourahJS.

---

## 2. Purpose
Android UI creation in JavaScript can become verbose and difficult to maintain.  
Sugar DSL solves this by providing:

- a compact declarative syntax  
- automatic mapping to Android widget classes  
- automatic setter resolution  
- built‑in hook support  
- clean separation between UI structure and behavior  

It allows developers to focus on **what** the UI should look like, not **how** to build it.

---

## 3. Concepts

### 3.1 Identifiers (`$`)
Every widget starts with `$`:

```
$root
$title
$button
```

These identifiers become accessible through the Overview flat‑map:

```javascript
view.$("button")
```

### 3.2 Attributes → Setters
Every key that is not `$` or `_` becomes a setter:

```
text → setText()
gravity → setGravity()
orientation → setOrientation()
```

Values are evaluated using `eval()` to support Android constants:

```
"android.view.Gravity.CENTER"
```

### 3.3 Hooks (`_`)
Keys starting with `_` represent JavaScript functions executed at build time:

```
_onClick
_onInit
_onLongPress
```

Hooks receive:

```
(widget, parent, root)
```

### 3.4 Children (`content`)
Child widgets are declared under the `content` key:

```javascript
content: {
  $child: { ... }
}
```

---

## 4. Architecture

### 4.1 Processing Pipeline

```
Sugar Descriptor
        ↓
Overview.Sugar (conversion)
        ↓
Overview (widget instantiation)
        ↓
Android Views (runtime UI)
```

### 4.2 Conversion Rules
Sugar DSL is converted into an Overview descriptor by:

- resolving widget identifiers  
- mapping attributes to setters  
- evaluating constants  
- preparing hook functions  
- recursively processing children  

The resulting descriptor is then passed to `Overview`.

---

## 5. Example

### 5.1 Sugar DSL

```javascript
{
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "android.widget.LinearLayout.VERTICAL",

    $btn: {
      class: "android.widget.Button",
      text: "'@Open'",
      _onClick: "(w) => console.log('clicked')"
    }
  }
}
```

### 5.2 Build and display

```javascript
var view = Lourah.android.Overview.buildFromSugar(UI, i18n);
Activity.setContentView(view.$root);
```

---

## 6. Best Practices

- Use symbolic keys for all UI text  
- Keep Sugar descriptors shallow and modular  
- Avoid complex logic inside hooks  
- Group related widgets into separate components  
- Prefer descriptive widget identifiers (`$saveButton`, `$titleLabel`)  

---

## 7. Notes & Caveats

- Hooks must be valid JavaScript strings  
- Identifiers must be unique within the descriptor  
- `eval()` is used internally to resolve Android constants  
- Sugar DSL does not validate widget class names  

---

## 8. Related Pages

- Overview  
- Internationalizer  
- Vocabulary Format  
- Symbolic Keys
