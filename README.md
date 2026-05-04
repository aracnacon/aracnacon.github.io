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

- **Animated Splash Screen** - Full-screen SVG spider logo with independently pivoting arms/tools and tool cutouts (screen, gear hole, briefcase clasp); electric circuit animation races around the inner body and powers up the outer body like a light bulb (loops until mouse move dissolves the screen). Shows only on first visit or after 2 minutes of inactivity.
- **Crawling Spider Background** - A miniature version of the SVG spider crawls around every page with a walk-cycle animation and electric body effect
- **Spider Fire Fighter Game** (`spider-demo.html`) - Canvas-based mini-game: mouse-guided spider shoots laser bolts to extinguish spreading fires while dodging falling Matrix code rain. Features Web Audio API sound effects, 3 lives, score with distance-based points, matrix column kill bonuses, and particle explosions
- **Theme Switcher** - Multiple visual themes with custom backgrounds, fonts, icon sets, and profile image borders
- **Typewriter Effect** - Animated subtitle text on each page
- **Scroll Animations** - GSAP-powered reveal animations on scroll
- **Open Graph / Twitter Cards** - Social media metadata for link previews
- **Responsive Design** - Mobile-friendly layout

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
│   ├── typewriter.js      # Typewriter text animation
│   ├── scroll-animations.js # GSAP scroll-triggered reveals
│   ├── skills.js          # Skills section functionality
│   ├── spider-bg.js       # Crawling spider background element
│   └── splash.js          # Animated splash screen logic
├── images/
│   ├── profile/           # Profile photos
│   ├── backgrounds/       # Theme background images
│   └── screenshots/       # Project screenshots
├── data/                  # Data files
└── *.html                 # Site pages
```
