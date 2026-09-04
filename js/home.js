'use strict';

function gameTitle(slug) {
  const parts = slug.split('-');
  const cap   = parts.map(w => /^\d+$/.test(w) ? w : w[0].toUpperCase() + w.slice(1));
  if (parts.length === 2 && !/^\d+$/.test(parts[0]) && !/^\d+$/.test(parts[1]))
    return cap.join(' / ');
  if (parts.length === 4 && /^\d+$/.test(parts[1]) && /^\d+$/.test(parts[3]))
    return `${cap[0]} ${cap[1]} / ${cap[2]} ${cap[3]}`;
  return cap.join(' ');
}

async function showHome() {
  viewMode = 'home';
  $('content').classList.remove('team-mode');
  $('content').classList.add('home-mode');
  setContent(spinnerHTML());

  try {
    const genData = await apiFetch('/generation?limit=100');
    const gens    = await Promise.all(genData.results.map(g => apiFetch(g.url)));

    const COLS = 3;
    let rowsHTML = '';
    for (let i = 0; i < gens.length; i += COLS) {
      const slice = gens.slice(i, i + COLS);
      const cardsHTML = slice.map((gen, j) => {
        const idx       = i + j;
        const roman     = ROMANS[idx] ?? idx + 1;
        const genUrl    = genData.results[idx].url;
        const gameCount = gen.version_groups.length;
        const games     = gen.version_groups.map(vg => `
          <div class="home-game-card" onclick="selectGame('${genUrl}','${vg.url}')">
            ${gameTitle(vg.name)}
          </div>`).join('');
        return `
          <div class="home-gen" style="flex:${gameCount}">
            <div class="home-gen-label">
              <span class="home-gen-tag">Gen</span>
              <span class="home-gen-num">${roman}</span>
            </div>
            <div class="home-games">${games}</div>
          </div>`;
      }).join('');
      rowsHTML += `<div class="home-gen-row">${cardsHTML}</div>`;
    }

    setContent(`
      <div class="home-view">
        <div class="home-heading">Escolha um Jogo</div>
        <div class="home-gens">${rowsHTML}</div>
      </div>`);
  } catch(e) {
    setContent('<div class="loading">Erro ao carregar jogos.</div>');
    console.error(e);
  }
}

async function selectGame(genUrl, vgUrl) {
  $('sel-gen').value = genUrl;
  await onGenChange();
  $('sel-game').value = vgUrl;
  await onGameChange();
}

function renderGameGrid() {
  if (!shownPoke.length) return;

  const selGame = $('sel-game');
  const selGen  = $('sel-gen');
  const label   = selGame.value
    ? selGame.options[selGame.selectedIndex]?.text
    : selGen.options[selGen.selectedIndex]?.text || '';

  const items = shownPoke.map(p => `
    <div class="gg-item" onclick="selectPoke('${p.name}',${p.id})">
      <img src="${artUrl(p.id)}" alt="${p.name}" loading="lazy"
           onerror="this.onerror=null;this.src='${spriteUrl(p.id)}'">
      <div class="gg-num">#${String(p.id).padStart(3,'0')}</div>
      <div class="gg-name">${titleCase(p.name)}</div>
    </div>`).join('');

  viewMode = 'explorer';
  $('content').classList.remove('team-mode');
  $('content').classList.remove('home-mode');
  setContent(`
    <div class="gg-wrap">
      <div class="gg-header">${label} <span>${shownPoke.length} Pokémon</span></div>
      <div class="gg-grid">${items}</div>
    </div>`);
}
