import {
  CubeTexture,
  MeshBuilder,
  PBRMaterial,
  Scene,
  SceneLoader,
  Texture,
} from 'babylonjs';
import { SkyMaterial } from 'babylonjs-materials';

const envFiles = {
  mountains: {
    name: 'green_mountains.glb',
    offset: {
      x: 48,
      y: 0,
      z: -145,
    },
  },
  winter: {
    name: 'winter_mountains.glb',
    offset: {
      x: -115,
      y: 0,
      z: -120,
    },
  },
};

export function useReflectionTexture(scene: Scene) {
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    'assets/textures/royal_esplanade.env',
    scene
  );
}

let ticker: NodeJS.Timer;
let skyMaterial: SkyMaterial;

export function useSkybox(scene: Scene) {
  skyMaterial = new SkyMaterial('skyMaterial', scene);
  skyMaterial.backFaceCulling = false;

  skyMaterial.inclination = 0.15;
  skyMaterial.azimuth = 0.25;
  skyMaterial.luminance = 1.0;
  const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  skybox.material = skyMaterial;
  enableDynamicSky();
}

export function enableDynamicSky() {
  let inclination = 0.15;
  let direction = 1; // 1 for increasing, -1 for decreasing
  function updateSkyParams() {
    if (direction === 1) {
      inclination += 0.001;
      if (inclination > 0.5) {
        inclination = 0.5;
        direction = -1;
      }
    } else {
      inclination -= 0.001;
      if (inclination < 0.15) {
        inclination = 0.15;
        direction = 1;
      }
    }
    skyMaterial.inclination = inclination;
  }

  ticker = setInterval(updateSkyParams, 500);
}

export function disableDynamicSky() {
  if (ticker) {
    clearInterval(ticker);
  }
}

export function setLandscape(scene: Scene) {
  SceneLoader.ShowLoadingScreen = false;
  SceneLoader.ImportMeshAsync(
    '',
    './assets/landscapes/',
    envFiles.winter.name,
    scene
  ).then((result) => {
    const mesh = result.meshes[0];
    mesh.position.x = envFiles.winter.offset.x;
    mesh.position.y = envFiles.winter.offset.y;
    mesh.position.z = envFiles.winter.offset.z;
    const winterMaterial = scene.getMaterialByName(
      'Material.001'
    ) as PBRMaterial;
    if (winterMaterial) {
      const winterBaseTexture4K = new Texture(
        './assets/landscapes/textures/Material_baseColor.png',
        scene
      );
      const winterNormalTexture4K = new Texture(
        './assets/landscapes/textures/Material_normal.png',
        scene
      );
      Texture.WhenAllReady([winterBaseTexture4K], () => {
        winterMaterial.albedoTexture = winterBaseTexture4K;
        winterMaterial.freeze();
      });
      Texture.WhenAllReady([winterNormalTexture4K], () => {
        winterMaterial.bumpTexture = winterNormalTexture4K;
        winterMaterial.freeze();
      });
    }
  });
}
