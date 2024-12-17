import { Col, Container, Row } from "reactstrap";
import {
  BookCard,
  UserBookCardSm,
  BookContainer,
  BookTransferTracker,
  RequestBadge,
  BookCardBadge,
} from "../../features/library";
import styles from "./Library.module.scss";
import { useState } from "react";
import { useBookSelectors } from "../../features/library/hooks/useBookSelectors";
import { useModalMenu } from "../../features/library/hooks/useModalMenu";
import { useSelector } from "react-redux";
import { Badge } from "../../components";
import requestStatus from "../../data/requestStatus";

const Library = () => {
  const { menuItems, renderModal, activeCardId, setActiveCardId } =
    useModalMenu();

  const { booksInLibrary, booksToFriends, ownedbooksInTransition } =
    useBookSelectors(useSelector((state) => state.userBooks));

  const toFriendsMenuItems = menuItems.booksToFriends;
  const inLibraryMenuItems = menuItems.booksInLibrary;
  const bookRequestMenuItems = menuItems.bookRequests;

  const BookCol = ({ children, key }) => (
    <Col sm="4" md="3" xl="2" className="mb-3" key={key}>
      {children}
    </Col>
  );

  const mapCheckedOutBooks = (userBook, i) => {
    const { _id, book, sender, dueDate, currentPage } = userBook;
    const { request } = userBook;
    const bookCardBadge = { badge: null, clickHandler: () => {} };
    const toFriendsmenuItems = toFriendsMenuItems(userBook);
    const cancelReturnRequest = toFriendsmenuItems[2].clickHandler;
    if (request.status === requestStatus.RETURN_REQUESTED) {
      bookCardBadge.badge = <Badge.ReturnRequestedBadge />;
      bookCardBadge.clickHandler = () => {
        cancelReturnRequest();
      };
    }
    return (
      <BookCol key={`LibraryCard:${userBook._id}`}>
        <BookCardBadge
          badge={bookCardBadge.badge}
          clickHandler={bookCardBadge.clickHandler}
        >
          <UserBookCardSm
            _id={_id}
            book={book}
            menuItems={toFriendsmenuItems}
            user={sender}
            dueDate={dueDate}
            currentPage={currentPage}
            setActive={setActiveCardId}
            isActive={activeCardId === _id}
          />
        </BookCardBadge>
      </BookCol>
    );
  };

  const renderCheckedInBookCard = (userBook, i) => {
    const { _id, book, status } = userBook;
    const { coverImg, title } = book;
    const cardInfo = { coverImg, title, status };
    console.log("bookcard in library", userBook);
    const checkedInMenuItems = (userBook) => {
      if (userBook.requests.length > 0) {
        return bookRequestMenuItems(userBook);
      } else {
        return inLibraryMenuItems(userBook);
      }
    };
    const badgeOnClick = bookRequestMenuItems(userBook)[0].clickHandler;

    return (
      <Col sm="4" md="3" xl="2" className="mb-3" key={_id}>
        <RequestBadge
          count={userBook.requests.length}
          clickHandler={() => {
            console.log("badge clicked");
            badgeOnClick();
          }}
        >
          <BookCard
            _id={_id}
            book={cardInfo}
            menuItems={checkedInMenuItems(userBook)}
            isActive={activeCardId === _id}
            setActive={setActiveCardId}
          />
        </RequestBadge>
      </Col>
    );
  };

  return (
    <>
      {renderModal()}
      <Container>
        <div className={styles.title}>
          <h1>Your Library</h1>
        </div>
        <div>
          <h4 className={styles.subtitle}>Checked in Books</h4>
        </div>
        <Row className={styles.section}>
          <BookContainer
            noContent={{
              text: "No Books in Library",
              description: "Add some books to get started!",
            }}
          >
            {booksInLibrary.map(renderCheckedInBookCard)}
          </BookContainer>
        </Row>

        <BookTransferTracker
          booksInTransition={ownedbooksInTransition}
          isBorrower={false}
        />

        <div>
          <h4 className={styles.subtitle}>Checked Out Books</h4>
        </div>
        <Row className={styles.section}>
          <BookContainer
            noContent={{
              text: "No Checked Out Books",
              description: "Share books with friends to see them here",
            }}
          >
            {booksToFriends.map(mapCheckedOutBooks)}
          </BookContainer>
        </Row>
      </Container>
    </>
  );
};

export default Library;