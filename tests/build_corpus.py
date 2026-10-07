#!/usr/bin/env python3
"""Kitesurf oracle: independent python recompute of the sizing math."""
import json, os

SIZES = [5,6,7,8,9,10,11,12,13.5,15,17]

def kite_area(w, kn):
    if not (w > 0 and kn > 0): return None
    return round(w * 2.2 / kn, 1)

def nearest(area):
    if area is None or not (area > 0): return None
    best = SIZES[0]
    for s in SIZES:
        if abs(s - area) < abs(best - area): best = s
    i = SIZES.index(best)
    return {'pick': best, 'smaller': SIZES[i-1] if i > 0 else None,
            'larger': SIZES[i+1] if i < len(SIZES)-1 else None}

def wind_for(w, size):
    if not (w > 0 and size > 0): return None
    ideal = w * 2.2 / size
    return {'ideal': round(ideal, 1), 'min': round(ideal*0.8, 1), 'max': round(ideal*1.2, 1)}

BF = [(1,0,'Calm'),(4,1,'Light air'),(7,2,'Light breeze'),(11,3,'Gentle breeze'),
      (17,4,'Moderate breeze'),(22,5,'Fresh breeze'),(28,6,'Strong breeze'),
      (34,7,'Near gale'),(41,8,'Gale'),(48,9,'Strong gale'),(56,10,'Storm'),
      (64,11,'Violent storm'),(10**9,12,'Hurricane')]
def beaufort(kn):
    if not (kn >= 0): return None
    for lim, f, n in BF:
        if kn < lim: return {'force': f, 'name': n}
    return {'force': 12, 'name': 'Hurricane'}

def convert(kn):
    if not (kn >= 0): return None
    return {'kmh': round(kn*1.852, 1), 'mph': round(kn*1.15077945, 1), 'ms': round(kn*0.514444, 2)}

def board(w):
    if not (w > 0): return None
    if w < 55: return {'min':130,'max':134}
    if w < 70: return {'min':133,'max':137}
    if w < 85: return {'min':136,'max':140}
    if w < 100: return {'min':139,'max':143}
    return {'min':142,'max':146}

cases = []
for a in [(75,15),(60,18),(85,22),(95,12),(70,25),(0,15),(75,0),(55,10),(80,8),(68,20)]:
    area = kite_area(*a)
    cases.append({'kind':'area','args':list(a),'oracle':area})
    cases.append({'kind':'nearest','args':[area],'oracle':nearest(area)})
for a in [(75,11),(60,7),(85,9),(95,17),(70,6),(0,11),(75,0)]:
    cases.append({'kind':'windfor','args':list(a),'oracle':wind_for(*a)})
for kn in [0,3,10,15,21,27,33,40,50,-1]:
    cases.append({'kind':'beaufort','args':[kn],'oracle':beaufort(kn)})
    cases.append({'kind':'convert','args':[kn],'oracle':convert(kn)})
for w in [50,60,75,90,110,0]:
    cases.append({'kind':'board','args':[w],'oracle':board(w)})

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': cases}, open(out,'w'))
print('cases:', len(cases))
