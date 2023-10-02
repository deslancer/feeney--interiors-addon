import { useFeeneyStore } from '../store/store';
import { RailingParams } from '../../types/RailingParams';
import { Project } from '../../types/Project';

export const gatherDataForPayload = (projectName: string): string => {
  const {
    selectedScene,
    user,
    railingType,
    postMounting,
    cornerPosts,
    railingHeight,
    topRail,
    infill,
    verticalPicketShapeType,
    verticalPicketColorName,
  } = useFeeneyStore.getState();
  const userID = user ? user.id : 'empty';
  const railingParams: RailingParams = {
    railingType: railingType,
    postMounting: postMounting,
    cornerPosts: cornerPosts,
    railingHeight: railingHeight,
    topRail: topRail,
    infill: infill,
    verticalPicketShapeType: verticalPicketShapeType,
    verticalPicketColorName: verticalPicketColorName,
  };
  const projectData: Project = {
    created: Date.now(),
    projectImg: selectedScene ? selectedScene.image : '',
    projectName: projectName,
    projectType: 'interior',
    railing: railingParams,
    railingColors: {},
    scenery: 'string',
    sceneId: selectedScene ? selectedScene.id : '',
    snapshots: ['string'],
    updated: Date.now(),
    userId: userID,
  };
  return JSON.stringify(projectData);
};
