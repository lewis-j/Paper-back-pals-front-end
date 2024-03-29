import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import "./SearchPagination..scss";
import { useBSSizeFromWidth } from "../../../utilities/getBSSizeFromWidth";
import { useDispatch, useSelector } from "react-redux";
import { getMoreBooks } from "../../../features/search";

const SearchPagination = ({ setCurrentPage, currentPage, scroll }) => {
  const reactstrapBreakPointSize = useBSSizeFromWidth();

  const { bookResults } = useSelector((state) => state.searchResults);
  const dispatch = useDispatch();

  const renderNewPage = async (item) => {
    if (bookResults.length - 1 < item) {
      const dif = item - (bookResults.length - 1);
      const calls = Math.ceil(dif / 3);
      console.log("dif", Math.ceil(dif / 3));
      [...Array(calls).keys()].forEach(async (i) => {
        const _startIndex = bookResults.length * 12 * (i + 1);
        console.log("starting index", _startIndex);
        await dispatch(getMoreBooks({ startIndex: _startIndex })).unwrap();
      });
    }
    setCurrentPage(item);
  };

  const nextPage = async () => {
    if (bookResults.length - 1 === currentPage) {
      await dispatch(getMoreBooks({ startIndex: currentPage * 12 })).unwrap();
    }

    setCurrentPage((currentPage) => {
      return currentPage === renderedPaginationItems.length - 1
        ? currentPage
        : currentPage + 1;
    });
    scroll();
  };

  const renderedPaginationItems = [...Array(10).keys()].map((item) => (
    <PaginationItem key={item} active={currentPage === item}>
      <PaginationLink tag="div" onClick={() => renderNewPage(item)}>
        {item + 1}
      </PaginationLink>
    </PaginationItem>
  ));

  return (
    <div>
      <Pagination
        aria-label="Page navigation for Search"
        size={reactstrapBreakPointSize}
      >
        <PaginationItem>
          <PaginationLink
            tag="div"
            onClick={() => {
              setCurrentPage((currentPage) =>
                currentPage === 0 ? currentPage : currentPage - 1
              );
              scroll();
            }}
            previous
          />
        </PaginationItem>
        {renderedPaginationItems}
        <PaginationItem>
          <PaginationLink tag="div" onClick={nextPage} next />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default SearchPagination;
