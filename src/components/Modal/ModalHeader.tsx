import { FC, PropsWithChildren, useContext } from 'react';
import ModalContext from './ModalContext';

export interface ModalHeaderProps extends PropsWithChildren {
  /**
   * Specify whether the Component should contain a close button
   */
  closeButton?: boolean;

  /**
   * Provides an accessible label for the close button.
   * It is used for Assistive Technology when the label text is not readable
   */
  closeLabel?: string;

  /**
   * A Callback fired when the close button is clicked.
   * If used directly inside a Modal component,
   * the `onClose` will automatically be propagated up to the parent Modal `onClose`.
   */
  onClose?: () => unknown;
}

const ModalHeader: FC<ModalHeaderProps> = (props: ModalHeaderProps) => {
  const { children, closeLabel, closeButton, onClose } = props;
  const { handleClose } = useContext(ModalContext);
  const close = () => {
    handleClose?.();
    onClose?.();
  };

  return (
    <div className="flex justify-between items-center py-4 px-5 border-b border-gray-600">
      <h3 className="text-xl font-medium">{children}</h3>
    </div>
  );
};
const defaultProps: ModalHeaderProps = {
  closeButton: true,
  closeLabel: 'Close',
};

ModalHeader.displayName = 'ModalHeader';
ModalHeader.defaultProps = defaultProps;

export default ModalHeader;
