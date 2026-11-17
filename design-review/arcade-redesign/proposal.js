(() => {
  const cards=[...document.querySelectorAll('.game-card')];
  const filters=[...document.querySelectorAll('.filter')];
  const search=document.querySelector('#search');
  const count=document.querySelector('#result-count');
  const empty=document.querySelector('#empty-state');
  let category='all';
  function update(){const q=search.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&card.dataset.search.includes(q);card.hidden=!visible;if(visible)shown++});filters.forEach(button=>{const selected=button.dataset.filter===category;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});count.textContent=`SHOWING ${shown===cards.length?'ALL ':''}${String(shown).padStart(2,'0')} ${shown===1?'GAME':'GAMES'}`;empty.hidden=shown!==0}
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;update()}));
  search.addEventListener('input',update);
  document.querySelector('#clear-search').addEventListener('click',()=>{category='all';search.value='';update();search.focus()});
  function random(){const visible=cards.filter(card=>!card.hidden);const pool=visible.length?visible:cards;pool[Math.floor(Math.random()*pool.length)].querySelector('a').click()}
  document.querySelector('#random-game').addEventListener('click',random);document.querySelector('#hero-random').addEventListener('click',random);
})();
