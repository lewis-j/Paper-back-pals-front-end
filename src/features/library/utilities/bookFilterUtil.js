import requestStatus from "../../../data/requestStatus";

export const categorizeOwnedBooksByStatus = (ownedBooks) => {
  console.log("ownedBooks in categorizeOwnedBooksByStatus", ownedBooks);
  let categorizedBooks = {};
  console.log("request slice", Object.keys(requestStatus).slice(1));
  ownedBooks.forEach((userBook) => {
    // Find the first active request (if any)
    const activeRequest = userBook.requests.find((request) =>
      Object.keys(requestStatus).slice(1).includes(request.status)
    );

    if (activeRequest) {
      const status = activeRequest.status;
      const singleRequestBook = {
        ...userBook,
        dueDate: activeRequest.dueDate,
        currentPage: activeRequest.currentPage,
        sender: activeRequest.sender,
        requests: userBook.requests,
        request: {
          status: activeRequest.status,
          id: activeRequest._id,
        },
      };

      categorizedBooks[status] = categorizedBooks[status]
        ? [...categorizedBooks[status], singleRequestBook]
        : [singleRequestBook];
    } else {
      // If no active request, book is checked in
      categorizedBooks[requestStatus.CHECKED_IN] = categorizedBooks[
        requestStatus.CHECKED_IN
      ]
        ? [
            ...categorizedBooks[requestStatus.CHECKED_IN],
            { ...userBook, request: { status: requestStatus.CHECKED_IN } },
          ]
        : [{ ...userBook, request: { status: requestStatus.CHECKED_IN } }];
    }
  });

  return categorizedBooks;
};

export const categorizeBorrowedBooksByStatus = (borrowedBooks) => {
  const categorizedBooks = {};
  borrowedBooks.forEach((userBook) => {
    const status = userBook.request.status;
    categorizedBooks[status] = categorizedBooks[status]
      ? [...categorizedBooks[status], userBook]
      : [userBook];
  });

  return categorizedBooks;
};
