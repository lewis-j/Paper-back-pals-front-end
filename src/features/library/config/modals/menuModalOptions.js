import { useSelector } from "react-redux";
import BookModalForm from "../../components/ModalForms/BookModalForm/BookModalForm";
import FormContainer from "../../components/ModalForms/Shared/FormContainer/FormContainer";
import { useBookActions } from "../../hooks/useBookActions";
import { MODAL_TYPES } from "./modalTypes";
import * as asyncStatus from "../../../../data/asyncStatus";
const createBookFinder = (book_id) => (userBooks) => {
  return userBooks.find((book) => book._id === book_id);
};

// Menu configurations for different sections
export const getMenuItems = (modalActions, book_id) => {
  const getUserBookById = createBookFinder(book_id);
  return {
    booksInLibrary: (userBooks) => {
      const userBook = getUserBookById(userBooks);

      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Remove from Library",
          clickHandler: () => modalActions.removeBook(userBook),
        },
      ];
    },
    booksFromFriends: (userBooks) => {
      const userBook = getUserBookById(userBooks);

      return [
        {
          text: "Set as Current Read",
          clickHandler: () => modalActions.setCurrentRead(userBook),
        },
        {
          text: "Update Progress",
          clickHandler: () => modalActions.updateProgress(userBook),
        },
        {
          text: "Request Extension",
          clickHandler: () => modalActions.requestExtension(userBook),
        },
        {
          text: "Message Owner",
          clickHandler: () => modalActions.sendMessage(userBook),
        },
        {
          text: "Return Book",
          clickHandler: () => modalActions.returnBook(userBook),
        },
      ];
    },

    currentRead: (currentRead) => [
      {
        text: "Update Progress",
        clickHandler: () => modalActions.updateProgress(currentRead),
      },
      {
        text: "Mark as Complete",
        clickHandler: () => modalActions.markComplete(currentRead),
      },
      {
        text: "Book Details",
        clickHandler: () => modalActions.viewUserBookDetails(currentRead),
      },
      {
        text: "Return Book",
        clickHandler: () => modalActions.returnBook(currentRead),
      },
    ],

    booksToFriends: (userBooks) => {
      const userBook = getUserBookById(userBooks);
      return [
        {
          text: "View Progress",
          clickHandler: () => {
            modalActions.viewProgress(userBook);
          },
        },
        {
          text: "Message Borrower",
          clickHandler: () => modalActions.sendMessage(userBook.sender._id),
        },
        {
          text: "Request Return",
          clickHandler: () => modalActions.requestReturn(userBook),
        },
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
      ];
    },
    borrowedBookRequests: (userBooks) => {
      const userBook = getUserBookById(userBooks);
      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Message Owner",
          clickHandler: () => modalActions.sendMessage(userBook),
        },
        {
          text: "Remove Request",
          clickHandler: () => modalActions.removeRequest(userBook),
        },
      ];
    },

    bookRequests: (userBooks) => {
      const userBook = getUserBookById(userBooks);

      return [
        {
          text: "View Requests",
          clickHandler: () => modalActions.viewRequests(userBook),
        },
        {
          text: "Remove from Library",
          clickHandler: () => modalActions.removeBook(userBook),
        },
      ];
    },
  };
};

const modalConfig = (modalData, actions, isSubmitting, error, onClose) => ({
  [MODAL_TYPES.PAGE_COUNT]: {
    label: "Update current page",
    component: (
      <BookModalForm.ChangePageCount
        userBook={modalData.userBook}
        onClose={onClose}
        onUpdatePages={actions.handleUpdatePageCount}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.MARK_COMPLETE]: {
    label: "Mark book as complete",
    component: (
      <BookModalForm.MarkComplete
        userBook={modalData.userBook}
        onClose={onClose}
        onMarkComplete={actions.markComplete}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.RETURN_BOOK]: {
    label: "Return Book",
    component: (
      <BookModalForm.ReturnBook
        userBook={modalData.userBook}
        onClose={onClose}
        onReturnBook={actions.returnBook}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.VIEW_REQUESTS]: {
    label: "View Requests",
    component: (
      <BookModalForm.UserBookRequest
        userBook={modalData.userBook}
        onClose={onClose}
      />
    ),
  },
  [MODAL_TYPES.USER_BOOK_DETAILS]: {
    label: "Book Description",
    component: (
      <BookModalForm.UserBookDetails
        userBook={modalData.userBook}
        onClose={onClose}
      />
    ),
  },
  [MODAL_TYPES.CONFIRM_REQUEST]: {
    label: "Confirm Request",
    component: (
      <BookModalForm.ConfirmRequest
        requestData={modalData.request}
        userBook={modalData.userBook}
        onClose={onClose}
        onConfirmRequest={actions.confirmRequest}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.VIEW_PROGRESS]: {
    label: "Reading Progress",
    component: (
      <BookModalForm.ViewProgress
        userBook={modalData.userBook}
        onClose={onClose}
      />
    ),
  },
  [MODAL_TYPES.REMOVE_BOOK]: {
    label: "Remove Book",
    component: (
      <BookModalForm.RemoveBook
        userBook={modalData.userBook}
        onClose={onClose}
        onConfirmDelete={actions.removeBook}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.REMOVE_REQUEST]: {
    label: "Remove Request",
    component: (
      <BookModalForm.RemoveRequest
        userBook={modalData.userBook}
        onClose={onClose}
        onRemoveRequest={actions.removeRequest}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
  [MODAL_TYPES.EXTEND_BORROW]: {
    label: "Extend Borrow",
    component: (
      <BookModalForm.RequestExtension
        userBook={modalData.userBook}
        onClose={onClose}
        onRequestExtension={actions.requestExtension}
        isSubmitting={isSubmitting}
        error={error}
      />
    ),
  },
});

// Modal content components
export const ModalContent = ({ modal, onClose }) => {
  const actions = useBookActions();
  const status = useSelector((state) => state.userBooks.status);
  const error = useSelector((state) => state.userBooks.error);
  const isSubmitting = status === asyncStatus.LOADING;
  const config = modalConfig(modal.data, actions, isSubmitting, error, onClose)[
    modal.type
  ];
  const label = config?.label || modal.title || "";
  return (
    <FormContainer bookData={modal.data.userBook} label={label}>
      {config && config.component}
    </FormContainer>
  );
};
