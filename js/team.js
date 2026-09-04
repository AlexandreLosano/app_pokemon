'use strict';

function addToTeam() {
  if (team.length >= 6 || !activeForms.length) return;
  const form  = activeForms[activeFormIdx];
  const label = formLabel(form, activePoke);
  if (team.some(t => t.speciesName === activePoke && t.label === label)) return;

  team.push({
    speciesName: activePoke,
    speciesId:   activePokeId,
    label,
    art:    form.art,
    sprite: form.sprite,
    types:  form.types,
    eff:    form.eff,
  });

  renderTeamBar();
  const wrap = document.querySelector('.add-team-wrap');
  if (wrap) wrap.innerHTML = teamBtnHTML(form, activePoke);
}

async function addToTeamFromList(event, name, id) {
  event.stopPropagation();
  if (team.some(t => t.speciesName === name) || team.length >= 6) return;

  const btn = event.currentTarget;
  btn.disabled = true;
  btn.classList.add('loading');
  btn.textContent = '…';

  try {
    const species    = await apiFetch(`/pokemon-species/${id}`);
    const defVariety = species.varieties.find(v => v.is_default) || species.varieties[0];
    const poke       = await apiFetch(defVariety.pokemon.url);

    const typeNames = poke.types.map(t => t.type.name);
    const typeData  = await Promise.all(typeNames.map(t => apiFetch(`/type/${t}`)));
    const typeMap   = Object.fromEntries(typeNames.map((t, i) => [t, typeData[i]]));

    const apiArt    = poke.sprites?.other?.['official-artwork']?.front_default || null;
    const apiSprite = poke.sprites?.front_default || null;

    team.push({
      speciesName: name,
      speciesId:   id,
      label:       'Padrão',
      art:         apiArt || apiSprite || artUrl(id),
      sprite:      apiSprite || spriteUrl(id),
      types:       typeNames,
      eff:         computeEff(typeNames.map(t => typeMap[t])),
    });

    renderTeamBar();
    if (viewMode === 'team') renderTeamView();
    btn.classList.remove('loading');
    btn.classList.add('in-team');
    btn.textContent = '✓';
    btn.title = 'No time';

    if (team.length >= 6) {
      document.querySelectorAll('.list-add-btn:not(.in-team)').forEach(b => {
        b.disabled = true;
        b.title = 'Time cheio';
      });
    }

    if (activePoke === name) {
      const wrap = document.querySelector('.add-team-wrap');
      if (wrap) wrap.innerHTML = teamBtnHTML(activeForms[activeFormIdx], name);
    }
  } catch(e) {
    console.error(e);
    btn.classList.remove('loading');
    btn.disabled    = false;
    btn.textContent = '+';
    btn.title = 'Erro — tente novamente';
  }
}

function removeFromTeam(idx) {
  const removed = team[idx];
  team.splice(idx, 1);
  renderTeamBar();

  const listBtn = $(`lab-${removed.speciesId}`);
  if (listBtn) {
    listBtn.classList.remove('in-team');
    listBtn.disabled    = false;
    listBtn.textContent = '+';
    listBtn.title       = 'Adicionar ao time';
  }

  if (team.length === 5) {
    document.querySelectorAll('.list-add-btn:not(.in-team)').forEach(b => {
      b.disabled = false;
      b.title = 'Adicionar ao time';
    });
  }

  if (viewMode === 'team') {
    renderTeamView();
  } else if (activePoke) {
    const wrap = document.querySelector('.add-team-wrap');
    if (wrap) wrap.innerHTML = teamBtnHTML(activeForms[activeFormIdx], activePoke);
  }
}

function clearTeam() {
  team = [];
  renderTeamBar();
  showExplorerView();
}

function renderTeamBar() {
  const badge = $('team-badge');
  badge.textContent = `${team.length}/6`;
  badge.className   = `team-count-badge${team.length ? ' has-members' : ''}`;
  $('team-ver-btn').disabled = team.length === 0;

  const slots = [...team];
  while (slots.length < 6) slots.push(null);
  $('team-slots').innerHTML = slots.map((t, i) => t
    ? `<div class="t-slot filled" onclick="removeFromTeam(${i})" title="${titleCase(t.speciesName)}${t.label !== 'Padrão' ? ' — '+t.label : ''}">
         <img src="${t.sprite}" alt="${t.speciesName}"
              onerror="this.onerror=null;this.src='${t.art}'">
       </div>`
    : `<div class="t-slot"></div>`
  ).join('');
}

