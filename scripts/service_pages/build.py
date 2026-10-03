"""Build the service and category pages from scripts/service_pages/content/<slug>.json.

Only <main> and the FAQPage schema are generated. The head (apart from the
hero preload and the service stylesheet link), the nav and the footer stay
exactly as they are in each HTML file, so sitewide scripts keep working.

    python3 scripts/service_pages/build.py --check [slug ...]   lint only, writes nothing
    python3 scripts/service_pages/build.py [slug ...]           lint, then write the pages
    python3 scripts/service_pages/build.py --css                rebuild css/service.min.css
    python3 scripts/service_pages/build.py --bump N             set ?v=N on the stylesheet link

Edit the JSON, not the generated HTML: a rebuild overwrites <main>.
Copy rules the lint enforces are in README.md next to this file.
"""
import html
import json
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONTENT = os.path.join(os.path.dirname(__file__), 'content')
CSS_VERSION = 1
CSS_LINK = '<link rel="stylesheet" href="/css/service.min.css?v={v}">'

# ── Catalogs ──────────────────────────────────────────────────────────────
IMAGES = {  # key: (folder, width, height, has a -800 version)
    'group-therapy-room': ('facility', 800, 600, True),
    'reception-lobby': ('facility', 800, 600, True),
    'recreation-room': ('facility', 800, 600, True),
    'waiting-area': ('facility', 800, 600, True),
    'individual-therapy-room': ('facility', 600, 800, True),
    'meditation-room': ('facility', 600, 800, True),
    'computer-workstations': ('facility', 600, 800, True),
    'game-room': ('facility', 600, 800, True),
    'reading-lounge': ('facility', 600, 800, True),
    'tv-lounge': ('facility', 600, 800, True),
    'alumni-gathering': ('community', 1800, 1200, False),
}
PEOPLE = {  # key: (name, role shown under the photo, portrait file stem)
    'eric-chaghouri': ('Dr. Eric Chaghouri, MD', 'Medical director, psychiatrist'),
    'ari-labowitz': ('Ari Labowitz, LMFT', 'Clinical director'),
    'viola-sulahian': ('Viola Sulahian, AMFT', 'Primary therapist'),
    'nechama-berkowitz': ('Nechama Berkowitz, APCC', 'Trauma-informed therapist'),
    'juanita-casillas': ('Juanita Casillas, RADT', 'Counselor, habla español'),
    'eduardo-garcia': ('Eduardo Garcia', 'Program director'),
    'sophia-scharpf': ('Sophia Scharpf', 'Case manager'),
    'scott-hedlund': ('Scott Hedlund', 'Director of business development'),
    'dean-mcdermott': ('Dean McDermott', 'Director of brand development'),
}
REVIEWS = {  # verbatim Google review excerpts (about.html); mark = highlighted clause
    'joey-viola': ('Working with Viola was amazing. She helped me open up, look at things honestly, and do real work on myself.', 'Working with Viola was amazing.', 'Joey F.', 'June 2026'),
    'joey-juanita': ('Juanita led every group with so much love and care. Her groups always felt safe, honest, and meaningful.', 'Juanita led every group with so much love and care.', 'Joey F.', 'June 2026'),
    'joey-toolbox': ('By the time I finished, I felt like I was leaving with a full toolbox, a clearer mind, and more confidence in my sobriety.', 'a full toolbox', 'Joey F.', 'June 2026'),
    'gregory': ('Juanita and Scott helped me through some of the hardest parts and made sure I never felt like I was doing it alone.', 'made sure I never felt like I was doing it alone', 'Gregory Icenogle', 'July 2026'),
    'gregory-place': ('From the moment I got there, the place felt safe, calm, and welcoming.', 'the place felt safe, calm, and welcoming', 'Gregory Icenogle', 'July 2026'),
    'yvette': ('All the facilitators have a lot of experience in recovery and walk the talk.', 'walk the talk', 'Yvette Vargas', 'August 2026'),
    'dennis-groups': ('The groups are also excellent. They are informative, engaging, and provide helpful tools that can be applied to everyday life.', 'helpful tools that can be applied to everyday life', 'Dennis', 'July 2026'),
    'dennis-judged': ('The facilitators create a comfortable and supportive environment where people can be honest, participate, and learn without feeling judged.', 'learn without feeling judged', 'Dennis', 'July 2026'),
    'mikey': ('The staff and owners actually listen to you and show genuine care which ive never experienced before.', 'actually listen to you', 'Mikey Iava', 'August 2026'),
    'ryan': ('Having people around you who believe in you, hold you accountable, and remind you that your past doesn’t have to determine your future makes a huge difference.', 'your past doesn’t have to determine your future', 'Ryan Hill', 'September 2026'),
    'kali-detox': ('Honestly, after detox, I had no idea what came next.', 'after detox, I had no idea what came next', 'Kali', 'September 2026'),
    'kali-life': ('They’re not just focused on my addiction. They’re helping me figure out how to actually put my life back together, one piece at a time.', 'one piece at a time', 'Kali', 'September 2026'),
    'desteny': ('They have the best staff, the group facilitators that actually love to lead group and teach.', 'actually love to lead group and teach', 'Desteny', 'September 2026'),
}
ICONS = set('''briefcase lock users map-pin home heart heart-pulse clock calendar calendar-heart phone video laptop moon sun
sunrise shield-check pill stethoscope brain message-circle hand-heart leaf sparkles user user-check globe languages wifi
car coffee book-open activity repeat refresh-cw target compass life-buoy anchor sprout flame zap wind smile file-text
clipboard-check badge-check scale timer hourglass alarm-clock graduation-cap building-2 baby monitor smartphone
house-heart handshake hand-helping footprints mountain trees waves syringe tablets ban siren thermometer bed school'''.split())

