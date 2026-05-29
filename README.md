# LourahJS  
A Modular JavaScript Framework for Android

LourahJS is a lightweight, modular JavaScript framework that enables you to build Android interfaces, interact with system services, manage internationalization, and develop advanced tools — all using JavaScript through the embedded Rhino engine.

This repository contains:

- the **LourahJS framework** (JavaScript modules + Java engine)  
- the **official documentation** (in `/docs`)  
- examples and reusable components  

---

## 🚀 Key Features

- **Declarative UI** with Overview and Sugar DSL  
- **Built‑in internationalization** (symbolic keys + vocabularies)  
- **Direct access to Android classes** via Rhino  
- **Independent modules** (android, tools, audio, system, network…)  
- **Extensible architecture** (add your own JS modules)  
- **Zero compilation** — everything runs as pure scripts  

---

## 📚 Documentation

Full documentation is available at:

👉 **https://fredoden.github.io**

It includes:

- Getting Started  
- Framework Architecture  
- LourahJS Engine (Java)  
- LourahJS Modules  
- UI Internal Workflow  
- Overview  
- Sugar DSL  
- Internationalizer  
- Vocabulary Format  
- Symbolic Keys  

---

## 📁 Repository Structure

```
/
├── docs/                 # Just the Docs documentation
│   ├── index.md
│   ├── _config.yml
│   └── lourahjs/
│       ├── index.md
│       ├── architecture.md
│       ├── getting-started.md
│       ├── modules.md
│       └── android/
│           ├── overview.md
│           ├── sugar.md
│           ├── internationalizer.md
│           ├── vocabulary.md
│           └── symbols.md
│
├── lourah/               # LourahJS modules (JS)
│   ├── android/
│   ├── tools/
│   ├── audio/
│   ├── system/
│   └── network/
│
└── main.js               # Example entry point
```

---

## 🧱 Architecture Overview

LourahJS is built on four layers:

```
JavaScript (Rhino)
        ↓
LourahJS Engine (Java)
        ↓
LourahJS Modules (JS)
        ↓
Android Runtime
```

- **Rhino** executes JavaScript  
- **LourahJS Engine** exposes Android and loads modules  
- **Modules** provide UI, i18n, tools, audio, etc.  
- **Android** renders the UI and handles system interactions  

---

## 🧪 Minimal Example

```javascript
var Overview = Lourah.android.Overview;
var Sugar = Lourah.android.Overview.Sugar;
var Internationalizer = Lourah.android.Internationalizer;

var i18n = new Internationalizer();
i18n.addVocabulary({
  "@Hello": { "fr": "Bonjour", "default": "Hello" }
});

var layout = {
  $root: {
    class: "android.widget.TextView",
    text: "'@Hello'",
    textSize: "24"
  }
};

var view = Overview.buildFromSugar(layout, i18n);
Activity.setContentView(view.$root);
```

---

## 🛠️ Contributing

Contributions are welcome:

- documentation improvements  
- new JS modules  
- examples  
- engine enhancements  
- bug fixes  

Fork the repository, create a branch, and open a Pull Request.

---

## 📄 License

LourahJS is provided for educational and experimental use.  
See the LICENSE file if included in this repository.
