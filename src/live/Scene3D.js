import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { makeRenderer } from './scenes/common';
import { createCs } from './scenes/cs';
import { createMoba } from './scenes/moba';
import { createRl } from './scenes/rl';
import { createFc } from './scenes/fc';

// Уровень графики: 0 — полный, 1 — без теней, 2 — минимальный. Понижается автоматически при ошибках GL.
let GFX = 0;

export default function Scene3D({ viz, style }) {
  const raf = useRef(null); const alive = useRef(true);
  const [attempt, setAttempt] = useState(0); const [diag, setDiag] = useState(null);
  useEffect(() => () => { alive.current = false; if (raf.current) cancelAnimationFrame(raf.current); }, []);
  // если за 3 с нет кадров или есть ошибка — показываем диагностику и пробуем пониженную графику
  useEffect(() => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const err = viz.glError; const fr = viz.frames || 0;
      if (err) console.warn('GLERR', GFX, err);
      if (err && fr < 90 && GFX < 2 && attempt < 2) { GFX++; viz.glError = null; viz.frames = 0; if (raf.current) cancelAnimationFrame(raf.current); setAttempt(a => a + 1); return; }
      if (err || (fr === 0 && Date.now() - t0 > 3500)) setDiag(`3D: ${err ? String(err).slice(0, 260) : 'нет кадров'} · ${viz.glInfo || ''} · графика ${GFX}`);
      else setDiag(null);
    }, 1000);
    return () => clearInterval(iv);
  }, [attempt]);
  const onCtx = gl => {
    if (typeof window !== 'undefined' && window.document) globalThis.__VIZ = viz;
    let renderer;
    try {
      viz.glInfo = `GL ${gl.getParameter ? gl.getParameter(gl.VERSION) : '?'}${gl.supportsWebGL2 === false ? ' (WebGL1!)' : ''}`;
      renderer = makeRenderer(gl, GFX);
      renderer.debug.checkShaderErrors = true;
      renderer.debug.onShaderError = (g, prog, vs, fs) => { viz.glError = 'shader: ' + (g.getProgramInfoLog(prog) || '') + ' ' + (g.getShaderInfoLog(fs) || g.getShaderInfoLog(vs) || ''); };
    } catch (e) { viz.glError = 'init: ' + String(e && e.message || e); return; }
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(42, w / h, 0.5, 400);
    const make = { fps: createCs, moba: createMoba, ball: createRl, duel: createFc }[viz.kind];
    let sc;
    try { sc = make(scene, cam, viz); } catch (e) { viz.glError = 'scene: ' + String(e && e.message || e); return; }
    let last = Date.now();
    const loop = () => {
      if (!alive.current) return;
      const now = Date.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now;
      try { sc.update(dt, now); renderer.render(scene, cam); } catch (e) { viz.glError = 'render: ' + String(e && e.message || e); }
      gl.endFrameEXP && gl.endFrameEXP();
      viz.frames = (viz.frames || 0) + 1;
      raf.current = requestAnimationFrame(loop);
    };
    loop();
  };
  return (
    <View style={[{ flex: 1, backgroundColor: '#05070b' }, style]}>
      <GLView key={'gl' + attempt} style={{ flex: 1 }} onContextCreate={onCtx} />
      {diag ? <View pointerEvents="none" style={{ position: 'absolute', left: 60, right: 60, top: 100, padding: 8, borderRadius: 8, backgroundColor: 'rgba(120,0,0,0.75)' }}><Text selectable style={{ color: '#fff', fontSize: 11 }}>{diag}</Text></View> : null}
    </View>
  );
}
