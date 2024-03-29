import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { UserRequestCard, SearchCard } from "../../../features/search";
import { processBookResults } from "../../../utilities/bookUtilities";
import { addBook } from "../../../features/library";
import { StatusHandler } from "../StatusHandler";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./AllResults.module.scss";
import * as asyncStatus from "../../../data/asyncStatus";

const AllResults = () => {
  const {
    userResults,
    bookResults,
    query: queryTitle,
  } = useSelector((state) => state.searchResults);
  const { currentUser: user } = useSelector((state) => state.authUser);
  const {
    status: addBookStatus,
    books: { owned },
  } = useSelector((state) => state.userBooks);
  const userBookGoogle_ids = owned.map(({ book: { google_id } }) => google_id);
  const checkIsOwned = (google_id) => {
    return userBookGoogle_ids.includes(google_id);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = addBookStatus === asyncStatus.LOADING;

  const addBookToLibrary = (bookDto) => () => {
    dispatch(addBook({ id: user._id, bookDto }));
  };

  const seeMorebooks = () => {
    navigate("../book-results");
  };

  const seeMoreUsers = () => {
    navigate("../user-results");
  };

  const renderUserCards = () =>
    userResults.length
      ? userResults[0].map((user, i) => {
          const { _id, username, profilePic } = user;
          return (
            <Col xs="12" sm="6" md="4" xl="3" key={`${_id}-${i}`}>
              <UserRequestCard
                _id={_id}
                username={username}
                profilePic={profilePic}
              />
            </Col>
          );
        })
      : [];

  const renderBookCards = () =>
    bookResults.length
      ? bookResults[0].map(({ id, volumeInfo }, i) => {
          const {
            title,
            shortTitle,
            authors,
            shortAuthor,
            thumbnail,
            description,
          } = processBookResults(volumeInfo);
          const cardData = {
            title: shortTitle,
            author: shortAuthor,
            thumbnail,
          };
          const bookDto = {
            google_id: id,
            title,
            authors,
            coverImg: thumbnail,
            description,
          };

          const inLibrary = checkIsOwned(id);

          if (cardData) {
            return (
              <Col xs="12" sm="6" md="4" xl="3" key={`${id}-${i}`}>
                <SearchCard
                  isLoading={isLoading}
                  inLibrary={inLibrary}
                  cardData={cardData}
                  addBook={addBookToLibrary(bookDto)}
                />
              </Col>
            );
          }
          return null;
        })
      : [];

  return (
    <StatusHandler results={[...bookResults, ...userResults]}>
      <Container fluid="md" className="main-container">
        {userResults.length > 0 && (
          <>
            <h3 className="my-3">Results in Users for: {queryTitle}</h3>
            <Row className="row-margin">{renderUserCards()}</Row>
            <div className={styles.nav_btn_wrapper}>
              <button className={styles.nav_btn} onClick={seeMoreUsers}>
                See more user results for {queryTitle}{" "}
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </button>
            </div>
          </>
        )}
        {bookResults.length > 0 && (
          <>
            <h3 className="my-3">Results in Books for: {queryTitle}</h3>
            <Row className="row-margin">{renderBookCards()}</Row>
            <div className={styles.nav_btn_wrapper}>
              <button className={styles.nav_btn} onClick={seeMorebooks}>
                See more books results for {queryTitle}{" "}
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </button>
            </div>
          </>
        )}
      </Container>
    </StatusHandler>
  );
};

export default AllResults;
