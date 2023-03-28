import { Engine } from "babylonjs";

export function useEngine(canvas: HTMLCanvasElement){
    const engine = new Engine(canvas, true,{doNotHandleContextLost: true});
    function resize() {
        engine.resize();
    }

    window.addEventListener('resize', resize);
    return engine
}