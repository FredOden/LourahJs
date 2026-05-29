---
title: Overview
parent: LourahJS
nav_order: 1
---

# Lourah.android.Overview  
Declarative Android UI Builder for LourahJS

## 1. Summary
`Lourah.android.Overview` is the foundational UI engine of LourahJS.  
It builds Android interfaces declaratively using:

- Java Reflection to instantiate widgets  
- JSON-like descriptors to define UI trees  
- Hook functions for dynamic behavior  
- A flat-map for direct widget access  
- Optional integration with the Internationalizer for i18n  

It powers the Sugar DSL and all higher-level UI abstractions.

## 2. Purpose
Android UI creation in JavaScript is verbose.  
Overview solves this by providing:

- A declarative UI description format  
- Automatic widget instantiation  
- Automatic attribute binding  
- Automatic event hook execution  
- A flat lookup table for widgets  

It turns JSON into a fully functional Android UI.

## 3. Concepts

### Declarative UI
UI is described as a nested object:

```javascript
{
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "android.widget.LinearLayout.VERTICAL",
    content: { ... }
  }
}
```

### Identifiers
Keys starting with `$` represent widgets.

### Hooks
Keys starting with `_` represent JavaScript functions executed at build time.

### Attribute Binding
Every key that is not `$` or `_` becomes a setter.

### Children
Declared under `content`.

## 4. Architecture

### Internal Flow

```
Descriptor → Reflection → Widget → Attributes → Hooks → Children → Flat‑Map
```

### Reflection
Resolves classes dynamically using `Class.forName`.

### Attribute Resolution
Values are evaluated with `eval()` to support Android constants.

### Hook Execution
Hooks receive `(widget, parent, root)`.

### Flat‑Map
All widgets are stored in a map:

```javascript
view.$("button")
```

## 5. API Reference

### new Overview(descriptor, internationalizer?)
Creates a UI tree.

### getJSONView(key, view)
Instantiates a widget and its children.

### getViews()
Returns the original descriptor.

### $(key)
Returns a widget by its identifier.

### Overview.Sugar
Converts Sugar DSL into Overview descriptors.

### Overview.buildFromSugar(sugar, i18n)
Full pipeline: Sugar → Overview → Flat‑Map.

## 6. Usage Example

```javascript
var UI = {
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "android.widget.LinearLayout.VERTICAL",

    $btn: {
      class: "android.widget.Button",
      text: "'@Open'",
      _onClick: "(w) => console.log('clicked')"
    }
  }
};

var view = Lourah.android.Overview.buildFromSugar(UI, i18n);
Activity.setContentView(view.$root);
```

## 7. Best Practices

- Use symbolic keys for all UI text  
- Keep hooks small and pure  
- Prefer Sugar DSL for readability  
- Avoid deep nesting  
- Group UI components logically  

## 8. Notes & Caveats

- `eval()` is required for Android constants  
- Reflection errors propagate directly  
- Hooks must be valid JavaScript strings  
- Identifiers must be unique  

## 9. Related Pages

- Internationalizer  
- Vocabulary Format  
- Symbolic Keys  
- Sugar DSL

