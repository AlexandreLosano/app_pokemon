'use strict';

async function onGenChange() {
  const url = $('sel-gen').value;
  $('sel-game').innerHTML = '<option value="">Todos os jogos</option>';
  $('sel-game').disabled  = true;
  $('inp-search').value   = '';
  $('list-header').style.display = 'none';
  allPoke = []; shownPoke = []; activePoke = null;

  if (!url) {
    setList('<div class="empty-msg" style="margin-top:20px">Selecione uma geração<br>ou busque um Pokémon</div>');
    return;
  }
  setList(spinnerHTML());

  const gen = await apiFetch(url);
  const gs  = $('sel-game');
  gen.version_groups.forEach(vg => gs.add(new Option(titleCase(vg.name), vg.url)));
  gs.disabled = false;

  allPoke   = gen.pokemon_species.map(s => ({ name: s.name, id: idFrom(s.url) })).sort((a, b) => a.id - b.id);
  shownPoke = [...allPoke];
  renderList();
  renderGameGrid();
}

async function onGameChange() {
  const url = $('sel-game').value;
  $('inp-search').value = '';

  if (!url) { shownPoke = [...allPoke]; renderList(); renderGameGrid(); return; }
  setList(spinnerHTML());

  try {
    const vg    = await apiFetch(url);
    const dexes = await Promise.all(vg.pokedexes.map(p => apiFetch(p.url)));
    const names = new Set();
    dexes.forEach(d => d.pokemon_entries.forEach(e => names.add(e.pokemon_species.name)));
    shownPoke = allPoke.filter(p => names.has(p.name));
  } catch(e) {
    console.warn('Pokédex do jogo falhou, exibindo todos:', e);
    shownPoke = [...allPoke];
  }
  renderList();
  renderGameGrid();
}

function renderList() {
  const q      = $('inp-search').value.toLowerCase().trim();
  const genSel = $('sel-gen').value;

  if (!genSel) {
    if (q.length < 2) {
      $('list-header').style.display = 'none';
      setList('<div class="empty-msg" style="margin-top:20px">Selecione uma geração<br>ou busque um Pokémon</div>');
      return;
    }
    const hits = globalPoke.filter(p => p.name.includes(q));
    $('list-header').style.display = 'block';
    $('list-count').textContent    = `(${hits.length})`;
    if (!hits.length) { setList('<div class="empty-msg">Nenhum Pokémon encontrado</div>'); return; }
    setList(hits.map(p => pokeItemHTML(p)).join(''));
    return;
  }

  const items = q ? shownPoke.filter(p => p.name.includes(q)) : shownPoke;
  $('list-header').style.display = 'block';
  $('list-count').textContent    = `(${items.length})`;
  if (!items.length) { setList('<div class="empty-msg">Nenhum Pokémon encontrado</div>'); return; }
  setList(items.map(p => pokeItemHTML(p)).join(''));
}

function pokeItemHTML(p) {
  const inTeam = team.some(t => t.speciesName === p.name);
  const isFull = !inTeam && team.length >= 6;
  return `
    <div class="poke-item${p.name === activePoke ? ' active' : ''}"
         onclick="selectPoke('${p.name}',${p.id})">
      <span class="poke-num">#${String(p.id).padStart(3,'0')}</span>
      <span class="poke-name">${titleCase(p.name)}</span>
      <button class="list-add-btn${inTeam ? ' in-team' : ''}"
              id="lab-${p.id}"
              onclick="addToTeamFromList(event,'${p.name}',${p.id})"
              title="${inTeam ? 'No time' : isFull ? 'Time cheio' : 'Adicionar ao time'}"
              ${inTeam || isFull ? 'disabled' : ''}>${inTeam ? '✓' : '+'}</button>
    </div>`;
}
