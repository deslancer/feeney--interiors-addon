import styles from './Preloader.module.scss'

export interface PreloaderProps {
    progress: number;
}

export function Preloader(props: PreloaderProps) {
    const { progress } = props;
    return (
        <div className={styles["preloader_container"]}>
            <div className={styles["preloader_block"]}>
                <div className={styles["preloader_line__container"]}>
                    <div
                        className={styles["preloader_line"]}
                        style={{ width: progress + '%' }}
                    ></div>
                </div>
                <span style={{marginTop: "2rem"}}>Loaded {progress} %</span>
            </div>
        </div>
    );
}

export default Preloader;
