(() => {
  const cards = [...document.querySelectorAll('.game-card')];
  const filters = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#search');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  let category = 'all';
  let recent = '';
  try { recent = localStorage.getItem('grapegames-last-played') || ''; } catch (_) { /* Storage is optional. */ }
  function update() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const visible = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(query);
      card.hidden = !visible;
      if (visible) shown++;
    });
    filters.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    count.textContent = `SHOWING ${shown === cards.length ? 'ALL ' : ''}${String(shown).padStart(2, '0')} ${shown === 1 ? 'GAME' : 'GAMES'}`;
    empty.hidden = shown !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  search.addEventListener('input', update);
  document.querySelector('#reset-filters').addEventListener('click', () => { category = 'all'; search.value = ''; update(); search.focus(); });
  document.querySelectorAll('.play-link').forEach(link => link.addEventListener('click', () => {
    try { localStorage.setItem('grapegames-last-played', link.dataset.game); } catch (_) { /* Playing does not depend on storage. */ }
  }));
  document.querySelector('#random-game').addEventListener('click', () => {
    const choices = cards.filter(card => card.dataset.id !== recent);
    const pool = choices.length ? choices : cards;
    const card = pool[Math.floor(Math.random() * pool.length)];
    card.querySelector('.play-link').click();
  });
  if (recent) {
    const card = cards.find(item => item.dataset.id === recent);
    if (card) {
      const label = document.createElement('span');
      label.className = 'spooky';
      label.textContent = ' / LAST PLAYED';
      card.querySelector('.category').append(label);
    }
  }
})();
