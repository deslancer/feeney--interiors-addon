import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import ModalBody from './ModalBody';
import ModalContext, { ModalContextValue } from './ModalContext';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import { motion } from 'framer-motion';

export interface ModalProps extends PropsWithChildren {
  /**
   * When `true` The modal will show itself.
   */
  isOpen: boolean;

  /**
   * A callback fired when the header closeButton or non-static backdrop is clicked.
   */
  onClose: () => void;
  /**
   * A callback fires when the modal is open.
   */
  onOpen?: () => void;
  width?: string;
  staticBackdrop?: boolean;
}

const Modal: FC<ModalProps> = (props) => {
  const { isOpen, onClose, onOpen, children, width, staticBackdrop } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo<ModalContextValue>(() => {
    return {
      handleClose: onClose,
    };
  }, [onClose]);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
      onOpen?.();
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  const closeModal = () => {
    if (!staticBackdrop) {
      setIsModalOpen(false);
      onClose?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <ModalContext.Provider value={contextValue}>
      <div key="modal" className="fixed inset-0 z-50 overflow-y-auto">
        <div
          ref={modalRef}
          className="flex items-center justify-center min-h-screen p-6"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 "
            aria-hidden="true"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transform: ['translateY(-100px)', 'translateY(0)'],
            }}
            exit={{
              opacity: 0,
              transform: ['translateY(0)', 'translateY(-100px)'],
            }}
            transition={{ duration: 1.2 }}
            className={`
            bg-feeney_secondary_dark text-white translate-y-0 rounded-md text-left overflow-hidden
            shadow-xl  sm:max-w-lg sm:w-full
            md:max-w-3xl h-full max-h-[90vh] ${width}`}
            role="document"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

Modal.displayName = 'Modal';

export default Object.assign(Modal, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
