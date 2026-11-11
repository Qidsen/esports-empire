// CS2: карта из модульных ассетов Quaternius (CC0), анимированные бойцы, камера-трансляция.
import * as THREE from 'three';
import { std, box, sph, glowSprite, lights, Bursts, Tracers, rng, hash } from './common';
import { loadModel, loadProps, placeProp, makeFighter } from '../assets';

// Темы карт по индексу пула: Ancient, Anubis, Cache, Dust II, Inferno, Mirage, Nuke
const THEMES = [
  { floor: ['#5d6b45', '#4a5737'], path: '#7a6f55', sky: '#a9c7a0', fog: '#7e9a7a', sun: '#fff1d6', ground: '#3b4a2e', trees: 10, mood: 'jungle' },
  { floor: ['#d6b981', '#c6a46a'], path: '#e3cfa1', sky: '#bfe3ef', fog: '#d9c9a4', sun: '#fff0d0', ground: '#7a6440', trees: 5, mood: 'desert' },
  { floor: ['#7d8287', '#6c7176'], path: '#9aa0a6', sky: '#c9d6e3', fog: '#a7b1bb', sun: '#fff6e6', ground: '#4a4f55', trees: 0, mood: 'industrial' },
  { floor: ['#d8bd8a', '#c9a974'], path: '#e6d3a8', sky: '#cfe6f5', fog: '#e0cfa6', sun: '#fff1d2', ground: '#8a6f45', trees: 1, mood: 'desert' },
  { floor: ['#a8846a', '#957158'], path: '#c4a58a', sky: '#f2d9b8', fog: '#cfae8c', sun: '#ffe2b8', ground: '#6b4b37', trees: 4, mood: 'town' },
  { floor: ['#d9b48f', '#c99f78'], path: '#ead0b3', sky: '#f3dcc6', fog: '#e2c3a3', sun: '#ffe9cc', ground: '#8d6a4c', trees: 3, mood: 'desert' },
  { floor: ['#8a9299', '#78818a'], path: '#a9b2ba', sky: '#d4e3f0', fog: '#b4c2cf', sun: '#f6fbff', ground: '#4d555c', trees: 0, mood: 'industrial' },
];
const CT_MAIN = '#2f6fd6', T_MAIN = '#c9a15a';

function floorTex(c1, c2, tiles, seed) {
  const n = 256, d = new Uint8Array(n * n * 4); const a = new THREE.Color(c1), b = new THREE.Color(c2); const R = rng(seed);
  const blot = []; for (let i = 0; i < 40; i++) blot.push([R() * n, R() * n, 8 + R() * 30, R()]);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let k = 0.5 + (Math.sin(x * 0.31 + y * 0.17) + Math.sin(x * 0.07 - y * 0.11)) * 0.06;
    for (const [bx, by, r, v] of blot) { const dx = x - bx, dy = y - by; const q = dx * dx + dy * dy; if (q < r * r) k += (v - 0.5) * 0.35 * (1 - q / (r * r)); }
    k += (hash(x * 13.1 + y * 7.7) - 0.5) * 0.18;
    const line = tiles && ((x % (n / tiles)) < 1.5 || (y % (n / tiles)) < 1.5) ? 0.82 : 1;
    const c = a.clone().lerp(b, Math.max(0, Math.min(1, k))).multiplyScalar(line);
    const i = (y * n + x) * 4; d[i] = c.r * 255; d[i + 1] = c.g * 255; d[i + 2] = c.b * 255; d[i + 3] = 255;
  }
  const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; return t;
}

