import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Button } from "../../../../components";
import { getTimeFromToday } from "../../../../utilities/timeUtil";
import styles from "./NotificationsCard.module.scss";

const NotificationsCard = ({
  _id,
  isRead,
  message,
  clickHandlers,
  user,
  createdAt,
  isActive = false,
}) => {
  const { username, profilePic } = user;
  const timeMsg = getTimeFromToday(createdAt);

  return (
    <div
      className={
        isActive ? `${styles.isActive} ${styles.container}` : styles.container
      }
    >
      <div className={styles.avatar}>
        <Avatar imgSrc={profilePic} username={username} size={"lg"} />
      </div>
      <div>
        <span className={styles.username}>{username}</span>
        <div className={styles.children}>
          <div>
            <div>{message}</div>
            <div>{timeMsg}</div>
            {clickHandlers && !isRead && (
              <div>
                <Button
                  circle
                  icon={faCheck}
                  onClick={() => clickHandlers.accept()}
                />
                <Button
                  circle
                  icon={faX}
                  onClick={() => clickHandlers.decline()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCard;
