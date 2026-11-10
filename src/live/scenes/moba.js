import * as THREE from 'three';
import { std, box, cyl, sph, lights, makeHero, Bursts, Tracers, glowSprite, gridTex, hash, rng, lerp, ease, camOrbit } from './common';

// lane geometry helpers
function polyPoint(pts, f) { // f in 0..1 along polyline
  let total = 0; const seg = []; for (let i = 0; i < pts.length - 1; i++) { const l = pts[i].distanceTo(pts[i + 1]); seg.push(l); total += l; }
  let d = f * total; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) return pts[i].clone().lerp(pts[i + 1], d / seg[i]); d -= seg[i]; } return pts[pts.length - 1].clone();
}
const V = (x, z) => new THREE.Vector3(x, 0, z);
export function createMoba(scene, cam, viz) {
  const dl = viz.d === 'dl';
  const S = { heroes: {}, towers: { A: [], B: [] }, bursts: new Bursts(scene), tracers: new Tracers(scene), focus: new THREE.Vector3(), ang: 0, lastT: -1, targets: {}, prevPos: {}, dead: {}, bossAlive: true, bossTimer: 0, ended: false };
  const L = lights(scene, dl ? { sky: '#8fb2ff', ground: '#2a2436', sun: '#ffd9b0', sunI: 2.0, hemi: 1.1, shadow: 40, sunPos: [20, 40, 18] } : { sky: '#cfe6ff', ground: '#2c3a1e', sun: '#fff1d6', sunI: 2.6, shadow: 40, sunPos: [24, 40, 14] });
  scene.background = new THREE.Color(dl ? '#0c0f1a' : '#14202a'); scene.fog = new THREE.Fog(dl ? '#0c0f1a' : '#14202a', 70, 140);
  // --- lanes ---
  const lanes = dl ? [[V(-18, 26), V(-18, -26)], [V(0, 26), V(0, -26)], [V(18, 26), V(18, -26)]] : [[V(-25, 21), V(-25, -25), V(21, -25)], [V(-21, 21), V(21, -21)], [V(-21, 25), V(25, 25), V(25, -21)]];
  const baseA = dl ? V(0, 29) : V(-27, 27), baseB = dl ? V(0, -29) : V(27, -27);
  // terrain
  const groundTex = dl ? gridTex('#1c2130', '#3a4560', 10) : gridTex('#3f6a2c', '#56873a', 4); groundTex.repeat.set(8, 8);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), std(dl ? '#090b12' : '#1b2a18', { r: 1 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.1; scene.add(outer);
  const laneMat = std(dl ? '#2b2f3c' : '#7a6646', { r: 1 });
  lanes.forEach(pts => { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; const len = a.distanceTo(b); const m = new THREE.Mesh(new THREE.PlaneGeometry(dl ? 5 : 4, len + 4), laneMat); m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(b.x - a.x, b.z - a.z) + Math.PI; m.position.set((a.x + b.x) / 2, 0.02, (a.z + b.z) / 2); m.receiveShadow = true; scene.add(m); if (dl) { const zl = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.clone().setY(6), b.clone().setY(6)]), new THREE.LineBasicMaterial({ color: '#8ad7ff', transparent: true, opacity: 0.5 })); scene.add(zl); } } });
  if (!dl) {
    const river = new THREE.Mesh(new THREE.PlaneGeometry(7, 90), new THREE.MeshStandardMaterial({ color: '#2a8fc9', roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85, emissive: '#0b3550', emissiveIntensity: 0.6 })); river.rotation.x = -Math.PI / 2; const rg = new THREE.Group(); rg.add(river); rg.rotation.y = Math.PI / 4; river.position.y = 0.04; scene.add(rg);
    // trees
    const trunk = new THREE.CylinderGeometry(0.18, 0.25, 1, 6), crown = new THREE.ConeGeometry(1.1, 2.6, 7);
    const tm = std('#4a3424', { r: 1 }), cm = std('#24502a', { r: 0.9 });
    const spots = []; const R = rng(42); for (let i = 0; i < 420; i++) { const x = -32 + R() * 64, z = -32 + R() * 64; const p = V(x, z); if (lanes.some(l => { for (let k = 0; k < l.length - 1; k++) { const d = distSeg(p, l[k], l[k + 1]); if (d < 4.5) return true; } return false; })) continue; if (Math.abs(x - z) < 6) continue; if (p.distanceTo(baseA) < 9 || p.distanceTo(baseB) < 9) continue; spots.push(p); }
    const it = new THREE.InstancedMesh(trunk, tm, spots.length), ic = new THREE.InstancedMesh(crown, cm, spots.length); const m4 = new THREE.Matrix4();
    spots.forEach((p, i) => { const s = 0.8 + hash(i) * 0.6; m4.compose(new THREE.Vector3(p.x, 0.5 * s, p.z), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); it.setMatrixAt(i, m4); m4.compose(new THREE.Vector3(p.x, 2.1 * s, p.z), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); ic.setMatrixAt(i, m4); });
    ic.castShadow = true; it.castShadow = true; scene.add(it, ic);
  } else {
    // city blocks
    const bm = [std('#2a3042', { r: 0.6, m: 0.3, e: '#1b2a55', ei: 0.4 }), std('#3a3346', { r: 0.6, m: 0.3, e: '#3a1b45', ei: 0.35 }), std('#24323a', { r: 0.5, m: 0.4, e: '#0f3a3a', ei: 0.4 })];
    const R = rng(7); for (let i = 0; i < 90; i++) { const x = -32 + R() * 64, z = -30 + R() * 60; const r1 = R(), r2 = R(), r3 = R(); if ([-18, 0, 18].some(lx => Math.abs(x - lx) < 5.5)) continue; if (V(x, z).distanceTo(baseA) < 8 || V(x, z).distanceTo(baseB) < 8) continue; const w = 2.5 + r1 * 4, d = 2.5 + r2 * 4, h = 3 + r3 * 9; scene.add(box(w, h, d, bm[i % 3], x, h / 2, z)); const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, h * 0.8), new THREE.MeshBasicMaterial({ color: ['#ffd27a', '#7ad7ff', '#ff7ad1'][i % 3], transparent: true, opacity: 0.12 })); win.position.set(x, h / 2, z + d / 2 + 0.01); scene.add(win); }
    for (let i = 0; i < 8; i++) { const pl = new THREE.PointLight(['#7ad7ff', '#ff7ad1', '#ffd27a'][i % 3], 25, 22); pl.position.set(-28 + i * 8, 6, (i % 2 ? -10 : 10)); scene.add(pl); }
  }
  // --- bases ---
  const mkBase = (pos, color) => { const g = new THREE.Group(); g.add(cyl(5, 6, 0.8, std('#3b3f4a', { r: 0.8 }), 24)); const core = dl ? sph(1.8, std(color, { e: color, ei: 1.6, r: 0.2, m: 0.5 }), 24) : new THREE.Mesh(new THREE.OctahedronGeometry(2.2), std(color, { e: color, ei: 1.3, r: 0.2, m: 0.4 })); core.position.y = dl ? 4 : 3.2; core.castShadow = true; g.add(core); const gl = glowSprite(color, 10, 0.55); gl.position.y = 3.5; g.add(gl); const pl = new THREE.PointLight(color, 40, 18); pl.position.y = 4; g.add(pl); g.position.copy(pos); g.userData.core = core; scene.add(g); return g; };
  const bA = mkBase(baseA, viz.ca), bB = mkBase(baseB, viz.cb);
  // --- towers / objectives ---
  const mkTower = (pos, color, kind) => {
    const g = new THREE.Group(); const stone = std(dl ? '#4a5263' : '#8a8578', { r: 0.8 });
    if (!dl) { g.add(cyl(0.9, 1.2, 0.6, stone, 10)); const col = cyl(0.55, 0.75, 3.2, stone, 8); col.position.y = 1.9; g.add(col); const cr = new THREE.Mesh(new THREE.OctahedronGeometry(0.6), std(color, { e: color, ei: 1.5 })); cr.position.y = 4; g.add(cr); g.userData.cr = cr; }
    else if (kind === 'walker') { const body = box(1.8, 1.6, 1.8, std('#59627a', { m: 0.6, r: 0.4 }), 0, 4.2, 0); g.add(body);[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].forEach(([x, z]) => g.add(box(0.35, 3.4, 0.35, std('#3a4052', { m: 0.5 }), x, 1.7, z))); const eye = sph(0.32, std(color, { e: color, ei: 2 })); eye.position.set(0, 4.3, 0.95); g.add(eye); g.userData.cr = eye; }
    else if (kind === 'shrine') { const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.9, 4.5, 4), std('#6b6f86', { m: 0.5, r: 0.4 })); ob.position.y = 2.25; ob.castShadow = true; g.add(ob); const cr = sph(0.35, std(color, { e: color, ei: 2 })); cr.position.y = 4.8; g.add(cr); g.userData.cr = cr; }
    else { g.add(box(1.4, 0.5, 1.4, stone, 0, 0.25, 0)); g.add(box(0.9, 2.2, 0.7, std('#5b6276', { m: 0.4 }), 0, 1.6, 0)); const head = box(0.6, 0.6, 0.6, std('#6b7288', { m: 0.4 }), 0, 3.0, 0); g.add(head); const cr = sph(0.18, std(color, { e: color, ei: 2.2 })); cr.position.set(0, 3.05, 0.32); g.add(cr); g.userData.cr = cr; }
    const gl = glowSprite(color, 2.2, 0.6); gl.position.y = dl ? 3.5 : 4; g.add(gl); g.position.copy(pos); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); scene.add(g); g.userData.alive = 1; return g;
  };
  const laneOrder = [1, 2, 0];
  ['A', 'B'].forEach(side => {
    const col = side === 'A' ? viz.ca : viz.cb; const list = [];
    for (let tier = 0; tier < 3; tier++) laneOrder.forEach(li => { const f = side === 'A' ? [0.38, 0.25, 0.13][tier] : 1 - [0.38, 0.25, 0.13][tier]; const kind = dl ? ['guardian', 'walker', 'guardian'][tier] : 'tower'; list.push(mkTower(polyPoint(lanes[li], f).add(V(dl ? 3 : 2.5, 0)), col, kind)); });
    const b = side === 'A' ? baseA : baseB; const dz = side === 'A' ? -5 : 5;
    list.push(mkTower(b.clone().add(V(-4, dz)), col, dl ? 'shrine' : 'tower')); list.push(mkTower(b.clone().add(V(4, dz)), col, dl ? 'shrine' : 'tower'));
    S.towers[side] = list;
  });
  // boss
  const bossPos = dl ? V(8, 0) : V(-10, -10);
  const pit = new THREE.Mesh(new THREE.CircleGeometry(3.2, 32), std('#1a1a22', { r: 1 })); pit.rotation.x = -Math.PI / 2; pit.position.copy(bossPos).setY(0.05); scene.add(pit);
  const boss = new THREE.Group(); const bb = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), std(dl ? '#6a3fbf' : '#6b5440', { r: 0.6, m: 0.2, e: dl ? '#4a1f9f' : '#2a1a0a', ei: 0.6 })); bb.position.y = 1.6; bb.castShadow = true; boss.add(bb); const be = glowSprite('#ff5a2a', 1.4, 0.9); be.position.set(0, 2, 1); boss.add(be); boss.position.copy(bossPos); scene.add(boss);
  // creeps (instanced)
  const creepGeo = new THREE.BoxGeometry(0.45, 0.6, 0.45); const cA = new THREE.InstancedMesh(creepGeo, std(viz.ca, { e: viz.ca, ei: 0.3 }), 36), cB = new THREE.InstancedMesh(creepGeo, std(viz.cb, { e: viz.cb, ei: 0.3 }), 36); scene.add(cA, cB);
  // heroes
  const ensure = () => { [...viz.pa.map(p => [p, 'A']), ...viz.pb.map(p => [p, 'B'])].forEach(([p, side], i) => { if (!S.heroes[p.id]) { const h = makeHero(side === 'A' ? viz.ca : viz.cb, p.role + (side === 'A' ? 0 : 1), 0.95); h.userData.side = side; h.userData.role = p.role; scene.add(h); S.heroes[p.id] = h; const b = side === 'A' ? baseA : baseB; h.position.copy(b).add(V((i % 3 - 1) * 1.5, 0)); S.targets[p.id] = h.position.clone(); S.prevPos[p.id] = h.position.clone(); } }); };
  function laneOfRole(side, role) { if (dl) return [0, 1, 2, 0, 1, 2][role]; const safe = side === 'A' ? 2 : 0, off = side === 'A' ? 0 : 2; return [safe, 1, off, off, safe][role]; }
  function frontF(lead) { return Math.max(0.2, Math.min(0.8, 0.5 + lead / 30000)); } // fraction from A end
  function retarget(g) {
    const t = g.t; const lead = g.lead; const evs = viz.events || [];
    const fight = evs.find(e => e.type === 'fight'); const ff = frontF(lead);
    const groupLane = fight ? laneOrder[(g.t * 7) % 3] : laneOrder[Math.floor(t / 4) % 3];
    const fightPt = polyPoint(lanes[groupLane], ff);
    [...viz.pa.map(p => [p, 'A']), ...viz.pb.map(p => [p, 'B'])].forEach(([p, side], i) => {
      const h = S.heroes[p.id]; if (!h) return; S.prevPos[p.id] = h.position.clone();
      if (S.dead[p.id] && S.dead[p.id] > t) { S.targets[p.id] = (side === 'A' ? baseA : baseB).clone().add(V((i % 3 - 1) * 1.6, (i % 2) * 1.5)); return; }
      let pt;
      if (t < 10 && !fight) { const li = laneOfRole(side, p.role); pt = polyPoint(lanes[li], side === 'A' ? ff - 0.06 : ff + 0.06); }
      else { pt = fightPt.clone().add(V(side === 'A' ? -2.5 : 2.5, (i % 3 - 1) * 1.8)); if (!fight) pt.add(V(side === 'A' ? -3 : 3, side === 'A' ? 3 : -3)); }
      pt.add(V((hash(p.id + t) - 0.5) * 2, (hash(p.id * 2 + t) - 0.5) * 2));
      S.targets[p.id] = pt;
    });
    if (fight) {
      const losers = (fight.side === 'A' ? viz.pb : viz.pa).slice(); for (let k = 0; k < Math.min(fight.kw, losers.length); k++) { const v = losers[(k + t) % losers.length]; S.dead[v.id] = t + 2; }
      S.fightAt = { pt: fightPt, side: fight.side, t0: viz.tickT0 };
      S.focus.lerp(fightPt, 0.6);
    }
    evs.forEach(e => {
      if (e.type === 'tower' || e.type === 'hg') { const victimSide = e.side === 'A' ? 'B' : 'A'; const lst = S.towers[victimSide]; const idx = (e.side === 'A' ? g.twA : g.twB) - 1; const tw = lst[Math.min(lst.length - 1, Math.max(0, idx))]; if (tw && tw.userData.alive) { tw.userData.alive = 0; S.bursts.add(tw.position.clone().setY(3), e.side === 'A' ? viz.ca : viz.cb, 50, 9, 1.2, 0.9); S.focus.lerp(tw.position, 0.5); } }
      if (e.type === 'boss') { S.bossAlive = false; S.bossTimer = 4; S.bursts.add(bossPos.clone().setY(2), '#ffcf5a', 70, 10, 1.3, 1); }
      if (e.type === 'end') { const b = e.side === 'A' ? bB : bA; S.ended = b; for (let k = 0; k < 3; k++) S.bursts.add(b.position.clone().setY(3 + k), k % 2 ? '#ffffff' : (e.side === 'A' ? viz.ca : viz.cb), 120, 16, 2, 1.4); S.focus.copy(b.position); }
    });
  }
  return {
    update(dt, now) {
      ensure();
      const g = viz.game;
      if (g && g.t !== S.lastT) { S.lastT = g.t; if (S.bossTimer > 0) { S.bossTimer--; if (!S.bossTimer) S.bossAlive = true; } retarget(g); }
      const u = Math.min(1, Math.max(0, (now - (viz.tickT0 || now)) / (viz.tickDur || 1)));
      Object.entries(S.heroes).forEach(([id, h]) => {
        const a = S.prevPos[id], b = S.targets[id]; if (!a || !b) return;
        const prev = h.position.clone(); h.position.lerpVectors(a, b, ease(u)); h.position.y = Math.abs(Math.sin(now / 260 + +id)) * 0.08;
        const dead = S.dead[id] && g && S.dead[id] > g.t; h.visible = true; h.userData.mat.opacity = 1;
        h.scale.setScalar(dead ? 0.95 * Math.max(0.15, 1 - u * 1.5) : 0.95);
        if (h.position.distanceTo(prev) > 0.002) h.rotation.y = Math.atan2(h.position.x - prev.x, h.position.z - prev.z);
        h.userData.crest.rotation.y += dt * 2;
      });
      // fight fx
      if (S.fightAt && now - S.fightAt.t0 < (viz.tickDur || 600)) { if (Math.random() < 0.35) { const ids = Object.keys(S.heroes); const a = S.heroes[ids[Math.floor(Math.random() * ids.length)]], b = S.heroes[ids[Math.floor(Math.random() * ids.length)]]; if (a && b && a.userData.side !== b.userData.side && a.position.distanceTo(b.position) < 12) S.tracers.add(a.position.clone().setY(1.3), b.position.clone().setY(1.2), a.userData.side === 'A' ? viz.ca : viz.cb, 0.25); } if (Math.random() < 0.15) S.bursts.add(S.fightAt.pt.clone().add(V((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)).setY(1), S.fightAt.side === 'A' ? viz.ca : viz.cb, 16, 5, 0.6, 0.5); }
      // towers collapse
      ['A', 'B'].forEach(s => S.towers[s].forEach(tw => { if (!tw.userData.alive && tw.scale.y > 0.18) { tw.scale.y = Math.max(0.18, tw.scale.y - dt * 1.4); tw.rotation.z = Math.min(0.25, tw.rotation.z + dt * 0.3); } if (tw.userData.cr) tw.userData.cr.rotation.y += dt; }));
      boss.visible = S.bossAlive; bb.rotation.y += dt * 0.4;
      bA.userData.core.rotation.y += dt * 0.5; bB.userData.core.rotation.y += dt * 0.5;
      if (S.ended) S.ended.scale.y = Math.max(0.1, S.ended.scale.y - dt * 0.5);
      // creeps
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      [[cA, 'A'], [cB, 'B']].forEach(([im, side]) => { let k = 0; const front = frontF(g ? g.lead : 0); for (let li = 0; li < 3; li++) for (let w = 0; w < 3; w++) for (let c = 0; c < 4; c++) { const ph = ((now / 9000 + w / 3 + li * 0.13) % 1); const f = side === 'A' ? 0.08 + ph * (front - 0.08) : 0.92 - ph * (0.92 - front); const p = polyPoint(lanes[li], f).add(V((c % 2 - 0.5) * 0.9, (Math.floor(c / 2) - 0.5) * 0.9)); p.y = 0.3; m4.compose(p, q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(k++, m4); } im.count = k; im.instanceMatrix.needsUpdate = true; });
      S.tracers.update(dt); S.bursts.update(dt);
      S.ang += dt * 0.04; S.focus.lerp(V(0, 0), dt * 0.15);
      camOrbit(cam, S.focus, dl ? 30 : 32, dl ? 38 : 40, Math.PI * (dl ? 0.5 : 0.75) + Math.sin(S.ang) * 0.35);
      L.sun.target.position.copy(S.focus);
    },
  };
}
function distSeg(p, a, b) { const ab = b.clone().sub(a), ap = p.clone().sub(a); const t = Math.max(0, Math.min(1, ap.dot(ab) / ab.lengthSq())); return a.clone().add(ab.multiplyScalar(t)).distanceTo(p); }
