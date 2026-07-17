# Rapport d'audit — Les Aventuriers du Dé

---

## 1. Bugs techniques à corriger en priorité

### 🔴 IDs dupliqués : `id="main-menu"`

Trois éléments partagent le même `id` :

```html
<dialog class="header__floating-menu" id="main-menu">
  ...
  <nav class="header__menu">
    <menu class="menu astro-xrc56gie" id="main-menu"></menu>
  </nav>
</dialog>
```

Le HTML n'autorise pas les ID dupliqués. Conséquences concrètes :

- `popovertarget="main-menu"` / `commandfor="main-menu"` peuvent cibler le mauvais élément selon les
  navigateurs.
- Les technologies d'assistance (lecteurs d'écran) peuvent se perdre dans la navigation par repères.

➡️ Renommer l'un des deux (ex. `id="main-menu-list"` pour le `<menu>`).

### 🔴 `aria-controls="menu"` pointe vers un ID inexistant

```html
<button ... aria-controls="menu">Menu</button>
```

Aucun élément n'a `id="menu"` sur la page (seulement `id="main-menu"`). Cette référence est cassée et
n'apporte rien aux lecteurs d'écran actuellement — à corriger en `aria-controls="main-menu"` (une fois
l'ID dupliqué ci-dessus réglé).

### 🟠 Bouton "Menu" sans état `aria-expanded`

Le bouton d'ouverture du menu (`#main-menu-button`) n'expose pas `aria-expanded="true/false"`. Pour un
menu qui s'ouvre/se ferme (même via `popovertarget`), c'est recommandé par le RGAA/WAI-ARIA pour que les
utilisateurs de lecteurs d'écran sachent si le menu est ouvert.

---

## 2. JSON-LD — à revoir en profondeur

```json
{
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "location": "Mérignac",
  "openingHours": "Dernier dimanche de chaque mois, 14h-18h",
  "paymentAccepted": "Cash,Donation",
  "currenciesAccepted": "EUR",
  "priceRange": "€"
}
```

Problèmes :

1. **`@type: SportsActivityLocation`** n'est pas adapté : ce type Schema.org désigne un lieu dédié au
   sport (hérite de `Place`), pas une association culturelle/ludique. Pour un club de jeux de société
   loi 1901, le type le plus pertinent est plutôt **`Organization`**, éventuellement combiné à un
   **`Event`** récurrent pour les séances mensuelles.
2. **`location` en simple texte** ("Mérignac") au lieu d'un objet `PostalAddress` structuré — alors que
   l'adresse complète existe déjà dans le footer (25 rue Paul Langevin, 33700 Mérignac). Il faut la
   réutiliser :

   ```json
   "address": {
     "@type": "PostalAddress",
     "streetAddress": "25 rue Paul Langevin",
     "postalCode": "33700",
     "addressLocality": "Mérignac",
     "addressCountry": "FR"
   }
   ```

3. **`openingHours` en texte libre** ("Dernier dimanche de chaque mois, 14h-18h") n'est **pas compris**
   par les moteurs : le format `openingHours` de Schema.org attend un code du type `"Su 14:00-18:00"`
   hebdomadaire — il **ne sait pas exprimer** une récurrence "dernier dimanche du mois". Deux options :
   - Utiliser `Event` avec une récurrence explicite (plus adapté pour ce cas précis),
   - Ou simplement supprimer `openingHours` du JSON-LD et laisser l'info en texte visible (déjà bien
     présente dans "Agenda").
4. **Champs manquants** : `name`, `url`, `email`, `description`. Sans `name`, Google ne peut pas relier
   clairement cette fiche à "Les Aventuriers du Dé".
5. `paymentAccepted: "Cash,Donation"` : préférer soit une chaîne unique ("Cash"), soit un tableau
   `["Cash", "Donation"]`.

