import { FC, PropsWithChildren } from 'react';

// eslint-disable-next-line
export interface ModalBodyProps extends PropsWithChildren {}

const ModalBody: FC<ModalBodyProps> = (props) => {
  const { children } = props;
  return (
    <div className="bg-white text-feeney_secondary_dark h-full max-h-[60vh] overflow-y-auto">
      {children}
    </div>
  );
};

ModalBody.displayName = 'ModalBody';

export default ModalBody;
