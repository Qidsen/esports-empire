// CS2: настоящие раскладки карт (сетка из навмеша), анимированные бойцы Quaternius, маршруты A*, камера-трансляция.
import * as THREE from 'three';
import { std, box, sph, glowSprite, lights, Bursts, Tracers, rng, hash } from './common';
import { loadModel, loadProps, placeProp, makeFighter } from '../assets';
import { CS_MAPS } from '../csmaps';
import { sfx, buzz } from '../../ui/audio';

const THEMES = [
  { floor: '#7d8a5a', floor2: '#5f6d45', wall: '#8f8a76', wall2: '#6f6a58', sky: '#a9c7a0', fog: '#7e9a7a', sun: '#fff1d6', ground: '#2c3522' }, // Ancient
  { floor: '#d9c08e', floor2: '#bfa070', wall: '#c9b48a', wall2: '#9c8a64', sky: '#bfe3ef', fog: '#d9c9a4', sun: '#fff0d0', ground: '#4a3d27' }, // Anubis
  { floor: '#8a8f94', floor2: '#6c7176', wall: '#9aa0a6', wall2: '#5d6268', sky: '#c9d6e3', fog: '#a7b1bb', sun: '#fff6e6', ground: '#2c3035' }, // Cache
  { floor: '#dcc08c', floor2: '#c4a26c', wall: '#e2cfa0', wall2: '#b39466', sky: '#cfe6f5', fog: '#e0cfa6', sun: '#fff1d2', ground: '#4d3c25' }, // Dust II
  { floor: '#b08a6c', floor2: '#8f6c52', wall: '#d2b08c', wall2: '#9c7457', sky: '#f2d9b8', fog: '#cfae8c', sun: '#ffe2b8', ground: '#3b2a1f' }, // Inferno
  { floor: '#dbb892', floor2: '#c29a74', wall: '#e8d0b0', wall2: '#b08c68', sky: '#f3dcc6', fog: '#e2c3a3', sun: '#ffe9cc', ground: '#4f3b2a' }, // Mirage
  { floor: '#8d969e', floor2: '#6f7880', wall: '#b9c3cc', wall2: '#7b8792', sky: '#d4e3f0', fog: '#b4c2cf', sun: '#f6fbff', ground: '#2d3338' }, // Nuke
];
const CT_MAIN = '#2f6fd6', T_MAIN = '#c9a15a';
const C = 1.4, HS = 4 / 45; // размер клетки (м) и масштаб высоты
const RU = { BombsiteA: 'A-сайт', BombsiteB: 'B-сайт', TSpawn: 'респаун T', CTSpawn: 'респаун CT', Middle: 'мид', TopofMid: 'верх мида' };
const prettyPlace = n => !n ? '' : RU[n] || n.replace(/([a-z])([A-Z])/g, '$1 $2');

