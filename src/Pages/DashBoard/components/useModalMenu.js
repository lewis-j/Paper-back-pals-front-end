import React, { useState } from "react";
import { Modal } from "../../../components";

const useModalMenu = (getMenuItems, getModalContent) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: null,
    data: null,
  });

  const openModal = (type, title, data = null) => {
    setModal({ isOpen: true, type, title, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
  };

  const menuItems = getMenuItems(openModal);

  const renderModal = () => {
    console.log("modal", modal);
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        {getModalContent(modal, closeModal)}
      </Modal>
    );
  };
  return {
    menuItems,
    renderModal,
  };
};

export default useModalMenu;
