import * as THREE from 'three';
import { std, box, cyl, sph, lights, makeSoldier, animWalk, Bursts, Tracers, glowSprite, gridTex, hash, rng, lerp, ease, camOrbit } from './common';

const PAL = [ // floor, wall, accent, fog
  ['#b59a6a', '#d8c39a', '#8a6a3c', '#2a2216'], // Ancient-ish / sandy
  ['#9a8a6e', '#cdb98f', '#3d8a86', '#1f2622'], // Anubis teal-sand
  ['#6e7a6a', '#a7b0a0', '#4b6a4a', '#18201a'], // Cache green-grey
  ['#c2a775', '#e2cd9e', '#a77a3e', '#2b2316'], // Dust
  ['#8e6450', '#c89a78', '#7a3a2a', '#24160f'], // Inferno terracotta
  ['#b9a07a', '#e0cfa8', '#b0874a', '#2a2318'], // Mirage
  ['#5f6b78', '#9aa6b2', '#3a6ea0', '#151b22'], // Nuke industrial
];
export function createCs(scene, cam, viz) {
  const S = { soldiers: {}, built: -1, roundN: -1, plan: null, world: new THREE.Group(), bursts: new Bursts(scene), tracers: new Tracers(scene), smokes: [], bomb: null, ang: 0, focus: new THREE.Vector3(0, 0, -3) };
  scene.add(S.world);
  const L = lights(scene, { shadow: 28, sunPos: [16, 30, 10] });
  function buildMap(mi) {
    S.world.clear(); const pal = PAL[mi % PAL.length];
    scene.background = new THREE.Color(pal[3]); scene.fog = new THREE.Fog(pal[3], 45, 95);
    const ft = gridTex(pal[0], '#f6efe0', 4); ft.repeat.set(10, 10);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(48, 48), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, metalness: 0.05, color: '#ffffff' })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.world.add(floor);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), std(pal[3], { r: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; S.world.add(ground);
    const wm = std(pal[1], { r: 0.85 }); const am = std(pal[2], { r: 0.7 }); const crate = std('#7a5a34', { r: 0.8 }); const metal = std('#4b5563', { r: 0.4, m: 0.6 }); const trim = std('#3b3328', { r: 0.6, m: 0.2 }); const base = std('#2a241c', { r: 1 });
    // lamps
    const Rl = rng(mi + 99); for (let i = 0; i < 6; i++) { const lx = -20 + Rl() * 40, lz = -18 + Rl() * 36; const pole = cyl(0.08, 0.1, 4, std('#222', { m: 0.6 }), 6); pole.position.set(lx, 2, lz); S.world.add(pole); const lamp = glowSprite('#ffd08a', 2.2, 0.9); lamp.position.set(lx, 4.1, lz); S.world.add(lamp); const pl = new THREE.PointLight('#ffc070', 10, 11); pl.position.set(lx, 3.8, lz); S.world.add(pl); }
    // outer walls
    [[0, -24, 48, 1.2], [0, 24, 48, 1.2], [-24, 0, 1.2, 48], [24, 0, 1.2, 48]].forEach(([x, z, w, d]) => S.world.add(box(w, 3.2, d, wm, x, 1.6, z)));
    // interior blocks with lanes kept free
    const seed = mi * 7 + 3; const R = rng(seed + 11);
    for (let i = 0; i < 26; i++) {
      const x = -20 + R() * 40, z = -18 + R() * 36; const rw = R(), rd = R(), rh = R();
      if (Math.abs(x - S.siteA.x) < 5 && Math.abs(z - S.siteA.z) < 5) continue; if (Math.abs(x - S.siteB.x) < 5 && Math.abs(z - S.siteB.z) < 5) continue;
      if (Math.abs(z) > 14 && Math.abs(x) < 9) continue; if (Math.abs(x) < 2.2 || Math.abs(Math.abs(x) - 12) < 1.8) continue;
      const w = 2 + rw * 5, d = 2 + rd * 5, h = 2.4 + rh * 2.6;
      S.world.add(box(w, h, d, i % 4 === 0 ? am : wm, x, h / 2, z)); S.world.add(box(w + 0.25, 0.25, d + 0.25, trim, x, h + 0.12, z)); S.world.add(box(w + 0.1, 0.35, d + 0.1, base, x, 0.17, z, false));
    }
    // cover crates near sites
    [S.siteA, S.siteB].forEach((s, k) => { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + k; const r = 3.2 + hash(seed + i + k * 9) * 1.5; const c = box(1.1, 1.1, 1.1, i % 2 ? crate : metal, s.x + Math.cos(a) * r, 0.55, s.z + Math.sin(a) * r); c.rotation.y = a; S.world.add(c); } });
    // site markers
    [[S.siteA, '#ff8a1f'], [S.siteB, '#38d6ff']].forEach(([s, c]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.3, 2.6, 40), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(s.x, 0.04, s.z); S.world.add(ring);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(2.3, 40), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.12 })); disc.rotation.x = -Math.PI / 2; disc.position.set(s.x, 0.03, s.z); S.world.add(disc);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 9, 8), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })); beam.position.set(s.x, 4.5, s.z); S.world.add(beam);
      const g = glowSprite(c, 5, 0.6); g.position.set(s.x, 0.4, s.z); S.world.add(g);
      const pl = new THREE.PointLight(c, 12, 10); pl.position.set(s.x, 2.5, s.z); S.world.add(pl);
    });
    // spawns
    [[0, -19, '#4da3ff'], [0, 19, '#ffb347']].forEach(([x, z, c]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.08 })); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.03, z); S.world.add(p); });
  }
  function ensureSoldiers() {
    const all = [...viz.pa.map(p => [p, 'A']), ...viz.pb.map(p => [p, 'B'])];
    all.forEach(([p, side]) => { if (!S.soldiers[p.id]) { const g = makeSoldier(side === 'A' ? viz.ca : viz.cb, side === 'A' ? '#1d2a3a' : '#3a2a1d'); g.userData.side = side; scene.add(g); S.soldiers[p.id] = g; } });
  }
  function planRound(rec) {
    const tA = !rec.ctA; // A is T this round
    const site = hash(rec.n * 3.3 + (viz.map || 0)) > 0.5 ? S.siteA : S.siteB; const other = site === S.siteA ? S.siteB : S.siteA;
    const P = {}; const sideT = tA ? 'A' : 'B';
    const mk = (list, side) => list.forEach((p, i) => {
      const isT = side === sideT; const sx = (i - 2) * 1.8, sz = isT ? 19 : -19;
      const lane = isT ? (site.x < 0 ? -12 : 12) + (i - 2) * 0.6 : 0;
      const dest = isT ? new THREE.Vector3(site.x + (i - 2) * 1.3, 0, site.z + 2.6 + (i % 2) * 1.2) : (i < 3 ? new THREE.Vector3(site.x + (i - 1) * 1.8, 0, site.z - 2.8) : new THREE.Vector3(other.x + (i - 3.5) * 2, 0, other.z - 2));
      P[p.id] = { side, isT, path: [new THREE.Vector3(sx, 0, sz), new THREE.Vector3(lane, 0, isT ? 6 : -10), dest], dead: null, pos: new THREE.Vector3(sx, 0, sz) };
    });
    mk(viz.pa, 'A'); mk(viz.pb, 'B');
    const n = rec.ev.length; const kills = rec.ev.map((e, i) => ({ ...e, t: 0.42 + 0.48 * (i + 0.5) / Math.max(1, n) + (hash(rec.n + i) - 0.5) * 0.03, done: false }));
    const plant = (!rec.ctA ? rec.A : !rec.A) && (rec.how === 'bomb') || rec.how === 'defuse';
    S.plan = { rec, site, kills, plant, plantT: 0.66, boomT: 0.96, P, smoked: false, boomed: false };
    if (S.bomb) { scene.remove(S.bomb); S.bomb = null; }
    S.smokes.forEach(s => scene.remove(s)); S.smokes = [];
  }
  function pathPos(path, u) { if (u <= 0.5) return path[0].clone().lerp(path[1], ease(u / 0.5)); return path[1].clone().lerp(path[2], ease((u - 0.5) / 0.5)); }
  S.siteA = new THREE.Vector3(-13, 0, -8); S.siteB = new THREE.Vector3(13, 0, -7);
  return {
    update(dt, now) {
      if (S.built !== viz.map) { const mi = viz.map || 0; S.siteA.set(-13 + (hash(mi) - 0.5) * 4, 0, -8 + (hash(mi + 1) - 0.5) * 6); S.siteB.set(13 + (hash(mi + 2) - 0.5) * 4, 0, -7 + (hash(mi + 3) - 0.5) * 6); buildMap(mi); S.built = viz.map; }
      ensureSoldiers();
      const rec = viz.round;
      if (rec && rec.n !== S.roundN) { S.roundN = rec.n; planRound(rec); }
      const u = rec ? Math.min(1, Math.max(0, (now - viz.roundT0) / viz.roundDur)) : 0;
      const pl = S.plan;
      if (pl) {
        // kills
        pl.kills.forEach(k => { if (!k.done && u >= k.t) { k.done = true; const a = pl.P[k.k], b = pl.P[k.v]; if (a && b) { const from = a.pos.clone().setY(1.2), to = b.pos.clone().setY(1.1); S.tracers.add(from, to, a.side === 'A' ? '#ffe9a8' : '#ffd0a0'); S.bursts.add(to, '#ff4b3a', 14, 4, 0.5, 0.35); b.dead = { t: u, face: Math.atan2(to.x - from.x, to.z - from.z) }; a.shoot = { t: u, at: to }; } } });
        Object.entries(pl.P).forEach(([id, st]) => {
          const g = S.soldiers[id]; if (!g) return;
          const mu = Math.min(1, u / 0.62);
          const prev = st.pos.clone();
          if (!st.dead) st.pos.copy(pathPos(st.path, mu)).add(new THREE.Vector3(Math.sin(now / 700 + +id) * 0.15 * (u > 0.62 ? 1 : 0), 0, 0));
          g.position.copy(st.pos);
          const v = prev.distanceTo(st.pos) / Math.max(dt, 0.001);
          if (st.dead) { const k = Math.min(1, (u - st.dead.t) * 8); g.rotation.set(-k * Math.PI / 2 * 0.95, st.dead.face, 0, 'YXZ'); g.position.y = -k * 0.15; g.userData.ring.material.opacity = 0.85 * (1 - k); }
          else { g.rotation.set(0, 0, 0); g.userData.ring.material.opacity = 0.85; if (st.shoot && u - st.shoot.t < 0.08) g.rotation.y = Math.atan2(st.shoot.at.x - st.pos.x, st.shoot.at.z - st.pos.z); else if (v > 0.05) g.rotation.y = Math.atan2(st.pos.x - prev.x, st.pos.z - prev.z); else g.rotation.y = st.isT ? Math.PI : 0; animWalk(g, v / 4, now / 1000); }
        });
        if (!pl.smoked && u > 0.33) { pl.smoked = true; for (let i = 0; i < 2; i++) { const s = new THREE.Group(); for (let j = 0; j < 7; j++) { const b = sph(1.1 + Math.random() * 0.6, new THREE.MeshStandardMaterial({ color: '#c9ccd2', transparent: true, opacity: 0.55, roughness: 1, depthWrite: false })); b.castShadow = false; b.position.set((Math.random() - 0.5) * 2.4, 0.9 + Math.random() * 1.2, (Math.random() - 0.5) * 2.4); s.add(b); } s.position.set(pl.site.x + (i ? 3.5 : -3.5), 0, pl.site.z + 4); s.scale.setScalar(0.1); scene.add(s); S.smokes.push(s); } }
        S.smokes.forEach(s => { const k = Math.min(1, s.scale.x + dt * 2); s.scale.setScalar(k); s.rotation.y += dt * 0.1; });
        if (pl.plant && !S.bomb && u > pl.plantT) { const b = new THREE.Group(); b.add(box(0.5, 0.25, 0.35, std('#2b2f36', { m: 0.6, r: 0.4 }))); const led = sph(0.07, new THREE.MeshBasicMaterial({ color: '#ff2a2a' })); led.position.set(0, 0.16, 0.1); b.add(led); const lg = glowSprite('#ff2a2a', 1.5, 1); lg.position.set(0, 0.25, 0); b.add(lg); b.position.set(pl.site.x, 0.13, pl.site.z); b.userData.lg = lg; scene.add(b); S.bomb = b; }
        if (S.bomb) { S.bomb.userData.lg.material.opacity = (Math.sin(now / (u > 0.85 ? 60 : 160)) + 1) / 2; if (pl.rec.how === 'bomb' && !pl.boomed && u > pl.boomT) { pl.boomed = true; S.bursts.add(S.bomb.position.clone().setY(1), '#ffb347', 90, 16, 1.4, 1.2); S.bursts.add(S.bomb.position.clone().setY(1), '#ff4b2b', 60, 10, 1.6, 1.6); } }
        S.focus.lerp(u > 0.4 ? pl.site.clone().setZ(pl.site.z + 3) : new THREE.Vector3(0, 0, 0), dt * 0.8);
      }
      S.tracers.update(dt); S.bursts.update(dt);
      S.ang += dt * 0.05; camOrbit(cam, S.focus, 21, 22, Math.PI / 2 + Math.sin(S.ang) * 0.45);
      L.sun.target.position.copy(S.focus);
    },
  };
}