// ---- сетка карты ----
function mkGrid(M) {
  const { w, h } = M; const walk = i => M.z[i] >= 0;
  const yAt = i => M.z[i] * HS;
  const toW = (gx, gy) => new THREE.Vector3((gx - w / 2) * C, 0, -(gy - h / 2) * C);
  const idx = (gx, gy) => gy * w + gx;
  const cellOf = v => { const gx = Math.round(v.x / C + w / 2), gy = Math.round(-v.z / C + h / 2); return [Math.max(0, Math.min(w - 1, gx)), Math.max(0, Math.min(h - 1, gy))]; };
  // A* с ограничением подъёма
  function path(a, b) {
    const N = w * h; const g = new Float32Array(N).fill(1e9); const from = new Int32Array(N).fill(-1); const closed = new Uint8Array(N);
    const s = idx(a[0], a[1]), t = idx(b[0], b[1]); if (!walk(s) || !walk(t)) return [a, b];
    const heap = []; const push = (i, f) => { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; const x = heap[p]; heap[p] = heap[k]; heap[k] = x; k = p; } };
    const pop = () => { const top = heap[0]; const last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; const x = heap[m]; heap[m] = heap[k]; heap[k] = x; k = m; } } return top; };
    const hx = i => { const dx = (i % w) - b[0], dy = ((i / w) | 0) - b[1]; return Math.sqrt(dx * dx + dy * dy); };
    g[s] = 0; push(s, hx(s));
    const D = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    let it = 0;
    while (heap.length && it++ < 60000) {
      const [, i] = pop(); if (closed[i]) continue; closed[i] = 1; if (i === t) break;
      const x = i % w, y = (i / w) | 0;
      for (const [dx, dy, cst] of D) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const j = idx(nx, ny); if (!walk(j) || closed[j]) continue;
        if (dx && dy && (!walk(idx(x + dx, y)) || !walk(idx(x, y + dy)))) continue;
        const up = (M.z[j] - M.z[i]) * 4; if (up > 66 || up < -260) continue;
        let nearWall = 0; for (const [ex, ey] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const qx = nx + ex, qy = ny + ey; if (qx < 0 || qy < 0 || qx >= w || qy >= h || !walk(idx(qx, qy))) nearWall++; }
        const ng = g[i] + cst + nearWall * 0.35; if (ng < g[j]) { g[j] = ng; from[j] = i; push(j, ng + hx(j)); }
      }
    }
    if (from[t] < 0) return [a, b];
    const out = []; let k = t; while (k >= 0) { out.push([k % w, (k / w) | 0]); if (k === s) break; k = from[k]; } out.reverse();
    return out.filter((p, n) => n === 0 || n === out.length - 1 || n % 2 === 0);
  }
  function near(c, r0, r1, R) { for (let k = 0; k < 240; k++) { const a = R() * Math.PI * 2, r = r0 + R() * (r1 - r0); const gx = Math.round(c[0] + Math.cos(a) * r), gy = Math.round(c[1] + Math.sin(a) * r); if (gx < 0 || gy < 0 || gx >= w || gy >= h) continue; if (walk(idx(gx, gy)) && Math.abs(M.z[idx(gx, gy)] - M.z[idx(c[0], c[1])]) * 4 < 90) return [gx, gy]; } return c; }
  function placeAt(v) { const [gx, gy] = cellOf(v); const p = M.pc[idx(gx, gy)]; return p >= 0 ? M.places[p] : ''; }
  function placeCell(name) { const pi = M.places.indexOf(name); if (pi < 0) return null; const cs = []; M.pc.forEach((p, i) => { if (p === pi) cs.push(i); }); if (!cs.length) return null; const cx = cs.reduce((a, i) => a + i % w, 0) / cs.length, cy = cs.reduce((a, i) => a + ((i / w) | 0), 0) / cs.length; let best = cs[0], bd = 1e9; cs.forEach(i => { const d = (i % w - cx) ** 2 + (((i / w) | 0) - cy) ** 2; if (d < bd) { bd = d; best = i; } }); return [best % w, (best / w) | 0]; }
  return { M, w, h, walk, yAt, toW, idx, cellOf, path, near, placeAt, placeCell };
}

