# LourahJS Documentation Roadmap
A structured and comprehensive plan for completing, organizing, and publishing the LourahJS documentation across GitHub Pages and lourah.com.

---

## 1. Repository Cleanup & File Normalization (COMPLETED)

### Objectives
- Normalize all documentation filenames to lowercase.
- Remove legacy uppercase files from Git history.
- Recreate missing documentation pages after forced renames.
- Ensure consistent front‑matter across all pages.
- Validate folder structure under `/docs/lourahjs`.

### Status
✔ Completed  
The repository now uses a clean, predictable, case‑consistent structure compatible with Git, Android/Termux, and GitHub Pages.

---

## 2. Documentation Architecture (COMPLETED)

### Objectives
- Establish a clear documentation hierarchy.
- Create Android sub‑sections:
  - Overview
  - Sugar DSL
  - Internationalizer
  - Symbolic Keys
  - Vocabulary Format
- Ensure all pages are written in English.
- Add internal links between all related pages.
- Maintain consistent Markdown formatting and structure.

### Status
✔ Completed  
All pages are now coherent, linked, and aligned with Just the Docs conventions.

---

## 3. Just the Docs Navigation (PENDING — CRITICAL)

### 3.1 Enable Collections
Just the Docs does not generate navigation for subfolders unless they are declared as collections.

Add the following to `_config.yml`:

```yaml
collections:
  lourahjs:
    output: true
    permalink: /:collection/:path/

just_the_docs:
  collections:
    lourahjs:
      name: "LourahJS"
      output: true
```

### 3.2 Validate Sidebar Behavior
- Test on desktop (sidebar visible by default).
- Test on mobile (sidebar hidden, accessible via menu).
- Confirm that all pages appear in the navigation tree.

### Status
⏳ Pending  
This is the final step required for full navigation.

---

## 4. Domain Integration (PENDING)

### 4.1 GitHub Pages
- Ensure GitHub Pages is set to “Deploy from `/docs`”.
- Confirm that `fredoden.github.io` loads the documentation correctly.

### 4.2 lourah.com
- Ensure DNS CNAME points to `fredoden.github.io`.
- Add a `CNAME` file in the repository root if needed.
- Test HTTPS redirection and canonical URLs.

### Status
⏳ Pending  
Once configured, both domains will serve the same documentation seamlessly.

---

## 5. Documentation UX Enhancements (OPTIONAL)

### Objectives
- Add previous/next navigation at the bottom of each page.
- Add table of contents for long pages.
- Add cross‑links between modules (Engine ↔ Overview ↔ Sugar ↔ Internationalizer).
- Add a landing page for the entire LourahJS ecosystem.
- Improve readability and navigation flow.

### Status
Optional  
These enhancements will improve user experience but are not required for initial publication.

---

## 6. Future Documentation Expansion (PLANNED)

### Planned Modules
- Engine internals
- HTTP server module
- Crypto module
- IDE module
- Utilities (text, math, etc.)
- Android advanced UI patterns
- LourahJS philosophy & design principles

### Status
Planned  
These modules will expand the documentation into a full technical reference.

---

## 7. Final Validation Checklist

- [ ] Sidebar visible on desktop  
- [ ] All pages appear under the LourahJS collection  
- [ ] All internal links work  
- [ ] lourah.com resolves correctly  
- [ ] GitHub Pages builds without warnings  
- [ ] Documentation fully in English  
- [ ] Navigation consistent and intuitive  

---

## 8. Long‑Term Vision

- A unified documentation portal for all LourahJS modules.  
- A clean, modern, English‑only technical reference.  
- A stable domain (`lourah.com`) hosting the full ecosystem.  
- A maintainable structure for future growth.  

---

*This roadmap evolves as the LourahJS ecosystem grows.*
