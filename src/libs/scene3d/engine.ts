import { Engine } from 'babylonjs';

export function useEngine(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    doNotHandleContextLost: true,
    preserveDrawingBuffer: true,
    stencil: true,
  });

  function resize() {
    engine.resize();
  }

  window.addEventListener('resize', resize);
  return engine;
}
