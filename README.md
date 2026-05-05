# Brandon Hixson - Personal Portfolio

A personal portfolio website hosted on GitHub Pages at [aracnacon.github.io](https://aracnacon.github.io).

## Pages

- **Home** (`index.html`) - About me, skills, and introduction
- **Experience** (`experience.html`) - Professional work history
- **Projects** (`projects.html`) - Portfolio of projects
- **AracnaTech** (`aracnatech.html`) - AracnaTech business page
- **OpenTelemetry** (`opentelemetry.html`) - OpenTelemetry portfolio page
- **Marines** (`marines.html`) - US Marine Corps service story
- **Faith** (`faith.html`) - Faith and values
- **Contact** (`contact.html`) - Contact form and info
- **Web Compare** (`webcompare.html`) - Website comparison tool

## Features

- **Animated Splash Screen** - Full-screen SVG spider logo with independently pivoting arms/tools; electric circuit animation races around the inner body and powers up the outer body like a light bulb. Click to dismiss. All 5 theme colors cycle continuously on the spider every 4s with white-hot pulse spikes at each transition. Title "AracnaTech" and subtitle "Brandon Hixson" each have independent neon glow color cycles (10s and 13s respectively) with letter-by-letter wave animations: AracnaTech waves big (-22px), then Brandon Hixson follows after AracnaTech finishes — each wave fires once then holds for ~45s. Only shown on the home page (`index.html`) on load. A `splash-dev.html` page is available for development testing (always shows splash, no session gate).
- **Idle Screensaver** (`js/idle-splash.js`) - After 2 minutes of inactivity on any page, the full splash animation appears as a screensaver. Any mouse, keyboard, scroll, or touch event resets the countdown. Clicking dismisses it in place — no navigation, user stays on their current page. The 2-minute timer restarts after each dismiss.
- **Video Backgrounds** - Each theme plays a matching looping video background (desert, forest, arctic mountains, Miami nightlife, midnight circuit board). Arctic theme adds a progressive frost-overlay canvas effect that builds up over the video duration.
- **Nav "Try Me!" Prompts** - "Try Me!" text alternates fading in on the theme toggle and spider game nav buttons, drawing attention to them. Hidden on mobile. Both buttons use a filled primary color with pulsing glow animation.
- **Spider Logo Nav & Footer** - Themed static spider SVG (`images/icons/spider-{theme}.svg`) serves as the Home nav link on all pages and as a linked footer logo on every page, swapping automatically on theme change. Generated from `spiderTrace.svg` via `generate-spider-icons.js`. Browser tab favicon is `images/favicon.svg` — an animated SVG spider that cycles through all 5 theme neon colors (Midnight → Ember → Forest → Arctic → Miami) with white-hot pulse spikes at each 4s transition, matching the splash screen; falls back to the animated GIF on older browsers.
- **Crawling Spider Background** - A miniature SVG spider crawls every page with a walk-cycle animation and fully per-theme electric body: themed body fill, separate inner circuit body color, colored leg strokes, neon circuit glow, racing spark, and outer bulb flash — all unique per theme (Midnight: electric blue body; Ember: orange body/maroon inner/neon crimson bulb; Forest: neon green; Arctic: ice white; Miami: neon blue body/purple legs/purple bulb).
- **Spider Fire Fighter Game** (`spider-demo.html`) - Canvas-based mini-game: mouse/touch-guided spider shoots laser bolts to extinguish spreading fires while dodging falling Matrix code rain. Features a how-to-play start screen, back-to-home link, Web Audio API sound effects (auto-silenced after 7s on game over), 3 lives, score tracking, particle explosions, and full touch/mobile support (drag to move, tap to shoot).
- **SpiderShoes Checkout Simulation** (`opentelemetry.html`) - Interactive "Watch Telemetry in Action" demo: a spider shoe store (8-Leg Running Shoes with 4 shoe-print pairs, Silk-Grip Dress Shoes with 4 sock pairs, 8-Leg Rain Boots with 4 custom Wellington boot pair SVGs) where adding items to the cart and checking out generates real-time OTel signals. Displays live metrics (requests, errors, latency, error rate), an Availability SLO/SLI panel (99.5% target, error budget, canvas sparkline), and a Latency SLO/SLI panel (P95 < 300ms target, rolling P95 line, per-request latency bars). Three simulation toggles in the store panel — "Simulate stock error" (breaks availability SLO), "Simulate bad code" (NullPointerException trace with stack logs), and "Simulate high latency" (850ms full table scan, breaches latency SLO, log includes CREATE INDEX recommendation) — each with a properly aligned checkbox and label. Active trace panel with expandable span details and scrollable log stream — all expandable via flicker-free magnifying-glass modals. Watch Demo button auto-plays the full flow. All product icons theme-colored. 100% client-side, no backend required.
- **Theme Switcher** - 5 visual themes (Midnight, Ember, Forest, Arctic, Miami) each with unique video background, fonts, colors, component styling, animated profile photo border (rotating conic-gradient with theme-matched halos and glow), and per-theme nav hover glow.
- **Typewriter Effect** - Animated subtitle text on each page.
- **Scroll Animations** - GSAP-powered reveal animations on scroll.
- **Open Graph / Twitter Cards** - Social media metadata for link previews.
- **Responsive Design** - Mobile-friendly layout.

## Tech Stack

- HTML, CSS, JavaScript
- [GSAP](https://greensock.com/gsap/) + ScrollTrigger for animations
- [Font Awesome](https://fontawesome.com/) for icons
- Google Fonts
- GitHub Pages for hosting

## Project Structure

```
├── css/style.css          # Main stylesheet with theme support
├── js/
│   ├── theme-switcher.js  # Theme cycling logic
│   ├── video-bg.js        # Theme video backgrounds + Arctic frost canvas
│   ├── nav-bubbles.js     # "Try Me!" nav prompt labels
│   ├── typewriter.js      # Typewriter text animation
│   ├── scroll-animations.js # GSAP scroll-triggered reveals
│   ├── skills.js          # Skills section functionality
│   ├── spider-bg.js       # Crawling spider background element
│   └── splash.js          # Animated splash screen logic
├── videos/                # Theme background videos
├── images/
│   ├── profile/           # Profile photos
│   ├── backgrounds/       # Theme background images
│   └── screenshots/       # Project screenshots
├── data/                  # Data files
└── *.html                 # Site pages
```
