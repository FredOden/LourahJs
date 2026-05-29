---
title: Architecture
parent: LourahJS
nav_order: 3
---

# Architecture du Framework LourahJS  
Structure interne, flux d’exécution et organisation modulaire

LourahJS est un framework JavaScript conçu pour fonctionner sur Android via le moteur Rhino.  
Il fournit une architecture modulaire permettant de créer des interfaces, manipuler le système, gérer l’i18n, et étendre facilement les fonctionnalités.

Cette page décrit l’architecture interne du framework, ses couches, ses modules, et la manière dont ils interagissent.

---

## 🧱 1. Vue d’ensemble de l’architecture

LourahJS repose sur quatre couches principales :

```
JavaScript (Rhino)
        ↓
LourahJS Engine (Java)
        ↓
Modules LourahJS (JS)
        ↓
Android Runtime / System APIs
```

### 1. JavaScript (Rhino)
- Interpréteur JavaScript embarqué dans Android  
- Permet d’exécuter du JS avec accès direct aux classes Java  
- Fournit l’environnement d’exécution principal  

### 2. LourahJS Engine (Java)
- Cœur du framework  
- Initialise Rhino  
- Expose des classes Java au JS  
- Charge les modules LourahJS  
- Fournit des utilitaires bas niveau  

### 3. Modules LourahJS (JS)
Modules écrits en JavaScript, par exemple :

- UI (Overview, Sugar DSL)  
- Internationalizer  
- Audio  
- Tools  
- Network  
- System  

Chaque module est indépendant et peut être utilisé seul.

### 4. Android Runtime
- Widgets  
- Services système  
- Intents  
- Classes Java  
- API natives  

---

## 🧩 2. Organisation modulaire

LourahJS est conçu comme un ensemble de modules autonomes :

```
lourah/
  android/
    Overview.js
    Internationalizer.js
    Sugar.js
  audio/
  tools/
  system/
  network/
```

Chaque module :

- expose une API simple  
- peut être chargé indépendamment  
- ne dépend pas des autres modules  
- peut être documenté séparément  

---

## 🔄 3. Cycle d’exécution d’une application LourahJS

Voici le flux complet d’une application LourahJS :

```
Script JS
   ↓
Chargement du moteur LourahJS
   ↓
Initialisation des modules
   ↓
Construction de l’UI (optionnel)
   ↓
Exécution des hooks et logique applicative
   ↓
Interaction avec Android
```

### Étape 1 — Chargement du script
Le script JS est exécuté par Rhino.

### Étape 2 — Initialisation du moteur
Le moteur LourahJS :

- configure Rhino  
- expose les classes Java  
- charge les modules LourahJS  

### Étape 3 — Modules disponibles
Le script peut utiliser :

- Lourah.android.Overview  
- Lourah.android.Internationalizer  
- Lourah.android.Sugar  
- Lourah.tools  
- Lourah.audio  
- etc.

### Étape 4 — Construction de l’UI
Si l’application a une interface :

- Sugar DSL → Overview.Sugar → Overview → Android Views  
- Internationalizer traduit les textes  
- Hooks JS sont attachés aux widgets  

### Étape 5 — Exécution
L’application tourne dans un environnement hybride :

- JS pour la logique  
- Java pour l’accès système  
- Android pour l’affichage  

---

## 🧬 4. Architecture UI : Overview + Sugar + i18n

La partie UI repose sur trois briques :

### 1. Sugar DSL  
Syntaxe déclarative simple :

```javascript
$btnSave: {
  class: "android.widget.Button",
  text: "'@Save'"
}
```

### 2. Overview.Sugar  
Convertit Sugar en un descriptor Overview.

### 3. Overview  
Construit l’UI via :

- Reflection Java  
- Setters automatiques  
- Hooks JS  
- Flat‑map des widgets  

### 4. Internationalizer  
Résout les clés symboliques :

```
@Save → "Enregistrer"
```

---

## 🧠 5. Interaction Java ↔ JavaScript

LourahJS utilise Rhino pour permettre :

### Appels JS → Java
```javascript
var btn = new android.widget.Button(Activity);
```

### Appels Java → JS
Hooks exécutés depuis Java :

```javascript
_onClick: "(w) => console.log('clicked')"
```

### Reflection
Permet d’instancier n’importe quelle classe Android :

```
Class.forName("android.widget.TextView")
```

---

## 🧩 6. Structure recommandée d’un projet LourahJS

```
project/
  main.js
  vocabularies/
    core.json
    android.json
  ui/
    mainLayout.js
  modules/
    customModule.js
```

---

## 🛠️ 7. Extensibilité

LourahJS est conçu pour être étendu facilement :

- ajouter un module JS  
- exposer une classe Java au JS  
- créer un DSL  
- ajouter un moteur i18n personnalisé  
- créer des composants UI réutilisables  

---

## 📄 8. Pages associées

- [Overview](ca://s?q=Send_full_Overview_file)  
- [Internationalizer](ca://s?q=Send_full_Internationalizer_file)  
- [Vocabulary Format](ca://s?q=Send_full_Vocabulary_file)  
- [Symbolic Keys](ca://s?q=Send_full_Symbolic_Keys_file)  
- [Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)
