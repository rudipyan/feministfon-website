/* Shared scroll-driven fluid mesh-gradient background.
   Used by index.html, hakkimizda.html, duyurular.html, yayinlar.html —
   previously this whole block was copy-pasted per page as a flat 2-point
   linear-gradient. Replaced with a 2-layer scene per section (1 drifting
   radial "bloom" + the section's own --flow-*-a/-b pair as the linear
   base), per the Fable design brief on making the gradient read as
   multi-colour/fluid instead of a flat two-tone band.

   Base colors still come from tokens-brand.css (--flow-<name>-a/-b), same
   as before — only the bloom choreography below is new. Every bloom color
   is one of the institution's brand primaries used for this arc (blue
   #285EEA, purple #6D1283, coral #D8563F — see tokens-brand.css); nothing
   invented. Each section's bloom is a different color from its own base,
   which is what keeps every frame showing more than one hue without
   over-crowding it. Trimmed to one bloom per scene
   (was two) per client feedback: fewer simultaneous colors, calmer scenes
   to match how little content each page actually has. Only four unique
   scenes exist (blue/story/work/close, one per base color) — every other
   waypoint aliases whichever of the four shares its base color, see below.
   See PROJECT-HISTORY for why the fixed-layer mechanic itself (background
   painted on #flow-bg, never on the section) must not change.

   Per client feedback the flat brand hues read as too intense/tiring across
   a full-bleed scrolling background, so every base and bloom color below is
   desaturated (pulled toward its own gray) by DESATURATE before use —
   softer without going pale, so contrast with the sitewide white text
   (--color-ink) holds up.

   The homepage hero is a special case: it now sits under a fixed coral-reef
   photo (#hero-reef-bg, painted with the same "fixed layer, not on the
   section" discipline as #flow-bg) that crossfades out as the user scrolls
   from hero into Hikayemiz — see updateFlow() below. Its own --flow-hero-*
   base color was moved to purple (tokens-brand.css) so the reveal underneath
   is the same purple as Hikayemiz, not a color jump. The old blue "hero"
   scene — still used elsewhere on the site (duyuru1/duyuru5) — lives on
   below as SCENES.blue.

   The closing İletişim section is a deliberate exception to the blue →
   purple → coral arc: per client feedback its color didn't read as a real
   palette hue, so it now runs its own scene — base green (a deepened tint
   of --color-green #009F74, see tokens-brand.css --color-green-deep; the
   literal swatch was too light to hold contrast under the sitewide white
   text) with a blue bloom — instead of aliasing SCENES.blue. */
