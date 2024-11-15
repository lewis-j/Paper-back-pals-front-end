import { useModal } from "../../../context/ModalContext";
import { MODAL_TYPES, MODAL_CONFIG } from "../config/modals";

export const useModalActions = () => {
  const { openModal: openModalBase } = useModal();

  const openModal = (type, data) => {
    const config = MODAL_CONFIG[type];
    if (!config) {
      console.warn(`No configuration found for modal type: ${type}`);
      return;
    }
    openModalBase(type, config.title, data);
  };

  return {
    openModal,
    // Book reading actions
    updateProgress: (userBook) => openModal(MODAL_TYPES.PAGE_COUNT, userBook),
    setCurrentRead: (userBook) => openModal(MODAL_TYPES.CURRENT_READ, userBook),
    markComplete: (userBook) => openModal(MODAL_TYPES.MARK_COMPLETE, userBook),
    viewBookDetails: (userBook) =>
      openModal(MODAL_TYPES.BOOK_DETAILS, userBook),

    // Book lending actions
    returnBook: (userBook) => openModal(MODAL_TYPES.RETURN_BOOK, userBook),
    requestExtension: (userBook) =>
      openModal(MODAL_TYPES.EXTEND_BORROW, userBook),
    requestReturn: (userBook) =>
      openModal(MODAL_TYPES.REQUEST_RETURN, userBook),

    // Request management
    viewRequests: (userBook) => openModal(MODAL_TYPES.VIEW_REQUESTS, userBook),
    confirmRequest: (data) => openModal(MODAL_TYPES.CONFIRM_REQUEST, data),

    // Book management
    removeBook: (userBook) => openModal(MODAL_TYPES.REMOVE_BOOK, userBook),
    viewProgress: (userBook) => openModal(MODAL_TYPES.VIEW_PROGRESS, userBook),

    // Communication
    sendMessage: (userBook) => openModal(MODAL_TYPES.SEND_MESSAGE, userBook),
  };
};
