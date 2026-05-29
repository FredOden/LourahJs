---
title: Modules LourahJS
parent: LourahJS
nav_order: 4
---

# Modules LourahJS  
Organisation, rôles et architecture des modules JavaScript du framework

LourahJS est conçu comme un framework **modulaire**, où chaque fonctionnalité est fournie par un module JavaScript indépendant.  
Cette page décrit les modules existants, leur rôle, leur structure, et la manière dont ils s’intègrent dans l’écosystème.

---

## 🧩 1. Qu’est‑ce qu’un module LourahJS ?

Un module LourahJS est un fichier JavaScript chargé automatiquement par le moteur LourahJS.  
Chaque module :

- expose une API JavaScript  
- peut utiliser les classes Java via Rhino  
- peut être utilisé indépendamment  
- peut être combiné avec d’autres modules  
- peut être documenté séparément  

Les modules sont regroupés par domaine fonctionnel :

```
lourah/
  android/
  audio/
  tools/
  system/
  network/
  ...
```

---

## 🗂️ 2. Structure générale d’un module

Un module LourahJS suit généralement cette structure :

```javascript
var Lourah = Lourah || {};
Lourah.<module> = Lourah.<module> || {};

(function () {
  // code interne
  Lourah.<module>.<API> = function (...) { ... };
})();
```

Caractéristiques :

- encapsulation dans une IIFE  
- espace de noms `Lourah.<module>`  
- API exposée via des fonctions ou objets  
- dépendances minimales  

---

## 📦 3. Modules Android

Les modules Android sont les plus utilisés dans LourahJS.  
Ils fournissent une couche déclarative pour construire des interfaces et gérer l’i18n.

### 👉 [Overview](ca://s?q=Send_full_Overview_file)
- Construction déclarative d’interfaces Android  
- Reflection Java  
- Setters automatiques  
- Hooks JS  
- Flat‑map des widgets  

### 👉 [Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)
- Syntaxe déclarative simplifiée  
- Conversion vers Overview  
- Idéal pour les layouts lisibles  

### 👉 [Internationalizer](ca://s?q=Send_full_Internationalizer_file)
- Gestion de l’i18n  
- Résolution des clés symboliques  
- Cache de traduction  

### 👉 [Vocabulary Format](ca://s?q=Send_full_Vocabulary_file)
- Format des dictionnaires de traduction  
- Gestion des locales  
- Fallback automatique  

### 👉 [Symbolic Keys](ca://s?q=Send_full_Symbolic_Keys_file)
- Clés sémantiques pour le texte UI  
- Indépendance vis‑à‑vis de la langue  

---

## 🎵 4. Modules Audio (optionnels)

Ces modules permettent de manipuler l’audio depuis JavaScript :

- lecture de sons  
- génération audio  
- manipulation de buffers  
- outils DSP simples  

Structure typique :

```
Lourah.audio.Player
Lourah.audio.Generator
Lourah.audio.Utils
```

---

## 🧰 5. Modules Tools

Modules utilitaires génériques :

- manipulation de fichiers  
- helpers JSON  
- timers  
- wrappers Java  
- outils de debug  

Exemples :

```
Lourah.tools.Logger
Lourah.tools.IO
Lourah.tools.Thread
```

---

## 🖥️ 6. Modules System

Modules permettant d’interagir avec Android :

- accès aux services système  
- intents  
- notifications  
- capteurs  
- informations sur l’appareil  

Exemples :

```
Lourah.system.Intent
Lourah.system.Device
Lourah.system.Notifications
```

---

## 🌐 7. Modules Network

Modules pour les communications réseau :

- HTTP client  
- WebSockets  
- parsing JSON/XML  
- outils réseau bas niveau  

Exemples :

```
Lourah.network.Http
Lourah.network.WebSocket
```

---

## 🧬 8. Modules personnalisés

LourahJS est conçu pour être étendu facilement.  
Un module personnalisé peut être ajouté dans :

```
lourah/custom/MyModule.js
```

Avec une structure simple :

```javascript
var Lourah = Lourah || {};
Lourah.custom = Lourah.custom || {};

Lourah.custom.MyModule = (function () {
  function hello() {
    return "Hello from MyModule";
  }

  return { hello };
})();
```

---

## 🧭 9. Comment les modules sont chargés

Le moteur LourahJS :

1. initialise Rhino  
2. charge les modules JavaScript dans `lourah/`  
3. expose les modules via l’espace de noms `Lourah.*`  
4. permet au script principal (`main.js`) d’utiliser les modules  

---

## 🛠️ 10. Bonnes pratiques

- garder les modules **petits et cohérents**  
- éviter les dépendances circulaires  
- documenter chaque module dans `docs/lourahjs/<module>`  
- utiliser des espaces de noms clairs  
- séparer UI, logique, outils et données  

---

## 📄 11. Pages associées

- [Architecture](ca://s?q=Creer_page_Architecture_Framework)  
- [Getting Started](ca://s?q=Creer_page_Getting_Started)  
- [Overview](ca://s?q=Send_full_Overview_file)  
- [Sugar DSL](ca://s?q=Send_full_Sugar_DSL_file)  
- [Internationalizer](ca://s?q=Send_full_Internationalizer_file)
