# VAS Ayurvedic Clinic — design review copy

Static copy of three pages of https://vasayurvedicclinic.com/ (captured 6 Nov 2026 at 1440px),
annotated with design problems only: Home, About Us, the Shirodhara treatment page, and one blog post (Ayurvedic Detox Treatment in Dubai).

This is a review copy, not the official website. It is set to `noindex` for search engines.

- `pages/` — the four copied pages with the annotation layer
- `audit/` — annotation overlay (notes, panel, toolbar)
- `css/`, `assets/` — captured stylesheets, fonts and images (hero video compressed to 720p for web)

Deploy: import this repository in Vercel as a static site (Framework preset: Other, no build command,
output directory = repository root). `/` redirects to `/pages/home.html`.
