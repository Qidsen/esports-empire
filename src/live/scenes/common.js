import * as THREE from 'three';

export function makeRenderer(gl, gfx = 0) {
  const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
  const canvas = { width: w, height: h, style: {}, addEventListener() { }, removeEventListener() { }, clientWidth: w, clientHeight: h, getContext: () => gl };
  if (!gl.getContextAttributes) gl.getContextAttributes = () => ({ alpha: true, antialias: false, depth: true, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false });
  const r = new THREE.WebGLRenderer({ canvas, context: gl, antialias: false, powerPreference: 'high-performance' });
  r.setPixelRatio(1); r.setSize(w, h, false);
  r.shadowMap.enabled = gfx === 0; r.shadowMap.type = THREE.PCFShadowMap;
  r.toneMapping = gfx >= 2 ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.15;
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}
let _glow = null;
export function glowTex() {
  if (_glow) return _glow;
  const n = 64, d = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const dx = (x - n / 2 + 0.5) / (n / 2), dy = (y - n / 2 + 0.5) / (n / 2); const r = Math.sqrt(dx * dx + dy * dy); const a = Math.max(0, 1 - r); const v = Math.pow(a, 1.8); const i = (y * n + x) * 4; d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = Math.round(v * 255); }
  _glow = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); _glow.needsUpdate = true; return _glow;
}
export function gridTex(c1, c2, lines = 8) {
  const n = 128, d = new Uint8Array(n * n * 4); const a = new THREE.Color(c1), b = new THREE.Color(c2);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const on = (x % (n / lines) < 1) || (y % (n / lines) < 1); const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1; const k = on ? 0.35 : 0.1 * Math.abs(noise); const i = (y * n + x) * 4; d[i] = (a.r + (b.r - a.r) * k) * 255; d[i + 1] = (a.g + (b.g - a.g) * k) * 255; d[i + 2] = (a.b + (b.b - a.b) * k) * 255; d[i + 3] = 255; }
  const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t;
}
export function stripeTex(c1, c2, n = 10) {
  const W = 16, Hh = 256, d = new Uint8Array(W * Hh * 4); const a = new THREE.Color(c1), b = new THREE.Color(c2);
  for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { const c = Math.floor(y / (Hh / n)) % 2 ? a : b; const i = (y * W + x) * 4; d[i] = c.r * 255; d[i + 1] = c.g * 255; d[i + 2] = c.b * 255; d[i + 3] = 255; }
  const t = new THREE.DataTexture(d, W, Hh, THREE.RGBAFormat); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t;
}
export const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? 0.6, metalness: o.m ?? 0.1, emissive: o.e ? new THREE.Color(o.e) : undefined, emissiveIntensity: o.ei ?? 1, transparent: !!o.t, opacity: o.t ?? 1, map: o.map });
export function box(w, h, d, mat, x = 0, y = 0, z = 0, cast = true) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; return m; }
export function cyl(rt, rb, h, mat, seg = 16) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.castShadow = true; m.receiveShadow = true; return m; }
export function sph(r, mat, seg = 16) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), mat); m.castShadow = true; return m; }
export function glowSprite(color, size = 1, op = 1) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.set(size, size, 1); return m; }
export function lights(scene, o = {}) {
  const hemi = new THREE.HemisphereLight(o.sky || '#b9d4ff', o.ground || '#2a2018', o.hemi ?? 0.9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(o.sun || '#fff4e0', o.sunI ?? 2.4); sun.position.set(...(o.sunPos || [18, 32, 12])); sun.castShadow = true;
  const s = o.shadow || 30; sun.shadow.camera.left = -s; sun.shadow.camera.right = s; sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s; sun.shadow.camera.near = 1; sun.shadow.camera.far = 120; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target); return { hemi, sun };
}
// --- characters ---
export function makeSoldier(color, accent) {
  const g = new THREE.Group(); const body = std(color, { r: 0.55, m: 0.2 }); const dark = std('#1b1f27', { r: 0.7 }); const skin = std('#d9a37e', { r: 0.8 });
  const legL = box(0.22, 0.75, 0.24, dark, -0.14, 0.38, 0); const legR = box(0.22, 0.75, 0.24, dark, 0.14, 0.38, 0);
  const torso = box(0.62, 0.72, 0.36, body, 0, 1.12, 0); const vest = box(0.66, 0.42, 0.4, std(accent || '#2c3442', { r: 0.4, m: 0.4 }), 0, 1.2, 0);
  const head = sph(0.2, skin, 12); head.position.set(0, 1.68, 0); const helm = new THREE.Mesh(new THREE.SphereGeometry(0.235, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark); helm.position.set(0, 1.72, 0); helm.castShadow = true;
  const armL = box(0.16, 0.6, 0.18, body, -0.4, 1.12, 0.12); const armR = box(0.16, 0.6, 0.18, body, 0.4, 1.12, 0.12); armL.rotation.x = -0.9; armR.rotation.x = -0.9;
  const gun = box(0.09, 0.14, 0.85, std('#111318', { m: 0.7, r: 0.3 }), 0.12, 1.15, 0.55);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 24), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03;
  g.add(legL, legR, torso, vest, head, helm, armL, armR, gun, ring);
  g.userData = { legL, legR, ring, body, mats: [body], walk: Math.random() * 6 };
  return g;
}
export function animWalk(g, speed, t) { const u = g.userData; const a = Math.sin(t * 9 + u.walk) * Math.min(1, speed) * 0.6; u.legL.rotation.x = a; u.legR.rotation.x = -a; }
export function makeHero(color, shape = 0, scale = 1) {
  const g = new THREE.Group(); const mat = std(color, { r: 0.35, m: 0.35, e: color, ei: 0.25 }); const dark = std('#20242e', { r: 0.6, m: 0.3 });
  const base = cyl(0.5, 0.62, 0.9, dark, 12); base.position.y = 0.45;
  const torso = shape % 3 === 0 ? cyl(0.42, 0.34, 0.9, mat, 12) : shape % 3 === 1 ? box(0.8, 0.9, 0.55, mat) : new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 10), mat);
  torso.position.y = 1.3; torso.castShadow = true;
  const head = sph(0.28, std('#e8d8c8', { r: 0.6 }), 12); head.position.y = 2.0;
  const crest = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), std(color, { e: color, ei: 1.4 })); crest.position.y = 2.45;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.95, 28), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
  const glow = glowSprite(color, 2.4, 0.5); glow.position.y = 0.2;
  g.add(base, torso, head, crest, ring, glow); g.scale.setScalar(scale);
  g.userData = { crest, ring, mat };
  return g;
}
export function makeCar(color) {
  const g = new THREE.Group(); const paint = std(color, { r: 0.25, m: 0.6 }); const dark = std('#0e1116', { r: 0.4, m: 0.5 }); const glass = std('#9fd6ff', { r: 0.1, m: 0.9, t: 0.7 });
  const chassis = box(1.3, 0.38, 2.4, paint, 0, 0.42, 0); const nose = box(1.2, 0.22, 0.6, paint, 0, 0.36, 1.35); const cabin = box(1.0, 0.36, 1.0, glass, 0, 0.78, -0.15); const spoiler = box(1.3, 0.08, 0.3, dark, 0, 0.85, -1.15);
  g.add(chassis, nose, cabin, spoiler);
  const wheels = [];[[-0.7, 0.85], [0.7, 0.85], [-0.7, -0.8], [0.7, -0.8]].forEach(([x, z]) => { const w = cyl(0.32, 0.32, 0.26, dark, 14); w.rotation.z = Math.PI / 2; w.position.set(x, 0.32, z); g.add(w); wheels.push(w); });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.4, 10), new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); flame.rotation.x = -Math.PI / 2; flame.position.set(0, 0.5, -1.9);
  const fglow = glowSprite('#ff8a1f', 2.2, 0.7); fglow.position.set(0, 0.5, -1.7);
  const under = glowSprite(color, 3.2, 0.35); under.position.y = 0.08;
  g.add(flame, fglow, under);
  g.userData = { wheels, flame, fglow };
  return g;
}
// --- particles ---
export class Bursts {
  constructor(scene) { this.scene = scene; this.list = []; }
  add(pos, color, n = 24, speed = 8, life = 0.9, size = 0.6) {
    const geo = new THREE.BufferGeometry(); const p = new Float32Array(n * 3); const v = []; for (let i = 0; i < n; i++) { p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z; const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI; v.push(new THREE.Vector3(Math.cos(th) * Math.sin(ph), Math.abs(Math.cos(ph)) * 0.8 + 0.2, Math.sin(th) * Math.sin(ph)).multiplyScalar(speed * (0.4 + Math.random() * 0.8))); }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const mat = new THREE.PointsMaterial({ color, size, map: glowTex(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat); this.scene.add(pts); this.list.push({ pts, v, life, t: 0 });
  }
  update(dt) {
    this.list = this.list.filter(b => { b.t += dt; const a = b.pts.geometry.attributes.position; for (let i = 0; i < b.v.length; i++) { a.array[i * 3] += b.v[i].x * dt; a.array[i * 3 + 1] += b.v[i].y * dt; a.array[i * 3 + 2] += b.v[i].z * dt; b.v[i].y -= 9 * dt * 0.5; b.v[i].multiplyScalar(1 - dt * 1.5); } a.needsUpdate = true; b.pts.material.opacity = Math.max(0, 1 - b.t / b.life); if (b.t > b.life) { this.scene.remove(b.pts); b.pts.geometry.dispose(); b.pts.material.dispose(); return false; } return true; });
  }
}
export class Tracers {
  constructor(scene) { this.scene = scene; this.list = []; }
  add(a, b, color = '#ffe08a', life = 0.18) { const geo = new THREE.BufferGeometry().setFromPoints([a.clone(), b.clone()]); const mat = new THREE.LineBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending }); const l = new THREE.Line(geo, mat); this.scene.add(l); const f = glowSprite(color, 1.6, 1); f.position.copy(a); this.scene.add(f); this.list.push({ l, f, t: 0, life }); }
  update(dt) { this.list = this.list.filter(x => { x.t += dt; const k = Math.max(0, 1 - x.t / x.life); x.l.material.opacity = k; x.f.material.opacity = k; if (x.t > x.life) { this.scene.remove(x.l, x.f); x.l.geometry.dispose(); return false; } return true; }); }
}
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
export function camOrbit(cam, target, radius, height, angle) { cam.position.set(target.x + Math.cos(angle) * radius, height, target.z + Math.sin(angle) * radius); cam.lookAt(target); }
