'use strict';

async function init() {
  const [genData, speciesData] = await Promise.all([
    apiFetch('/generation?limit=100'),
    apiFetch('/pokemon-species?limit=2000'),
  ]);

  const sel = $('sel-gen');
  genData.results.forEach((g, i) => sel.add(new Option(`Geração ${ROMANS[i] ?? i+1}`, g.url)));

  globalPoke = speciesData.results
    .map(s => ({ name: s.name, id: idFrom(s.url) }))
    .sort((a, b) => a.id - b.id);

  sel.onchange            = onGenChange;
  $('sel-game').onchange  = onGameChange;
  $('inp-search').oninput = renderList;

  renderTeamBar();
  showHome();
}

init().catch(e => {
  console.error(e);
  $('poke-list').innerHTML = '<div class="empty-msg">Erro ao conectar com a PokéAPI.</div>';
});
