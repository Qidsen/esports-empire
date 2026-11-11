import * as THREE from 'three';
import { loadModel, makeActor } from '../assets';
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
  loadModel('cyber').then(gl => { ['A', 'B'].forEach(side => team[side].forEach((x, i) => { const col = i === 0 ? '#e8d23a' : (side === 'A' ? viz.ca : viz.cb); const a = makeActor(gl, { tint: [[/^Main$/, col], [/^Accent$/, i === 0 ? '#333333' : '#f2f2f2'], [/Accent_Dark/, '#1b1f27']], hide: [/^Sword$/, /Cube\.009/], height: 1.85 }); scene.remove(x.g); x.g = a; scene.add(a); a.position.copy(x.p); a.userData.fighter.play('Idle_Neutral', 0); })); }).catch(e => { viz.glError = 'fc models: ' + (e && e.message || e); });
  // Мяч всегда в игре: пасы, ведение, отборы. Голевой момент вырастает из текущего владения — без телепортов.
  const S = { seq: -1, queue: [], poss: 'A', holder: 9, ball: new THREE.Vector3(), pass: null, shot: null, steal: null, attack: null, freeze: 0, t: 0, hold: 1, focus: new THREE.Vector3() };
  S.ball.copy(team.A[9].p);
  const atkSgn = side => side === 'A' ? -1 : 1; // направление атаки по z
  function nearestTo(side, pos, excludeGk = true) { let bi = 1, bd = 1e9; team[side].forEach((x, i) => { if (excludeGk && i === 0) return; const d = x.p.distanceTo(pos); if (d < bd) { bd = d; bi = i; } }); return bi; }
  function startSteal(side) { S.steal = { side, i: nearestTo(side, S.ball) }; S.pass = null; }
  function nextPass(forward) {
    const tm = team[S.poss]; tm[S.holder].kick = 0.35; const sg = atkSgn(S.poss);
    const cand = tm.map((x, i) => i).filter(i => i !== S.holder && i !== 0);
    let best;
    if (forward) best = cand.filter(i => sg * (tm[i].p.z - tm[S.holder].p.z) > 2).sort((a, b) => sg * (tm[b].p.z - tm[a].p.z))[Math.floor(Math.random() * 2)];
    if (best === undefined) best = cand.sort((a, b) => tm[a].p.distanceTo(S.ball) - tm[b].p.distanceTo(S.ball))[Math.floor(Math.random() * 4)];
    const to = tm[best].p.clone().add(new THREE.Vector3(0, 0, sg * 1.5));
    S.pass = { from: S.ball.clone(), to, t: 0, dur: 0.45 + S.ball.distanceTo(to) / 26, i: best };
  }
  function shoot() {
    const sg = atkSgn(S.poss); const goal = S.attack && S.attack.type === 'goal';
    const to = goal ? new THREE.Vector3((Math.random() - 0.5) * 6, 0.4 + Math.random() * 1.6, sg * (PL + 0.6)) : new THREE.Vector3((Math.random() - 0.5) * 3, 1, sg * (PL - 0.8));
    team[S.poss][S.holder].kick = 0.45;
    S.shot = { side: S.poss, goal, from: S.ball.clone(), to, t: 0, dur: 0.35 + S.ball.distanceTo(to) / 40 };
  }
  function kickoff(side) { ['A', 'B'].forEach(s => team[s].forEach(x => x.p.copy(x.home))); S.poss = side; S.holder = 9; S.ball.set(0, 0, 0); S.pass = null; S.steal = null; S.t = 0; }
  return {
    update(dt, now) {
      if (viz.evSeq !== S.seq) { S.seq = viz.evSeq; (viz.events || []).forEach(e => { if (e.type === 'goal' || (e.type === 'chance' && Math.random() < 0.6)) S.queue.push(e); }); }
      if (!S.attack && S.freeze <= 0 && S.queue.length) { S.attack = S.queue.shift(); S.attack.t0 = now; }
      if (S.freeze > 0) { S.freeze -= dt; if (S.freeze <= 0) kickoff(S.celebrate === 'A' ? 'B' : 'A'); }
      else if (S.shot) {
        const sc = S.shot; sc.t += dt / sc.dur; const k = Math.min(1, sc.t); S.ball.lerpVectors(sc.from, sc.to, k); S.ball.y = sc.from.y + (sc.to.y - sc.from.y) * k + Math.sin(k * Math.PI) * 1.0;
        if (sc.t >= 1) {
          if (sc.goal) { for (let i = 0; i < 3; i++) bursts.add(S.ball.clone().setY(1.5), i === 1 ? '#ffffff' : (sc.side === 'A' ? viz.ca : viz.cb), 80, 12, 1.4, 0.8); S.freeze = 2.2; S.celebrate = sc.side; viz.vg = viz.vg || { A: 0, B: 0 }; viz.vg[sc.side]++; }
          else { S.poss = sc.side === 'A' ? 'B' : 'A'; S.holder = 0; S.ball.copy(team[S.poss][0].p); S.ball.y = 0.32; S.t = -0.6; }
          S.shot = null; S.attack = null;
        }
      } else if (S.pass) {
        const ps = S.pass; ps.t += dt / ps.dur; const k = Math.min(1, ps.t); S.ball.lerpVectors(ps.from, ps.to, ease(k)); S.ball.y = 0.32 + Math.sin(k * Math.PI) * 0.7; if (k >= 1) { S.holder = ps.i; S.pass = null; S.t = 0; S.hold = 0.7 + Math.random() * 0.9; }
      } else if (S.steal) {
        const x = team[S.steal.side][S.steal.i]; if (x.p.distanceTo(S.ball.clone().setY(0)) < 1.3) { S.poss = S.steal.side; S.holder = S.steal.i; S.steal = null; S.t = 0; S.hold = 0.6; }
      } else {
        const h = team[S.poss][S.holder]; const sg = atkSgn(S.poss);
        S.ball.lerp(h.p.clone().add(new THREE.Vector3(0, 0.32, sg * 0.6)), Math.min(1, dt * 10));
        S.t += dt;
        if (S.t > S.hold) {
          S.t = 0; S.hold = 0.8 + Math.random() * 1.0; const a = S.attack;
          const finalThird = sg * S.ball.z > PL - 18;
          if (a && S.poss !== a.side) startSteal(a.side);
          else if (a && (finalThird || now - a.t0 > 12000)) shoot();
          else if (!a && Math.random() < 0.14) startSteal(S.poss === 'A' ? 'B' : 'A');
          else nextPass(!!a || Math.random() < 0.45);
        }
      }
      ball.position.copy(S.ball); ball.position.y = Math.max(0.32, S.ball.y); ball.rotation.x += dt * 8;
      // formation drift with ball
      ['A', 'B'].forEach(side => { const att = S.poss === side; const sgn = side === 'A' ? -1 : 1; team[side].forEach((x, i) => { let tgt; if (S.celebrate === side && S.freeze > 0 && i > 0) tgt = new THREE.Vector3(S.ball.x + (i % 3 - 1) * 1.5, 0, S.ball.z - sgn * (3 + i * 0.3)); else { tgt = x.home.clone(); if (i > 0) { tgt.z += sgn * (att ? 8 : 2) + (S.ball.z - tgt.z) * 0.25; tgt.x += (S.ball.x - tgt.x) * 0.2; } else tgt.x = S.ball.x * 0.2; if (!att && i > 0 && x.p.distanceTo(S.ball) < 9 && i >= 5) tgt.lerp(S.ball, 0.6); } if (!S.pass && !S.shot && S.freeze <= 0 && side === S.poss && i === S.holder) tgt = x.p.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0, sgn * 5)); if (S.steal && side === S.steal.side && i === S.steal.i) tgt = S.ball.clone(); tgt.x = Math.max(-PW + 1, Math.min(PW - 1, tgt.x)); tgt.z = Math.max(-PL + 1, Math.min(PL - 1, tgt.z)); tgt.y = 0; const prev = x.p.clone(); const step = tgt.clone().sub(x.p); const maxv = (S.steal && side === S.steal.side && i === S.steal.i) ? 8 : 5.5; if (step.length() > maxv * dt) step.setLength(maxv * dt); x.p.add(step); x.g.position.copy(x.p); const v = prev.distanceTo(x.p) / Math.max(dt, 0.001); const look = S.ball.clone().sub(x.p); x.g.rotation.y = Math.atan2(look.x, look.z); const fd = x.g.userData.fighter; if (fd) { if (x.kick > 0) { x.kick -= dt; fd.play('Kick_Right', 0.08); } else if (S.celebrate === side && S.freeze > 0) fd.play('Wave', 0.2); else if (v > 0.5) fd.play('Run', 0.2, Math.min(1.4, Math.max(0.6, v / 4))); else fd.play('Idle_Neutral', 0.25); fd.mixer.update(dt); } else animWalk(x.g, v / 3, now / 1000 + i); }); });
      if (S.freeze <= 0) S.celebrate = null;
      viz.busy = !!(S.attack || S.queue.length || S.freeze > 0 || S.shot);
      bursts.update(dt);
      S.focus.lerp(new THREE.Vector3(S.ball.x * 0.3, 0, S.ball.z * 0.7), dt * 1.2);
      // ТВ-ракурс с боковой трибуны: камера ходит вдоль бровки за мячом
      S.cx = (S.cx === undefined ? 0 : S.cx) + (S.ball.z - (S.cx || 0)) * Math.min(1, dt * 1.5);
      cam.position.set(PW + 17, 14, S.cx * 0.85); cam.lookAt(S.ball.x * 0.35, 0, S.cx * 0.9);
      L.sun.target.position.copy(S.focus);
    },
  };
}
