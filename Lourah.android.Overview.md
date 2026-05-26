# Lourah.android.Overview

A declarative, JSON-driven UI builder for Android views, running on the LourahJS engine (Rhino/Android).

---

## Overview

`Lourah.android.Overview` lets you define Android user interfaces as plain JavaScript objects instead of XML layouts or imperative Java/JS code. It instantiates Android widgets, applies setter methods, wires event hooks, and builds a full view hierarchy — all from a structured descriptor.

It ships with a **Sugar** syntax layer that makes UI definitions more readable, and a convenience factory `buildFromSugar` that combines both in a single call.

---

## Architecture

```
Sugar descriptor (ui.js)
        │
        ▼
Lourah.android.Overview.Sugar   → parses into canonical descriptor
        │
        ▼
Lourah.android.Overview         → instantiates Android widgets via Java reflection
        │
        ▼
widget map  { $root, $title, $myButton, ... }
        │
        ▼
Activity.setContentView(view.$root)
```

---

## View Descriptor Format

The canonical format used internally by `Overview`:

```js
{
  myWidget: {
    class: "android.widget.TextView",   // Java class name or direct class reference
    attributes: {
      setText: "'Hello world'",          // values are eval()'d
      setTextSize: "sp(14)",             // can reference helper functions
      _myHook: (w, m, translate) => {   // '_' prefix = hook (custom logic)
        w.setPadding(0, 0, 0, dp(12));
      }
    },
    content: {                           // nested child views
      myChild: { ... }
    }
  }
}
```

### Attribute values

- Values are **`eval()`'d**, so they can reference Android constants (`android.widget.LinearLayout.VERTICAL`), helper functions (`sp()`, `dp()`), or any in-scope variable.
- **Array values** are spread as multiple arguments: `setPadding: [dp(8), dp(8), dp(8), dp(8)]`
- **Hook attributes** (keys starting with `_`) execute a custom function instead of a setter call. The hook receives `(widget, hookName, translateFn)`.

---

## Sugar Syntax

The Sugar layer allows a more compact, nested style. Child views are identified by keys starting with `$`; all other keys are treated as attribute setters.

```js
var UI = {
  $root: {
    class: "android.widget.LinearLayout",
    setOrientation: android.widget.LinearLayout.VERTICAL,

    $title: {
      class: "android.widget.TextView",
      setText: "'My App'",
      setTextSize: sp(16)
    },

    $myButton: {
      class: "android.widget.Button",
      setText: "'Click me'",
      setOnClickListener: { onClick: v => doSomething() }
    }
  }
};
```

Sugar keys:
| Key pattern | Meaning |
|---|---|
| `$xxx` | Child view (nested widget) |
| `class` | Android widget class |
| `_xxx` | Hook attribute (custom logic) |
| anything else | Widget setter method |

---

## API

### `new Lourah.android.Overview(views, internationalizer?)`

Builds a widget tree from a canonical view descriptor.

| Parameter | Type | Description |
|---|---|---|
| `views` | Object | Canonical view descriptor |
| `internationalizer` | Object (optional) | Internationalizer instance for string translation |

**Methods:**

- **`.$( key? )`** — Returns a widget by key. If no key given, returns the full widget map. Throws if key not found.
- **`.getViews()`** — Returns the raw view descriptor.

---

### `new Lourah.android.Overview.Sugar(sugarForm)`

Parses a Sugar descriptor into a canonical view descriptor.

- **`.getContent()`** — Returns the parsed canonical content (top-level children).

---

### `Lourah.android.Overview.buildFromSugar(sugar, internationalizer?)`

Convenience factory. Parses a Sugar descriptor and builds the full widget map in one call.

```js
var view = Lourah.android.Overview.buildFromSugar(UI);
Activity.setContentView(view.$root);
```

Returns a flat object `{ $root, $title, $myButton, ... }`.

---

## Internationalizer

`Lourah.android.Internationalizer` is a lightweight i18n engine tightly coupled with Overview. It is automatically imported by Overview at load time.

### How it works

When an `Internationalizer` instance is passed to `Overview` or `buildFromSugar`, all attribute string values are passed through `translate()` before being applied to the widget. The UI descriptor itself requires no changes.

