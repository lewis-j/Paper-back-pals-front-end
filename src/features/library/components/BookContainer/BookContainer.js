import styles from "./BookContainer.module.scss";
import { IconBookOff } from "@tabler/icons";
import { faArrowDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { NoContent, Placeholder, Button, FadeIn } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";
import { useState } from "react";

const BookContainer = ({ children: cards, noContent = null }) => {
  const [renderBookCount, setRenderBookCount] = useState(12);
  const [loadingSection, setLoadingSection] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setLoadingSection(true);
    setTimeout(() => {
      setLoadingSection(false);
      setRenderBookCount((previousState) => previousState + 12);
    }, 300);
  };

  if (cards.length === 0) {
    if (noContent) return noContent();
    return (
      <NoContent text="No Books Yet!" icon={IconBookOff}>
        <div>Check Notifications for Book request</div>
        <Button
          varient="add"
          icon={faBell}
          onClick={() => navigate("/notifications")}
        >
          Notifications
        </Button>
      </NoContent>
    );
  }
  const renderBooks = cards.slice(0, renderBookCount);
  const loadingCount = cards.slice(
    renderBookCount,
    renderBookCount + 12
  ).length;

  return (
    <>
      <FadeIn delay={100}>{renderBooks}</FadeIn>
      {loadingSection &&
        [...Array(loadingCount).keys()].map((i) => (
          <Col sm="4" md="3" xl="2" key={i} className={styles.cardWrapper}>
            <Placeholder />
          </Col>
        ))}
      {cards.length > renderBookCount && (
        <Button icon={faArrowDown} varient="accept" onClick={handleClick}>
          Show more
        </Button>
      )}
    </>
  );
};

export default BookContainer;
