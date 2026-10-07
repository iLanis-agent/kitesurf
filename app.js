'use strict';
/* global Kitesurf */
(function () {
  const $ = (id) => document.getElementById(id);
  const presets = [
    { n: 'Feather 60kg / 18kn', w: 60, k: 18 },
    { n: 'Average 75kg / 15kn', w: 75, k: 15 },
    { n: 'Big 85kg / 22kn', w: 85, k: 22 },
    { n: 'Heavy 95kg / 12kn', w: 95, k: 12 }
  ];
  const prow = $('presets');
  presets.forEach((p) => {
    const b = document.createElement('button');
    b.textContent = p.n;
    b.addEventListener('click', () => { $('wt').value = p.w; $('kn').value = p.k; run(); });
    prow.appendChild(b);
  });

  function run () {
    const w = parseFloat($('wt').value), kn = parseFloat($('kn').value);
    const area = Kitesurf.kiteArea(w, kn);
    if (area === null) {
      $('sizeOut').innerHTML = '<p>Enter a positive weight and wind speed.</p>';
      $('quiverOut').innerHTML = '';
      return;
    }
    const pick = Kitesurf.nearestSize(area);
    const bf = Kitesurf.beaufort(kn);
    const cv = Kitesurf.convert(kn);
    const bd = Kitesurf.boardBand(w);
    $('sizeOut').innerHTML =
      '<p class="big">Rule-of-thumb area ' + area + ' m2 - take the <strong>' + pick.pick + ' m</strong>' +
      (pick.smaller !== null || pick.larger !== null
        ? ' (' + (pick.smaller !== null ? pick.smaller + ' m if you want less pull, ' : '') +
          (pick.larger !== null ? pick.larger + ' m if it is gusty-light' : '') + ')'
        : '') + '.</p>' +
      '<table><tr><th>Wind</th><th>Value</th></tr>' +
      '<tr><td>Beaufort</td><td>Force ' + bf.force + ' - ' + bf.name + '</td></tr>' +
      '<tr><td>Same wind as</td><td>' + cv.kmh + ' km/h, ' + cv.mph + ' mph, ' + cv.ms + ' m/s</td></tr>' +
      (bd ? '<tr><td>Twin-tip board band</td><td>' + bd.min + ' to ' + bd.max + ' cm</td></tr>' : '') +
      '</table>';

    const own = parseFloat($('own').value);
    const wf = Kitesurf.windForKite(w, own);
    $('quiverOut').innerHTML = wf === null ? '' :
      '<p class="big">Your ' + own + ' m likes about <strong>' + wf.ideal + ' kn</strong> for your weight ' +
      '(working band ' + wf.min + ' to ' + wf.max + ' kn).</p>';
  }

  ['wt', 'kn', 'own'].forEach((id) => $(id).addEventListener('input', run));
  run();
})();
