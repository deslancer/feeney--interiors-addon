import { FC, PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModalFooterProps extends PropsWithChildren {
  className?: string;
}

const ModalFooter: FC<ModalFooterProps> = (props: ModalFooterProps) => {
  const { children, className } = props;
  return (
    <div
      className={`bg-iit-gray text-white border-t border-gray-600 ${className}`}
    >
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
