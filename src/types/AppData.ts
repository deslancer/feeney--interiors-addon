import { AppAssetsData } from './AppAssetsData';

export type AppData = {
  assets: Array<AppAssetsData>;
  created_at: string;
  description: string;
  engine: string;
  graph: string;
  id: string;
  name: string;
  scene3d: string;
  uidl: Array<any>;
  updated_at: string;
  user_id: string;
};
