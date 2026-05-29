---
title: Getting Started
parent: LourahJS
nav_order: 1
---

# Getting Started  
Premiers pas avec le framework LourahJS

Cette page vous guide à travers les étapes essentielles pour commencer à développer avec **LourahJS**, depuis l’installation jusqu’à l’exécution d’une première interface Android.

---

## 🚀 1. Prérequis

Pour utiliser LourahJS, vous avez besoin de :

- Un appareil Android  
- L’application permettant d’exécuter du JavaScript avec accès aux classes Java (Rhino embarqué)  
- Le framework LourahJS (modules JS + moteur Java)  
- Un éditeur de texte (Termux, Acode, DroidEdit, etc.)

Aucune installation complexe n’est nécessaire : LourahJS est conçu pour être **portable**, **léger**, et **sans build system**.

---

## 📁 2. Structure minimale d’un projet

Voici la structure recommandée pour démarrer :

```
project/
  main.js
  vocabularies/
    core.json
  ui/
    mainLayout.js
```

- `main.js` → point d’entrée  
- `vocabularies/` → dictionnaires i18n  
- `ui/` → layouts déclaratifs (Sugar DSL ou Overview)

---

## 🌍 3. Ajouter un vocabulaire i18n

Créez un fichier :

```
vocabularies/core.json
```

Avec par exemple :

```json
{
  "@Hello": {
    "fr": "Bonjour",
    "default": "Hello"
  },
  "@ClickMe": {
    "fr": "Cliquez-moi",
    "default": "Click me"
  }
}
```

---

## 🧩 4. Créer une interface avec Sugar DSL

Créez :

```
ui/mainLayout.js
```

Avec :

```javascript
({
  $root: {
    class: "android.widget.LinearLayout",
    orientation: "android.widget.LinearLayout.VERTICAL",

    $title: {
      class: "android.widget.TextView",
      text: "'@Hello'",
      textSize: "24"
    },

    $button: {
      class: "android.widget.Button",
      text: "'@ClickMe'",
      _onClick: "(w) => Activity.toast('Clicked!')"
    }
  }
})
```

---

## ⚙️ 5. Point d’entrée : `main.js`

Voici un exemple minimal :

```javascript
// Charger les modules LourahJS
var Overview = Lourah.android.Overview;
var Sugar = Lourah.android.Overview.Sugar;
var Internationalizer = Lourah.android.Internationalizer;

// Charger le vocabulaire
var i18n = new Internationalizer();
i18n.addVocabulary(JSON.parse(Lourah.IO.loadText("vocabularies/core.json")));

// Charger le layout Sugar
var layout = eval(Lourah.IO.loadText("ui/mainLayout.js"));

// Construire l’UI
var view = Overview.buildFromSugar(layout, i18n);

// Afficher l’UI
Activity.setContentView(view.$root);
```

---

## 📱 6. Exécuter l’application

1. Ouvrez votre environnement d’exécution LourahJS  
2. Chargez `main.js`  
3. Lancez le script  

Vous devriez voir :

- un texte “Bonjour” (ou “Hello” selon la langue du téléphone)  
- un bouton “Cliquez-moi”  
- un toast “Clicked!” lorsque vous appuyez dessus  

---

## 🧠 7. Comprendre le flux

Voici ce qui se passe en interne :

```
main.js
   ↓
Chargement du vocabulaire
   ↓
Chargement du layout Sugar
   ↓
Sugar → Overview.Sugar → Descriptor
   ↓
Overview → Widgets Android
   ↓
Internationalizer → Traductions
   ↓
Activity.setContentView()
```

---

## 🛠️ 8. Étapes suivantes

Vous pouvez maintenant explorer :

- [Overview](ca://s?q=Send_full_Overview_file)  
- [Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)  
- [Internationalizer](ca://s?q=Send_full_Internationalizer_file)  
- [Vocabulary Format](ca://s?q=Send_full_Vocabulary_file)  
- [Symbolic Keys](ca://s?q=Send_full_Symbolic_Keys_file)

---

## 🎉 9. Vous êtes prêt

Vous avez maintenant :

- un projet minimal  
- une UI déclarative  
- un vocabulaire i18n  
- un script d’entrée  
- un flux complet fonctionnel  

LourahJS est conçu pour être simple, modulaire et extensible.  
Vous pouvez maintenant créer vos propres modules, layouts, outils et applications.