# Up-link each page must carry (GBP category silo); see memory/gbp-category-silos.
HOME_UP = ('/', 'addiction treatment center in Los Angeles')
UPLINK = {
    'mental-health': HOME_UP, 'rehabilitation-center': HOME_UP, 'alcoholism-treatment-program': HOME_UP,
    'programs/group-therapy': ('/mental-health', 'mental health clinic in Los Angeles'),
    'treatments/depression': ('/mental-health', None), 'treatments/anxiety': ('/mental-health', None),
    'treatments/ptsd': ('/mental-health', None), 'treatments/complex-trauma': ('/mental-health', None),
    'treatments/dbt': ('/mental-health', None), 'programs/psychiatric-care': ('/mental-health', None),
    'programs/outpatient-rehab': ('/rehabilitation-center', 'rehabilitation center in Los Angeles'),
    'programs/telehealth': ('/rehabilitation-center', 'rehabilitation center in Los Angeles'),
    'treatments/alcohol': ('/alcoholism-treatment-program', None),
}
ALWAYS_OK = {'/verify-insurance', '/team', '/contact'}

# Facts confirmed sitewide or by the owner; numbers in new copy must appear here or on the old page.
GLOBAL_FACTS = '''1964 Westwood Blvd Suite 425 405 10 (424) 208-3120 24/7 100+ 5.0 DHCS #191643AP April 15 2026 May 26
August 12 2026 Joint Commission 2026 PHP about 6 hours a day 5 days a week 9am to 3pm 9 to 3 IOP 3-hour sessions 3 to 5
days a week 9 to 15 hours mornings evenings 2 to 4 weeks two to four weeks 42 CFR Part 2 HIPAA FMLA CFRA SB 855 one full
year weekly alumni groups monthly check-ins 988 1-800-662-4357'''

BANNED = ['ensure', 'crucial', 'vital', 'comprehensive', 'navigating', 'navigate', 'delve', 'deep dive', 'realm', 'embark',
          'unlock', 'unleash', 'unveil', 'top-notch', 'transition', 'optimal', 'assessing', 'moreover', 'furthermore',
          'therefore', 'thus', 'essentially', 'notably', 'significantly', 'we know', 'we understand', 'look no further',
          'in conclusion', 'in terms of', 'bear in mind', "it's important to note", 'testament', 'eager', 'journey',
          'holistic approach', 'tailored', 'cutting-edge', 'state-of-the-art', 'world-class', 'seamless', 'empower']
BANNED_INSURANCE = ['we accept', 'accepted', 'in-network', 'in network', 'we take insurance', 'covered by', 'fully covered',
                    'free of charge', "won't pay", 'no cost to you', 'aceptamos',
                    # owner, 2026-10-02: we never quote what someone will owe (no coverage, no admission)
                    'out-of-pocket', 'out of pocket', "what you'd owe", "you'd pay", 'what you will pay', 'your costs']
FLAG = ['business hours', 'office hours', 'medi-cal', 'guarantee', 'cure', 'licensed facility', 'state-licensed',
        'sex addiction', '500+', 'detox on site', 'on-site detox', 'sober living we', 'our sober living']
# Facts are checked against each page as it stood before the redesign.
FACTS_COMMIT = 'a8eb239'
VOID = {'img', 'br', 'meta', 'link', 'input', 'hr', 'source', 'use', 'path', 'circle', 'polyline', 'line', 'rect'}


# ── Text helpers ──────────────────────────────────────────────────────────
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')


def md(text):
    """Escape plain text and turn [label](href) into links. External links open in a new tab."""
    out, last = [], 0
    for m in LINK_RE.finditer(text):
        out.append(html.escape(text[last:m.start()], quote=False))
        label, href = html.escape(m.group(1), quote=False), m.group(2)
        ext = ' target="_blank" rel="noopener"' if href.startswith('http') else ''
        out.append(f'<a href="{html.escape(href)}"{ext}>{label}</a>')
        last = m.end()
    out.append(html.escape(text[last:], quote=False))
    return ''.join(out)


def plain(text):
    return LINK_RE.sub(lambda m: m.group(1), text)


def esc(text):
    return html.escape(text, quote=True)


def img_src(key, prefer_small=True):
    folder, w, h, small = IMAGES[key]
    full = f'/images/{folder}/{key}.webp'
    return (f'/images/{folder}/{key}-800.webp' if small else full), full, w, h, small


