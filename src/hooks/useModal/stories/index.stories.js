import React from 'react';

import useModal, { ModalComponents } from '../index';
import ModalRoot from '../ModalRoot';

import Button from '../../../ui/Button';
import IconButton from '../../../ui/IconButton';

export default { title: 'UI Components/Modal' };

export const ModalComponent = () => {
  const [Modal, open, close] = useModal('customclassname');
  return (
    <>
      <Button onClick={open}>Click me</Button>
      <Modal>
        <div style={{ height: '120px', width: '400px' }}>
          <ModalComponents.ModalHeader>
            I am a modal title
            <ModalComponents.ModalClose>
              {/* Use icon button/button of your choice */}
              <IconButton onClick={close}>x</IconButton>
            </ModalComponents.ModalClose>
          </ModalComponents.ModalHeader>
          <div>
            Use your own custom content
          </div>
          <ModalComponents.ModalFooter>
            <Button onClick={close}>close</Button>
          </ModalComponents.ModalFooter>
        </div>
      </Modal>
      <ModalRoot />
    </>
  );
};
