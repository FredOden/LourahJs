---
title: LourahJS
nav_order: 2
has_children: true
---

# LourahJS  
Modular JavaScript Framework for Android and System‑Level Scripting

LourahJS is a lightweight, modular JavaScript framework designed to run on Android and provide high‑level abstractions for UI, system access, and application logic.  
It combines the flexibility of JavaScript with the power of the Android runtime, enabling developers to build applications, tools, and experiments with minimal boilerplate.

This section introduces the core concepts of the framework and provides access to all subsystem documentation.

---

## 🚀 What is LourahJS?

LourahJS is built around three principles:

### **1. Declarative**
UI and system components are described using JSON‑like structures and DSLs.

### **2. Modular**
Each subsystem (UI, i18n, audio, tools, etc.) is independent and can be used standalone.

### **3. Dynamic**
Java Reflection and the Rhino JavaScript engine allow dynamic access to Android APIs.

---

## 🧱 Architecture Overview

LourahJS is composed of several layers:

```
JavaScript (Rhino)
        ↓
LourahJS Engine (Java)
        ↓
LourahJS Modules (JS)
        ↓
Android Runtime / System APIs
```

### Components

- **LourahJS Engine**  
  The Java foundation that embeds Rhino and exposes Android APIs.

- **LourahJS Modules**  
  JavaScript libraries providing UI, i18n, utilities, DSLs, and more.

- **Android Integration**  
  Dynamic access to Android classes, widgets, and system services.

---

## 📚 Documentation Sections

This section contains all documentation related to the LourahJS framework.

### 👉 LourahJS / Android  
Android‑specific modules, including:

- Overview (declarative UI builder)  
- Internationalizer (i18n engine)  
- Vocabulary Format  
- Symbolic Keys  
- Sugar DSL  

More modules will be added as the framework evolves.

---

## 🧭 How to Navigate

Use the sidebar to explore:

- core concepts  
- architecture  
- Android modules  
- DSLs  
- utilities  

Each page follows a consistent structure:

- concepts  
- architecture  
- API reference  
- examples  
- best practices  

---

## 🛠️ Extending the Framework

LourahJS is designed to grow.  
You can add new modules under:

```
docs/lourahjs/
```

Examples of future sections:

- `audio/`  
- `runtime/`  
- `network/`  
- `tools/`  
- `ui/`  

---

## 📄 License

This documentation is part of the LourahJS project.  
All content is provided for educational and development purposes.
