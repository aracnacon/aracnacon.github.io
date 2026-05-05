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
- **Nav "Try Me!" Prompts** - "Try Me!" text alternates fading in on the theme toggle and spider game nav buttons, drawing attention to them. Hidden on mobile.
- **Crawling Spider Background** - A miniature version of the SVG spider crawls around every page with a walk-cycle animation and electric body effect.
- **Spider Fire Fighter Game** (`spider-demo.html`) - Canvas-based mini-game: mouse-guided spider shoots laser bolts to extinguish spreading fires while dodging falling Matrix code rain. Features a how-to-play start screen, back-to-home link, Web Audio API sound effects (auto-silenced after 7s on game over), 3 lives, score tracking, and particle explosions.
- **Live Trace Explorer** (`opentelemetry.html`) - Interactive Jaeger-style distributed trace viewer with 3 pre-loaded realistic traces (checkout flow, user profile, error scenario). Select a trace to render a color-coded Gantt span timeline; click any span to inspect its full OTel attributes. 100% client-side, no backend required.
- **Theme Switcher** - 5 visual themes (Midnight, Ember, Forest, Arctic, Miami) each with unique video background, fonts, colors, and component styling.
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
