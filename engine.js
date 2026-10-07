/* Kitesurf engine: rough kite-size math for twin-tip riding.
   area(m2) ~ weight(kg) x 2.2 / wind(knots) - a widely quoted rule of thumb
   that lands near the middle of most brand charts (75 kg / 15 kn -> 11 m).
   Beaufort boundaries follow the WMO scale. All outputs are rough planning
   estimates; brand charts, skill, board and kite type all shift the answer. */
'use strict';
var Kitesurf = (function () {
  var SIZES = [5, 6, 7, 8, 9, 10, 11, 12, 13.5, 15, 17];

  function kiteArea(weightKg, windKn) {
    if (!(weightKg > 0) || !(windKn > 0)) return null;
    return Math.round(weightKg * 2.2 / windKn * 10) / 10;
  }

  function nearestSize(area) {
    if (!(area > 0)) return null;
    var best = SIZES[0];
    for (var i = 0; i < SIZES.length; i++) {
      if (Math.abs(SIZES[i] - area) < Math.abs(best - area)) best = SIZES[i];
      /* ties keep the earlier (smaller) size */
    }
    var idx = SIZES.indexOf(best);
    return { pick: best,
             smaller: idx > 0 ? SIZES[idx - 1] : null,
             larger: idx < SIZES.length - 1 ? SIZES[idx + 1] : null };
  }

  /* Ideal wind for a given kite: wind = weight x 2.2 / size, with a +-20%
     working band (rule of thumb). */
  function windForKite(weightKg, sizeM) {
    if (!(weightKg > 0) || !(sizeM > 0)) return null;
    var ideal = weightKg * 2.2 / sizeM;
    return { ideal: Math.round(ideal * 10) / 10,
             min: Math.round(ideal * 0.8 * 10) / 10,
             max: Math.round(ideal * 1.2 * 10) / 10 };
  }

  var BF = [[1,0,'Calm'],[4,1,'Light air'],[7,2,'Light breeze'],[11,3,'Gentle breeze'],
            [17,4,'Moderate breeze'],[22,5,'Fresh breeze'],[28,6,'Strong breeze'],
            [34,7,'Near gale'],[41,8,'Gale'],[48,9,'Strong gale'],[56,10,'Storm'],
            [64,11,'Violent storm'],[1e9,12,'Hurricane']];
  function beaufort(kn) {
    if (!(kn >= 0)) return null;
    for (var i = 0; i < BF.length; i++) if (kn < BF[i][0]) return { force: BF[i][1], name: BF[i][2] };
    return { force: 12, name: 'Hurricane' };
  }

  function convert(kn) {
    if (!(kn >= 0)) return null;
    return { kmh: Math.round(kn * 1.852 * 10) / 10,
             mph: Math.round(kn * 1.15077945 * 10) / 10,
             ms: Math.round(kn * 0.514444 * 100) / 100 };
  }

  /* Twin-tip length band by rider weight (rule of thumb, cm). */
  function boardBand(weightKg) {
    if (!(weightKg > 0)) return null;
    if (weightKg < 55) return { min: 130, max: 134 };
    if (weightKg < 70) return { min: 133, max: 137 };
    if (weightKg < 85) return { min: 136, max: 140 };
    if (weightKg < 100) return { min: 139, max: 143 };
    return { min: 142, max: 146 };
  }

  return { kiteArea: kiteArea, nearestSize: nearestSize, windForKite: windForKite,
           beaufort: beaufort, convert: convert, boardBand: boardBand };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Kitesurf;
