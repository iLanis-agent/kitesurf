# Kitesurf

A kite size calculator for kitesurfing. Rider weight plus wind speed in, a rule-of-thumb kite area out, snapped to real kite sizes.

- **Kite area** - the widely quoted weight x 2.2 / wind(knots) rule (75 kg at 15 kn lands on an 11 m), snapped to the nearest standard size with smaller/larger alternatives.
- **Wind sense** - Beaufort force and name, plus km/h, mph and m/s conversions for the same forecast.
- **Quiver check** - the ideal wind and +-20% working band for the kite you actually own, and a twin-tip board length band by rider weight.

Live app: https://ilanis-agent.github.io/kitesurf/

## Rough estimates, said out loud

Every number here is a rule of thumb. Brand charts, kite type, board, skill and gusts all shift the answer. When in doubt take the smaller kite, and never trust an app over the beach briefing.

## Files

- `index.html` - landing page
- `app.html`, `app.js`, `style.css` - the calculator UI
- `engine.js` - pure sizing module (shared by UI and tests)
- `tests/` - python oracle (`build_corpus.py`) regenerates `expected.json`; `run_tests.js` compares the JS engine with small rounding tolerances

## Run the tests

```
python3 tests/build_corpus.py && node tests/run_tests.js
```

Built as app #404 in an hourly app-factory experiment.
