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

- **Animated Splash Screen** - Full-screen SVG spider logo with independently pivoting arms/tools; electric circuit animation races around the inner body and powers up the outer body like a light bulb. Auto-dismisses after 3 seconds (or click to dismiss early). Shows only on first visit or after 2 minutes of inactivity.
- **Video Backgrounds** - Each theme plays a matching looping video background (desert, forest, arctic mountains, Miami nightlife, midnight circuit board). Arctic theme adds a progressive frost-overlay canvas effect that builds up over the video duration.
- **Nav "Try Me!" Prompts** - "Try Me!" text alternates fading in on the theme toggle and spider game nav buttons, drawing attention to them. Hidden on mobile. Both buttons use a filled primary color with pulsing glow animation.
- **Spider Logo Nav & Footer** - Themed static spider SVG (`images/icons/spider-{theme}.svg`) serves as the Home nav link on all pages and as a linked footer logo on every page, swapping automatically on theme change. Generated from `spiderTrace.svg` via `generate-spider-icons.js`. Browser tab favicon remains the animated GIF.
- **Crawling Spider Background** - A miniature SVG spider crawls every page with a walk-cycle animation and fully per-theme electric body: themed body fill, separate inner circuit body color, colored leg strokes, neon circuit glow, racing spark, and outer bulb flash — all unique per theme (Midnight: electric blue body; Ember: orange body/maroon inner/neon crimson bulb; Forest: neon green; Arctic: ice white; Miami: neon blue body/purple legs/purple bulb).
- **Spider Fire Fighter Game** (`spider-demo.html`) - Canvas-based mini-game: mouse-guided spider shoots laser bolts to extinguish spreading fires while dodging falling Matrix code rain. Features a how-to-play start screen, back-to-home link, Web Audio API sound effects (auto-silenced after 7s on game over), 3 lives, score tracking, and particle explosions.
- **SpiderShoes Checkout Simulation** (`opentelemetry.html`) - Interactive "Watch Telemetry in Action" demo: a spider shoe store (8-Leg Running Shoes, Silk-Grip Dress Shoes, Waterproof Web Boots) where adding pairs to the cart and checking out generates real-time OTel signals. Displays live metrics (requests, errors, latency, error rate), an active trace panel with expandable span details, and a scrollable log stream — all expandable via magnifying-glass modals. Includes a "Simulate stock error" toggle and a "Simulate bad code" toggle. 100% client-side, no backend required.
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
