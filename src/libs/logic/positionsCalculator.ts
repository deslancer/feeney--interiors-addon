/* eslint-disable @typescript-eslint/no-explicit-any */
import {BoundingInfo, Node, Vector3} from 'babylonjs';
import {useFeeneyStore} from '../store/store';
import {Singleton} from '../../decorators/singleton';
import {Balustrade, PlacementPoints, PostsPositionTypes, ProductEntity, Stairway,} from '../../types';
import {BACKWARD, FORWARD, LEFT, RIGHT} from '../utils/constants';

@Singleton
export class PositionsCalculator {
    private readonly _points: PlacementPoints;
    private height = 0;
    private halfHeight = 0;
    private _dimensions: Record<string, number | number[]> = {};
    private readonly sceneMetaData: any;

    constructor() {
        this.sceneMetaData = useFeeneyStore.getState().sceneMetaData;
        this._points = this.sceneMetaData.positions;

        console.info('scene metadata:', this.sceneMetaData);
    }

    public calculate(post: ProductEntity) {
        this._calculateFromPostsPositions(post);
    }

    public get points() {
        return this._points;
    }

    public get dimensions() {
        return this._dimensions;
    }

    /**
     * @param {Node} meshNode - Node for calculation real size
     * @returns (Vector3) - returns size of Node represented via Vector3, where x - Height, y - Length, z - Depth
     * */
    public meshSizeInMeters(meshNode: Node) {
        const getParentUpdatedBoundingInfo = (parent: Node): BoundingInfo => {
            parent.getChildMeshes().forEach((mesh) => mesh.computeWorldMatrix(true)); // force the update
            const childMeshes = parent.getChildMeshes();
            let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
            let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;
            for (let i = 0; i < childMeshes.length; i++) {
                const meshMin =
                    childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
                const meshMax =
                    childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;

                min = Vector3.Minimize(min, meshMin);
                max = Vector3.Maximize(max, meshMax);
            }
            return new BoundingInfo(min, max);
        };
        const boundingInfo = getParentUpdatedBoundingInfo(meshNode);
        const bbox = boundingInfo.boundingBox;

        return {
            height: bbox.maximum.z - bbox.minimum.z,
            length: bbox.maximum.x - bbox.minimum.x,
            depth: bbox.maximum.y - bbox.minimum.y,
        };
    }

    /**
     *
     * @param fromPoint - Start Vector3
     * @param toPoint - End Vector3
     * @param amount - Amount of needed intermediate Vector3
     */
    public interpolateVectors(fromPoint: Vector3, toPoint: Vector3, amount: number): Vector3[] {
        const intermediates: Vector3[] = [];
        for (let i = 1; i <= amount; i++) {
            const t = i / (amount + 1);
            const intermediatePoint = Vector3.Lerp(fromPoint, toPoint, t);
            intermediates.push(intermediatePoint);
        }
        return intermediates
    }

    private angleBetweenTwoPoints(
        fromPoint: string[],
        toPoint: string[],
        direction: Vector3,
        isNeedsOffset: boolean,
        offset: number,
        bothSides?: boolean
    ) {
        let a1: number = +fromPoint[1];
        let a2: number = +toPoint[1];
        let b1: number;
        let b2: number;

        if (isNeedsOffset) {
            a1 += offset;
        }
        if (bothSides) {
            a2 += offset;
        }
        if (direction.equals(RIGHT) || direction.equals(LEFT)) {
            b1 = +fromPoint[0]; // x
            b2 = +toPoint[0]; // x
            return Math.atan2(a2 - a1, b2 - b1);
        } else if (direction.equals(FORWARD) || direction.equals(BACKWARD)) {
            b1 = +fromPoint[2]; // z
            b2 = +toPoint[2]; // z
            return Math.atan2(a2 - a1, b2 - b1);
        } else {
            console.error('Direction is not equals any side');
            return 0;
        }
    }

    private directionBetweenTwoPoints(
        fromPoint: string[],
        toPoint: string[]
    ): Vector3 {
        let vec = Vector3.FromArray(fromPoint.map((point) => Number(point)));
        let vec2 = Vector3.FromArray(toPoint.map((point) => Number(point)));
        vec.y = 0;
        vec2.y = 0;

        const direction = vec2.subtract(vec);
        const normalized = Vector3.Normalize(direction);
        normalized.set(
            Math.round(normalized.x),
            Math.round(normalized.y),
            Math.round(normalized.z)
        );
        return normalized;
    }

    private centerBetweenTwoPoints(
        fromPoint: string[],
        toPoint: string[]
    ): Vector3 {
        const vec1 = Vector3.FromArray(fromPoint.map((point) => Number(point)));
        const vec2 = Vector3.FromArray(toPoint.map((point) => Number(point)));
        return Vector3.Lerp(vec1, vec2, 0.5);
    }

    private lengthBetweenTwoPoints(
        fromPoint: string[],
        toPoint: string[],
        postWidth: number
    ): number {
        const vec1 = Vector3.FromArray(fromPoint.map((point) => Number(point)));
        const vec2 = Vector3.FromArray(toPoint.map((point) => Number(point)));
        return Vector3.Distance(vec1, vec2) + postWidth;
    }

    private sectionsLengthAndCenter(points: string[][]) {
        const centers: Vector3[] = [];
        const lengths: number[] = [];

        const pointsVectors: Vector3[] = points.map((point) =>
            Vector3.FromArray(point.map((point) => Number(point)))
        );

        for (let i = 0; i <= points.length - 1; i++) {
            const current = pointsVectors[i];
            const next = pointsVectors[i + 1];

            if (next) {
                centers.push(Vector3.Center(current, next));
                lengths.push(Vector3.Distance(current, next));
            }
        }

        return {
            centers: centers,
            lengths: lengths,
        };
    }