export function createCs(scene, cam, viz) {
  const S = { fighters: {}, built: -1, roundN: -1, plan: null, world: new THREE.Group(), props: null, gl: {}, ready: false,
    bursts: new Bursts(scene), tracers: new Tracers(scene), smokes: [], bomb: null, ang: 0,
    focus: new THREE.Vector3(0, 0, 0), camPos: new THREE.Vector3(0, 24, 30), look: new THREE.Vector3(), shot: null, flashes: [] };
  scene.add(S.world);
  const L = lights(scene, { shadow: 32, sunPos: [18, 34, 14], sunI: 2.0, hemi: 0.45 });
  L.sun.shadow.mapSize.set(2048, 2048);
  S.siteA = new THREE.Vector3(-13, 0, -8); S.siteB = new THREE.Vector3(13, 0, -7);

  Promise.all([loadProps(), loadModel('soldier'), loadModel('enemy')]).then(([props, sol, en]) => { S.props = props; S.gl = { ct: sol, t: en }; S.built = -1; S.ready = true; }).catch(e => { viz.glError = 'models: ' + (e && e.message || e); });

  function buildMap(mi) {
    S.world.clear(); const th = THEMES[mi % THEMES.length]; const R = rng(mi * 31 + 7);
    scene.background = new THREE.Color(th.sky); scene.fog = new THREE.Fog(th.fog, 70, 160);
    L.hemi.color.set(th.sky); L.hemi.groundColor.set(th.ground); L.sun.color.set(th.sun);
    const ft = floorTex(th.floor[0], th.floor[1], th.mood === 'industrial' ? 6 : th.mood === 'town' ? 10 : 0, mi + 3); ft.repeat.set(6, 6);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.95, metalness: 0 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.world.add(floor);
    const outer = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), std(th.ground, { r: 1 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.04; S.world.add(outer);
    // дорожки-маршруты (чуть светлее)
    const pm = new THREE.MeshStandardMaterial({ color: th.path, roughness: 1, transparent: true, opacity: 0.55 });
    [[-12, 6, 4, 18], [12, 6, 4, 18], [0, 0, 3.5, 30], [0, -12, 30, 3.5]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), pm); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.015, z); m.receiveShadow = true; S.world.add(m); });
    // сайты
    [[S.siteA, '#ff9a2e'], [S.siteB, '#38c8ff']].forEach(([s, c]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.85, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(s.x, 0.03, s.z); S.world.add(ring);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.1 })); disc.rotation.x = -Math.PI / 2; disc.position.set(s.x, 0.025, s.z); S.world.add(disc);
      const g = glowSprite(c, 4, 0.35); g.position.set(s.x, 0.3, s.z); S.world.add(g);
    });
    const P = S.props; if (!P) return;
    const put = (n, x, z, r = 0, s = 1, y = 0) => placeProp(P, n, S.world, x, z, r, s, y);
    // периметр: здания и контейнеры
    const STR = ['Structure_1', 'Structure_3', 'Structure_2', 'Structure_4'];
    for (let i = 0; i < 5; i++) { const x = -22 + i * 11; put(STR[(i + mi) % 4], x, -27.5, 0, 1); put(STR[(i + mi + 2) % 4], x, 27.5, Math.PI, 1); }
    for (let i = 0; i < 5; i++) { const z = -22 + i * 11; put(STR[(i + mi + 1) % 4], -27.5, z, Math.PI / 2, 1); put(STR[(i + mi + 3) % 4], 27.5, z, -Math.PI / 2, 1); }
    // разделители линий (контейнеры, местами в два яруса)
    [-6.5, 6.5].forEach((x, k) => {
      for (let j = 0; j < 3; j++) { const z = -1 + j * 4.5; put(j === 1 ? 'Container_Small' : 'Container_Long', x, z, Math.PI / 2); if ((j + k + mi) % 2 === 0) put('Container_Small', x, z, Math.PI / 2, 1, 2.13); }
      put('Fence_Long', x + (k ? 0.4 : -0.4), 12.5, Math.PI / 2); put('SackTrench_Small', x, 11, Math.PI / 2);
    });
    // зоны за сайтами (дальний угол) и у респаунов
    [[-19, -15, 0.3], [19, -14, -0.3]].forEach(([x, z, r]) => { put('Container_Long', x, z, r); put('Container_Small', x - 1.8, z - 2.4, r + 0.2); put('Container_Small', x - 1.8, z - 2.4, r + 0.2, 1, 2.13); });
    // укрытия на сайтах
    [S.siteA, S.siteB].forEach((s, k) => {
      const sg = k ? 1 : -1;
      put('SackTrench', s.x - sg * 0.5, s.z - 4.2, 0); put('Crate', s.x + 3.4 * sg, s.z - 1.5, 0.3); put('Crate', s.x + 3.4 * sg, s.z - 1.5, 0.8, 1, 0.79); put('Crate', s.x + 4.1 * sg, s.z - 0.6, 0.1);
      put('CardboardBoxes_2', s.x - 3.6 * sg, s.z - 2.4, 0.5); put('ExplodingBarrel', s.x - 3.9 * sg, s.z + 0.2); put('Barrier_Single', s.x + 0.4, s.z + 5.6, 0); put('Pallet', s.x + 1.2 * sg, s.z - 2.2, 0.2);
      put('WaterTank_Platform', s.x + 6.5 * sg, s.z - 5, 0);
    });
    // стены-коридоры: кирпич и заборы
    [[-17, 8, 0], [-17, 10.3, 0], [17, 8, 0], [17, 10.3, 0], [-9, -11, Math.PI / 2], [9, -11, Math.PI / 2], [-3.5, 2, Math.PI / 2], [3.5, 2, Math.PI / 2]].forEach(([x, z, r], i) => { put('BrickWall_2', x, z, r, 1.4); });
    for (let i = 0; i < 4; i++) { put('Fence_Long', -20 + i * 1.33, 4.5, 0); put('Fence_Long', 21.3 - i * 1.33, 4.5, 0); }
    [[-21, -6], [21, -6], [-21, 14], [21, 14]].forEach(([x, z], i) => { put('Container_Long', x, z, Math.PI / 2); if (i % 2 === mi % 2) put('Container_Long', x, z, Math.PI / 2, 1, 2.13); });
    // мид и декор
    put('Debris_BrokenCar', 1.2, 3.5, 0.35); put('Debris_Tires', -1.6, 7.8, 0); put('TrafficCone', -1.2, -2.6); put('TrafficCone', 1.8, -3.4); put('CardboardBoxes_1', 2.4, 9.2, 0.6);
    put('TrashContainer', -9.5, 15.5, 0); put('GasTank', 9.6, 16.2); put('Pipes', 9.2, -2.5, 0); put('WoodPlanks', -9.4, -2.4, 0.4); put('Sign', -3.5, 16.5, 0);
    put('SackTrench_Small', 0, -6.5, 0); put('Barrier_Single', -3, 13.5, 0.2); put('Barrier_Single', 3, 13.5, -0.2);
    // фонари со светом
    [[-9, 18], [9, 18], [-4, -16], [4, -16], [-17, -2], [17, -2]].forEach(([x, z], i) => { put('StreetLight', x, z, x < 0 ? Math.PI / 2 : -Math.PI / 2); if (i < 4) { const pl = new THREE.PointLight('#ffcc88', 6, 9); pl.position.set(x + (x < 0 ? 1.5 : -1.5), 5, z); S.world.add(pl); } });
    // деревья
    for (let i = 0; i < th.trees; i++) { const ang = R() * Math.PI * 2; const x = (R() < 0.5 ? -1 : 1) * (18 + R() * 4), z = -20 + R() * 40; put(i % 2 ? 'Tree_1' : 'Tree_2', x, z, ang, 0.8 + R() * 0.4); }
  }

  function fighterFor(p, side, isCT) {
    const key = p.id + (isCT ? 'c' : 't'); let f = S.fighters[key];
    if (!f) {
      const teamC = side === 'A' ? viz.ca : viz.cb;
      f = makeFighter(isCT ? S.gl.ct : S.gl.t, { main: isCT ? CT_MAIN : T_MAIN, accent: new THREE.Color(teamC).multiplyScalar(0.55).getStyle(), gun: p.role === 1 ? 'Sniper' : 'AK' });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 28), new THREE.MeshBasicMaterial({ color: teamC, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.04; f.add(ring); f.userData.ring = ring;
      f.visible = false; scene.add(f); S.fighters[key] = f;
    }
    return f;
  }

  function planRound(rec) {
    const tA = !rec.ctA;
    const site = hash(rec.n * 3.3 + (viz.map || 0)) > 0.5 ? S.siteA : S.siteB; const other = site === S.siteA ? S.siteB : S.siteA;
    const P = {}; const sideT = tA ? 'A' : 'B';
    Object.values(S.fighters).forEach(f => { f.visible = false; });
    const mk = (list, side) => list.forEach((p, i) => {
      const isT = side === sideT; const sx = (i - 2) * 1.6, sz = isT ? 20 : -20;
      const lane = (site.x < 0 ? -12 : 12) + (i - 2) * 0.5;
      const dest = isT ? new THREE.Vector3(site.x + (i - 2) * 1.6, 0, site.z + 3.2 + (i % 2) * 1.6) : (i < 3 ? new THREE.Vector3(site.x + (i - 1) * 2.4, 0, site.z - 3.2 - (i % 2) * 1.2) : new THREE.Vector3(other.x + (i - 3.5) * 2.5, 0, other.z - 2.5));
      const path = isT ? [new THREE.Vector3(sx, 0, sz), new THREE.Vector3(lane, 0, 13.5), new THREE.Vector3(lane, 0, 2.5), dest]
        : [new THREE.Vector3(sx, 0, sz), new THREE.Vector3(dest.x * 0.55, 0, -14.5), dest];
      const f = S.ready ? fighterFor(p, side, !isT) : null;
      if (f) { f.visible = true; f.userData.ring.material.opacity = 0.9; const fd = f.userData.fighter; fd.setGun(p.role === 1 ? 'Sniper' : (isT ? rec.bA === 'eco' && side === 'A' || rec.bB === 'eco' && side === 'B' : false) ? 'Pistol' : 'AK'); fd.play('Idle', 0); }
      P[p.id] = { side, isT, path, dead: null, pos: path[0].clone(), f, win: false };
    });
    mk(viz.pa, 'A'); mk(viz.pb, 'B');
    const n = rec.ev.length; const kills = rec.ev.map((e, i) => ({ ...e, t: 0.4 + 0.5 * (i + 0.5) / Math.max(1, n) + (hash(rec.n + i) - 0.5) * 0.03, done: false }));
    const plant = (!rec.ctA ? rec.A : !rec.A) && (rec.how === 'bomb') || rec.how === 'defuse';
    viz.hud = { n: rec.n, kills: [], dead: {}, planted: false, end: false, site: site === S.siteA ? 'A' : 'B' };
    S.plan = { rec, site, kills, plant, plantT: 0.64, boomT: 0.95, P, smoked: false, boomed: false };
    if (S.bomb) { scene.remove(S.bomb); S.bomb = null; }
    S.smokes.forEach(s => scene.remove(s)); S.smokes = []; S.shot = null;
  }
  const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  function pathPos(path, u) {
    const segs = path.length - 1; let tot = 0; const lens = []; for (let i = 0; i < segs; i++) { const l = path[i].distanceTo(path[i + 1]); lens.push(l); tot += l; }
    let d = ease(Math.max(0, Math.min(1, u))) * tot; for (let i = 0; i < segs; i++) { if (d <= lens[i] || i === segs - 1) return path[i].clone().lerp(path[i + 1], Math.min(1, d / Math.max(lens[i], 1e-4))); d -= lens[i]; }
    return path[segs].clone();
  }
  function muzzle(st, to) {
    const dir = to.clone().sub(st.pos).setY(0).normalize();
    const p = st.pos.clone().add(dir.clone().multiplyScalar(0.75)).setY(1.25);
    const s = glowSprite('#ffd27a', 1.1, 1); s.position.copy(p); scene.add(s); S.flashes.push({ s, t: 0.09 });
    return p;
  }

  const tmp = new THREE.Vector3();
  return {
    update(dt, now) {
      if (S.built !== (S.ready ? 1000 : 0) + (viz.map || 0)) {
        const mi = viz.map || 0; S.siteA.set(-13 + (hash(mi) - 0.5) * 3, 0, -8 + (hash(mi + 1) - 0.5) * 4); S.siteB.set(13 + (hash(mi + 2) - 0.5) * 3, 0, -7 + (hash(mi + 3) - 0.5) * 4);
        buildMap(mi); S.built = (S.ready ? 1000 : 0) + mi; S.roundN = -1;
      }
      const rec = viz.round;
      if (rec && rec.n !== S.roundN) { S.roundN = rec.n; planRound(rec); }
      const u = rec ? Math.min(1, Math.max(0, (now - viz.roundT0) / viz.roundDur)) : 0;
      const pl = S.plan;
      const alive = [];
      if (pl) {
        pl.kills.forEach(k => {
          if (k.done || u < k.t) return; k.done = true; const a = pl.P[k.k], b = pl.P[k.v]; if (!a || !b) return;
          const to = b.pos.clone().setY(1.1); const from = muzzle(a, to);
          S.tracers.add(from, to, a.isT ? '#ffd9a0' : '#cfe6ff'); S.bursts.add(to, '#c81e1e', 16, 3.5, 0.45, 0.35);
          b.dead = { t: u }; a.shoot = { t: u, at: to.clone() };
          if (viz.hud) { viz.hud.kills.push({ k: k.k, v: k.v, hs: k.hs, awp: k.awp, A: k.A, at: now }); viz.hud.dead[k.v] = true; }
          if (b.f) b.f.userData.fighter.play('Death', 0.08);
          if (!S.shot || now - S.shot.t0 > S.shot.dur * 0.7) S.shot = { t0: now, dur: Math.max(700, Math.min(1500, viz.roundDur * 0.2)), from: a.pos.clone(), to: b.pos.clone() };
        });
        const winT = pl.rec.A ? 'A' : 'B'; if (viz.hud) { viz.hud.u = u; if (u > 0.94) viz.hud.end = true; }
        Object.values(pl.P).forEach(st => {
          const prev = st.pos.clone();
          const mu = Math.min(1, u / 0.6);
          if (!st.dead) st.pos.copy(pathPos(st.path, mu));
          const v = prev.distanceTo(st.pos) / Math.max(dt, 0.001);
          if (!st.dead) alive.push(st.pos);
          const f = st.f; if (!f) return; const fd = f.userData.fighter;
          f.position.copy(st.pos);
          if (st.dead) { f.userData.ring.material.opacity = Math.max(0, f.userData.ring.material.opacity - dt * 2); }
          else {
            let face = null;
            if (st.shoot && u - st.shoot.t < 0.07) { face = Math.atan2(st.shoot.at.x - st.pos.x, st.shoot.at.z - st.pos.z); fd.play('Idle_Shoot', 0.06); }
            else if (v > 0.4) { face = Math.atan2(st.pos.x - prev.x, st.pos.z - prev.z); fd.play('Run_Gun', 0.15, Math.min(1.6, Math.max(0.7, v / 6))); }
            else if (pl.plant && st.isT && u > pl.plantT - 0.06 && u < pl.plantT + 0.02 && !st.planted && st.side === (pl.rec.ctA ? 'B' : 'A')) { fd.play('Duck', 0.1); st.planted = true; }
            else if (u > 0.93 && st.side === winT) fd.play(st.isT ? 'Yes' : 'Wave', 0.25);
            else if (fd.acts && (!st.planted || u > pl.plantT + 0.05)) fd.play('Idle', 0.25);
            if (face != null) { const cur = f.rotation.y; let dlt = face - cur; while (dlt > Math.PI) dlt -= Math.PI * 2; while (dlt < -Math.PI) dlt += Math.PI * 2; f.rotation.y = cur + dlt * Math.min(1, dt * 12); }
          }
          fd.mixer.update(dt);
        });
        if (!pl.smoked && u > 0.3) {
          pl.smoked = true;
          for (let i = 0; i < 2; i++) { const s = new THREE.Group(); for (let j = 0; j < 10; j++) { const b = sph(0.9 + Math.random() * 0.7, new THREE.MeshStandardMaterial({ color: '#dfe2e6', transparent: true, opacity: 0.5, roughness: 1, depthWrite: false }), 10); b.castShadow = false; b.position.set((Math.random() - 0.5) * 2.8, 0.7 + Math.random() * 1.6, (Math.random() - 0.5) * 2.8); s.add(b); } s.position.set(pl.site.x + (i ? 3.2 : -3.2), 0, pl.site.z + 4.5); s.scale.setScalar(0.1); scene.add(s); S.smokes.push(s); }
        }
        S.smokes.forEach(s => { const k = Math.min(1, s.scale.x + dt * 1.6); s.scale.setScalar(k); s.rotation.y += dt * 0.08; });
        if (pl.plant && !S.bomb && u > pl.plantT) {
          const b = new THREE.Group(); b.add(box(0.5, 0.22, 0.34, std('#2b2f36', { m: 0.6, r: 0.4 }))); b.add(box(0.3, 0.06, 0.2, std('#3a7d3a', { e: '#1f5f1f', ei: 0.6 }), 0, 0.14, 0));
          const lg = glowSprite('#ff2a2a', 1.4, 1); lg.position.set(0, 0.3, 0); b.add(lg); b.position.set(pl.site.x, 0.11, pl.site.z); b.userData.lg = lg; scene.add(b); S.bomb = b; if (viz.hud) viz.hud.planted = true;
        }
        if (S.bomb) {
          S.bomb.userData.lg.material.opacity = (Math.sin(now / (u > 0.85 ? 50 : 150)) + 1) / 2;
          if (pl.rec.how === 'bomb' && !pl.boomed && u > pl.boomT) { pl.boomed = true; const bp = S.bomb.position.clone().setY(1); S.bursts.add(bp, '#ffd27a', 100, 18, 1.6, 1.3); S.bursts.add(bp, '#ff5a1f', 70, 11, 1.8, 1.7); S.bursts.add(bp, '#3a3a3a', 40, 6, 2.2, 2.4); S.shake = 0.9; }
        }
      }
      S.flashes = S.flashes.filter(f => { f.t -= dt; f.s.material.opacity = Math.max(0, f.t / 0.09); if (f.t <= 0) { scene.remove(f.s); return false; } return true; });
      S.tracers.update(dt); S.bursts.update(dt);

      // ---- камера-трансляция ----
      // фокус: атакующие до выхода на сайт, затем сам сайт; на убийствах — кадр «стрелок + жертва»
      const tPos = [], ctPos = [];
      if (pl) Object.values(pl.P).forEach(st => { if (!st.dead) (st.isT ? tPos : ctPos).push(st.pos); });
      const cen = (arr, d) => { if (!arr.length) return d.clone(); const v = new THREE.Vector3(); arr.forEach(p => v.add(p)); return v.multiplyScalar(1 / arr.length); };
      let target = pl ? (u < 0.42 ? cen(tPos, pl.site) : cen(tPos.concat(ctPos).filter(p => p.distanceTo(pl.site) < 12), pl.site)) : new THREE.Vector3();
      S.focus.lerp(target, Math.min(1, dt * 2.2));
      S.ang += dt * 0.05;
      let wantPos, wantLook, kp = 2.2, kl = 4;
      if (S.shot && now - S.shot.t0 < S.shot.dur) {
        const mid = S.shot.from.clone().lerp(S.shot.to, 0.5); const dir = S.shot.to.clone().sub(S.shot.from).setY(0); const len = Math.max(2, dir.length()); dir.normalize();
        const side = new THREE.Vector3(-dir.z, 0, dir.x); if (side.z < 0) side.negate();
        const k = (now - S.shot.t0) / S.shot.dur; const dd = Math.max(7, len * 0.9 + 3);
        wantPos = mid.clone().addScaledVector(side, dd).addScaledVector(dir, -1.5 + k).setY(Math.max(7, dd * 0.75));
        wantLook = mid.clone().setY(0.9); kp = k < 0.12 ? 20 : 3; kl = k < 0.12 ? 20 : 6;
      } else {
        const a = Math.PI / 2 + Math.sin(S.ang) * 0.35; const wide = pl && u >= 0.42 ? 1.15 : 0.9; const dist = 17 * wide, h = 17 * wide;
        wantPos = new THREE.Vector3(S.focus.x + Math.cos(a) * dist * 0.6, h, S.focus.z + Math.sin(a) * dist);
        wantLook = S.focus.clone().setY(0.6);
      }
      S.camPos.lerp(wantPos, Math.min(1, dt * kp)); S.look.lerp(wantLook, Math.min(1, dt * kl));
      cam.position.copy(S.camPos);
      if (S.shake) { cam.position.x += (Math.random() - 0.5) * S.shake; cam.position.y += (Math.random() - 0.5) * S.shake; S.shake = Math.max(0, S.shake - dt * 1.5); }
      cam.lookAt(S.look);
      L.sun.position.copy(S.focus).add(tmp.set(18, 34, 14)); L.sun.target.position.copy(S.focus);
    },
  };
}
