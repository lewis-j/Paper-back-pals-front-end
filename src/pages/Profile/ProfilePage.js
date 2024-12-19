import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBook,
  faStar,
  faUsers,
  faClockRotateLeft,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProfilePage.module.scss";
import { Avatar, Button } from "../../components";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.authUser);
  const { username, profilePic } = currentUser;
  return (
    <div className={styles.container}>
      {/* User Header Section */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <Avatar imgSrc={profilePic} username={username} size="xl" />
          <h1>{username}</h1>
          <p className={styles.bio}>User bio goes here...</p>
        </div>
        <Button variant="secondary" to="/settings">
          Edit Profile
        </Button>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
          <h3>Books Read</h3>
          <span>42</span>
        </div>
        <div className={styles.stat}>
          <FontAwesomeIcon icon={faStar} className={styles.statIcon} />
          <h3>Reviews</h3>
          <span>15</span>
        </div>
        <div className={styles.stat}>
          <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
          <h3>Following</h3>
          <span>120</span>
        </div>
      </div>

      {/* Bookshelves Section */}
      <section className={styles.bookshelves}>
        <h2>
          <FontAwesomeIcon icon={faBookOpen} className={styles.sectionIcon} />
          My Bookshelves
        </h2>
        {/* BookshelfGrid component */}
      </section>

      {/* Recent Activity */}
      <section className={styles.activity}>
        <h2>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className={styles.sectionIcon}
          />
          Recent Activity
        </h2>
        {/* ActivityFeed component */}
      </section>

      {/* Reviews Section */}
      <section className={styles.reviews}>
        <h2>
          <FontAwesomeIcon icon={faStar} className={styles.sectionIcon} />
          Recent Reviews
        </h2>
        {/* ReviewsList component */}
      </section>
    </div>
  );
};
export default ProfilePage;
