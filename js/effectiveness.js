'use strict';

function computeEff(typeDataList) {
  const eff = {};
  ALL_TYPES.forEach(t => eff[t] = 1);
  typeDataList.filter(Boolean).forEach(td => {
    const dr = td.damage_relations;
    dr.double_damage_from.forEach(({name}) => { if (name in eff) eff[name] *= 2; });
    dr.half_damage_from  .forEach(({name}) => { if (name in eff) eff[name] *= 0.5; });
    dr.no_damage_from    .forEach(({name}) => { if (name in eff) eff[name]  = 0; });
  });
  return eff;
}

function groupEff(eff) {
  return {
    weak: ALL_TYPES.filter(t => eff[t] > 1             ).sort((a, b) => eff[b] - eff[a]),
    str:  ALL_TYPES.filter(t => eff[t] > 0 && eff[t] < 1).sort((a, b) => eff[a] - eff[b]),
    imm:  ALL_TYPES.filter(t => eff[t] === 0),
  };
}
