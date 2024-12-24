import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as status from "../../data/asyncStatus";
import { setExtraReducer } from "../../utilities/reduxUtil";
import * as notificationsApi from "./notificationsApi";
import { FRIEND_REQUEST_STATUS } from "../../data/friendRequestStatus";

const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  notificationsApi.fetchNotifications
);

const fetchNotificationsSuccess = (state, action) => {
  state.list = action.payload.notifications;
};

const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  notificationsApi.markAsRead
);

const markAsReadSuccess = (state, action) => {
  const { notification } = action.payload;

  const notificationList = state.list;
  const idx = notificationList.findIndex(
    (_notification) => _notification._id === notification._id
  );

  state.list[idx] = notification;
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    status: status.IDLE,
    isOpen: false,
    error: null,
  },
  reducers: {
    setNotificationsIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setNotifications: (state, action) => {
      state.list = action.payload.notifications;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload.notification);
    },
    markAllAsRead: (state) => {
      state.list = state.list.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
  },
  extraReducers: {
    ...setExtraReducer(fetchNotifications, fetchNotificationsSuccess),
    ...setExtraReducer(markAsRead, markAsReadSuccess),
  },
});

export { fetchNotifications, markAsRead };

export const {
  setNotifications,
  addNotification,
  setNotificationsIsOpen,
  markAllAsRead,
} = notificationsSlice.actions;

export const selectNotificationByRequestRefIdCreator =
  (state) => (requestRefId) => {
    const notification = state.notifications.list.find(
      (notification) => notification.requestRef === requestRefId
    );
    if (!notification?.id) {
      console.warn(`No notification found for requestRefId: ${requestRefId}`);
      return null;
    }
    return notification.id;
  };

export const findPendingFriendRequestNotificationCreator =
  (state) => (requestRefId) => {
    const notifications = state.notifications.list.filter(
      (notification) => notification.requestRef === requestRefId
    );

    if (notifications.length === 0) {
      console.warn(`No notifications found for requestRefId: ${requestRefId}`);
      return null;
    }
    const pendingNotification = notifications.find(
      (notification) =>
        notification.requestRef.status === FRIEND_REQUEST_STATUS.PENDING
    );
    return pendingNotification.id;
  };
export default notificationsSlice.reducer;