# ── Markup pieces ─────────────────────────────────────────────────────────
PROOF = '''<ul class="cta-proof" aria-label="Ratings and accreditation">
          <li class="cta-proof-item">
            <svg class="cta-proof-laurel" aria-hidden="true" focusable="false"><use href="#cta-laurel"/></svg>
            <span class="cta-proof-text"><strong>5-Star</strong> Rated<br>on Google</span>
            <svg class="cta-proof-laurel cta-proof-laurel--r" aria-hidden="true" focusable="false"><use href="#cta-laurel"/></svg>
          </li>
          <li class="cta-proof-item">
            <img class="cta-proof-seal" src="/images/joint-commission-gold-seal.webp" alt="" width="24" height="24" loading="lazy" decoding="async">
            <span class="cta-proof-text"><strong>Joint Commission</strong><br>Accredited</span>
          </li>
        </ul>'''
VERIFY = '<a href="/verify-insurance" class="btn btn-primary btn-lg" data-cta="{key}">Verify My Insurance <i data-lucide="arrow-right"></i></a>'
PHONE_DARK = '<a href="tel:+14242083120" class="btn btn-white-outline btn-lg"><i data-lucide="phone"></i> (424) 208-3120</a>'
LAUREL = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="cta-laurel" viewBox="0 0 20 40">'
          '<path d="M15 39C5 33 3 16 9 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
          '<path d="M11.3 35.9Q6.9 32.4 2.3 35.5Q6.6 39.0 11.3 35.9ZM11.3 35.9Q14.3 32.2 11.4 28.4Q8.5 32.1 11.3 35.9ZM8.2 31.1Q5.3 27.1 0.7 28.6Q3.5 32.6 8.2 31.1ZM8.2 31.1Q11.6 28.7 10.2 24.8Q6.7 27.2 8.2 31.1ZM6.3 25.5Q4.7 21.5 0.5 21.9Q2.0 25.8 6.3 25.5ZM6.3 25.5Q9.6 24.2 9.2 20.6Q5.8 21.9 6.3 25.5ZM5.6 19.4Q5.0 15.9 1.5 15.5Q2.1 19.0 5.6 19.4ZM5.6 19.4Q8.6 18.9 8.9 15.9Q5.9 16.4 5.6 19.4ZM6.2 13.4Q6.3 10.5 3.6 9.6Q3.5 12.5 6.2 13.4ZM6.2 13.4Q8.7 13.5 9.4 11.2Q6.9 11.1 6.2 13.4ZM9.0 6.0Q12.5 4.9 11.8 1.3Q8.4 2.4 9.0 6.0Z" fill="currentColor"/></symbol></svg>')


def cta_block(key, indent='    '):
    return (f'\n{indent}<div class="svc-cta reveal">\n{indent}  <div class="cta-stack">\n{indent}    {VERIFY.format(key=key)}\n'
            f'{indent}    {PROOF}\n{indent}  </div>\n{indent}</div>')


def head_block(sec, left=False):
    cls = 'svc-head reveal'
    note = f'\n      <p class="svc-note">{md(sec["note"])}</p>' if sec.get('note') else ''
    return (f'<div class="{cls}">\n      <h2 id="{sec["id"]}-title">{esc(sec["q"])}</h2>\n'
            f'      <p class="svc-answer">{md(sec["a"])}</p>{note}\n    </div>')


def snap(key, alt, caption, cls, lazy=True):
    small, full, w, h, has_small = img_src(key)
    srcset = f' srcset="{small} 800w, {full} {w * 2}w" sizes="(max-width: 899px) 92vw, 460px"' if has_small else ''
    load = ' loading="lazy"' if lazy else ' fetchpriority="high"'
    return (f'<figure class="snap {cls}">\n        <img src="{small}"{srcset} width="{w}" height="{h}"{load} decoding="async" alt="{esc(alt)}">\n'
            f'        <figcaption>{esc(caption)}</figcaption>\n      </figure>')


def review_fig(key, cls='svc-review'):
    quote, mark, who, when = REVIEWS[key]
    q = esc(quote).replace(esc(mark), f'<mark>{esc(mark)}</mark>', 1)
    return (f'<figure class="{cls}">\n        <span class="svc-stars" role="img" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>\n'
            f'        <blockquote>{q}</blockquote>\n        <figcaption>{esc(who)}, Google review, {when}</figcaption>\n      </figure>')


