import { createContext } from 'react';

export interface ModalContextValue {
  handleClose?: () => void;
}

const ModalContext = createContext<ModalContextValue>({});
ModalContext.displayName = 'ModalContext';

export default ModalContext;
