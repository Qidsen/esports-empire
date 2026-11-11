import * as THREE from 'three';
import { loadModel } from '../assets';
import { std, box, cyl, sph, lights, makeCar, Bursts, glowSprite, stripeTex, hash, rng, camOrbit } from './common';
import { sfx, buzz } from '../../ui/audio';

const W = 20, Lh = 30, GOAL = 5;
export function createRl(scene, cam, viz) {
  scene.background = new THREE.Color('#05070d'); scene.fog = new THREE.Fog('#05070d', 70, 150);
  const L = lights(scene, { sky: '#9cc8ff', ground: '#101820', sunI: 1.4, hemi: 0.8, shadow: 36, sunPos: [10, 40, 6] });
  const bursts = new Bursts(scene);
  // field
  const ft = stripeTex('#2a7a3a', '#2f8a42', 12);
  const field = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, Lh * 2), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.85 })); field.rotation.x = -Math.PI / 2; field.receiveShadow = true; scene.add(field);
  const lineM = new THREE.MeshBasicMaterial({ color: '#e8f4ff', transparent: true, opacity: 0.7 });
  const ln = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lineM); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, z); scene.add(m); };
  ln(W * 2, 0.2, 0, 0); const cc = new THREE.Mesh(new THREE.RingGeometry(5.8, 6.1, 48), lineM); cc.rotation.x = -Math.PI / 2; cc.position.y = 0.02; scene.add(cc);
  // half colors
  [[viz.ca, 1], [viz.cb, -1]].forEach(([c, s]) => { const h = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, 6), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.12 })); h.rotation.x = -Math.PI / 2; h.position.set(0, 0.015, s * (Lh - 3)); scene.add(h); });
  // walls (glass) + frame
  const glass = new THREE.MeshStandardMaterial({ color: '#9fd6ff', transparent: true, opacity: 0.08, roughness: 0.05, metalness: 0.8, depthWrite: false });
  const frame = std('#2a3446', { m: 0.7, r: 0.3 });
  [[0, -Lh, W * 2, 0.3], [0, Lh, W * 2, 0.3], [-W, 0, 0.3, Lh * 2], [W, 0, 0.3, Lh * 2]].forEach(([x, z, w, d]) => { scene.add(box(w, 6, d, glass, x, 3, z, false)); scene.add(box(w + (w > 1 ? 0.3 : 0), 0.25, d + (d > 1 ? 0.3 : 0), frame, x, 6, z)); scene.add(box(w + (w > 1 ? 0.3 : 0), 0.4, d + (d > 1 ? 0.3 : 0), frame, x, 0.2, z)); });
  // goals
  const goals = {};
  [['A', Lh, viz.ca], ['B', -Lh, viz.cb]].forEach(([side, z, c]) => {
    const g = new THREE.Group(); const post = std(c, { e: c, ei: 0.8, m: 0.5, r: 0.3 });
    const dz = z > 0 ? 2.5 : -2.5;
    g.add(box(0.4, 4.2, 0.4, post, -GOAL, 2.1, z)); g.add(box(0.4, 4.2, 0.4, post, GOAL, 2.1, z)); g.add(box(GOAL * 2 + 0.4, 0.4, 0.4, post, 0, 4.2, z));
    const net = new THREE.Mesh(new THREE.BoxGeometry(GOAL * 2, 4.2, 2.5), new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.18 })); net.position.set(0, 2.1, z + dz / 2); g.add(net);
    const gl = new THREE.PointLight(c, 30, 16); gl.position.set(0, 3, z); g.add(gl);
    scene.add(g); goals[side] = { z, c, light: gl };
  });
  // boost pads
  const pads = []; [[-W + 2, -Lh + 2], [W - 2, -Lh + 2], [-W + 2, Lh - 2], [W - 2, Lh - 2], [-W + 2, 0], [W - 2, 0]].forEach(([x, z]) => { const p = cyl(0.9, 1.1, 0.15, std('#ffb347', { e: '#ff8a1f', ei: 1.5 }), 20); p.position.set(x, 0.08, z); scene.add(p); const g = glowSprite('#ff8a1f', 3, 0.6); g.position.set(x, 0.5, z); scene.add(g); pads.push(g); });
  // stadium + crowd
  const stand = std('#151a26', { r: 0.9 }); [[0, -Lh - 7, W * 2 + 16, 8], [0, Lh + 7, W * 2 + 16, 8], [-W - 7, 0, 8, Lh * 2 + 2], [W + 7, 0, 8, Lh * 2 + 2]].forEach(([x, z, w, d]) => { for (let k = 0; k < 4; k++) scene.add(box(w - (w > d ? 0 : k), 1.2, d - (d > w ? 0 : k), stand, x + (Math.abs(x) > 1 ? Math.sign(x) * k * 1.5 : 0), 0.6 + k * 1.2, z + (Math.abs(z) > 1 ? Math.sign(z) * k * 1.5 : 0), false)); });
  const crowdN = 900; const crowd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), new THREE.MeshStandardMaterial({ roughness: 0.8 }), crowdN); const m4 = new THREE.Matrix4(); const col = new THREE.Color();
  const R = rng(5); for (let i = 0; i < crowdN; i++) { const side = i % 4; const k = Math.floor(R() * 4); const t = R(); let x, z; if (side < 2) { x = (t - 0.5) * (W * 2 + 14); z = (side ? 1 : -1) * (Lh + 4.5 + k * 1.5); } else { z = (t - 0.5) * (Lh * 2); x = (side === 2 ? -1 : 1) * (W + 4.5 + k * 1.5); } m4.makeTranslation(x, 1.6 + k * 1.2, z); crowd.setMatrixAt(i, m4); col.set(R() > 0.5 ? (z > 0 ? viz.ca : viz.cb) : ['#d9d9d9', '#555', '#a0a0a0', '#333'][i % 4]); crowd.setColorAt(i, col); }
  scene.add(crowd);
  [[-W - 4, -Lh - 4], [W + 4, -Lh - 4], [-W - 4, Lh + 4], [W + 4, Lh + 4]].forEach(([x, z]) => { scene.add(box(0.5, 18, 0.5, frame, x, 9, z)); const sp = new THREE.SpotLight('#eaf2ff', 400, 90, 0.6, 0.5); sp.position.set(x, 18, z); sp.target.position.set(0, 0, 0); scene.add(sp, sp.target); const g = glowSprite('#eaf2ff', 6, 0.9); g.position.set(x, 18, z); scene.add(g); });
  // ball
  const ball = sph(1.0, std('#dfe6ef', { r: 0.35, m: 0.4 }), 24); ball.castShadow = true; scene.add(ball); const bglow = glowSprite('#ffffff', 3.2, 0.25); scene.add(bglow);
  const B = { p: new THREE.Vector3(0, 1, 0), v: new THREE.Vector3() };
  // cars
  let carTpl = null; loadModel('car').then(g => { carTpl = g.scene; Object.values(cars).forEach(c => skin(c)); }).catch(e => { viz.glError = 'rl models: ' + (e && e.message || e); });
  const skin = c => { if (!carTpl || c.skinned) return; c.skinned = true; const m = c.m; m.children.slice(0, 4).forEach(x => { x.visible = false; }); (m.userData.wheels || []).forEach(w => { w.visible = false; });
    const col = c.side === 'A' ? viz.ca : viz.cb; const t = carTpl.clone(true); const mats = {};
    t.traverse(o => { if (o.isMesh) { o.castShadow = true; const nm = o.parent && /wheel/.test(o.parent.name) || /wheel/.test(o.name); const k = (nm ? 'w' : 'b') + o.material.uuid; if (!mats[k]) { const mm = o.material.clone(); mm.vertexColors = true; if (!nm) { mm.color = new THREE.Color(col).lerp(new THREE.Color('#ffffff'), 0.2); mm.emissive = new THREE.Color(col).multiplyScalar(0.35); } mm.metalness = 0.2; mm.roughness = 0.5; mats[k] = mm; } o.material = mats[k]; } });
    t.scale.setScalar(1.05); m.add(t); c.model = t; c.wheelNodes = []; t.traverse(o => { if (/wheel/.test(o.name)) c.wheelNodes.push(o); }); };
  const cars = {}; const ensure = () => { [...viz.pa.map((p, i) => [p, 'A', i]), ...viz.pb.map((p, i) => [p, 'B', i])].forEach(([p, side, i]) => { if (!cars[p.id]) { const m = makeCar(side === 'A' ? viz.ca : viz.cb); scene.add(m); cars[p.id] = { m, side, role: p.role, i, p: new THREE.Vector3(), h: 0, s: 0, dead: 0 }; kickoffCar(cars[p.id]); skin(cars[p.id]); } }); };
  function kickoffCar(c) { const sgn = c.side === 'A' ? 1 : -1; const spots = [[0, 12], [-8, 18], [8, 22]]; const [x, z] = spots[c.i % 3]; c.p.set(x, 0, sgn * z); c.h = c.side === 'A' ? Math.PI : 0; c.s = 0; }
  const S = { seq: -1, queue: [], script: null, freeze: 0, ang: 0, focus: new THREE.Vector3() };
  function kickoff() { B.p.set(0, 1, 0); B.v.set(0, 0, 0); Object.values(cars).forEach(kickoffCar); }
  // Сценарий гола/сейва: атакующая машина реально доезжает до мяча и бьёт по воротам; мяч летит по физике
  function startScript(e) {
    if (e.type === 'demo') { const v = cars[e.v]; if (v && !v.dead) { v.dead = 1.6; sfx('demo', 0.8); bursts.add(v.p.clone().setY(1), '#ff7b2b', 60, 12, 1.1, 0.9); } return; }
    const atk = e.type === 'goal' ? e.side : (e.side === 'A' ? 'B' : 'A');
    let shooter = e.type === 'goal' ? cars[e.p] : null; if (!shooter) shooter = Object.values(cars).filter(c => c.side === atk && !c.dead).sort((a, b) => a.p.distanceTo(B.p) - b.p.distanceTo(B.p))[0];
    const goalZ = atk === 'A' ? -Lh : Lh;
    S.script = { type: e.type, side: e.side, atk, shooter, keeper: e.type === 'save' ? cars[e.p] : null, goalZ, t: 0, shot: false, aim: new THREE.Vector3((Math.random() - 0.5) * (e.type === 'goal' ? 6 : 3), 1.2 + Math.random() * 1.6, goalZ * 1.04) };
  }
  function shoot(sc) {
    const T = Math.max(0.6, Math.min(1.4, B.p.distanceTo(sc.aim) / 28)); const g = 22;
    B.v.set((sc.aim.x - B.p.x) / T, (sc.aim.y - B.p.y + 0.5 * g * T * T) / T, (sc.aim.z - B.p.z) / T); sc.shot = true; sc.t = 0; sfx('kick', 1.3);
    bursts.add(B.p.clone(), '#ffffff', 16, 5, 0.4, 0.4);
  }
  return {
    update(dt, now) {
      ensure();
      if (viz.evSeq !== S.seq) { S.seq = viz.evSeq; (viz.events || []).forEach(e => { if (['goal', 'save', 'demo'].includes(e.type)) S.queue.push(e); }); }
      if (!S.script && S.freeze <= 0 && S.queue.length) startScript(S.queue.shift());
      if (S.freeze > 0) { S.freeze -= dt; if (S.freeze <= 0) kickoff(); }
      // мяч: всегда физика; сценарий только направляет машины и удар
      const sc = S.script;
      if (sc && (sc.type === 'goal' || sc.type === 'save')) {
        sc.t += dt;
        if (!sc.shot && (sc.t > 5 || (sc.shooter && sc.shooter.p.distanceTo(B.p.clone().setY(0)) < 2.6))) { if (sc.shooter) { sc.shooter.boostT = 0.4; sfx('boost', 0.6); } shoot(sc); }
        if (sc.shot) {
          const nearLine = Math.abs(B.p.z) > Lh - 1.6 && Math.sign(B.p.z) === Math.sign(sc.goalZ);
          if (sc.type === 'save' && sc.keeper && !sc.saved && Math.abs(B.p.z) > Lh - 6 && Math.sign(B.p.z) === Math.sign(sc.goalZ)) { sc.saved = true; B.v.set((Math.random() - 0.5) * 16, 7, -Math.sign(sc.goalZ) * 20); bursts.add(B.p.clone(), '#bfe3ff', 24, 7, 0.5, 0.5); S.script = null; }
          else if (sc.type === 'goal' && nearLine) { sfx('horn'); sfx('cheer'); buzz('medium'); const g = goals[sc.side === 'A' ? 'B' : 'A']; for (let i = 0; i < 3; i++) bursts.add(B.p.clone(), i === 1 ? '#ffffff' : (sc.side === 'A' ? viz.ca : viz.cb), 90, 18, 1.6, 1.1); g.light.intensity = 160; S.freeze = 1.6; viz.vg = viz.vg || { A: 0, B: 0 }; viz.vg[sc.side]++; S.focus.copy(B.p); B.v.set(0, 0, 0); S.script = null; }
          else if (sc.t > 3) S.script = null;
        }
      }
      if (S.freeze <= 0) {
        B.v.y -= 22 * dt; B.p.addScaledVector(B.v, dt); if (B.p.y < 1) { B.p.y = 1; B.v.y = Math.abs(B.v.y) * 0.55; } B.v.x *= 1 - dt * 0.45; B.v.z *= 1 - dt * 0.45;
        if (Math.abs(B.p.x) > W - 1) { B.p.x = Math.sign(B.p.x) * (W - 1); B.v.x *= -0.8; }
        const inMouth = S.script && S.script.shot && S.script.type === 'goal' && Math.abs(B.p.x) < 6;
        if (!inMouth && Math.abs(B.p.z) > Lh - 1.2) { B.p.z = Math.sign(B.p.z) * (Lh - 1.2); B.v.z *= -0.8; }
      }
      viz.busy = !!((S.script && S.script.type !== 'demo') || S.queue.some(e => e.type !== 'demo') || S.freeze > 0);
      ball.position.copy(B.p); ball.rotation.x += B.v.z * dt * 0.5; ball.rotation.z -= B.v.x * dt * 0.5; bglow.position.copy(B.p);
      Object.values(goals).forEach(g => { g.light.intensity += (30 - g.light.intensity) * dt * 2; });
      // cars AI
      Object.values(cars).forEach(c => {
        if (c.dead > 0) { c.dead -= dt; c.m.visible = false; if (c.dead <= 0) { c.m.visible = true; kickoffCar(c); } return; }
        const own = c.side === 'A' ? Lh : -Lh; let tgt;
        const sc2 = S.script;
        if (S.freeze > 0) tgt = c.p.clone(); else if (sc2 && !sc2.shot && sc2.shooter === c) { const dir = sc2.aim.clone().sub(B.p).setY(0).normalize(); tgt = B.p.clone().addScaledVector(dir, -1.2); } else if (sc2 && sc2.keeper === c) tgt = new THREE.Vector3(B.p.x * 0.4, 0, sc2.goalZ * 0.9); else if (c.role === 2) tgt = new THREE.Vector3(B.p.x * 0.5, 0, own * 0.7 + B.p.z * 0.25); else if (c.role === 1) tgt = B.p.clone().add(new THREE.Vector3(c.i % 2 ? 6 : -6, 0, (c.side === 'A' ? 1 : -1) * 6)); else tgt = B.p.clone().add(new THREE.Vector3(0, 0, c.side === 'A' ? 2 : -2));
        tgt.y = 0; const to = tgt.clone().sub(c.p); const dist = to.length(); const want = Math.atan2(to.x, to.z); let dh = want - c.h; while (dh > Math.PI) dh -= Math.PI * 2; while (dh < -Math.PI) dh += Math.PI * 2; c.h += Math.max(-dt * 3.5, Math.min(dt * 3.5, dh));
        const target = dist > 2 ? (dist > 12 ? 20 : 12) : 3; c.s += (target - c.s) * dt * 2; c.p.x += Math.sin(c.h) * c.s * dt; c.p.z += Math.cos(c.h) * c.s * dt; c.p.x = Math.max(-W + 1.2, Math.min(W - 1.2, c.p.x)); c.p.z = Math.max(-Lh + 1.5, Math.min(Lh - 1.5, c.p.z));
        if (!S.script && S.freeze <= 0 && c.p.distanceTo(new THREE.Vector3(B.p.x, 0, B.p.z)) < 2.2 && B.p.y < 3) { const dir = new THREE.Vector3(B.p.x - c.p.x, 0, B.p.z - c.p.z).normalize(); const toGoal = new THREE.Vector3(-B.p.x * 0.3, 0, c.side === 'A' ? -1 : 1).normalize(); dir.lerp(toGoal, 0.4).normalize(); B.v.copy(dir.multiplyScalar(18 + c.s)); B.v.y = 4 + Math.random() * 6; }
        c.m.position.copy(c.p); c.m.rotation.y = c.h; c.m.userData.wheels.forEach(w => w.rotation.x += c.s * dt); if (c.wheelNodes) c.wheelNodes.forEach(w => { w.rotation.x += c.s * dt; }); const boost = c.s > 14; c.m.userData.flame.visible = boost; c.m.userData.fglow.visible = boost; c.m.userData.flame.scale.y = 0.7 + Math.random() * 0.6;
      });
      pads.forEach((p, i) => p.material.opacity = 0.45 + Math.sin(now / 300 + i) * 0.2);
      bursts.update(dt);
      S.focus.lerp(new THREE.Vector3(B.p.x * 0.4, 0, B.p.z * 0.55), dt * 1.5);
      S.cx = (S.cx === undefined ? 0 : S.cx) + (S.focus.z - (S.cx || 0)) * Math.min(1, dt * 1.6);
      cam.position.set(S.focus.x * 0.25 + 25, 15, S.cx * 0.85); cam.lookAt(S.focus.x * 0.4, 1, S.cx * 0.92);
      L.sun.target.position.copy(S.focus);
    },
  };
}
