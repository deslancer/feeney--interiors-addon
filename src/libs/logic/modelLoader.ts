
interface Entity {
    [key: string]: any;
}
export function loadModel<R extends object>(entity: Entity, specialModel?: string): Promise<R> {

    const cache: Array<any> = [];
    const lightedCache: Array<any> = [];
    const cache135degree: any[] = [];
    const cache45degree: any[] = [];

    return new Promise((resolve, reject) => {
        let objName: string;

        switch ( specialModel ) {
            case 'lighting': {
                objName = entity.modelLightingObj;
                for ( let i = 0; i < lightedCache.length; i++ ) {
                    const model = lightedCache[i];
                    if (model.userData.entity && model.userData.entity.id === entity.id) {
                        const modelClone = model.clone();
                        resolve(modelClone);
                        return;
                    }
                }
            }
                break;
            case '45degree': {
                objName = entity.model45Obj;
                for ( let i = 0; i < cache45degree.length; i++ ) {
                    const model = cache45degree[i];
                    if (model.userData.entity && model.userData.entity.id === entity.id) {
                        const modelClone = model.clone();
                        resolve(modelClone);
                        return;
                    }
                }
            }
                break;
            case '135degree': {
                objName = entity.model135Obj;
                for ( let i = 0; i < cache135degree.length; i++ ) {
                    const model = cache135degree[i];
                    if (model.userData.entity && model.userData.entity.id === entity.id) {
                        const modelClone = model.clone();
                        resolve(modelClone);
                        return;
                    }
                }
            }
                break;
            default: {
                objName = entity.modelObj;
                for ( let i = 0; i < cache.length; i++ ) {
                    const model = cache[i];
                    if (model.userData.entity && model.userData.entity.id === entity.id) {
                        const modelClone = model.clone();
                        resolve(modelClone);
                        return;
                    }
                }
            }
                break;
        }
    })
}