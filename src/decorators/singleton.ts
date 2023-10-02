export function Singleton<T extends new (...args: any[]) => any>(ctr: T): T {

    let instance: T;

    return class {
        constructor(...args: any[]) {

            if (instance == null) {
                instance = new ctr(...args);
                return instance;
            }else {
                return instance;
            }



        }
    } as T
}
