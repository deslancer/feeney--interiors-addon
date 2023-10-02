import { motion } from 'framer-motion';

export interface LoadingSpinnerProps {}
export function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{ backdropFilter: 'blur(4px)', zIndex: '1000' }}
      className={
        'w-screen h-screen flex absolute transition-all duration-700 top-0 left-0 bg-transparent'
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className={'m-auto'}
      >
        <img
          className={''}
          src="./assets/loadingSpinner.gif"
          alt="LoadingSpinner"
        />
      </motion.div>
    </motion.div>
  );
}
