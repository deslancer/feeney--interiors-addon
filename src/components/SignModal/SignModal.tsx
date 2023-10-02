import Modal from '../Modal/Modal';
import { SignIn } from './SignIn';
import { useState } from 'react';
import { SignUp } from './SignUp';

export interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignModal(props: SignModalProps) {
  const { isOpen, onClose } = props;
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  return (
    <Modal isOpen={isOpen} width={'md:max-w-xl'} onClose={onClose}>
      <Modal.Header>Authorization</Modal.Header>
      <Modal.Body>
        <div className={'min-h-[60vh] flex'}>
          {isSignUp ? (
            <SignUp />
          ) : (
            <SignIn needsSignUp={setIsSignUp} onClose={onClose} />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
