import * as THREE from 'three';
import { std, box, cyl, sph, lights, makeSoldier, animWalk, Bursts, glowSprite, stripeTex, hash, rng, camOrbit, ease } from './common';

const PW = 17, PL = 26;
const F442 = [[0, 0.95], [-0.6, 0.72], [-0.2, 0.75], [0.2, 0.75], [0.6, 0.72], [-0.65, 0.45], [-0.22, 0.5], [0.22, 0.5], [0.65, 0.45], [-0.2, 0.2], [0.2, 0.2]];
export function createFc(scene, cam, viz) {
  scene.background = new THREE.Color('#05080c'); scene.fog = new THREE.Fog('#05080c', 80, 160);
  const L = lights(scene, { sky: '#d8ecff', ground: '#16301a', sunI: 1.8, shadow: 34, sunPos: [14, 40, 8] });
  const bursts = new Bursts(scene);
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(PW * 2, PL * 2), new THREE.MeshStandardMaterial({ map: stripeTex('#2f7d36', '#36903e', 14), roughness: 0.9 })); pitch.rotation.x = -Math.PI / 2; pitch.receiveShadow = true; scene.add(pitch);
  const surround = new THREE.Mesh(new THREE.PlaneGeometry(PW * 2 + 10, PL * 2 + 10), std('#24602a', { r: 1 })); surround.rotation.x = -Math.PI / 2; surround.position.y = -0.02; scene.add(surround);
  const lm = new THREE.MeshBasicMaterial({ color: '#f2f7ff', transparent: true, opacity: 0.85 });
  const ln = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lm); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, z); scene.add(m); };
  ln(PW * 2, 0.18, 0, -PL); ln(PW * 2, 0.18, 0, PL); ln(0.18, PL * 2, -PW, 0); ln(0.18, PL * 2, PW, 0); ln(PW * 2, 0.18, 0, 0);
  const cc = new THREE.Mesh(new THREE.RingGeometry(4.4, 4.6, 48), lm); cc.rotation.x = -Math.PI / 2; cc.position.y = 0.02; scene.add(cc);
  [1, -1].forEach(s => { ln(16, 0.18, 0, s * (PL - 7.5)); ln(0.18, 7.5, -8, s * (PL - 3.75)); ln(0.18, 7.5, 8, s * (PL - 3.75)); ln(7, 0.18, 0, s * (PL - 2.6)); ln(0.18, 2.6, -3.5, s * (PL - 1.3)); ln(0.18, 2.6, 3.5, s * (PL - 1.3)); });
  // goals
  const post = std('#ffffff', { r: 0.3, m: 0.2 });
  [1, -1].forEach(s => { const z = s * PL; scene.add(box(0.2, 2.4, 0.2, post, -3.6, 1.2, z)); scene.add(box(0.2, 2.4, 0.2, post, 3.6, 1.2, z)); scene.add(box(7.4, 0.2, 0.2, post, 0, 2.4, z)); const net = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.4, 2), new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.25 })); net.position.set(0, 1.2, z + s * 1); scene.add(net); });
  // stands + crowd + floodlights
  const stand = std('#1a1f2b', { r: 0.9 }); const roof = std('#2a3142', { m: 0.6, r: 0.4 });
  [[0, -PL - 9, PW * 2 + 24, 1, 0], [0, PL + 9, PW * 2 + 24, 1, 0], [-PW - 9, 0, PL * 2 + 6, 0, 1], [PW + 9, 0, PL * 2 + 6, 0, 1]].forEach(([x, z, len, alongX, alongZ], si) => { for (let k = 0; k < 6; k++) { const off = k * 1.4; const w = alongX ? len : 6, d = alongZ ? len : 6; scene.add(box(alongX ? w : 1.4, 1.2, alongZ ? d : 1.4, stand, x + (alongZ ? Math.sign(x) * (off - 3) : 0), 0.6 + k * 1.1, z + (alongX ? Math.sign(z) * (off - 3) : 0), false)); } if (si < 2) scene.add(box(len, 0.4, 9, roof, x, 9.5, z + Math.sign(z) * 1)); });
  const N = 1400; const crowd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.45, 0.65, 0.45), new THREE.MeshStandardMaterial({ roughness: 0.8 }), N); const m4 = new THREE.Matrix4(); const col = new THREE.Color();
  const R = rng(9); for (let i = 0; i < N; i++) { const side = i % 4; const k = Math.floor(R() * 6); const t = R(); let x, z; if (side < 2) { x = (t - 0.5) * (PW * 2 + 20); z = (side ? 1 : -1) * (PL + 6 + k * 1.4); } else { z = (t - 0.5) * (PL * 2 + 4); x = (side === 2 ? -1 : 1) * (PW + 6 + k * 1.4); } m4.makeTranslation(x, 1.55 + k * 1.1, z); crowd.setMatrixAt(i, m4); col.set(R() > 0.55 ? (z > 0 ? viz.ca : viz.cb) : ['#e0e0e0', '#404040', '#8a8a8a', '#2a2a2a', '#c8b48a'][i % 5]); crowd.setColorAt(i, col); }
  scene.add(crowd);
  [[-PW - 12, -PL - 12], [PW + 12, -PL - 12], [-PW - 12, PL + 12], [PW + 12, PL + 12]].forEach(([x, z]) => { scene.add(box(0.6, 24, 0.6, roof, x, 12, z)); scene.add(box(3, 1.6, 0.4, std('#dfe8ff', { e: '#ffffff', ei: 2 }), x, 24, z)); const g = glowSprite('#f2f6ff', 9, 0.95); g.position.set(x, 24, z); scene.add(g); const sp = new THREE.SpotLight('#f4f8ff', 500, 110, 0.7, 0.6); sp.position.set(x, 24, z); sp.target.position.set(0, 0, 0); scene.add(sp, sp.target); });
  // players
  const ball = sph(0.32, std('#ffffff', { r: 0.4 }), 16); scene.add(ball);
  const team = { A: [], B: [] };
  ['A', 'B'].forEach(side => { for (let i = 0; i < 11; i++) { const g = makeSoldier(i === 0 ? '#e8d23a' : (side === 'A' ? viz.ca : viz.cb), i === 0 ? '#333' : '#f2f2f2'); g.children.forEach(c => { if (c.geometry && c.geometry.type === 'BoxGeometry' && c.geometry.parameters.depth > 0.8) c.visible = false; }); g.scale.setScalar(0.9); scene.add(g); const [fx, fz] = F442[i]; const sgn = side === 'A' ? 1 : -1; team[side].push({ g, home: new THREE.Vector3(fx * PW * 0.9, 0, sgn * fz * (PL - 1)), p: new THREE.Vector3(fx * PW * 0.9, 0, sgn * fz * (PL - 1)) }); } });
  const S = { seq: -1, queue: [], poss: 'A', holder: 9, ball: new THREE.Vector3(), pass: null, script: null, freeze: 0, t: 0, ang: 0, focus: new THREE.Vector3() };
  S.ball.copy(team.A[9].p);
  function nextPass() { const tm = team[S.poss]; const sgn = S.poss === 'A' ? -1 : 1; const cand = tm.map((x, i) => i).filter(i => i !== S.holder && i !== 0); let best = cand[Math.floor(Math.random() * cand.length)]; if (Math.random() < 0.6) { best = cand.sort((a, b) => sgn * (tm[a].p.z - tm[b].p.z))[0 + Math.floor(Math.random() * 3)]; } const from = S.ball.clone(); S.pass = { from, to: tm[best].p.clone().add(new THREE.Vector3(0, 0, sgn * 1)), t: 0, dur: 0.5 + from.distanceTo(tm[best].p) / 30, i: best }; }
  function startScript(e) {
    if (e.type === 'goal' || e.type === 'chance') { S.poss = e.side; const sgn = e.side === 'A' ? -1 : 1; const tm = team[e.side]; S.holder = 9 + Math.floor(Math.random() * 2); S.ball.copy(tm[S.holder].p); tm[S.holder].p.set((Math.random() - 0.5) * 12, 0, sgn * (PL - 9)); S.ball.copy(tm[S.holder].p); const goal = e.type === 'goal'; S.script = { type: e.type, side: e.side, from: S.ball.clone(), to: goal ? new THREE.Vector3((Math.random() - 0.5) * 6, 0.4 + Math.random() * 1.6, sgn * (PL + 0.6)) : new THREE.Vector3((Math.random() - 0.5) * 4, 1, sgn * (PL - 0.8)), t: 0, dur: 0.55, sgn }; S.pass = null; }
  }
  return {
    update(dt, now) {
      if (viz.evSeq !== S.seq) { S.seq = viz.evSeq; (viz.events || []).forEach(e => { if (e.type === 'goal' || (e.type === 'chance' && Math.random() < 0.5)) S.queue.push(e); }); }
      if (!S.script && S.freeze <= 0 && S.queue.length) startScript(S.queue.shift());
      if (S.freeze > 0) { S.freeze -= dt; if (S.freeze <= 0) { ['A', 'B'].forEach(s => team[s].forEach(x => x.p.copy(x.home))); S.poss = S.poss === 'A' ? 'B' : 'A'; S.holder = 9; S.ball.set(0, 0, 0); } }
      if (S.script) { const sc = S.script; sc.t += dt / sc.dur; const k = Math.min(1, sc.t); S.ball.lerpVectors(sc.from, sc.to, k); S.ball.y = sc.from.y + (sc.to.y - sc.from.y) * k + Math.sin(k * Math.PI) * 1.2; if (k >= 1) { if (sc.type === 'goal') { for (let i = 0; i < 3; i++) bursts.add(S.ball.clone().setY(1.5), i === 1 ? '#ffffff' : (sc.side === 'A' ? viz.ca : viz.cb), 80, 12, 1.4, 0.8); S.freeze = 1.8; S.celebrate = sc.side; } else { S.poss = sc.side === 'A' ? 'B' : 'A'; S.holder = 0; S.ball.copy(team[S.poss][0].p); } S.script = null; } }
      else if (S.freeze <= 0) {
        if (!S.pass) { S.t += dt; if (S.t > 0.35) { S.t = 0; if (Math.random() < 0.08) { S.poss = S.poss === 'A' ? 'B' : 'A'; S.holder = 5 + Math.floor(Math.random() * 4); } nextPass(); } else S.ball.lerp(team[S.poss][S.holder].p.clone().setY(0.32), dt * 8); }
        else { const ps = S.pass; ps.t += dt / ps.dur; const k = Math.min(1, ps.t); S.ball.lerpVectors(ps.from, ps.to, ease(k)); S.ball.y = 0.32 + Math.sin(k * Math.PI) * 0.8; if (k >= 1) { S.holder = ps.i; S.pass = null; } }
      }
      ball.position.copy(S.ball); ball.position.y = Math.max(0.32, S.ball.y); ball.rotation.x += dt * 8;
      // formation drift with ball
      ['A', 'B'].forEach(side => { const att = S.poss === side; const sgn = side === 'A' ? -1 : 1; team[side].forEach((x, i) => { let tgt; if (S.celebrate === side && S.freeze > 0 && i > 0) tgt = new THREE.Vector3(S.ball.x + (i % 3 - 1) * 1.5, 0, S.ball.z - sgn * (3 + i * 0.3)); else { tgt = x.home.clone(); if (i > 0) { tgt.z += sgn * (att ? 8 : 2) + (S.ball.z - tgt.z) * 0.25; tgt.x += (S.ball.x - tgt.x) * 0.2; } else tgt.x = S.ball.x * 0.2; if (!att && i > 0 && x.p.distanceTo(S.ball) < 9 && i >= 5) tgt.lerp(S.ball, 0.6); } tgt.y = 0; const prev = x.p.clone(); x.p.lerp(tgt, dt * 1.6); x.g.position.copy(x.p); const v = prev.distanceTo(x.p) / Math.max(dt, 0.001); const look = S.ball.clone().sub(x.p); x.g.rotation.y = Math.atan2(look.x, look.z); animWalk(x.g, v / 3, now / 1000 + i); }); });
      if (S.freeze <= 0) S.celebrate = null;
      bursts.update(dt);
      S.focus.lerp(new THREE.Vector3(S.ball.x * 0.3, 0, S.ball.z * 0.7), dt * 1.2);
      S.ang += dt * 0.04; camOrbit(cam, S.focus, 30, 22, Math.sin(S.ang) * 0.18);
      L.sun.target.position.copy(S.focus);
    },
  };
}