**Proposition de bloc JSON-LD révisé** (type `Organization`) :

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Les Aventuriers du Dé",
  "url": "https://les-aventuriers-du-de.github.io/",
  "email": "les-aventuriers-du-de@outlook.fr",
  "description": "Association loi 1901 de jeux de société, jeux de cartes et jeux de rôles à Mérignac.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "25 rue Paul Langevin",
    "postalCode": "33700",
    "addressLocality": "Mérignac",
    "addressCountry": "FR"
  }
}
```

---

## 3. SEO restant

| Point                                  | État                | Action                                   |
| -------------------------------------- | ------------------- | ---------------------------------------- |
| Meta description                       | ✅ OK               | RAS                                      |
| Canonical                              | ❌ mauvaise syntaxe | `<meta>` → `<link rel="canonical">` (§1) |
| Open Graph (`og:title`, `og:image`...) | ❌ absentes         | À ajouter pour le partage social         |
| Twitter Card                           | ❌ absente          | Optionnel, facile à ajouter              |
| `hreflang`                             | —                   | Non applicable (site mono-langue)        |
| Slugs d'URL accentués                  | ℹ️ note             | Voir remarque ci-dessous                 |
| `robots.txt` / `sitemap.xml`           | ❓                  | Vérifier leur présence à la racine       |
| Cohérence titre / H1 / menu actif      | ⚠️ incohérence      | Voir détail ci-dessous                   |

**Note sur les slugs d'URL accentués** (`/à-propos`, `/mentions-légales`, `/confidentialité`,
`/accessibilité`, `/règlement-intérieur`) : l'ASCII reste la convention la plus répandue par souci de
compatibilité (partage de liens, anciens outils), mais ce n'est pas une contrainte technique dure — les
navigateurs gèrent nativement l'UTF-8 dans les URLs, et rien n'empêche de garder les accents comme choix
assumé d'identité linguistique. C'est un compromis à trancher selon vos priorités, pas un bug à corriger.

**Cohérence titre / H1 / menu actif** : le menu affiche "Accueil" en `aria-current="page"` alors que le
`<title>` et le H1 indiquent "L'association" — à vérifier, cela peut dérouter Google autant que les
visiteurs.

---

## 4. Accessibilité (RGAA) restant

- **Icônes décoratives sans `aria-hidden`** : les `<i class="ri-sun-line">`, `ri-computer-line`,
  `ri-moon-line` dans les boutons de thème n'ont pas `aria-hidden="true"`, alors que le bouton porte déjà
  un `aria-label` explicite. Sans `aria-hidden`, certains lecteurs d'écran peuvent tenter de lire l'icône
  (souvent silencieuse mais bonne pratique RGAA à formaliser) :

  ```html
  <i class="ri-sun-line" aria-hidden="true"></i>
  ```

  (Bon point : l'emoji 📆 dans "Agenda" a lui déjà `aria-hidden="true"` — juste à harmoniser partout.)

- **Attributs `width`/`height` absents sur toutes les images** (`<img src="robert-coelho-...">`, images
  des cards) → risque de **CLS (Cumulative Layout Shift)** au chargement, l'espace n'étant pas réservé
  avant que l'image ne soit chargée. À ajouter systématiquement, ou définir un `aspect-ratio` CSS fixe
  sur les conteneurs `.card__illustration` / `.hero__illustration`.
- **`data-credit-author`/`data-credit-source` vides** sur 2 images sur 3 (incohérence, pas un souci
  d'accessibilité mais de qualité de code — soit renseigner les crédits Unsplash partout, soit retirer
  ces attributs des images qui n'en ont pas besoin).
- Bon point à noter : les **liens d'évitement**, les `aria-labelledby` sur les `<section class="card">`,
  l'`aria-pressed` sur le sélecteur de thème, et le `alt` descriptif des images informatives sont **déjà
  bien faits** — le socle d'accessibilité est solide.

---

## 5. Performance

- **Multiples blocs `<style>` inline** générés par Astro pour chaque transition de vue
  (`view-transition-name` par élément) : c'est propre à l'usage des View Transitions d'Astro, cela
  alourdit un peu le poids du `<head>` mais reste mineur (quelques Ko). Pas d'action nécessaire sauf si
  le poids total du head devient significatif.
- **`loading="eager"` sur l'image hero** ✅ bon choix (LCP), **`loading="lazy"` sur les images de cards**
  ✅ également bon choix — seul manque : les dimensions explicites (`width`/`height`) pour éviter le CLS,
  comme noté ci-dessus.
- Le script de thème s'exécute de façon synchrone très tôt dans le `<head>`, ce qui est voulu pour
  **éviter le flash de thème (FOUC)** — bonne pratique, à conserver.

---

## Priorités classées

1. **Corriger la balise canonical** (`<meta>` → `<link rel="canonical">`) — actuellement inopérante
2. **Corriger les ID dupliqués `main-menu`** + réparer `aria-controls`
3. **Refaire le JSON-LD** avec le bon `@type` (`Organization`) et une adresse structurée
4. Ajouter `width`/`height` sur toutes les `<img>` pour stabiliser le CLS
5. Ajouter `aria-hidden="true"` sur les icônes décoratives des boutons de thème
6. Ajouter `aria-expanded` sur le bouton Menu
7. Ajouter les balises Open Graph pour le partage social
8. Vérifier la cohérence Titre / H1 / item de menu actif entre les pages
9. Trancher (sans urgence) la question des slugs accentués selon vos priorités
