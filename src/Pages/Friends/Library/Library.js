import React from "react";

import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import {
  UserBookCardSm,
  BookCard,
  BookContainer,
  RequestCard,
  bookRequestStatus,
} from "../../../features/library";
import { getFriendsOwnedBookById } from "../../../features/Friends";
import { upperFirst } from "../../../utilities/stringUtil";
import styles from "./Library.module.scss";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useBookSelectors } from "../../../features/library/hooks/useBookSelectors";
import { useModalMenu } from "../../../features/library/hooks/useModalMenu";

const Library = () => {
  const currentFriend = useSelector((state) => state.friends.currentFriend);
  const currentUser = useSelector((state) => state.authUser.currentUser);
  const { username, ownedBooks } = currentFriend;
  console.log("ownedBooks", ownedBooks);
  const books = ownedBooks.map((book) => ({
    ...book,
    owner: {
      _id: currentFriend._id,
      username: currentFriend.username,
      profilePic: currentFriend.profilePic,
    },
  }));
  const { menuItems, renderModal, activeCardId, setActiveCardId } =
    useModalMenu();

  const { booksInLibrary: checkedInBooks, booksToFriends: checkedOutBooks } =
    useBookSelectors({
      books: { owned: books },
    });

  const friendsBooksMenuItems = menuItems.friendsBooks(checkedInBooks);
  const borrowedBookRequestsMenuItems =
    menuItems.borrowedBookRequests(checkedInBooks);
  const booksFromFriendsMenuItems = menuItems.booksFromFriends(checkedInBooks);
  // const checkedOutMenuItems = menuItems.booksToFriends(checkedOutBooks);

  const filterRequest = (request) => {
    console.log("request in filterRequest", request);
    const foundRequest = request.find(
      (req) => req.sender._id === currentUser._id
    );
    console.log("foundRequest", foundRequest);
    switch (foundRequest?.status) {
      case bookRequestStatus.CHECKED_IN:
        return {
          menu: [...borrowedBookRequestsMenuItems],
          icon: faCheckCircle,
          iconStyle: styles.requestSentIcon,
        };
      case bookRequestStatus.CHECKED_OUT:
        return {
          menu: [...booksFromFriendsMenuItems],
          icon: faCheckCircle,
          iconStyle: styles.requestSentIcon,
        };
      default:
        return {
          menu: [...friendsBooksMenuItems],
          icon: null,
        };
    }
  };

  const BookCol = ({ children, key }) => (
    <Col sm="6" md="4" lg="3" xl="2" className="mb-3" key={key}>
      {children}
    </Col>
  );

  const renderCheckedOutUserBookCard = (userBook, i) => {
    const { _id, book, dueDate, currentPage, sender } = userBook;
    console.log("userBook in renderCheckedOutUserBookCard", userBook);

    // const { menu } = filterRequest(bookData._id);
    return (
      <BookCol key={`UserBookCardSm:${_id}`}>
        <UserBookCardSm
          _id={_id}
          book={book}
          user={sender}
          dueDate={dueDate}
          // menuItems={menu}
          currentPage={currentPage}
          setActive={setActiveCardId}
          isActive={activeCardId === _id}
        />
      </BookCol>
    );
  };

  const renderCheckedInBookCard = (userBook) => {
    console.log("userBook", userBook);
    const { _id, book, request } = userBook;
    const { menu, icon, iconStyle } = filterRequest(request);
    const { coverImg, title } = book;

    return (
      <BookCol key={`BookCards:${_id}`}>
        <BookCard
          menuItems={menu}
          book={{ coverImg, title }}
          _id={_id}
          setActive={setActiveCardId}
          isActive={activeCardId === _id}
          icon={icon}
          iconStyle={iconStyle}
        />
      </BookCol>
    );
  };

  return (
    <>
      <div className="container">
        {renderModal()}
        <div className={styles.title}>
          <h1>
            {upperFirst(username)}
            's Library
          </h1>
        </div>
        <div>
          <h4 className={styles.subtitle}>Checked in Books</h4>
        </div>
        <Row className={styles.section}>
          <BookContainer>
            {checkedInBooks.map(renderCheckedInBookCard)}
          </BookContainer>
        </Row>
        <div>
          <h4 className={styles.subtitle}>Checked Out Books</h4>
        </div>
        <Row className={styles.section}>
          <BookContainer>
            {checkedOutBooks.map(renderCheckedOutUserBookCard)}
          </BookContainer>
        </Row>
      </div>
    </>
  );
};

export default Library;
