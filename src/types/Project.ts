import { RailingParams } from './RailingParams';

export interface Project {
  created: number;
  projectImg: string;
  projectName: string;
  projectType: string;
  railing: RailingParams;
  railingColors: {};
  scenery: 'string';
  snapshots: string[];
  updated: number;
  sceneId: string;
  userId: string;
  id?: string;
}
