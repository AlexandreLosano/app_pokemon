'use strict';

const API = 'https://pokeapi.co/api/v2';
const SPR = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX'];

const TYPE_COLORS = {
  normal:'#A8A878',  fire:'#F08030',    water:'#6890F0',  electric:'#F8D030',
  grass:'#78C850',   ice:'#98D8D8',     fighting:'#C03028',poison:'#A040A0',
  ground:'#E0C068',  flying:'#A890F0',  psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038',    ghost:'#705898',   dragon:'#7038F8',  dark:'#705848',
  steel:'#B8B8D0',   fairy:'#EE99AC',
};
const ALL_TYPES = Object.keys(TYPE_COLORS);

// ── State ──
let globalPoke    = [];     // todas as espécies (~1025)
let allPoke       = [];     // espécies da geração selecionada
let shownPoke     = [];     // após filtro por jogo
let activePoke    = null;   // nome da espécie selecionada
let activePokeId  = null;   // id numérico da espécie
let activeForms   = [];     // formas do Pokémon selecionado
let activeFormIdx = 0;
let team          = [];     // [{speciesName,speciesId,label,art,sprite,types,eff}], max 6
let viewMode      = 'explorer'; // 'explorer' | 'team'
