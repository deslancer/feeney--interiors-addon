type BuildMethod<T> = (args: T) => void;
export interface RailingComponentsBuilder<T> {

    build: BuildMethod<T>;
    remove: () => void;

}