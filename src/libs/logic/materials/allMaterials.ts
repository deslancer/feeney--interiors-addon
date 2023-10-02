import { Color3, PBRMaterial, Texture } from 'babylonjs';
import { useFeeneyStore } from '../../store/store';

export const redWoodMaterial = () => {
  const { scene } = useFeeneyStore.getState();
  if (scene) {
    let material;
    const existed = scene.getMaterialByName('RedWood');
    if (existed) {
      return existed;
    } else {
      material = new PBRMaterial('RedWood', scene);
      material.albedoTexture = new Texture(
        './assets/textures/Wood/wood_rail_redwood.jpg'
      );
      material.bumpTexture = new Texture(
        './assets/textures/Wood/wood_rail_normal.png'
      );
      material.metallic = 0.1;
      material.roughness = 0.9;
      return material;
    }
  }
};
export const blackMetalMaterial = () => {
  const { scene } = useFeeneyStore.getState();
  if (scene) {
    let material;
    const existed = scene.getMaterialByName('BlackMetal');
    if (existed) {
      return existed;
    } else {
      material = new PBRMaterial('BlackMetal', scene);
      material.albedoColor = new Color3(0.06, 0.06, 0.08);
      material.bumpTexture = new Texture(
        './assets/textures/Metall/Metal_Painted_001_normal.jpg'
      );
      material.metallic = 1.0;
      material.roughness = 0.9;
      //material.alpha = 0.8; //Remove after testing
      return material;
    }
  }
};
export const greyMetalMaterial = () => {
  const { scene } = useFeeneyStore.getState();
  if (scene) {
    let material;
    const existed = scene.getMaterialByName('GreyMetal');
    if (existed) {
      return existed;
    } else {
      material = new PBRMaterial('GreyMetal', scene);
      material.albedoColor = new Color3(0.6, 0.6, 0.6);

      material.metallic = 1.0;
      material.roughness = 0.5;
      return material;
    }
  }
};
export const compositeWoodWhite = () => {
  const { scene } = useFeeneyStore.getState();
  if (scene) {
    let material;
    const existed = scene.getMaterialByName('CompositeWhiteWood');
    if (existed) {
      return existed;
    } else {
      material = new PBRMaterial('CompositeWhiteWood', scene);
      material.albedoColor = new Color3(0.76, 0.76, 0.72);
      material.bumpTexture = new Texture(
        './assets/textures/Wood/wood_rail_normal.png'
      );
      material.metallic = 0.1;
      material.roughness = 0.25;
      material.bumpTexture.level = 0.2;
      return material;
    }
  }
};