```js
var i18n = new Lourah.android.Internationalizer();
i18n.addVocabulary(myStrings);
var view = Lourah.android.Overview.buildFromSugar(UI, i18n);
```

### Vocabulary format

```js
{
  "Hello": {
    "fr":      "Bonjour",
    "fr-FR":   "Bonjour (France)",
    "default": "Hello"
  },
  "Optimistic": {
    "fr":      "Optimiste",
    "default": "Optimistic"
  }
}
```

### API

#### `new Lourah.android.Internationalizer()`

Constructs an instance initialized with the device's default locale (`java.util.Locale.getDefault()`).

#### `.addVocabulary(vocabulary)`

Adds a vocabulary to the translation chain. Multiple vocabularies can be added and are searched in insertion order.

#### `.translate(string)`

Translates a string using the active locale. Resolution order:
1. Cache hit → return immediately
2. Language + country match (e.g. `"fr-FR"`)
3. Language-only match (e.g. `"fr"`)
4. `"default"` fallback
5. Original string unchanged

Results are cached for performance. The cache is cleared automatically on locale change.

#### `.setLocale(java.util.Locale)`

Switches the active locale and clears the cache. Useful for runtime locale switching.

---

## Real-world example: 440hz decision cockpit

`440hz` is a treasury decision support app built with Overview. It illustrates the full pattern: Sugar descriptor → widget map → business logic wiring.

**`ui.js`** — UI descriptor (Sugar format):
```js
var UI = {
  $root: {
    class: "android.widget.LinearLayout",
    setOrientation: android.widget.LinearLayout.VERTICAL,
    setBackgroundColor: 0xfff0b0a0|0,

    $scenario: {
      class: "android.widget.Spinner",
      _setEntries: (w, m, translate) => {
        var adapter = new android.widget.ArrayAdapter(
          Activity.getApplicationContext(),
          android.R.layout.simple_spinner_dropdown_item|0,
          ["'Optimiste'", "'Neutre'", "'Pessimiste'"].map(i => translate(eval(i)))
        );
        w.setAdapter(adapter);
      }
    },

    $liquidity: { class: "android.widget.SeekBar", setMax: 100, setProgress: 60 },
    $risk:      { class: "android.widget.SeekBar", setMax: 100, setProgress: 40 },

    $compute: {
      class: "android.widget.Button",
      setText: "'Évaluer'",
      setOnClickListener: { onClick: v => refresh() }
    },

    $result: {
      class: "android.widget.LinearLayout",
      setOrientation: android.widget.LinearLayout.VERTICAL,
      $score:          { class: "android.widget.TextView", setText: "'Score : --'" },
      $recommendation: { class: "android.widget.TextView", setText: "'Recommandation : --'" }
    }
  }
};
```

**`440hz_0.js`** — App entry point:
```js
Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.Overview.js');
Activity.importScript(Lourah.jsFramework.dir() + "/decisionEngine.js");
Activity.importScript(Lourah.jsFramework.dir() + "/ui.js");

// Build the full UI from the Sugar descriptor
var view = Lourah.android.Overview.buildFromSugar(UI);
Activity.setContentView(view.$root);

// Direct widget access by name
var scenario    = view.$scenario;
var liquidity   = view.$liquidity;
var risk        = view.$risk;
var scoreView   = view.$score;
var recView     = view.$recommendation;

function refresh() {
  var ctx = {
    liquidity:   liquidity.getProgress(),
    risk:        risk.getProgress(),
    opportunity: opportunity.getProgress(),
    scenario:    scenario.getSelectedItem().toString().toLowerCase()
  };
  var result = DecisionEngine.evaluate(ctx);
  scoreView.setText("Score : " + result.score);
  recView.setText("Recommandation : " + result.recommendation);
}
```

---

## Notes

- Widget keys must be **unique** across the entire view tree. Duplicate keys throw an error.
- Attribute values are `eval()`'d in the calling scope — make sure helper functions like `sp()` and `dp()` are defined before the descriptor is parsed.
- The `class` field accepts both a **string** (Java class name, resolved via reflection) and a **direct Java class reference**.
- Hook scripts receive `(widget, hookName, translateFn)` — use them for setup logic that can't be expressed as a simple setter call (e.g. building an adapter, setting complex listeners).
