"""Flag service pages whose copy overlaps too much (templated sameness hurts quality signals).

    python3 scripts/service_pages/overlap.py

Compares every pair of content files on shared 6-word runs and on identical
section questions. Questions every page asks by design (insurance) are fine;
whole sentences shared between pages are not.
"""
import itertools
import json
import os
import re

CONTENT = os.path.join(os.path.dirname(__file__), 'content')
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')


def copy_of(spec):
    parts = [spec['sub']]
    for s in spec['sections']:
        parts.append(s['a'])
        b = s.get('block') or {}
        parts += [x if isinstance(x, str) else f"{x.get('t', '')} {x.get('d', '')}" for x in b.get('signs', []) + b.get('items', [])]
        parts += [' '.join(r[1:]) for r in b.get('rows', [])]
        parts += [f"{st['t']} {st['d']}" for st in b.get('steps', [])]
        if b.get('card'):
            parts.append(b['card']['text'])
    return LINK_RE.sub(lambda m: m.group(1), ' '.join(parts)).lower()


def shingles(text, n=6):
    w = re.findall(r"[a-z0-9']+", text)
    return {' '.join(w[i:i + n]) for i in range(len(w) - n + 1)}


specs = {}
for f in sorted(os.listdir(CONTENT)):
    if f.endswith('.json'):
        specs[f[:-5].replace('__', '/')] = json.load(open(os.path.join(CONTENT, f), encoding='utf-8'))
sh = {k: shingles(copy_of(v)) for k, v in specs.items()}
qs = {k: {s['q'].lower() for s in v['sections']} for k, v in specs.items()}
rows = []
for a, b in itertools.combinations(specs, 2):
    common = sh[a] & sh[b]
    score = len(common) / max(1, min(len(sh[a]), len(sh[b])))
    rows.append((score, a, b, len(common), len(qs[a] & qs[b])))
rows.sort(reverse=True)
print('highest copy overlap (share of the smaller page\'s 6-word runs):')
for score, a, b, n, q in rows[:12]:
    flag = '  <-- too similar' if score > 0.08 else ''
    print(f'  {score:5.1%}  {a} / {b}  ({n} runs, {q} identical questions){flag}')
heads = {}
for k, v in specs.items():
    for s in v['sections']:
        heads.setdefault(s['q'].lower(), []).append(k)
shared = {q: ks for q, ks in heads.items() if len(ks) > 2}
if shared:
    print('questions used on more than two pages:')
    for q, ks in sorted(shared.items(), key=lambda x: -len(x[1])):
        print(f'  {len(ks):2}  {q}')