function showTeamView() {
  viewMode = 'team';
  $('content').classList.remove('home-mode');
  $('content').classList.add('team-mode');
  renderTeamView();
}

function showExplorerView() {
  viewMode = 'explorer';
  $('content').classList.remove('team-mode');
  $('content').classList.remove('home-mode');
  if (activePoke && activePokeId && activeForms.length) {
    renderCard(activePoke, activePokeId);
  } else {
    setContent(`<div class="placeholder">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="white" stroke="#30363d" stroke-width="4"/>
        <path d="M4 50 H96" stroke="#30363d" stroke-width="5"/>
        <path d="M4 50 Q4 4 50 4 Q96 4 96 50 Z" fill="#e63946"/>
        <circle cx="50" cy="50" r="15" fill="white" stroke="#30363d" stroke-width="6"/>
      </svg>
      <p>Selecione um Pokémon para ver seus detalhes</p>
    </div>`);
  }
}

function renderTeamView() {
  function badge(tp, label) {
    return `<span class="tv-tbadge" style="background:${TYPE_COLORS[tp]}">
      <span>${titleCase(tp)}</span><span class="tv-mult">${label}</span>
    </span>`;
  }

  const cols = team.map((t, i) => {

    const { weak, str: res, imm } = groupEff(t.eff);
    const normal = ALL_TYPES.filter(tp => t.eff[tp] === 1);

    const weakBadges   = weak.map(tp => badge(tp, `×${t.eff[tp]}`)).join('') || `<span class="tv-none">—</span>`;
    const normalBadges = normal.map(tp => badge(tp, '×1')).join('')           || `<span class="tv-none">—</span>`;
    const resBadges    = res.map(tp => badge(tp, t.eff[tp] <= 0.25 ? '¼×' : '½×')).join('') || `<span class="tv-none">—</span>`;
    const immBadges    = imm.map(tp => badge(tp, '×0')).join('');

    return `
      <div class="tv-col">
        <button class="tv-remove" onclick="removeFromTeam(${i})" title="Remover">✕</button>
        <div class="tv-col-top">
          <img src="${t.art}" alt="${t.speciesName}"
               onerror="this.onerror=null;this.src='${t.sprite}'">
          <div class="tv-poke-name">${titleCase(t.speciesName)}</div>
          ${t.label !== 'Padrão' ? `<div class="tv-poke-form">${t.label}</div>` : ''}
          <div class="tv-type-pips">
            ${t.types.map(tp => `<div class="tv-type-pip" style="background:${TYPE_COLORS[tp]}" title="${titleCase(tp)}"></div>`).join('')}
          </div>
        </div>
        <div class="tv-sections">
          <div class="tv-section">
            <div class="tv-sec-label lbl-weak">Fraco para:</div>
            <div class="tv-badges">${weakBadges}</div>
          </div>
          <div class="tv-section">
            <div class="tv-sec-label" style="color:var(--text)">Dano normal:</div>
            <div class="tv-badges">${normalBadges}</div>
          </div>
          <div class="tv-section">
            <div class="tv-sec-label lbl-adv">Resistente a:</div>
            <div class="tv-badges">${resBadges}</div>
          </div>
          ${immBadges ? `<div class="tv-section">
            <div class="tv-sec-label lbl-imm">Imune para:</div>
            <div class="tv-badges">${immBadges}</div>
          </div>` : ''}
        </div>
      </div>`;
  }).join('');

  setContent(`
    <div class="team-view">
      <div class="tv-header">
        <button class="tv-back" onclick="showExplorerView()">← Voltar</button>
        <span class="tv-title">Análise do Time (${team.length}/6)</span>
        ${team.length ? `<button class="tv-clear" onclick="clearTeam()">Limpar</button>` : ''}
      </div>
      <div class="tv-columns" style="grid-template-columns:repeat(${team.length},1fr)">${cols}</div>
    </div>`);

  $('content').classList.add('team-mode');
}
