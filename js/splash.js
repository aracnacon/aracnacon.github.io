(function () {
  const style = document.createElement('style');
  style.textContent = `
    #splash-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: none;
      transition: opacity 1.4s ease-out, filter 1.4s ease-out;
    }
    #splash-screen.dissolve {
      opacity: 0;
      filter: blur(12px);
      pointer-events: none;
    }
    #splash-screen img {
      width: 224px;
      height: 224px;
      animation: splash-dangle 5s ease-in-out infinite;
    }
    #splash-screen .splash-title {
      margin-top: 2rem;
      font-family: 'Courier New', monospace;
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 300;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.3);
    }
    #splash-screen .splash-subtitle {
      margin-top: 0.75rem;
      font-family: 'Courier New', monospace;
      font-size: clamp(1rem, 3vw, 1.5rem);
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.2);
    }
    @keyframes splash-dangle {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25%       { transform: translateY(6px) rotate(0.5deg); }
      75%       { transform: translateY(-4px) rotate(-0.5deg); }
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <img src="images/spider-bw.png" alt="AracnaTech" />
    <span class="splash-title">AracnaTech</span>
    <span class="splash-subtitle">Brandon Hixson</span>
  `;
  document.body.prepend(splash);

  let gone = false;
  function dissolve() {
    if (gone) return;
    gone = true;
    splash.classList.add('dissolve');
    setTimeout(() => splash.remove(), 1400);
  }

  document.addEventListener('mousemove', dissolve);
  document.addEventListener('mousedown', dissolve);
  document.addEventListener('keydown', dissolve);
  document.addEventListener('touchstart', dissolve);
})();
