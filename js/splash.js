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
      transition: all 1400ms ease-out;
    }
    #splash-screen.dissolve {
      opacity: 0;
      filter: blur(16px);
      pointer-events: none;
    }
    #splash-screen img {
      width: 14rem;
      height: 14rem;
      border-radius: 0;
      border: none;
      box-shadow: none;
    }
    #splash-screen .splash-title {
      margin-top: 2rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.3);
    }
    #splash-screen .splash-subtitle {
      margin-top: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.2);
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

  splash.addEventListener('mousemove', dissolve);
})();
