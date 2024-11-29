import React, { useState } from "react";
import { Modal } from "../../../../components";
import { BookModalContent } from "../../../library/config/modals/menuModalOptions";
import { MODAL_TYPES } from "../../../library/config/modals";
import { runBookRequestAction } from "./NotificationModalClickHandlers";
import { useModalActions } from "../../../library/hooks/useModalActions";
import { createBookFromRequestFinder } from "../../../library/userBooksSlice";
import { useSelector } from "react-redux";
import { useBookSelectors } from "../../../library/hooks/useBookSelectors";
import { getBookRequest } from "../../../library/userBookCalls";

const useNotificationModal = (notifications) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: null,
    data: null,
  });
  const [requestType, setRequestType] = useState(null);

  const findBookFromRequest = useSelector(createBookFromRequestFinder);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
  };

  const openModal = (type, data) => {
    console.log("type", type, data);
    const config = MODAL_TYPES[type];
    if (!config) {
      console.warn(`No configuration found for modal type: ${type}`);
      return;
    }
    setModal({ isOpen: true, type: config.value, title: config.title, data });
  };

  const modalActions = useModalActions(openModal);

  const openNotificationModal = async (notification_id) => {
    const notification = notifications.find(
      (notification) => notification.id === notification_id
    );
    if (notification.requestType === "BookRequest") {
      const requestObj = await getBookRequest(notification.requestRef);
      console.log("request object in open notification", requestObj);
      setRequestType("BookRequest");
      const userBook = findBookFromRequest(notification.requestRef);
      console.log("userBook from findBookFromRequest", userBook);
      return runBookRequestAction(modalActions, userBook);
    } else if (notification.requestType === "BookReturn") {
      //implement friend request action
    }
  };

  const getModalContent = (modal) => {
    console.log("modal in getModalContent", modal, "Request Type", requestType);
    if (!modal?.data) return null;
    if (requestType === "BookRequest") {
      return <BookModalContent modal={modal} onClose={closeModal} />;
    }
  };

  const renderModal = () => {
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        {getModalContent(modal)}
      </Modal>
    );
  };

  return { renderModal, openNotificationModal };
};

export default useNotificationModal;
