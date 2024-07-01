import React, { useEffect, useRef, useState } from "react";
import Styles from "./Styles.module.css";
const Modal = ({ isOpen, onClose, children, title = false }) => {
  return (
    <>
      {isOpen && (
        <div className={Styles.modalOverlay} onClick={onClose}>
          <div
            className={`${Styles.modal} `}
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation();
            }}
          >
            {title && <div className={Styles.modalTitle}>{title}</div>}
            <div className={Styles.ModalContent}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
const ModalPage = ({ open, content, onClose, title = false }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onModalClose = () => {
    onClose?.();
    setIsOpen(false);
  };

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={onModalClose} title={title}>
      <div className={Styles.ModalControl}>
        {content}
      </div>
    </Modal>
  ) : null;
};

export default ModalPage;
