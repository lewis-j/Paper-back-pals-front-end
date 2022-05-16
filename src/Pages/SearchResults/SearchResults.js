import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Spinner } from "reactstrap";
import { SearchCard } from "../../components";
import { processBookResults } from "../../utilities/bookUtilities";
import SearchPagination from "./SearchPagination";
import "./searchResults.scss";
import { addBook } from "../../redux/userBook/userBooksSlice";

const SearchResults = ({ bookResults, isLoading = "false", queryTitle }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const firstIdx = currentPage * 12;
  const lastIdx = firstIdx + 12;
  const pageOfBookResults = bookResults.slice(firstIdx, lastIdx);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const addBookToLibrary = (bookDto) => () => {
    dispatch(addBook({ id: user._id, bookDto }));
  };

  const renderCards = pageOfBookResults.map(({ id, volumeInfo }, i) => {
    const { title, shortTitle, authors, shortAuthor, thumbnail, description } =
      processBookResults(volumeInfo);
    const cardData = { title: shortTitle, author: shortAuthor, thumbnail };
    const bookDto = {
      google_id: id,
      title,
      authors,
      coverImg: thumbnail,
      description,
    };

    if (cardData) {
      return (
        <SearchCard
          key={`${id}-${i}`}
          cardData={cardData}
          addBook={addBookToLibrary(bookDto)}
        />
      );
    }
    return null;
  });

  if (renderCards.length === 0) return null;

  return (
    <Container fluid="md" className="main-container">
      <h3 className="my-3">Results for: {queryTitle}</h3>

      {!isLoading ? (
        <>
          <Row className="row-margin">{renderCards}</Row>
          <Row>
            <SearchPagination
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              queryTitle={queryTitle}
            />
          </Row>
        </>
      ) : (
        <Spinner type="grow" className="search-spinner"></Spinner>
      )}
    </Container>
  );
};

export default SearchResults;
