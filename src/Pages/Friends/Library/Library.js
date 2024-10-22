import React, { useState, useRef } from "react";

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
import { Modal } from "../../../components";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import requestStatus from "../../../data/requestStatus";

const Library = () => {
  const currentFriend = useSelector((state) => state.friends.currentFriend);
  const currentUser = useSelector((state) => state.authUser.currentUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState("");
  const [modalHeight, setModalHeight] = useState({ top: "0px" });
  const { username, ownedBooks } = currentFriend;
  const containerRef = useRef();

  const activeBookInfo = useSelector(getFriendsOwnedBookById(activeCardId));

  const filterRequest = (request) => {
    const foundRequest = request.find(
      (req) => req.sender._id === currentUser._id
    );
    console.log("foundRequest", foundRequest);
    const openRequestCardModal = ({ target }) => {
      const { y: containerY } = containerRef.current.getBoundingClientRect();
      const { y } = target.getBoundingClientRect();
      setModalHeight({ top: `${y - containerY}px` });
      setIsModalOpen(true);
    };

    return (
      {
        [bookRequestStatus.CHECKED_IN]: {
          menu: [
            {
              text: "Cancel",
              clickHandler: () => alert("delete this request"),
            },
            {
              text: "Status",
              clickHandler: openRequestCardModal,
            },
          ],
          icon: faCheckCircle,
          iconStyle: styles.requestSentIcon,
        },
      }[foundRequest.status] || {
        menu: [
          {
            text: "Request",
            clickHandler: openRequestCardModal,
          },
        ],
        icon: null,
      }
    );
  };

  const mapCheckedOutBooks = (userBook, i) => {
    // const progressValue = getProgressInPercent(
    //   bookData.currentPage,
    //   bookData.pageCount
    // );

    const {
      _id,
      book: { coverImg, title },
      currentRequest: { dueDate, sender },
    } = userBook;
    const book = { _id, coverImg, title, dueDate };

    // const { menu } = filterRequest(bookData._id);
    return (
      <Col
        sm="6"
        md="4"
        lg="3"
        xl="2"
        className="mb-3"
        key={`UserBookCardSm:${_id}`}
      >
        <UserBookCardSm
          book={book}
          user={sender}
          setActive={setActiveCardId}
          isActive={activeCardId === _id}
        />
      </Col>
    );
  };

  const mapCheckedInBooks = (userBook) => {
    const { _id, book, request } = userBook;
    console.log("userBook", userBook);
    const { menu, icon, iconStyle } = filterRequest(request);
    const { coverImg, title } = book;
    const cardInfo = { _id, coverImg, title };

    return (
      <Col
        sm="6"
        md="4"
        lg="3"
        xl="2"
        className={styles.card}
        key={`BookCards:${_id}`}
      >
        <BookCard
          menuItems={menu}
          cardInfo={cardInfo}
          setActive={setActiveCardId}
          isActive={activeCardId === _id}
          icon={icon}
          iconStyle={iconStyle}
        />
      </Col>
    );
  };
  const BookCards = ownedBooks.reduce(
    (obj, book) => {
      const requestEnum = Object.values(requestStatus);
      const checkedIn = requestEnum.slice(1, 3);
      const checkedOut = requestEnum.slice(3, -1);

      if (book.currentRequest) {
        const status = book.currentRequest.status;

        if (checkedIn.includes(status)) {
          return {
            ...obj,
            checkedIn: [...obj.checkedIn, book],
          };
        }
        if (checkedOut.includes(status)) {
          return {
            ...obj,
            checkedOut: [...obj.checkedOut, book],
          };
        }
      }
      return {
        ...obj,
        checkedIn: [...obj.checkedIn, book],
      };
    },

    { checkedIn: [], checkedOut: [] }
  );

  return (
    <>
      <div className="container" ref={containerRef}>
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          style={modalHeight}
          title="Request Status"
        >
          <RequestCard
            userBook={activeBookInfo}
            decline={() => {
              setIsModalOpen(false);
              setActiveCardId("");
            }}
          />
        </Modal>
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
            {BookCards.checkedIn.map((checkedInBook) =>
              mapCheckedInBooks(checkedInBook)
            )}
          </BookContainer>
        </Row>
        <div>
          <h4 className={styles.subtitle}>Checked Out Books</h4>
        </div>
        <Row className={styles.section}>
          <BookContainer>
            {BookCards.checkedOut.map((checkedOutBook) =>
              mapCheckedOutBooks(checkedOutBook)
            )}
          </BookContainer>
        </Row>
      </div>
    </>
  );
};

export default Library;
