import { AxesViewer, Scene } from 'babylonjs';

export function useSceneInspector(scene: Scene, isInDebugMode: boolean) {
  const debugLayer = scene.debugLayer;
  if (isInDebugMode) {
    debugLayer
      .show({
        overlay: true,
        globalRoot: document.body,
      })
      .then(() => console.log('App in debug mode'));
    new AxesViewer(scene, 2.5);
  } else {
    debugLayer.hide();
    const arrows = scene.rootNodes.filter((mesh) => mesh.name === 'arrow');
    if (arrows.length > 0) {
      arrows.map((arrow) => arrow.dispose());
    }
    console.log('Debug mode has been closed');
  }
}
