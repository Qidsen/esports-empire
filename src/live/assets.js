// Загрузка GLB-моделей (Quaternius Toon Shooter Game Kit, CC0) в expo-gl / вебе.
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = class {
    decode(buf) {
      const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf.buffer || buf, buf.byteOffset || 0, buf.byteLength);
      let s = '', i = 0;
      while (i < b.length) {
        const c = b[i++];
        if (c < 0x80) s += String.fromCharCode(c);
        else if (c < 0xe0) s += String.fromCharCode(((c & 0x1f) << 6) | (b[i++] & 0x3f));
        else if (c < 0xf0) s += String.fromCharCode(((c & 0x0f) << 12) | ((b[i++] & 0x3f) << 6) | (b[i++] & 0x3f));
        else { const cp = (((c & 0x07) << 18) | ((b[i++] & 0x3f) << 12) | ((b[i++] & 0x3f) << 6) | (b[i++] & 0x3f)) - 0x10000; s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff)); }
      }
      return s;
    }
  };
}

const MODS = {
  props: require('../../assets/models/props.glb'),
  soldier: require('../../assets/models/Character_Soldier.glb'),
  enemy: require('../../assets/models/Character_Enemy.glb'),
  knight: require('../../assets/models/knight.glb'),
  cyber: require('../../assets/models/cyber.glb'),
  robot: require('../../assets/models/robot.glb'),
  moba: require('../../assets/models/moba.glb'),
  city: require('../../assets/models/city.glb'),
  car: require('../../assets/models/car.glb'),
};
const cache = {};

async function bytesOf(mod) {
  const a = Asset.fromModule(mod);
  if (Platform.OS === 'web') { const r = await fetch(a.uri); return await r.arrayBuffer(); }
  await a.downloadAsync();
  const { File } = require('expo-file-system');
  const u8 = await new File(a.localUri || a.uri).bytes();
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

export function loadModel(key) {
  if (!cache[key]) {
    cache[key] = bytesOf(MODS[key]).then(buf => new Promise((res, rej) => new GLTFLoader().parse(buf, '', res, rej)));
    cache[key].catch(() => { delete cache[key]; });
  }
  return cache[key];
}

// Пропсы: словарь имя → шаблон, клонируем с общими геометриями/материалами.
export async function loadProps(key = 'props') {
  const g = await loadModel(key); const out = {};
  g.scene.children.forEach(n => { n.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); out[n.name] = n; });
  return out;
}
export function placeProp(lib, name, parent, x, z, rotY = 0, s = 1, y = 0) {
  const t = lib[name]; if (!t) return null;
  const o = t.clone(); o.position.set(x, y, z); o.rotation.set(0, rotY, 0); if (s !== 1) o.scale.multiplyScalar(s); parent.add(o); return o;
}

const GUNS = ['AK', 'GrenadeLauncher', 'Knife_1', 'Knife_2', 'Pistol', 'Revolver', 'Revolver_Small', 'RocketLauncher', 'ShortCannon', 'Shotgun', 'Shovel', 'SMG', 'Sniper', 'Sniper_2'];
// Боец: клон скелета, свои материалы под цвет команды, оружие, анимации.
export function makeFighter(gltf, { main, accent, gun = 'AK', scale = 0.95 }) {
  const root = skClone(gltf.scene);
  const mats = {};
  root.traverse(o => {
    if (GUNS.includes(o.name)) o.visible = o.name === gun;
    if (o.isMesh) {
      o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      const nl = list.map(m => {
        if (!mats[m.name]) {
          const c = m.clone();
          if (/Main|Enemy_Red/.test(m.name) && main) c.color.set(main);
          if (/^Pants$|^DarkGrey$/.test(m.name) && accent) c.color.set(accent);
          mats[m.name] = c;
        }
        return mats[m.name];
      });
      o.material = Array.isArray(o.material) ? nl : nl[0];
    }
  });
  root.scale.setScalar(scale);
  const wrap = new THREE.Group(); wrap.add(root);
  const mixer = new THREE.AnimationMixer(root);
  const acts = {}; gltf.animations.forEach(a => { acts[a.name] = mixer.clipAction(a); });
  ['Death'].forEach(n => { if (acts[n]) { acts[n].setLoop(THREE.LoopOnce); acts[n].clampWhenFinished = true; } });
  let cur = null;
  wrap.userData.fighter = {
    mixer, acts,
    play(name, fade = 0.18, speed = 1) {
      const a = acts[name]; if (!a) return;
      a.timeScale = speed;
      if (cur === a) return;
      a.reset(); a.enabled = true; a.setEffectiveWeight(1); a.play();
      if (cur) cur.crossFadeTo(a, fade, false);
      cur = a; wrap.userData.anim = name;
    },
    setGun(g) { root.traverse(o => { if (GUNS.includes(o.name)) o.visible = o.name === g; }); },
  };
  return wrap;
}

