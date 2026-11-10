import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { makeRenderer } from './scenes/common';
import { createCs } from './scenes/cs';
import { createMoba } from './scenes/moba';
import { createRl } from './scenes/rl';
import { createFc } from './scenes/fc';

export default function Scene3D({ viz, style }) {
  const raf = useRef(null); const alive = useRef(true);
  useEffect(() => () => { alive.current = false; if (raf.current) cancelAnimationFrame(raf.current); }, []);
  const onCtx = gl => {
    let renderer;
    try { renderer = makeRenderer(gl); } catch (e) { viz.glError = String(e); return; }
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(42, w / h, 0.5, 400);
    const make = { fps: createCs, moba: createMoba, ball: createRl, duel: createFc }[viz.kind];
    const sc = make(scene, cam, viz);
    let last = Date.now();
    const loop = () => {
      if (!alive.current) return;
      const now = Date.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now;
      try { sc.update(dt, now); renderer.render(scene, cam); } catch (e) { viz.glError = String(e && e.stack || e); }
      gl.endFrameEXP && gl.endFrameEXP();
      viz.frames = (viz.frames || 0) + 1;
      raf.current = requestAnimationFrame(loop);
    };
    loop();
  };
  return <View style={[{ flex: 1, backgroundColor: '#05070b' }, style]}><GLView style={{ flex: 1 }} onContextCreate={onCtx} /></View>;
}
