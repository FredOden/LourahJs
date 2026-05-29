---
title: Overview
parent: LourahJS
nav_order: 10
---

# Overview  
Android UI Builder for LourahJS

The **Overview module** is the declarative UI builder of LourahJS.  
It allows you to describe Android interfaces using plain JavaScript objects, without XML, without Java, and without boilerplate.

Overview converts a JSON‑like structure into a fully functional Android View hierarchy.

---

## 🎯 Purpose

Overview provides:

- a **declarative UI syntax**  
- automatic **widget instantiation**  
- automatic **setter resolution**  
- **hooks** for event binding  
- integration with **Internationalizer**  
- integration with **Sugar DSL**  

It is the foundation of the LourahJS UI system.

---

## 🧱 Basic Structure

An Overview layout is a JavaScript object:

```javascript
var layout = {
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "VERTICAL",
    $children: {
      title: {
        class: "android.widget.TextView",
        text: "'@Hello'",
        textSize: "24"
      }
    }
  }
};
```

Then you build it:

```javascript
var view = Overview.buildFromSugar(layout, i18n);
Activity.setContentView(view.$root);
```

---

## 🔧 Core Concepts

### **1. `$root`**
The root widget of the UI tree.

### **2. `class`**
The Android class to instantiate.

### **3. `$children`**
A map of child widgets.

### **4. Setters**
Any property that matches a Java setter is applied automatically:

```javascript
textSize: "18"
orientation: "VERTICAL"
gravity: "CENTER"
```

### **5. Hooks**
Functions prefixed with `_` are executed after widget creation:

```javascript
_onClick: function(v) {
  console.log("Clicked!");
}
```

---

## 🔄 Execution Flow

```
Sugar → Overview → Android Views
```

1. Sugar normalizes the layout  
2. Overview instantiates widgets  
3. Setters are applied  
4. Hooks are executed  
5. Internationalizer resolves symbolic keys  
6. Android renders the UI  

---

## 📚 Related Pages

- **[Sugar DSL](ca://s?q=Reenvoyer_sugar_md)**  
- **[Internationalizer](ca://s?q=Reenvoyer_internationalizer_md)**  
- **[UI Internal Workflow](ca://s?q=Reenvoyer_ui_internal_workflow)**  
- **[Vocabulary Format](ca://s?q=Reenvoyer_vocabulary_md)**