export function createCs(scene, cam, viz) {
  const S = { fighters: {}, built: -1, roundN: -1, plan: null, world: new THREE.Group(), props: null, gl: {}, ready: false, G: null,
    bursts: new Bursts(scene), tracers: new Tracers(scene), smokes: [], bomb: null, ang: 0,
    focus: new THREE.Vector3(), camPos: new THREE.Vector3(0, 40, 40), look: new THREE.Vector3(), shot: null, flashes: [], camDir: new THREE.Vector3(0, 0, -1) };
  scene.add(S.world);
  const L = lights(scene, { shadow: 34, sunPos: [20, 40, 16], sunI: 2.1, hemi: 0.5 });
  L.sun.shadow.mapSize.set(2048, 2048); L.sun.shadow.camera.far = 160;
  Promise.all([loadProps(), loadModel('soldier'), loadModel('enemy')]).then(([props, sol, en]) => { S.props = props; S.gl = { ct: sol, t: en }; S.built = -1; S.ready = true; }).catch(e => { viz.glError = 'models: ' + (e && e.message || e); });

  function wpos(c) { const G = S.G; const v = G.toW(c[0], c[1]); v.y = G.yAt(G.idx(c[0], c[1])); return v; }

  function buildMap(mi) {
    S.world.clear(); const th = THEMES[mi % THEMES.length]; const M = CS_MAPS[mi % CS_MAPS.length]; const G = S.G = mkGrid(M); const R = rng(mi * 31 + 7);
    scene.background = new THREE.Color(th.sky); scene.fog = new THREE.Fog(th.fog, 60, 170);
    L.hemi.color.set(th.sky); L.hemi.groundColor.set(th.ground); L.sun.color.set(th.sun);
    let zmin = 1e9; M.z.forEach(z => { if (z >= 0 && z < zmin) zmin = z; }); const base = zmin * HS - 1.2;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std(th.ground, { r: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = base; S.world.add(ground);
    const geo = new THREE.BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    const walkCells = [], wallCells = [];
    for (let gy = 0; gy < M.h; gy++) for (let gx = 0; gx < M.w; gx++) {
      const i = G.idx(gx, gy);
      if (G.walk(i)) walkCells.push([gx, gy, G.yAt(i)]);
      else { let mx = -1e9; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const x = gx + dx, y = gy + dy; if (x < 0 || y < 0 || x >= M.w || y >= M.h) continue; const j = G.idx(x, y); if (G.walk(j)) mx = Math.max(mx, G.yAt(j)); } if (mx > -1e9) wallCells.push([gx, gy, mx]); }
    }
    const m4 = new THREE.Matrix4(); const col = new THREE.Color();
    const floors = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }), walkCells.length); floors.receiveShadow = true;
    const c1 = new THREE.Color(th.floor).multiplyScalar(0.72), c2 = new THREE.Color(th.floor2).multiplyScalar(0.72);
    walkCells.forEach(([gx, gy, y], n) => { const p = G.toW(gx, gy); m4.makeScale(C * 1.001, Math.max(0.05, y - base), C * 1.001); m4.setPosition(p.x, base, p.z); floors.setMatrixAt(n, m4); col.copy(c1).lerp(c2, ((gx * 7 + gy * 13) % 5) / 8 + hash(gx * 31 + gy) * 0.35); floors.setColorAt(n, col); });
    S.world.add(floors);
    const walls = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.02 }), Math.max(1, wallCells.length)); walls.castShadow = true; walls.receiveShadow = true;
    const w1 = new THREE.Color(th.wall).lerp(new THREE.Color('#ffffff'), 0.12), w2 = new THREE.Color(th.wall2);
    wallCells.forEach(([gx, gy, y], n) => { const p = G.toW(gx, gy); const hgt = y - base + 2.3; m4.makeScale(C, hgt, C); m4.setPosition(p.x, base, p.z); walls.setMatrixAt(n, m4); col.copy(w1).lerp(w2, ((gx >> 2) + (gy >> 2)) % 3 * 0.18 + hash(gx * 11 + gy * 5) * 0.08); walls.setColorAt(n, col); });
    S.world.add(walls);
    [['A', '#ff9a2e'], ['B', '#38c8ff']].forEach(([k, c]) => {
      const p = wpos(M.pts[k]);
      const ring = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.75, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, p.y + 0.04, p.z); S.world.add(ring);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(3.4, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.1 })); disc.rotation.x = -Math.PI / 2; disc.position.set(p.x, p.y + 0.03, p.z); S.world.add(disc);
      const g = glowSprite(c, 5, 0.35); g.position.set(p.x, p.y + 0.4, p.z); S.world.add(g);
    });
    const P = S.props; if (!P) return;
    const cover = ['Crate', 'CardboardBoxes_2', 'SackTrench_Small', 'ExplodingBarrel', 'Pallet', 'Barrier_Single', 'Crate'];
    ['A', 'B'].forEach(k => { for (let n = 0; n < 7; n++) { const c = G.near(M.pts[k], 2.5, 6, R); const p = wpos(c); placeProp(P, cover[n % cover.length], S.world, p.x, p.z, R() * Math.PI, 1, p.y); } });
    let placed = 0;
    for (let k = 0; k < 900 && placed < 40; k++) {
      const [gx, gy, y] = walkCells[Math.floor(R() * walkCells.length)];
      let wallN = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = gx + dx, yy = gy + dy; if (x < 0 || yy < 0 || x >= M.w || yy >= M.h || !G.walk(G.idx(x, yy))) wallN++; }
      if (wallN !== 1) continue;
      const p = G.toW(gx, gy); const nm = ['Crate', 'ExplodingBarrel', 'CardboardBoxes_1', 'Pallet', 'GasTank', 'WoodPlanks', 'TrafficCone', 'Debris_Tires'][placed % 8];
      placeProp(P, nm, S.world, p.x, p.z, R() * Math.PI * 2, 1, y); placed++;
    }
    for (let k = 0; k < 6; k++) { const [gx, gy, y] = walkCells[Math.floor(R() * walkCells.length)]; const p = G.toW(gx, gy); const pl = new THREE.PointLight('#ffcc88', 5, 12); pl.position.set(p.x, y + 4, p.z); S.world.add(pl); }
  }

  function fighterFor(p, side, isCT) {
    const key = p.id + (isCT ? 'c' : 't'); let f = S.fighters[key];
    if (!f) {
      const teamC = side === 'A' ? viz.ca : viz.cb;
      f = makeFighter(isCT ? S.gl.ct : S.gl.t, { main: isCT ? CT_MAIN : T_MAIN, accent: new THREE.Color(teamC).multiplyScalar(0.55).getStyle(), gun: p.role === 1 ? 'Sniper' : 'AK', scale: 1.25 });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.75, 28), new THREE.MeshBasicMaterial({ color: teamC, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; f.add(ring); f.userData.ring = ring;
      f.visible = false; scene.add(f); S.fighters[key] = f;
    }
    return f;
  }

  function planRound(rec) {
    const G = S.G; const M = G.M; const R = rng(rec.n * 97 + (viz.map || 0) * 13);
    const sideT = !rec.ctA ? 'A' : 'B';
    const sk = rec.site || (hash(rec.n * 3.3 + (viz.map || 0)) > 0.5 ? 'A' : 'B'); const ok = sk === 'A' ? 'B' : 'A';
    const site = M.pts[sk], other = M.pts[ok];
    const mid = G.placeCell('Middle') || G.placeCell('TopofMid') || null;
    const tMain = G.path(M.pts.T, site); const tMid = mid ? G.path(M.pts.T, mid).concat(G.path(mid, site).slice(1)) : tMain;
    Object.values(S.fighters).forEach(f => { f.visible = false; });
    const P = {};
    const mk = (list, side) => list.forEach((p, i) => {
      const isT = side === sideT; let st;
      if (isT) {
        const base = (i >= 3 && mid ? tMid : tMain); const s0 = Math.floor(base.length * (0.5 + i * 0.03 + R() * 0.04));
        const pts = base.slice(Math.min(s0, base.length - 2)).concat([G.near(site, 0.5, 3.2, R)]).map(wpos);
        const rush = rec.tT && rec.tT !== 'def'; st = { path: pts, t0: (rush ? 0.04 : 0.08) + i * 0.025, t1: (rush ? 0.46 : 0.56) + i * 0.03, pos: pts[0].clone() };
      } else {
        const stk = rec.tCT; const holdOther = stk === sk ? i >= 4 : stk && stk !== 'std' ? i >= 1 : i >= 3; const hc = G.near(holdOther ? other : site, 2, 7, R); const hold = wpos(hc);
        const rot = holdOther ? G.path(hc, G.near(site, 2, 5, R)).map(wpos) : null;
        st = { hold, rot, t0: 0.42 + R() * 0.08, t1: 0.74 + R() * 0.08, pos: hold.clone() };
      }
      const f = S.ready ? fighterFor(p, side, !isT) : null;
      if (f) { f.visible = true; f.userData.ring.material.opacity = 0.9; const fd = f.userData.fighter; const eco = (side === 'A' ? rec.bA : rec.bB) === 'eco'; fd.setGun(p.role === 1 && !eco ? 'Sniper' : eco ? 'Pistol' : 'AK'); fd.play('Idle', 0); f.position.copy(st.pos); }
      P[p.id] = { side, isT, ...st, dead: null, f };
    });
    mk(viz.pa, 'A'); mk(viz.pb, 'B');
    const n = rec.ev.length; const kills = rec.ev.map((e, i) => ({ ...e, t: 0.4 + 0.52 * (i + 0.5) / Math.max(1, n) + (hash(rec.n + i) - 0.5) * 0.02, done: false }));
    const plant = (!rec.ctA ? rec.A : !rec.A) && (rec.how === 'bomb') || rec.how === 'defuse';
    viz.hud = { n: rec.n, kills: [], dead: {}, planted: false, end: false, site: sk };
    const sitePos = wpos(site);
    S.plan = { rec, site: sitePos, sk, kills, plant, plantT: 0.66, boomT: 0.95, P, smoked: false, boomed: false };
    if (S.bomb) { scene.remove(S.bomb); S.bomb = null; }
    S.smokes.forEach(s => scene.remove(s)); S.smokes = []; S.shot = null;
    const firstT = Object.values(P).find(s => s.isT);
    if (firstT) { S.camDir.copy(sitePos).sub(firstT.pos).setY(0); if (S.camDir.lengthSq() < 0.01) S.camDir.set(0, 0, -1); S.camDir.normalize(); }
  }
  function along(pts, u) {
    if (pts.length < 2) return pts[0].clone();
    let tot = 0; const ls = []; for (let i = 0; i < pts.length - 1; i++) { const l = pts[i].distanceTo(pts[i + 1]); ls.push(l); tot += l; }
    let d = Math.max(0, Math.min(1, u)) * tot; for (let i = 0; i < ls.length; i++) { if (d <= ls[i] || i === ls.length - 1) return pts[i].clone().lerp(pts[i + 1], Math.min(1, d / Math.max(ls[i], 1e-4))); d -= ls[i]; }
    return pts[pts.length - 1].clone();
  }
  const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  function muzzle(st, to) {
    const dir = to.clone().sub(st.pos).setY(0).normalize();
    const p = st.pos.clone().add(dir.clone().multiplyScalar(0.75)); p.y += 1.25;
    const s = glowSprite('#ffd27a', 1.1, 1); s.position.copy(p); scene.add(s); S.flashes.push({ s, t: 0.09 });
    return p;
  }
  function blockedAt(v, h) { const G = S.G; if (!G) return false; const [gx, gy] = G.cellOf(v); const i = G.idx(gx, gy); if (!G.walk(i)) return v.y < G.yAt(i < 0 ? 0 : i) + 6; return v.y - G.yAt(i) < h; }

  const tmp = new THREE.Vector3();
  return {
    update(dt, now) {
      const key = (S.ready ? 1000 : 0) + (viz.map || 0);
      if (S.built !== key) { buildMap(viz.map || 0); S.built = key; S.roundN = -1; }
      const rec = viz.round;
      if (rec && rec.n !== S.roundN && S.G) { S.roundN = rec.n; planRound(rec); }
      const u = rec ? Math.min(1, Math.max(0, (now - viz.roundT0) / viz.roundDur)) : 0;
      const pl = S.plan; const G = S.G;
      if (pl) {
        if (viz.hud) { viz.hud.u = u; if (u > 0.94 && !viz.hud.end) { viz.hud.end = true; if (pl.rec.how === 'defuse') sfx('defuse'); if (pl.rec.A === (viz.us === 'A')) sfx('roundwin'); if (pl.rec.hl) { sfx('cheer', pl.rec.hl.big ? 1 : 0.6); buzz('heavy'); } } }
        pl.kills.forEach(k => {
          if (k.done || u < k.t) return; k.done = true; sfx(k.awp ? 'awp' : 'ak'); if (k.hs) setTimeout(() => sfx('headshot', 0.6), 70); const a = pl.P[k.k], b = pl.P[k.v]; if (!a || !b) return;
          const to = b.pos.clone(); to.y += 1.1; const from = muzzle(a, to);
          S.tracers.add(from, to, a.isT ? '#ffd9a0' : '#cfe6ff'); S.bursts.add(to, '#c81e1e', 16, 3.5, 0.45, 0.35);
          b.dead = { t: u }; a.shoot = { t: u, at: to.clone() };
          if (b.f) b.f.userData.fighter.play('Death', 0.08);
          if (viz.hud) { viz.hud.kills.push({ k: k.k, v: k.v, hs: k.hs, awp: k.awp, A: k.A, at: now, place: prettyPlace(G.placeAt(b.pos)) }); viz.hud.dead[k.v] = true; }
          S.shot = { t0: now, from: a.pos.clone(), to: b.pos.clone() };
        });
        const winT = pl.rec.A ? 'A' : 'B';
        Object.values(pl.P).forEach(st => {
          const prev = st.pos.clone();
          if (!st.dead) {
            if (st.isT) { const k = (u - st.t0) / (st.t1 - st.t0); st.pos.copy(along(st.path, ease(Math.max(0, Math.min(1, k))))); }
            else if (st.rot) { const k = (u - st.t0) / (st.t1 - st.t0); st.pos.copy(k <= 0 ? st.hold : along(st.rot, ease(Math.min(1, k)))); }
            else st.pos.copy(st.hold);
          }
          const v = prev.distanceTo(st.pos) / Math.max(dt, 0.001);
          const f = st.f; if (!f) return; const fd = f.userData.fighter;
          f.position.copy(st.pos);
          if (st.dead) { f.userData.ring.material.opacity = Math.max(0, f.userData.ring.material.opacity - dt * 2); }
          else {
            let face = null;
            if (st.shoot && u - st.shoot.t < 0.06) { face = Math.atan2(st.shoot.at.x - st.pos.x, st.shoot.at.z - st.pos.z); fd.play('Idle_Shoot', 0.06); }
            else if (v > 0.6) { face = Math.atan2(st.pos.x - prev.x, st.pos.z - prev.z); fd.play('Run_Gun', 0.15, Math.min(1.5, Math.max(0.7, v / 5))); }
            else if (pl.plant && st.isT && u > pl.plantT - 0.06 && u < pl.plantT + 0.02 && !st.planted && st.side === (pl.rec.ctA ? 'B' : 'A')) { fd.play('Duck', 0.1); st.planted = true; }
            else if (u > 0.93 && st.side === winT) fd.play(st.isT ? 'Yes' : 'Wave', 0.25);
            else if (!st.planted || u > pl.plantT + 0.05) {
              fd.play('Idle', 0.25);
              if (!st.isT) { const tl = Object.values(pl.P).filter(x => x.isT && !x.dead).sort((x, y) => x.pos.distanceTo(st.pos) - y.pos.distanceTo(st.pos))[0]; const tgt = tl ? tl.pos : pl.site; face = Math.atan2(tgt.x - st.pos.x, tgt.z - st.pos.z); }
            }
            if (face != null) { const cur = f.rotation.y; let dl = face - cur; while (dl > Math.PI) dl -= Math.PI * 2; while (dl < -Math.PI) dl += Math.PI * 2; f.rotation.y = cur + dl * Math.min(1, dt * 10); }
          }
          fd.mixer.update(dt);
        });
        if (!pl.smoked && u > 0.36) {
          pl.smoked = true;
          for (let i = 0; i < 2; i++) { const s = new THREE.Group(); for (let j = 0; j < 10; j++) { const b = sph(0.9 + Math.random() * 0.7, new THREE.MeshStandardMaterial({ color: '#dfe2e6', transparent: true, opacity: 0.5, roughness: 1, depthWrite: false }), 10); b.castShadow = false; b.position.set((Math.random() - 0.5) * 2.8, 0.7 + Math.random() * 1.6, (Math.random() - 0.5) * 2.8); s.add(b); } const p = wpos(G.near(G.M.pts[pl.sk], 4, 8, Math.random)); s.position.copy(p); s.scale.setScalar(0.1); scene.add(s); S.smokes.push(s); }
        }
        S.smokes.forEach(s => { const k = Math.min(1, s.scale.x + dt * 1.6); s.scale.setScalar(k); s.rotation.y += dt * 0.08; });
        if (pl.plant && !S.bomb && u > pl.plantT) {
          const b = new THREE.Group(); b.add(box(0.5, 0.22, 0.34, std('#2b2f36', { m: 0.6, r: 0.4 }))); b.add(box(0.3, 0.06, 0.2, std('#3a7d3a', { e: '#1f5f1f', ei: 0.6 }), 0, 0.14, 0));
          const lg = glowSprite('#ff2a2a', 1.4, 1); lg.position.set(0, 0.3, 0); b.add(lg); b.position.copy(pl.site); b.position.y += 0.11; b.userData.lg = lg; scene.add(b); S.bomb = b; sfx('beep'); pl.nextBeep = now + 900; if (viz.hud) viz.hud.planted = true;
        }
        if (S.bomb) {
          S.bomb.userData.lg.material.opacity = (Math.sin(now / (u > 0.85 ? 50 : 150)) + 1) / 2;
          if (!pl.boomed && now > (pl.nextBeep || 0) && u < 0.95) { sfx('beep', 0.7); pl.nextBeep = now + (u > 0.85 ? 250 : u > 0.75 ? 500 : 900); }
          if (pl.rec.how === 'bomb' && !pl.boomed && u > pl.boomT) { pl.boomed = true; sfx('explosion'); buzz('heavy'); const bp = S.bomb.position.clone(); bp.y += 1; S.bursts.add(bp, '#ffd27a', 100, 18, 1.6, 1.3); S.bursts.add(bp, '#ff5a1f', 70, 11, 1.8, 1.7); S.bursts.add(bp, '#3a3a3a', 40, 6, 2.2, 2.4); S.shake = 0.9; }
        }
      }
      S.flashes = S.flashes.filter(f => { f.t -= dt; f.s.material.opacity = Math.max(0, f.t / 0.09); if (f.t <= 0) { scene.remove(f.s); return false; } return true; });
      S.tracers.update(dt); S.bursts.update(dt);

      // ---- камера-трансляция: один понятный ракурс 3/4 со стороны атаки, плавно ведёт «центр событий» ----
      let wantPos, wantLook;
      if (pl) {
        const alive = Object.values(pl.P).filter(s => !s.dead);
        const tAlive = alive.filter(s => s.isT).map(s => s.pos);
        const tc = tAlive.length ? tAlive.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / tAlive.length) : pl.site.clone();
        // центр событий: между атакой и сайтом, а ближе к концу — сам сайт
        const k = Math.min(1, Math.max(0, (u - 0.3) / 0.3));
        const focus = tc.clone().lerp(pl.site, k * 0.75);
        // свежее убийство слегка притягивает кадр
        if (S.shot && now - S.shot.t0 < 1600) focus.lerp(S.shot.to.clone().lerp(S.shot.from, 0.5), 0.35);
        S.focus.lerp(focus, Math.min(1, dt * 2.2));
        const zoom = u < 0.1 ? 1.5 - u * 5 : (S.shot && now - S.shot.t0 < 1600 ? 0.85 : 1);
        wantPos = S.focus.clone().addScaledVector(S.camDir, -7 * zoom).add(tmp.set(0, 19 * zoom, 0));
        wantLook = S.focus.clone();
        if (u < 0.02) { S.focus.copy(focus); wantPos = S.focus.clone().addScaledVector(S.camDir, -7 * zoom).add(tmp.set(0, 19 * zoom, 0)); S.camPos.copy(wantPos); S.look.copy(S.focus); }
      } else { wantPos = new THREE.Vector3(0, 70, 60); wantLook = new THREE.Vector3(); }
      S.camPos.lerp(wantPos, Math.min(1, dt * 2.2)); S.look.lerp(wantLook, Math.min(1, dt * 3));
      cam.position.copy(S.camPos);
      if (S.shake) { cam.position.x += (Math.random() - 0.5) * S.shake; cam.position.y += (Math.random() - 0.5) * S.shake; S.shake = Math.max(0, S.shake - dt * 1.5); }
      cam.lookAt(S.look);
      L.sun.position.copy(S.focus).add(tmp.set(20, 40, 16)); L.sun.target.position.copy(S.focus);
    },
  };
}
