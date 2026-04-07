fetch('data/skills.json')
  .then(res => res.json())
  .then(categories => {
    const grid = document.querySelector('.hex-grid');
    if (!grid) return;

    grid.innerHTML = categories.map(cat => `
      <div class="hex-group ${cat.color}">
        <h3 class="hex-label">${cat.name}</h3>
        <div class="hex-row">
          ${cat.skills.map(s => `
            <a href="${s.url}" target="_blank" class="hex">
              <i class="${s.icon}"></i>
              <span>${s.name}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');
  });