    private sectionsAngles(
        points: string[][],
        direction: Vector3,
        isNeedsOffset: boolean,
        offset: number
    ): number[] {
        const angles: number[] = [];

        for (let i = 0; i <= points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            if (next) {
                angles.push(
                    this.angleBetweenTwoPoints(
                        current,
                        next,
                        direction,
                        isNeedsOffset,
                        offset,
                        true
                    )
                );
            }
        }
        return angles;
    }

    private _calculateFromPostsPositions(entity: ProductEntity) {
        /** Divide by 100 is for converting to meters, */
        this.height = entity.height / 100;
        /**  Divide by 2 because pivot point in mesh center*/
        this.halfHeight = this.height / 2;
        const postWidth = entity.postWidth
            ? entity.postWidth / 100
            : entity.width / 100;
        this._dimensions['postHeight'] = this.height;
        this._dimensions['postWidth'] = postWidth;
        this._dimensions['postHalfHeight'] = this.halfHeight;

        const stairways = this._points[PostsPositionTypes.STAIRS]
            .stairways as Stairway[];
        const balustrades = this._points[PostsPositionTypes.PLATFORM]
            .balustrades as Balustrade[];

        stairways.map((stairway) => {
            const firstPoint = stairway.points[0];
            const secondPoint = stairway.points[1];
            const fasciaPointsLength = stairway.fasciaPoints.length - 1;

            const lastPoint = stairway.points[stairway.points.length - 1];
            const preLastPoint = stairway.points[stairway.points.length - 2];
            const direction = this.directionBetweenTwoPoints(firstPoint, lastPoint);
            const {centers, lengths} = this.sectionsLengthAndCenter(
                stairway.points
            );
            stairway.direction = direction;
            stairway.baseRail.angle = this.angleBetweenTwoPoints(
                firstPoint,
                lastPoint,
                direction,
                stairway.baseRail.needsAngleOffset,
                stairway.baseRail.offset
            );
            stairway.handRail.angle = this.angleBetweenTwoPoints(
                firstPoint,
                preLastPoint,
                direction,
                stairway.handRail.needsAngleOffset,
                stairway.handRail.offset
            );
            stairway.center = this.centerBetweenTwoPoints(firstPoint, lastPoint);

            stairway.length = this.lengthBetweenTwoPoints(
                firstPoint,
                lastPoint,
                postWidth
            );

            stairway.sectionsCenter = centers;
            stairway.sectionsLengths = lengths;
            stairway.sectionsAngles = this.sectionsAngles(
                stairway.points,
                direction,
                stairway.baseRail.needsAngleOffset,
                stairway.baseRail.offset
            );

            const fasciaFirstPoint = stairway.fasciaPoints[0];
            const fasciaSecondPoint = stairway.fasciaPoints[1];
            const fasciaLastPoint = stairway.fasciaPoints[fasciaPointsLength];
            const fasciaCentersAndLengths = this.sectionsLengthAndCenter(
                stairway.fasciaPoints
            );
            stairway.fasciaDirection = this.directionBetweenTwoPoints(
                secondPoint,
                fasciaSecondPoint
            );
            stairway.fasciaCenter = this.centerBetweenTwoPoints(
                fasciaFirstPoint,
                fasciaLastPoint
            );
            stairway.fasciaLength = this.lengthBetweenTwoPoints(
                fasciaFirstPoint,
                fasciaLastPoint,
                postWidth
            );
            stairway.fasciaSectionsCenter = fasciaCentersAndLengths.centers;
            stairway.fasciaSectionsLengths = fasciaCentersAndLengths.lengths;
            stairway.fasciaSectionsAngles = this.sectionsAngles(
                stairway.fasciaPoints,
                direction,
                stairway.baseRail.needsAngleOffset,
                stairway.baseRail.offset
            );
        });
        balustrades.map((balustrade) => {
            const firstPoint = balustrade.points[0];
            const secondPoint = balustrade.points[1];
            const lastPoint = balustrade.points[balustrade.points.length - 1];
            const {centers, lengths} = this.sectionsLengthAndCenter(
                balustrade.points
            );

            balustrade.direction = this.directionBetweenTwoPoints(
                firstPoint,
                lastPoint
            );
            balustrade.center = this.centerBetweenTwoPoints(firstPoint, lastPoint);
            balustrade.length = this.lengthBetweenTwoPoints(
                firstPoint,
                lastPoint,
                postWidth
            );

            balustrade.sectionsCenter = centers;
            balustrade.sectionsLengths = lengths;

            const fasciaFirstPoint = balustrade.fasciaPoints[0];
            const fasciaSecondPoint = balustrade.fasciaPoints[1];
            const fasciaLastPoint =
                balustrade.fasciaPoints[balustrade.fasciaPoints.length - 1];
            const fasciaCentersAndLengths = this.sectionsLengthAndCenter(
                balustrade.fasciaPoints
            );
            balustrade.fasciaDirection = this.directionBetweenTwoPoints(
                secondPoint,
                fasciaSecondPoint
            );
            balustrade.fasciaCenter = this.centerBetweenTwoPoints(
                fasciaFirstPoint,
                fasciaLastPoint
            );
            balustrade.fasciaLength = this.lengthBetweenTwoPoints(
                fasciaFirstPoint,
                fasciaLastPoint,
                postWidth
            );
            balustrade.fasciaSectionsCenter = fasciaCentersAndLengths.centers;
            balustrade.fasciaSectionsLengths = fasciaCentersAndLengths.lengths;
        });
    }
}
