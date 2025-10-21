# PT Digital Nusantara Group — Landing Page (Vite + Bootstrap 5)

A static corporate landing page for **PT Digital Nusantara Group**, built with **Vite (Vanilla JS)** and **Bootstrap 5 (CDN)**.  
It includes a hero, about, subsidiaries, services, why us, partners carousel, contact form, and footer—plus scroll animations, smooth anchors, and simple form validation.

## Tech Stack

- Vite (vanilla JavaScript, no frameworks)
- Bootstrap 5 via CDN
- Bootstrap Icons via CDN

## Project Structure

project/
├── index.html
├── main.js
├── /assets/
│ ├── /img/ # logo-mark.svg, hero-bg.jpg, subsidiary logos, og-cover.jpg
│ ├── /icons/ # favicon.ico
│ └── /partners/ # partner-1.png ... partner-8.png (placeholders)
└── /styles/ # (optional) custom.css if you decide to externalize styles

## Getting Started

1. **Create a Vite app (vanilla)**

   ```bash
   npm create vite@latest digital-nusantara-landing -- --template vanilla
   cd digital-nusantara-landing
   Copy files

   ```

2. Replace the generated index.html and main.js with the files from this repo.

Create the /assets folders and add placeholder images:

/assets/img/logo-mark.svg

/assets/img/hero-bg.jpg

/assets/img/reka-logo.svg, /assets/img/orcha-logo.svg, /assets/img/pheonex-logo.svg

/assets/img/og-cover.jpg

/assets/icons/favicon.ico

/assets/partners/partner-1.png … /assets/partners/partner-8.png

3. Install & run

npm install
npm run dev

The dev server URL will be shown in your terminal (usually http://localhost:5173).

4. Build for production

npm run build
npm run preview

Notes

All animations and form validation are implemented in main.js.

Schema.org Organization JSON-LD is embedded in index.html for SEO & AI parsing.

No React/Vue/Svelte or non-Bootstrap CSS frameworks are used.
