# devashribuilders — Real Estate Website (Static)

## Original problem statement
Create a modern, professional real estate website with 3D animation, built with **HTML/CSS/JS + Bootstrap** (user-mandated tech stack). Six pages required: index, projects, about, gallery, contact, blog. Must include modern animations across hero, scroll, hamburger menu, images, etc.

## User choices captured
- Brand: **devashribuilders** (no tagline)
- Theme: **Modern warm — off-white + emerald/sage accent**
- Property images: high-quality stock images from Unsplash
- Contact details: realistic placeholder data
- Tech stack: HTML5, CSS3, vanilla JavaScript, Bootstrap 5 CDN, Three.js for 3D, AOS for scroll animations
- Static delivery (no backend / frontend-only form validation)

## Architecture
- All static files served from `/app/frontend/public/` via the existing CRA dev-server (frontend container).
- React App.js intentionally returns `null` so the React bundle is a no-op; the static HTML in `public/` renders directly.
- Pages: `index.html`, `projects.html`, `about.html`, `gallery.html`, `contact.html`, `blog.html`
- Shared assets: `public/css/style.css`, `public/js/main.js`, `public/js/three-bg.js`

## Design system
- Palette: `#f6f4ee` warm off-white · `#1f5d43` emerald · `#9fb8a5` sage · `#14241b` deep forest ink · `#b4894a` gold accent
- Typography: **Fraunces** (display serif) + **Manrope** (sans)
- Components: pill buttons, soft cards, ::before circle accents, asymmetric grid layouts

## Implemented (Feb 2026)
- **Three.js 3D hero** — floating icosahedron/torus/octahedron/box/torusKnot/tetrahedron + 320-point particle field with mouse parallax & scroll-driven camera
- **AOS scroll animations** — fade-up, zoom-in across sections
- **Navbar** — sticky shrink-on-scroll, animated active-page indicator dot, hamburger mobile drawer with staggered link reveal
- **Hero** — word-by-word rise animation, kicker label, 3-stat side panel, scroll cue
- **Projects** — featured grid on home (4 cards, varying spans) + full listing with category filters (Residential/Commercial/Luxury) + corridor map section
- **About** — story split-layout, animated counters (26 / 42 / 3,200+ / 71%), 5-step timeline with hover dots, 3-value asymmetric grid, 6-person leadership grid
- **Gallery** — 12-image masonry (columns) with category filter (Exteriors/Interiors/Amenities/Details), full lightbox modal with prev/next/ESC keyboard nav
- **Contact** — validated form (name/phone/email/city/budget/message) with inline error states & success toast, 3 phone numbers, 3 office cards, founder direct line
- **Blog** — 6 essays with category filter (Materials/Design/City/Craft) + live search box with empty state
- **Footer** — 4-column grid with newsletter signup (validated)
- **UX details** — scroll progress bar, scroll-to-top FAB, lazy image fade-in, custom hover micro-animations on every card

## Tested (visual)
- All 6 pages render correctly with proper theming & typography
- Three.js animation renders on home
- Contact form invalid → shows red borders + errors; valid submission → success message
- Project category filter works (Luxury filter tested)
- Gallery lightbox opens on image click
- Mobile drawer (hamburger) wired

## Backlog
- **P1**: Optional contact form backend (currently frontend-only — submissions don't go anywhere)
- **P1**: Individual project detail pages (currently all cards link to listing)
- **P2**: Individual blog post pages
- **P2**: Real map embed in projects corridor section
- **P2**: SEO meta tags & sitemap.xml
- **P2**: Open Graph / Twitter card images
