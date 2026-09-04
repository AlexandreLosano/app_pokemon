'use strict';

// ── Helpers de renderização ──

function effItems(types, eff) {
  return types.map(t => `
    <div class="eff-item">
      <span class="eff-type">
        <span class="type-dot" style="background:${TYPE_COLORS[t]}"></span>
        ${titleCase(t)}
      </span>
      <span class="eff-mult">${eff[t]}×</span>
    </div>`).join('');
}

function effGridHTML(weak, str, imm, eff) {
  return `
    <div class="eff-card weakness">
      <div class="eff-title">⚠ Fraqueza</div>
      <div class="eff-list">${effItems(weak, eff) || '<div class="empty-msg">Nenhuma</div>'}</div>
    </div>
    <div class="eff-card strength">
      <div class="eff-title">✦ Força (Resistência)</div>
      <div class="eff-list">${effItems(str, eff) || '<div class="empty-msg">Nenhuma</div>'}</div>
    </div>
    <div class="eff-card immunity">
      <div class="eff-title">◆ Imunidade</div>
      <div class="eff-list">${effItems(imm, eff) || '<div class="empty-msg">Nenhuma</div>'}</div>
    </div>`;
}

function formLabel(form, speciesName) {
  if (form.isDefault) return 'Padrão';
  const prefix = speciesName + '-';
  return form.name.startsWith(prefix)
    ? titleCase(form.name.slice(prefix.length))
    : titleCase(form.name);
}

function formCardHTML(form, idx, speciesName) {
  const label = formLabel(form, speciesName);
  return `
    <div class="form-card${idx === 0 ? ' active' : ''}" onclick="selectForm(${idx})">
      <img src="${form.art}" alt="${form.name}"
           onerror="this.onerror=null;this.src='${form.sprite}'" loading="lazy">
      <div class="form-label" title="${label}">${label}</div>
    </div>`;
}

function teamBtnHTML(form, speciesName) {
  const label  = formLabel(form, speciesName);
  const inTeam = team.some(t => t.speciesName === speciesName && t.label === label);
  const isFull = !inTeam && team.length >= 6;
  if (inTeam) return `<button class="add-team-btn in-team" disabled>✓ No Time</button>`;
  if (isFull) return `<button class="add-team-btn" disabled>Time cheio (6/6)</button>`;
  return `<button class="add-team-btn" onclick="addToTeam()">＋ Adicionar ao Time</button>`;
}

// ── Select Pokémon ──

async function selectPoke(speciesName, speciesId) {
  activePoke   = speciesName;
  activePokeId = speciesId;
  viewMode     = 'explorer';
  $('content').classList.remove('team-mode');
  $('content').classList.remove('home-mode');
  renderList();
  setContent(spinnerHTML());

  try {
    const species = await apiFetch(`/pokemon-species/${speciesId}`);

    const isDefaultMap = {};
    species.varieties.forEach(v => { isDefaultMap[v.pokemon.name] = v.is_default; });

    const settled = await Promise.allSettled(
      species.varieties.map(v => apiFetch(v.pokemon.url))
    );
    const varPokemons = settled
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    if (!varPokemons.length) throw new Error('Nenhuma variedade carregou');

    const uniqueTypes = [...new Set(varPokemons.flatMap(v => v.types.map(t => t.type.name)))];
    const typeDataArr = await Promise.all(uniqueTypes.map(t => apiFetch(`/type/${t}`)));
    const typeMap     = Object.fromEntries(uniqueTypes.map((t, i) => [t, typeDataArr[i]]));

    activeForms = varPokemons.map(v => {
      const apiArt    = v.sprites?.other?.['official-artwork']?.front_default || null;
      const apiSprite = v.sprites?.front_default || null;
      const types     = v.types.map(t => t.type.name);
      return {
        name:      v.name,
        id:        v.id,
        art:       apiArt || apiSprite || artUrl(v.id),
        sprite:    apiSprite || spriteUrl(v.id),
        hasImage:  !!(apiArt || apiSprite),
        types,
        eff:       computeEff(types.map(t => typeMap[t])),
        isDefault: isDefaultMap[v.name] || false,
      };
    });

    // Remove formas sem imagem e não-default (ex: modos de viagem do Koraidon/Miraidon)
    activeForms = activeForms.filter(f => f.hasImage || f.isDefault);
    activeForms.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    activeFormIdx = 0;

    renderCard(speciesName, speciesId);
  } catch(e) {
    setContent('<div class="loading">Erro ao carregar Pokémon.</div>');
    console.error(e);
  }
}

// ── Render card ──

function renderCard(speciesName, speciesId) {
  const form = activeForms[activeFormIdx] || activeForms[0];
  const { weak, str, imm } = groupEff(form.eff);

  const typeBadges = form.types
    .map(t => `<span class="type-badge" style="background:${TYPE_COLORS[t]||'#888'}">${titleCase(t)}</span>`)
    .join('');

  const formsHTML = activeForms.length > 1 ? `
    <div class="section-label" style="margin-top:0">Formas (${activeForms.length})</div>
    <div class="forms-row" id="forms-row">
      ${activeForms.map((f, i) => formCardHTML(f, i, speciesName)).join('')}
    </div>` : '';

  setContent(`
    <div class="card">
      <div class="card-num">#${String(speciesId).padStart(3,'0')}</div>
      <div class="card-name">${titleCase(speciesName)}</div>
      <div class="type-badges" id="type-badges">${typeBadges}</div>

      <div class="artwork-wrap">
        <img id="art" class="artwork-img"
             src="${form.art}" alt="${speciesName}"
             onerror="this.onerror=null;this.src='${form.sprite}'">
      </div>

      <div class="add-team-wrap">${teamBtnHTML(form, speciesName)}</div>

      ${formsHTML}

      <div class="section-label">Efetividade por Tipo</div>
      <div class="eff-grid" id="eff-grid">
        ${effGridHTML(weak, str, imm, form.eff)}
      </div>
    </div>`);
}

// ── Select form ──

function selectForm(idx) {
  activeFormIdx = idx;
  const form = activeForms[idx];

  const img = $('art');
  if (img) {
    img.style.opacity = '.3';
    const next = new Image();
    next.onload  = () => { img.src = form.art;    img.style.opacity = '1'; };
    next.onerror = () => { img.src = form.sprite; img.style.opacity = '1'; };
    next.src = form.art;
  }

  const badgesEl = $('type-badges');
  if (badgesEl) {
    badgesEl.innerHTML = form.types
      .map(t => `<span class="type-badge" style="background:${TYPE_COLORS[t]||'#888'}">${titleCase(t)}</span>`)
      .join('');
  }

  const grid = $('eff-grid');
  if (grid) {
    const { weak, str, imm } = groupEff(form.eff);
    grid.innerHTML = effGridHTML(weak, str, imm, form.eff);
  }

  const wrap = document.querySelector('.add-team-wrap');
  if (wrap) wrap.innerHTML = teamBtnHTML(form, activePoke);

  document.querySelectorAll('.form-card').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.querySelector('.form-label').style.color = i === idx ? 'var(--red)' : '';
  });
}
