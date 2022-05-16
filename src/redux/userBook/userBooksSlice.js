import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userBookService from "../../network/userBooks/userBookCalls";
import * as status from "../status";

export const fetchBooks = createAsyncThunk(
  "userBooks/fetchBooks",
  userBookService.fetchBooks
);

export const addBook = createAsyncThunk(
  "userBooks/addBooks",
  userBookService.addBook
);
export const userBooksSlice = createSlice({
  name: "userBooks",
  initialState: {
    books: {
      borrowed: [],
      owned: [],
    },
    status: status.IDLE,
    error: null,
  },
  reducers: {
    setBook: (state, {payload})=> {
      console.log("payload", payload, "state", state);
      state.books.owned.push(payload); 
    }
  },
  extraReducers: {
    [fetchBooks.pending]: (state) => {
      state.status = status.LOADING;
    },
    [fetchBooks.fulfilled]: (state, { payload }) => {
      console.log("action ", payload);
      state.status = status.SUCCEEDED;
      state.books = payload;
    },
    [fetchBooks.rejected]: (state, action) => {
      state.status = status.FAILED;
      state.error = action.error.message;
      console.error(action.error.message);
    },
    [addBook.pending]: (state) => {
      state.status = status.LOADING;
    },
    [addBook.fulfilled]: (state, action) => {
      console.log("action ", action);
      state.status = status.SUCCEEDED;
    },
    [addBook.rejected]: (state, action) => {
      state.status = status.FAILED;
      state.error = action.error.message;
      console.error(action.error.message);
    },
  },
});

export const { setBook } = userBooksSlice.actions; 

export default userBooksSlice.reducer;
