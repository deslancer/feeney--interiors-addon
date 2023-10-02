import { TransformNode } from 'babylonjs';
import {
  blackMetalMaterial,
  compositeWoodWhite,
  greyMetalMaterial,
  redWoodMaterial,
} from '../logic/materials/allMaterials';

export const setDefaultMaterial = (
  meshNode: TransformNode,
  railingType: string[]
) => {
  const redWood = redWoodMaterial();
  const blackMetal = blackMetalMaterial();
  const greyMetal = greyMetalMaterial();
  const compositeWhite = compositeWoodWhite();
  const meshChildren = meshNode.getChildMeshes();

  if (railingType[0].includes('Wood')) {
    if (meshNode.name.includes('Post')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
      meshChildren[1].material = redWood ? redWood : meshChildren[1].material;
    }
    if (meshNode.name.includes('HorizontalCable')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
    }
    if (meshNode.name.includes('VerticalPicketForHorizontalInfill')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
    }
    if (meshNode.name.includes('BaseRail')) {
      meshChildren[0].material = redWood ? redWood : meshChildren[0].material;
    }
    if (meshNode.name.includes('HandRail')) {
      meshChildren[0].material = redWood ? redWood : meshChildren[0].material;
    }
  }

  if (
    railingType[0].includes('DesignRail') ||
    railingType[0].includes('Steel')
  ) {
    meshChildren.map((mesh) => {
      mesh.material = blackMetal ? blackMetal : mesh.material;
    });
    if (meshNode.name.includes('HorizontalCable')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
    }
    if (meshNode.name.includes('VerticalPicketForHorizontalInfill')) {
      meshChildren[0].material = blackMetal
        ? blackMetal
        : meshChildren[0].material;
    }
  }
  if (railingType[0].includes('Composite')) {
    meshChildren.map((mesh) => {
      mesh.material = compositeWhite ? compositeWhite : mesh.material;
    });
    if (meshNode.name.includes('HorizontalCable')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
    }
    if (meshNode.name.includes('VerticalPicketForHorizontalInfill')) {
      meshChildren[0].material = greyMetal
        ? greyMetal
        : meshChildren[0].material;
    }
  }
};