(function () {
  var EMPTY_BLOBS = [];
  var started = false;
  var DESATURATE = 0.15; // 0 = original brand hue, 1 = flat gray

  function desaturate(rgb, amount) {
    var gray = Math.round(rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114);
    return [
      Math.round(rgb[0] + (gray - rgb[0]) * amount),
      Math.round(rgb[1] + (gray - rgb[1]) * amount),
      Math.round(rgb[2] + (gray - rgb[2]) * amount)
    ];
  }

  var BLUE   = desaturate([ 40, 94,234], DESATURATE);
  var PURPLE = desaturate([109, 18,131], DESATURATE);
  var CORAL  = desaturate([216, 86, 63], DESATURATE);

  var SCENES = {
    blue: [ // base: blue — bloom: purple
      { x: 78, y: 18, rx: 62, ry: 78, c: PURPLE.concat(0.4) }
    ],
    story: [ // base: purple — bloom: blue
      { x: 85, y: 12, rx: 60, ry: 72, c: BLUE.concat(0.4)  }
    ],
    work: [ // base: coral — bloom: purple
      { x: 82, y: 78, rx: 58, ry: 68, c: PURPLE.concat(0.4) }
    ],
    close: [ // base: green — bloom: blue — the İletişim exception, see file header
      { x: 78, y: 18, rx: 62, ry: 78, c: BLUE.concat(0.4) }
    ]
  };
  // Every other waypoint shares a base color with one of the four scenes
  // above (see tokens-brand.css) — reuse the matching bloom choreography
  // instead of re-authoring near-duplicate data.
  SCENES.hero          = SCENES.story; // purple — homepage hero, under the reef photo
  SCENES.pub           = SCENES.story; // purple
  SCENES.misyon        = SCENES.story; // purple
  SCENES.destekciler   = SCENES.work;  // coral
  SCENES.duyuru1       = SCENES.blue;  // blue
  SCENES.duyuru2       = SCENES.story; // purple
  SCENES.duyuru3       = SCENES.work;  // coral
  SCENES.duyuru4       = SCENES.story; // purple (ping back)
  SCENES.duyuru5       = SCENES.blue;  // blue (ping back)
  SCENES.duyuru6       = SCENES.story; // purple (ping back)

  function hexToRgb(hex) {
    hex = (hex || '').replace('#', '');
    if (hex.length !== 6) return [255, 255, 255];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }

  // Wrapped in a named, re-callable entry point (rather than running only
  // once as a bare IIFE body) because on duyurular.html/en-duyurular.html
  // the [data-flow] elements are injected asynchronously by Sanity content
  // after this script's first pass already ran and found nothing — same
  // timing problem initPubCarouselBehavior solves for the homepage
  // carousel. Exposed as window.initFlowMesh so a module script can call it
  // again once the async content render finishes.
  function initFlowMesh() {
    if (started) return; // already scanning + listening; nothing to redo
    var cssVal = getComputedStyle(document.documentElement);
    var sections = Array.prototype.map.call(document.querySelectorAll('[data-flow]'), function (el) {
      var name = el.dataset.flow;
      var a = cssVal.getPropertyValue('--flow-' + name + '-a').trim();
      var b = cssVal.getPropertyValue('--flow-' + name + '-b').trim();
      return { el: el, baseA: desaturate(hexToRgb(a), DESATURATE), baseB: desaturate(hexToRgb(b), DESATURATE), blobs: SCENES[name] || EMPTY_BLOBS };
    });

    var flowBg = document.getElementById('flow-bg');
    if (!flowBg || !sections.length) return;
    started = true;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
      Math.round(lerp(a[3], b[3], t) * 100) / 100
    ];
  }
  function rgba(c, alpha) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha === undefined ? 1 : alpha) + ')'; }

  // Blooms fade to their own color at alpha 0 (never to the `transparent`
  // keyword) so they don't interpolate through gray fringes.
  function serialize(baseA, baseB, blobs) {
    var layers = blobs.map(function (b) {
      var x = Math.round(b.x * 2) / 2, y = Math.round(b.y * 2) / 2;
      return 'radial-gradient(' + Math.round(b.rx) + '% ' + Math.round(b.ry) + '% at ' + x + '% ' + y + '%, ' +
        rgba(b.c, b.c[3]) + ' 0%, ' + rgba(b.c, 0) + ' 70%)';
    });
    layers.push('linear-gradient(135deg, ' + rgba(baseA) + ', ' + rgba(baseB) + ')');
    return layers.join(', ');
  }

  var lastString = '';
  var ticking = false;
  function updateFlow() {
    ticking = false;
    var mid = window.innerHeight * 0.5;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.getBoundingClientRect().top <= mid) idx = i;
    }
    var cur = sections[idx];
    var next = sections[Math.min(idx + 1, sections.length - 1)];
    // Under reduced motion, t stays 0: each section renders its own static
    // scene with no drift, and only snaps to the next scene when the user
    // actually crosses into a new section — a color-state change, not
    // continuous motion. (Previously reduced-motion users got no per-section
    // color at all; this is a genuine fix, not just a freeze.)
    var t = 0;
    if (next !== cur && !reduceMotion) {
      var span = next.el.getBoundingClientRect().top - cur.el.getBoundingClientRect().top;
      t = span > 0 ? Math.min(1, Math.max(0, (mid - cur.el.getBoundingClientRect().top) / span)) : 0;
      t = Math.round(t * 200) / 200; // quantize so idle/slow-scroll frames can skip the repaint below
    }
    var baseA = lerpColor(cur.baseA.concat(1), next.baseA.concat(1), t);
    var baseB = lerpColor(cur.baseB.concat(1), next.baseB.concat(1), t);
    var blobs = cur.blobs.map(function (b, i) {
      var n = next.blobs[i] || b;
      return {
        x: lerp(b.x, n.x, t), y: lerp(b.y, n.y, t),
        rx: lerp(b.rx, n.rx, t), ry: lerp(b.ry, n.ry, t),
        c: lerpColor(b.c, n.c, t)
      };
    });
    var str = serialize(baseA, baseB, blobs);
    if (str !== lastString) { flowBg.style.backgroundImage = str; lastString = str; }

    // Hero reef photo: fully visible while the hero (always sections[0]) is
    // the current section, crossfades to 0 as the user scrolls into the
    // next section (Hikayemiz), gone for good once they've scrolled past.
    // Reduced motion gets a hard cut instead of a fade — same "snap, don't
    // animate" rule already used for the color interpolation above.
    var heroReef = document.getElementById('hero-reef-bg');
    if (heroReef) {
      var reefOpacity;
      if (idx > 0) { reefOpacity = 0; }
      else if (reduceMotion) { reefOpacity = 1; }
      else { reefOpacity = 1 - t; }
      heroReef.style.opacity = reefOpacity;
    }
  }
  function onScroll() { if (!ticking) { requestAnimationFrame(updateFlow); ticking = true; } }
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateFlow);
  updateFlow();
  }

  initFlowMesh();
  window.initFlowMesh = initFlowMesh;
})();
