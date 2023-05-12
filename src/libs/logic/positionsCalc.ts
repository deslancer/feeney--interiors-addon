import { Vector3 } from "babylonjs";
import { useFeeneyStore } from "../store/store";
import { ProductEntity } from "../../types/ProductEntity";

export class PositionsCalc {
    private placementPoints: Vector3[] = useFeeneyStore.getState().placementPoints ?? [];
    private static _instance: PositionsCalc;
    /**
     * The instance function is a property getter that creates and caches a singleton instance of the class.
     *
     * @return The singleton instance of the class
     *
     */
    public static get instance(): PositionsCalc {
        if (this._instance == null) {
            this._instance = new PositionsCalc();
        }
        return this._instance;
    }
    private halfPostHeight: number = 0;
    private _postsPositions: Record<string, Vector3> = {};
    private _baseRailPosition: Record<string, Vector3 | number> = {}
    private _dimensions: Record<string, number> = {}
    constructor() {
    }
    get getPostsPositions(){
        return this._postsPositions;
    }
    get getDimensions(){
        return this._dimensions;
    }
    calcForPosts(entity: ProductEntity){
        /** Because pivot point in mesh center*/
        this.halfPostHeight = (entity.height / 100) / 2;
        const lowestY = this.placementPoints.reduce((i, a) => Math.min(a.y, i), Infinity);
        const lowestVec3 = this.placementPoints.find(vec => vec.y === lowestY) ?? Vector3.Zero();

        //TODO think how to make it universal
        this._postsPositions['firstPost'] = new Vector3(lowestVec3.x, lowestVec3.y + this.halfPostHeight, lowestVec3.z);
        this._postsPositions['cornerPost'] = new Vector3(this.placementPoints[1].x,this.placementPoints[1].y + this.halfPostHeight, this.placementPoints[1].z)
        this._postsPositions['lastPost'] = new Vector3(this.placementPoints[2].x,this.placementPoints[2].y + this.halfPostHeight, this.placementPoints[2].z)

        this._dimensions['stairLength'] = Vector3.Distance(this._postsPositions['firstPost'], this._postsPositions['cornerPost']);
        console.log(this._dimensions['stairLength'])
    }
    calcForBaseRail(){
        const centerBetweenPosts = Vector3.Lerp(this._postsPositions['firstPost'],this._postsPositions['cornerPost'], 0.5);
        this._baseRailPosition['position'] = new Vector3(centerBetweenPosts.x, centerBetweenPosts.y, centerBetweenPosts.z)
        console.log(centerBetweenPosts)
    }
}