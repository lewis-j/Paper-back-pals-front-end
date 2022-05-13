import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as asyncActions from "./userAsyncActions";
import * as firebase from "../../network/firebase";
import * as status from "../status";

const rejectionReducer = (state, action) => {
  console.log("failed action", action);
  state.status = status.FAILED;
  state.error = action.error.message;
};

const pendingReducer = (state) => {
  state.status = status.LOADING;
  state.error = null;
};

const fulfilledReducer = (state, { payload: { user } }) => {
  console.log("fulffilled user action: ", user);
  state.status = status.SUCCEEDED;
  state.error = null;
  state.currentUser = user;
};

export const fetchUser = createAsyncThunk("user/fetchUser", firebase.fetchUser);

export const registerUser = createAsyncThunk(
  "user/createUser",
  asyncActions.registerUser
);

export const loginGoogle = createAsyncThunk(
  "user/googleLogin",
  asyncActions.loginWithGoogle
);

export const loginWithForm = createAsyncThunk(
  "user/FormLogin",
  asyncActions.loginWithForm
);

export const logout = createAsyncThunk("user/logout", asyncActions.logout);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    status: status.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [registerUser.pending]: pendingReducer,
    [registerUser.rejected]: rejectionReducer,
    [registerUser.fulfilled]: fulfilledReducer,
    [loginGoogle.pending]: pendingReducer,
    [loginGoogle.rejected]: rejectionReducer,
    [loginGoogle.fulfilled]: fulfilledReducer,
    [loginWithForm.pending]: pendingReducer,
    [loginWithForm.rejected]: rejectionReducer,
    [loginWithForm.fulfilled]: fulfilledReducer,
    [fetchUser.pending]: pendingReducer,
    [fetchUser.rejected]: rejectionReducer,
    [fetchUser.fulfilled]: fulfilledReducer,
    [logout.pending]: pendingReducer,
    [logout.fulfilled]: (state) => {
      state.currentUser = null;
      state.status = status.SUCCEEDED;
    },
  },
});

// export const { resetStatus } = userSlice.actions;

export default userSlice.reducer;
