'use strict';

const $ = id => document.getElementById(id);

function setList(html)    { $('poke-list').innerHTML = html; }
function setContent(html) { $('content').innerHTML   = html; }
function spinnerHTML()    { return '<div class="loading"><div class="spin"></div>Carregando...</div>'; }

function idFrom(url)   { return parseInt(url.split('/').filter(Boolean).pop()); }
function artUrl(id)    { return `${SPR}/other/official-artwork/${id}.png`; }
function spriteUrl(id) { return `${SPR}/${id}.png`; }

function titleCase(s) {
  return s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
