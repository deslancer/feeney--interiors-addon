import { Balustrade } from './Balustrade';
import { Stairway } from './Stairway';

export interface PlacementPoints {
  corners: string[][];
  platform: { balustrades: Balustrade[] };
  stairs: { stairways: Stairway[] };
}