# ── Blocks ────────────────────────────────────────────────────────────────
def block_html(sec, b):
    t = b['type']
    sid = sec['id']
    if t == 'fit':
        signs = ''.join(f'\n        <li>{md(s)}</li>' for s in b['signs'])
        if not b.get('card'):
            return (f'<div class="container svc-fit svc-fit--solo">\n    <div class="reveal">\n    {head_block(sec)}\n'
                    f'      <ul class="svc-signs">{signs}\n      </ul>\n    </div>' + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
        c = b['card']
        return (f'<div class="container svc-fit">\n    <div class="reveal">\n    {head_block(sec)}\n      <ul class="svc-signs">{signs}\n      </ul>\n    </div>\n'
                f'    <aside class="svc-card reveal reveal-delay-1" aria-labelledby="{sid}-card-title">\n'
                f'      <h3 id="{sid}-card-title">{esc(c["title"])}</h3>\n      <p>{md(c["text"])}</p>\n'
                f'      <div class="cta-stack cta-stack--dark">\n        {VERIFY.format(key=sid)}\n        {PHONE_DARK}\n        '
                + PROOF.replace('\n        ', '\n          ') + '\n      </div>\n    </aside>\n  </div>')
    if t == 'sheet':
        rows = ''.join(f'\n        <li><time>{esc(r[0])}</time><div><h3>{esc(r[1])}</h3><p>{md(r[2])}</p></div></li>' for r in b['rows'])
        photos = b.get('photos') or []
        cta = cta_block(sid, '      ') if sec.get('cta') else ''
        if not photos:
            return (f'<div class="container svc-day svc-day--solo">\n    <div class="svc-day-copy">\n      {head_block(sec)}\n'
                    f'      <ol class="svc-sheet reveal">{rows}\n      </ol>{cta}\n    </div>\n  </div>')
        p1, p2 = photos
        return (f'<div class="container svc-day">\n    <div class="svc-day-copy">\n      {head_block(sec)}\n      <ol class="svc-sheet reveal">{rows}\n      </ol>{cta}\n    </div>\n'
                f'    <div class="svc-day-media">\n      {snap(p1[0], p1[1], p1[2], "svc-snap-tall reveal")}\n      {snap(p2[0], p2[1], p2[2], "svc-snap-over reveal reveal-delay-1")}\n    </div>\n  </div>')
    if t == 'team':
        faces = ''
        for k in b['people']:
            name, role = PEOPLE[k]
            faces += (f'\n      <li><img src="/images/team/portrait/{k}-320.webp" width="320" height="400" loading="lazy" decoding="async" alt="{esc(name)}">'
                      f'<strong>{esc(name)}</strong><span>{esc(role)}</span></li>')
        n = len(b['people'])
        review = review_fig(b['review']) if b.get('review') else ''
        creds = ''
        if b.get('creds', True):
            creds = ('\n      <div class="svc-creds">\n        <p><img src="/images/joint-commission-gold-seal.webp" width="40" height="40" loading="lazy" decoding="async" alt=""><span>Accredited by <strong>The Joint Commission</strong> since August 2026</span></p>\n'
                     '        <p><i data-lucide="badge-check"></i><span>Certified by the State of California, <strong>DHCS #191643AP</strong></span></p>\n'
                     '        <a class="svc-link" href="/team">Meet the whole team <i data-lucide="arrow-right"></i></a>\n      </div>')
        if n == 1:  # one person: photo, review and credentials share a row
            k = b['people'][0]
            name, role = PEOPLE[k]
            face = (f'<figure class="svc-solo-face"><img src="/images/team/portrait/{k}-320.webp" width="320" height="400" loading="lazy" decoding="async" alt="{esc(name)}">'
                    f'<figcaption><strong>{esc(name)}</strong><span>{esc(role)}</span></figcaption></figure>\n      ')
            return (f'<div class="container">\n    {head_block(sec)}\n    <div class="svc-proof svc-proof--solo reveal">\n      {face}{review}{creds}\n    </div>'
                    + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
        proof = f'\n    <div class="svc-proof reveal">\n      {review}{creds}\n    </div>' if (review or creds) else ''
        return (f'<div class="container">\n    {head_block(sec)}\n    <ul class="svc-faces reveal" style="--n:{n}">{faces}\n    </ul>{proof}'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'insurance':
        items = ''.join(f'\n        <li>{esc(i)}</li>' for i in b['items'])
        return (f'<div class="container svc-cost">\n    {head_block(sec)}\n    <div class="svc-check reveal reveal-delay-1">\n'
                f'      <p class="svc-check-title">What we find out for you</p>\n      <ul>{items}\n      </ul>\n'
                f'      <div class="cta-stack">\n        {VERIFY.format(key=sid)}\n        {PROOF}\n      </div>\n    </div>\n  </div>')
    if t == 'cards':
        n = len(b['items'])
        cards = ''
        for i, c in enumerate(b['items']):
            delay = ' reveal-delay-1' if i % 2 else ''
            cards += (f'\n      <article class="svc-ask reveal{delay}">\n        <span class="svc-ask-icon" aria-hidden="true"><i data-lucide="{c["icon"]}"></i></span>\n'
                      f'        <h3>{esc(c["t"])}</h3>\n        <p>{md(c["d"])}</p>\n      </article>')
        return (f'<div class="container">\n    {head_block(sec)}\n    <div class="svc-asks" style="--n:{n}">{cards}\n    </div>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'path':
        n = len(b['steps'])
        steps = ''
        for i, s in enumerate(b['steps']):
            here = s.get('here')
            delay = f' reveal-delay-{min(i, 3)}' if i else ''
            title = (f'<a href="{esc(s["href"])}">{esc(s["t"])} <i data-lucide="arrow-right"></i></a>' if s.get('href') else esc(s['t']))
            steps += (f'\n      <li class="svc-step{" svc-step--here" if here else ""} reveal{delay}"{" aria-current=\"step\"" if here else ""}>\n'
                      f'        <span class="svc-step-dot" aria-hidden="true"></span>\n'
                      + ('        <span class="svc-step-tag">You&#39;re here</span>\n' if here else '')
                      + f'        <h3>{title}</h3>\n        <p>{md(s["d"])}</p>\n      </li>')
        return (f'<div class="container">\n    {head_block(sec)}\n    <ol class="svc-path" style="--n:{n}">{steps}\n    </ol>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'steps':
        n = len(b['items'])
        items = ''.join(f'\n      <li class="reveal{f" reveal-delay-{min(i, 3)}" if i else ""}"><span class="svc-step-n">{i + 1}</span><h3>{esc(s["t"])}</h3><p>{md(s["d"])}</p></li>'
                        for i, s in enumerate(b['items']))
        return (f'<div class="container">\n    {head_block(sec)}\n    <ol class="svc-steps" style="--n:{n}">{items}\n    </ol>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'compare':
        cols = ''
        for i, c in enumerate(b['cols']):
            rows = ''.join(f'\n          <li>{md(r)}</li>' for r in c['rows'])
            dark = ' svc-col--dark' if c.get('dark') else ''
            cols += (f'\n      <div class="svc-col{dark} reveal{" reveal-delay-1" if i else ""}">\n        <h3>{esc(c["t"])}</h3>\n'
                     f'        <ul>{rows}\n        </ul>\n      </div>')
        return (f'<div class="container">\n    {head_block(sec)}\n    <div class="svc-compare">{cols}\n    </div>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'links':
        items = ''.join(f'\n      <li><a href="{esc(i["href"])}"><span><strong>{esc(i["t"])}</strong><small>{esc(i["d"])}</small></span> <i data-lucide="arrow-up-right" aria-hidden="true"></i></a></li>'
                        for i in b['items'])
        return (f'<div class="container">\n    {head_block(sec)}\n    <ul class="svc-links reveal">{items}\n    </ul>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'quote':
        return (f'<div class="container">\n    {head_block(sec)}\n    <div class="svc-quote reveal">\n      {review_fig(b["review"])}\n    </div>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    if t == 'list':
        items = ''.join(f'\n        <li>{md(s)}</li>' for s in b['items'])
        return (f'<div class="container svc-fit svc-fit--solo">\n    <div class="reveal">\n    {head_block(sec)}\n      <ul class="svc-signs">{items}\n      </ul>\n    </div>'
                + (cta_block(sid) if sec.get('cta') else '') + '\n  </div>')
    raise ValueError(f'unknown block type {t}')


def section_html(sec, tone):
    b = sec.get('block')
    cls = {'plain': 'svc-block', 'tint': 'svc-block svc-block--tint', 'dark': 'svc-block svc-block--dark'}[tone]
    if b:
        inner = block_html(sec, b)
    else:
        inner = f'<div class="container">\n    {head_block(sec)}' + (cta_block(sec['id']) if sec.get('cta') else '') + '\n  </div>'
    return f'<section class="{cls}" id="{sec["id"]}" aria-labelledby="{sec["id"]}-title">\n  {inner}\n</section>'


def reviewed_line(spec, reviewed):
    if not reviewed:
        return ''
    verb, month = reviewed
    return ('\n      <p class="svc-reviewed">\n        <img src="/images/team/portrait/eric-chaghouri-160.webp" width="160" height="200" alt="" decoding="async">\n'
            f'        <span>{verb} <strong>Dr. Eric Chaghouri, MD</strong>, our medical director. {month}</span>\n      </p>')


def main_html(spec, reviewed):
    hero = spec['hero']
    key = hero['img']
    folder, w, h, has_small = IMAGES[key]
    tall = h > w
    small, full, *_ = img_src(key)
    srcset = f' srcset="{small} 800w, {full} {w * 2}w" sizes="(max-width: 899px) 92vw, 520px"' if has_small else ''
    note = ''
    if hero.get('note'):
        big, smallline = hero['note']
        note = f'\n      <p class="svc-sticky" aria-label="{esc(big)}, {esc(smallline)}"><span>{esc(big)}</span>{esc(smallline)}</p>'
    jump = ''.join(f'\n      <li><a href="#{s["id"]}">{esc(s["nav"])}</a></li>' for s in spec['sections'])
    parts = [f'''<main class="svc">

<!-- Generated by scripts/service_pages/build.py from content/{spec["slug"].replace("/", "__")}.json. Edit the JSON, not this markup. -->
<section class="svc-hero" aria-labelledby="svc-title">
  <div class="container svc-hero-grid">
    <div class="svc-hero-copy">
      <h1 id="svc-title" class="svc-line">{esc(spec["h1"])}</h1>
      <p class="svc-sub">{md(spec["sub"])}</p>
      <div class="cta-stack svc-hero-cta">
        {VERIFY.format(key="hero")}
        {PROOF.replace(' loading="lazy"', '')}
      </div>{reviewed_line(spec, reviewed)}
    </div>
    <div class="svc-hero-media">
      <figure class="snap svc-snap-main{" svc-snap-main--tall" if tall else ""}">
        <img src="{small}"{srcset} width="{w}" height="{h}" fetchpriority="high" decoding="async" alt="{esc(hero["alt"])}">
        <figcaption>{esc(hero["caption"])}</figcaption>
      </figure>{note}
    </div>
  </div>
</section>

<nav class="svc-jump" aria-label="On this page">
  <div class="container">
    <ol class="svc-jump-list">{jump}
    </ol>
  </div>
  <span class="svc-jump-progress" aria-hidden="true"></span>
</nav>
''']
    tones, flip = [], False
    for s in spec['sections']:
        if (s.get('block') or {}).get('type') == 'insurance':
            tones.append('dark')
        else:
            tones.append('tint' if flip else 'plain')
        flip = not flip
    for s, tone in zip(spec['sections'], tones):
        parts.append('\n' + section_html(s, tone) + '\n')
    banner_line = spec.get('banner_line', 'Most people start within days of their first call.')
    parts.append(f'''
{LAUREL}
<section class="cta-banner" aria-label="Final call to action">
  <div class="cta-banner-bg" style="background-image: url('/images/community/community-sunset.webp'); background-position: center 38%;"></div>
  <div class="cta-banner-overlay"></div>
  <div class="cta-banner-content">
    <span class="cta-meta"><i data-lucide="shield-check"></i> Confidential · Free · 24/7</span>
    <h2>Let's get you scheduled.</h2>
    <p>Verify your insurance in about a minute, or call our Los Angeles admissions team and we'll walk you through every step. Free and confidential.</p>
    <p class="svc-banner-soon"><i data-lucide="clock"></i><span>{esc(banner_line)}</span></p>
    <div class="cta-stack cta-stack--dark">
      {PHONE_DARK}
      {VERIFY.format(key="final")}
      {PROOF}
    </div>
  </div>
</section>

</main>

<script>
// Jump bar: highlight the section in view, keep its chip visible on phones,
// and fill the gold progress line as the page scrolls.
(function () {{
  var bar = document.querySelector('.svc-jump');
  if (!bar) return;
  var links = Array.prototype.slice.call(bar.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (a) {{ return document.getElementById(a.getAttribute('href').slice(1)); }});
  var progress = bar.querySelector('.svc-jump-progress');
  var list = bar.querySelector('.svc-jump-list');
  var current = -1;
  function update() {{
    var top = bar.getBoundingClientRect().bottom;
    var line = top + (window.innerHeight - top) * 0.3;
    var idx = -1;
    sections.forEach(function (s, i) {{ if (s && s.getBoundingClientRect().top <= line) idx = i; }});
    if (idx !== current) {{
      links.forEach(function (a, i) {{
        a.classList.toggle('is-active', i === idx);
        if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      }});
      if (idx >= 0 && list.scrollWidth > list.clientWidth) {{
        list.scrollTo({{ left: links[idx].offsetLeft - 16, behavior: 'smooth' }});
      }}
      current = idx;
    }}
    var first = sections[0], last = sections[sections.length - 1];
    if (first && last && progress) {{
      var start = first.getBoundingClientRect().top + window.scrollY - top;
      var end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      var p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }}
  }}
  var ticking = false;
  window.addEventListener('scroll', function () {{
    if (!ticking) {{ ticking = true; requestAnimationFrame(function () {{ update(); ticking = false; }}); }}
  }}, {{ passive: true }});
  window.addEventListener('resize', update);
  update();
}})();
</script>
''')
    return ''.join(parts)


# ── Page surgery ──────────────────────────────────────────────────────────
def body_bounds(t):
    nm = t.index('<nav class="nav-mobile"')
    start = t.index('</nav>', nm) + len('</nav>')
    foot = t.index('<footer')
    c = t.rfind('<!-- Footer -->', start, foot)
    end = c if c != -1 else foot
    return start, end


def current_reviewed(t):
    """The existing byline's verb and month, so the date never moves without Dr. Eric's review."""
    m = re.search(r'<p class="svc-reviewed">.*?<span>(.*?) <strong>Dr\. Eric Chaghouri, MD</strong>, our medical director\. ([A-Z][a-z]+ \d{4})</span>', t, re.S)
    if m:
        return m.group(1), m.group(2)
    m = re.search(r'medical-review-byline">(.*?)</div>', t, re.S)
    if not m:
        return None
    txt = re.sub(r'\s+', ' ', re.sub('<[^>]+>', ' ', m.group(1)))
    month = re.search(r'Updated ([A-Z][a-z]+ \d{4})', txt)
    verb = 'Care led by' if txt.strip().startswith('Care led by') else 'Medically reviewed by'
    return verb, month.group(1) if month else None


def faq_schema(spec):
    items = []
    for s in spec['sections']:
        items.append({'@type': 'Question', 'name': s['q'],
                      'acceptedAnswer': {'@type': 'Answer', 'text': html.unescape(plain(s['a']))}})
    return {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': items}


def render(spec, t):
    start, end = body_bounds(t)
    reviewed = current_reviewed(t)
    new_main = main_html(spec, reviewed)
    t = t[:start] + '\n\n' + new_main + '\n' + t[end:]
    # FAQPage: drop every existing copy (head or body), add the generated one before </head>
    t = re.sub(r'\s*<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "FAQPage".*?</script>', '', t, flags=re.S)
    t = re.sub(r'\s*<script type="application/ld\+json">(?:(?!</script>).)*?"@type":\s*"FAQPage"(?:(?!</script>).)*?</script>', '', t, flags=re.S)
    faq = json.dumps(faq_schema(spec), indent=2, ensure_ascii=False)
    # page-scoped pilot styles (PHP) go; the shared stylesheet replaces them
    t = re.sub(r'<style>\n  /\* Service page layout.*?</style>', '', t, flags=re.S)
    t = re.sub(r'<style>\n  /\* CTA TRUST ROW, same as the About pages and the homepage\. \*/.*?</style>', '', t, flags=re.S)
    # hero preload: one, for the new hero image
    t = re.sub(r'\n?<link rel="preload" as="image"[^>]*>', '', t)
    key = spec['hero']['img']
    small, full, w, h, has_small = img_src(key)
    preload = (f'<link rel="preload" as="image" href="{small}" imagesrcset="{small} 800w, {full} {w * 2}w" imagesizes="(max-width: 899px) 92vw, 520px" fetchpriority="high">'
               if has_small else f'<link rel="preload" as="image" href="{small}" fetchpriority="high">')
    link = CSS_LINK.format(v=CSS_VERSION)
    t = re.sub(r'\n?<link rel="stylesheet" href="/css/service\.min\.css\?v=\d+">', '', t)
    m = re.search(r'<link rel="stylesheet" href="[./]*css/styles\.min\.css\?v=\d+">', t)
    t = t[:m.end()] + '\n  ' + link + '\n' + preload + t[m.end():]
    t = t.replace('</head>', f'<script type="application/ld+json">\n{faq}\n</script>\n</head>', 1)
    return t


# ── Lint ──────────────────────────────────────────────────────────────────
def visible_text(t):
    s, e = body_bounds(t)
    body = re.sub(r'<script.*?</script>|<style.*?</style>|<svg.*?</svg>', ' ', t[s:e], flags=re.S)
    ld = ' '.join(re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S))
    return html.unescape(re.sub(r'<[^>]+>', ' ', body)) + ' ' + ld


def spec_texts(spec):
    """(where, text) for every piece of copy in the spec."""
    out = [('sub', spec['sub']), ('hero.caption', spec['hero']['caption']), ('hero.alt', spec['hero']['alt'])]
    if spec['hero'].get('note'):
        out += [('hero.note', ' '.join(spec['hero']['note']))]
    if spec.get('banner_line'):
        out.append(('banner_line', spec['banner_line']))
    for s in spec['sections']:
        out += [(f'{s["id"]}.nav', s['nav']), (f'{s["id"]}.a', s['a'])]
        if s.get('note'):
            out.append((f'{s["id"]}.note', s['note']))
        b = s.get('block') or {}
        for k in ('signs', 'items'):
            for i, x in enumerate(b.get(k, [])):
                if isinstance(x, str):
                    out.append((f'{s["id"]}.{k}[{i}]', x))
                else:
                    out += [(f'{s["id"]}.{k}[{i}]', ' '.join(str(v) for kk, v in x.items() if kk in ('t', 'd')))]
        for i, r in enumerate(b.get('rows', [])):
            out.append((f'{s["id"]}.rows[{i}]', ' '.join(r)))
        for p in b.get('photos', []) or []:
            out.append((f'{s["id"]}.photo', p[1] + ' ' + p[2]))
        if b.get('card'):
            out.append((f'{s["id"]}.card', b['card']['title'] + ' ' + b['card']['text']))
        for st in b.get('steps', []):
            out.append((f'{s["id"]}.step', st['t'] + ' ' + st['d']))
        for c in b.get('cols', []):
            out.append((f'{s["id"]}.col', c['t'] + ' ' + ' '.join(c['rows'])))
    return out


def lint(spec, t_old, allowed_links):
    errs, warns = [], []
    slug = spec['slug']
    texts = spec_texts(spec)
    old = visible_text(t_old)
    facts = old + ' ' + GLOBAL_FACTS
    for where, txt in texts:
        p = plain(txt)
        low = p.lower()
        if '—' in p or ' – ' in p:
            errs.append(f'{where}: em/en dash')
        if '?' in p:
            errs.append(f'{where}: question mark outside a heading')
        for w in BANNED:
            if re.search(r'\b' + re.escape(w) + r'\b', low):
                errs.append(f'{where}: banned word "{w}"')
        for w in BANNED_INSURANCE:
            if w in low:
                errs.append(f'{where}: insurance wording "{w}"')
        for w in FLAG:
            if re.search(r'(?<![a-z])' + re.escape(w) + r'(?![a-z])', low):
                warns.append(f'{where}: review "{w}"')
        for num in re.findall(r'\d+(?:[.,:]\d+)*\+?', p):
            if num not in facts:
                errs.append(f'{where}: number "{num}" is not on the old page or in the confirmed facts')
    for s in spec['sections']:
        if not s['q'].endswith('?'):
            errs.append(f'{s["id"]}: heading should be the visitor\'s question')
        if len(plain(s['a']).split()) > 75:
            warns.append(f'{s["id"]}: answer is {len(plain(s["a"]).split())} words (aim for 60 or fewer)')
        b = s.get('block') or {}
        if b.get('type') == 'cards':
            for c in b['items']:
                if c['icon'] not in ICONS:
                    errs.append(f'{s["id"]}: icon "{c["icon"]}" not in the icon list')
        if b.get('type') == 'team':
            for k in b['people']:
                if k not in PEOPLE:
                    errs.append(f'{s["id"]}: unknown person {k}')
        for r in [b.get('review')] if b.get('review') else []:
            if r not in REVIEWS:
                errs.append(f'{s["id"]}: unknown review {r}')
        for p in b.get('photos', []) or []:
            if p[0] not in IMAGES:
                errs.append(f'{s["id"]}: unknown image {p[0]}')
    if spec['hero']['img'] not in IMAGES:
        errs.append(f'hero: unknown image {spec["hero"]["img"]}')
    # links
    hrefs = []
    for _, txt in texts:
        hrefs += [m.group(2) for m in LINK_RE.finditer(txt)]
    for s in spec['sections']:
        b = s.get('block') or {}
        hrefs += [st['href'] for st in b.get('steps', []) if st.get('href')]
        hrefs += [i['href'] for i in b.get('items', []) if isinstance(i, dict) and i.get('href')]
        if b.get('type') == 'team' and b.get('creds', True):
            hrefs.append('/team')
    internal = [h.split('#')[0] for h in hrefs if h.startswith('/')]
    for h in internal:
        if h not in allowed_links and h not in ALWAYS_OK:
            errs.append(f'link {h} is not one of this page\'s current links (silo rule)')
    for h in hrefs:
        if not h.startswith(('/', 'https://', 'tel:')):
            errs.append(f'link {h} must be root-absolute')
    up = UPLINK.get(slug, HOME_UP)
    sub_links = {m.group(2): m.group(1) for m in LINK_RE.finditer(spec['sub'])}
    if up[0] not in sub_links:
        errs.append(f'sub: must carry the up-link to {up[0]}')
    elif up[1] and sub_links[up[0]] != up[1]:
        errs.append(f'sub: up-link anchor should be "{up[1]}"')
    dropped = [h for h in allowed_links if h not in internal and h not in ALWAYS_OK and not h.startswith('/blog/')]
    if dropped:
        warns.append(f'links on the old page not kept: {", ".join(dropped)}')
    reviews = [ (s.get('block') or {}).get('review') for s in spec['sections'] if (s.get('block') or {}).get('review')]
    if len(reviews) != len(set(reviews)):
        errs.append('the same review is used twice on this page')
    ids = [s['id'] for s in spec['sections']]
    if len(ids) != len(set(ids)):
        errs.append('duplicate section ids')
    ctas = sum(1 for s in spec['sections'] if s.get('cta') or (s.get('block') or {}).get('type') == 'insurance'
               or ((s.get('block') or {}).get('type') == 'fit' and (s.get('block') or {}).get('card')))
    if ctas < 3:
        warns.append(f'only {ctas + 2} Verify buttons (hero + {ctas} + banner); PHP has 7')
    words = sum(len(plain(x).split()) for _, x in texts)
    if not 500 <= words <= 1300:
        warns.append(f'{words} words of copy (PHP is about 1,000)')
    return errs, warns


def check_html(t):
    from html.parser import HTMLParser

    class P(HTMLParser):
        def __init__(self):
            super().__init__()
            self.stack, self.bad = [], 0

        def handle_starttag(self, tag, a):
            if tag not in VOID:
                self.stack.append(tag)

        def handle_endtag(self, tag):
            if tag in VOID:
                return
            if self.stack and self.stack[-1] == tag:
                self.stack.pop()
            else:
                self.bad += 1
    p = P()
    p.feed(t)
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
        json.loads(m.group(1))
    return p.stack, p.bad


# ── CLI ───────────────────────────────────────────────────────────────────
def load_specs(slugs):
    files = sorted(os.listdir(CONTENT))
    specs = []
    for f in files:
        if not f.endswith('.json'):
            continue
        spec = json.load(open(os.path.join(CONTENT, f), encoding='utf-8'))
        spec['slug'] = f[:-5].replace('__', '/')
        if not slugs or spec['slug'] in slugs:
            specs.append(spec)
    return specs


def allowed_links_for(slug):
    path = os.path.join(os.path.dirname(__file__), 'allowed_links.json')
    return set(json.load(open(path)).get(slug, {}))


def build_css():
    src = os.path.join(ROOT, 'css', 'service.css')
    out = os.path.join(ROOT, 'css', 'service.min.css')
    subprocess.run(['npx', '--yes', 'esbuild', src, '--minify', f'--outfile={out}', '--log-level=warning'], check=True)
    print('wrote css/service.min.css')


def main(argv):
    if '--css' in argv:
        build_css()
        return 0
    check = '--check' in argv
    slugs = [a for a in argv if not a.startswith('--')]
    specs = load_specs(slugs)
    if not specs:
        print('no content files matched')
        return 1
    failed = 0
    for spec in specs:
        path = os.path.join(ROOT, spec['slug'] + '.html')
        t_old = open(path, encoding='utf-8').read()
        t_facts = subprocess.run(['git', 'show', f'{FACTS_COMMIT}:{spec["slug"]}.html'], cwd=ROOT,
                                 capture_output=True, text=True, check=True).stdout
        errs, warns = lint(spec, t_facts, allowed_links_for(spec['slug']))
        new = render(spec, t_old)
        stack, bad = check_html(new)
        if stack or bad:
            errs.append(f'generated HTML does not balance: open {stack[-3:]}, {bad} stray closes')
        status = 'FAIL' if errs else ('ok, with notes' if warns else 'ok')
        print(f'{spec["slug"]}: {status}')
        for e in errs:
            print('   ERROR', e)
        for w in warns:
            print('   note ', w)
        if errs:
            failed += 1
            continue
        if not check:
            open(path, 'w', encoding='utf-8').write(new)
    print(f'{len(specs) - failed}/{len(specs)} passed' + (' (check only, nothing written)' if check else ''))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
