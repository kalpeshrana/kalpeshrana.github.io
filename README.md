# Kalpesh Rana — Portfolio

Static one-page site. HTML, CSS and ~200 lines of vanilla JS. No build step, no dependencies. Works on GitHub Pages as-is.

```
/
├── index.html
├── css/style.css
├── js/main.js            ← CONFIG block at the top
├── assets/
│   ├── projects/         ← project screenshots
│   ├── images/           ← portrait + og-image
│   └── icons/
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo (for a user site, name it `<username>.github.io`).
2. Push these files to the `main` branch root.
3. Repo → **Settings → Pages → Build and deployment** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Live at `https://<username>.github.io/` in about a minute.

**Custom domain:** add a `CNAME` file containing your domain (e.g. `kalpeshrana.com`), point DNS to GitHub Pages, then tick *Enforce HTTPS* in Settings → Pages.

## What to replace

| What | Where |
|---|---|
| Email | `js/main.js` → `CONFIG.email`. Also search and replace `connect@cloudpixelinfotech.com` in `index.html` (fallback links and JSON-LD). |
| LinkedIn / GitHub | `js/main.js` → `CONFIG.linkedin`, `CONFIG.github`. Blank = link hidden everywhere. |
| WhatsApp | `js/main.js` → `CONFIG.whatsapp` (digits only, with country code, e.g. `919876543210`). Blank = hidden. |
| Contact form | `CONFIG.formspree` blank = opens visitor's email app (mailto). Paste a Formspree endpoint to post directly instead. |
| Project screenshots | `assets/projects/` — filenames listed in `assets/projects/README.txt`. Placeholders show until a file exists. |
| Portrait | `assets/images/portrait.webp` (640×800). Initials show until it exists. |
| Testimonials | `js/main.js` → `CONFIG.testimonials`. The Client Feedback section stays hidden until you add at least one. Preview the layout with `/?preview=testimonials`. |
| Domain / canonical | Search and replace `YOUR-DOMAIN.com` in `index.html` (canonical, Open Graph, JSON-LD), `robots.txt` and `sitemap.xml`. |
| Social preview | Replace `assets/images/og-image.png` (1200×630). |

## Content rules followed

No invented clients, statistics, testimonials, results or years of experience. Case study outcomes read "Project outcome details available on request." until you have approved figures to publish. Project categories and one-line descriptions are neutral, so edit them freely.

## Pre-launch checklist

- [ ] Replace `YOUR-DOMAIN.com` everywhere
- [ ] Add screenshots and portrait
- [ ] Set LinkedIn / WhatsApp / GitHub
- [ ] Test the contact form once (mailto or Formspree)
- [ ] Run Lighthouse on the live URL
- [ ] Check the social preview with the LinkedIn Post Inspector
