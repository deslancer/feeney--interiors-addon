import { motion } from 'framer-motion';
import styles from './Preloader.module.scss';

export interface PreloaderProps {
  progress: number;
}

export function Preloader(props: PreloaderProps) {
  const { progress } = props;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className={styles['preloader_container']}
    >
      <div className={styles['preloader_block']}>
        <div>
          <img src="./assets/feeney_logo.png" alt="Logo" />
          <div className={styles['preloader_line__container']}>
            <div
              className={styles['preloader_line']}
              style={{ width: progress + '%' }}
            ></div>
          </div>
          <span style={{ marginTop: '2rem' }}>Loaded &nbsp; {progress} %</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Preloader;