// Универсальный актёр: клон скелета, перекраска материалов по регуляркам, скрытие узлов, нормировка роста, анимации.
export function makeActor(gltf, { tint = [], hide = [], height = 1.8 } = {}) {
  const root = skClone(gltf.scene); const mats = {};
  root.traverse(o => {
    if (hide.some(h => h.test(o.name))) o.visible = false;
    if (o.isMesh) {
      o.castShadow = true; o.frustumCulled = false;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      const nl = list.map(m => { if (!mats[m.name]) { const c = m.clone(); tint.forEach(([re, col]) => { if (re.test(m.name)) c.color.set(col); }); mats[m.name] = c; } return mats[m.name]; });
      o.material = Array.isArray(o.material) ? nl : nl[0];
    }
  });
  root.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(root); const hgt = Math.max(0.01, bb.max.y - bb.min.y);
  root.scale.multiplyScalar(height / hgt); root.position.y = -bb.min.y * (height / hgt);
  const wrap = new THREE.Group(); wrap.add(root);
  const mixer = new THREE.AnimationMixer(root); const acts = {}; gltf.animations.forEach(a => { acts[a.name] = mixer.clipAction(a); });
  ['Death', 'Kick_Left', 'Kick_Right', 'Sword_Slash', 'Run_swordAttack', 'Roll', 'Attack', 'Shoot', 'Gun_Shoot'].forEach(n => { if (acts[n] && n === 'Death') { acts[n].setLoop(THREE.LoopOnce); acts[n].clampWhenFinished = true; } });
  let cur = null;
  wrap.userData.fighter = { mixer, acts, play(name, fade = 0.18, speed = 1) { const a = acts[name]; if (!a) return; a.timeScale = speed; if (cur === a) return; a.reset(); a.enabled = true; a.setEffectiveWeight(1); a.play(); if (cur) cur.crossFadeTo(a, fade, false); cur = a; wrap.userData.anim = name; }, setGun() { } };
  return wrap;
}

// Много копий одного шаблона за пару draw call: InstancedMesh на каждый меш шаблона.
export function instanceTemplate(tpl, matrices, parent, { shadow = true, tint } = {}) {
  tpl.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(tpl.matrixWorld).invert();
  const out = []; const m = new THREE.Matrix4(); const local = new THREE.Matrix4();
  tpl.traverse(o => {
    if (!o.isMesh) return;
    local.multiplyMatrices(inv, o.matrixWorld);
    let mat = o.material; if (tint && tint[mat.name]) { mat = mat.clone(); mat.color.set(tint[mat.name]); }
    const im = new THREE.InstancedMesh(o.geometry, mat, matrices.length);
    matrices.forEach((M, i) => { m.multiplyMatrices(M, local); im.setMatrixAt(i, m); });
    im.castShadow = shadow; im.receiveShadow = true; parent.add(im); out.push(im);
  });
  return out;
}
