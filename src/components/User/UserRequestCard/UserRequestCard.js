import React from "react";
import styles from "./UserRequestCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../Button";
import {
  faUserPlus,
  faCheckCircle,
  faUser,
  faUserCheck,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequest } from "../../../redux/friends/friendsSlice";

const UserRequestCard = ({ username, profilePic, _id }) => {
  const dispatch = useDispatch();
  const handleAddFriend = () => {
    dispatch(sendFriendRequest({ _id }));
  };

  const { friendsList, friendRequestInbox, friendRequestOutbox } = useSelector(
    (state) => state.friends
  );

  const renderBtn = () => {
    if (friendsList.some((friend) => friend._id === _id))
      return (
        <div className={styles.friendIcon}>
          friends <FontAwesomeIcon icon={faUserGroup} size="sm" />
        </div>
      );

    if (friendRequestInbox.some(({ sender }) => sender._id === _id))
      return (
        <Button varient="accept" icon={faUserCheck}>
          Accept
        </Button>
      );

    if (friendRequestOutbox.some(({ reciever }) => reciever._id === _id))
      return (
        <div className={styles.pendingIcon}>
          <FontAwesomeIcon icon={faCheckCircle} /> Requested
        </div>
      );

    return (
      <Button icon={faUserPlus} onClick={handleAddFriend} varient="add">
        Add
      </Button>
    );
  };

  return (
    <div className={styles.container} key={_id}>
      <div className={styles.avatar}>
        <img src={profilePic} alt="profile" className={styles.img} />
      </div>
      <span className={styles.username}>{username}</span>
      {renderBtn()}
    </div>
  );
};

export default UserRequestCard;
