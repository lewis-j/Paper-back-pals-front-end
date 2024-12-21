import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Nav,
  NavItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUsers,
  faBell,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import * as NavLinks from "../NavLinks";
import styles from "./OffCanvasMenu.module.scss";
import { useSelector } from "react-redux";
import { Avatar } from "../../../components";
import { useDispatch } from "react-redux";
import { setNotificationsIsOpen } from "../../../features/Notifications/notificationsSlice";
import { setChatOpen } from "../../../features/Chat/chatSlice";

const OffCanvasMenu = ({ expandSize }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { username, profilePic } = useSelector(
    (state) => state.authUser.currentUser
  );

  const { isChatOpen } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setIsNotifOpen = (isOpen) => {
    dispatch(setNotificationsIsOpen(isOpen));
  };

  const toggleChat = () => {
    dispatch(setChatOpen(!isChatOpen));
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  };

  const clickedLink = () => {
    setIsNavOpen(false);
    setIsNotifOpen(false);
  };
  return (
    <div className={`d-none d-${expandSize}-flex ms-2`}>
      <button
        color="light"
        className={styles.btn}
        onClick={() => {
          setIsNotifOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faBell}
          size="xl"
          style={{ boxSizing: "border-box" }}
          className={styles.friendsIcon}
        />
      </button>
      <button color="light" className={styles.btn} onClick={toggleChat}>
        <FontAwesomeIcon
          icon={faMessage}
          size="xl"
          style={{ boxSizing: "border-box" }}
          className={styles.friendsIcon}
        />
      </button>
      <button
        color="light"
        className={styles.btn}
        onClick={() => {
          navigate("friends");
        }}
      >
        <FontAwesomeIcon
          icon={faUsers}
          size="xl"
          style={{ boxSizing: "border-box" }}
          className={styles.friendsIcon}
        />
      </button>
      <button
        color="light"
        className={styles.btn}
        onClick={() => {
          setIsNavOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faCircleUser} color="white" size="xl" />
      </button>

      <Offcanvas
        direction="end"
        isOpen={isNavOpen}
        className={styles.offCanvas}
        toggle={() => {
          setIsNavOpen(!isNavOpen);
        }}
      >
        <OffcanvasHeader
          className={styles.header}
          toggle={() => {
            setIsNavOpen(!isNavOpen);
          }}
        >
          <Avatar imgSrc={profilePic} username={username} /> {username}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Nav vertical tabs>
            <NavItem>
              <NavLinks.Profile closeOnClick={clickedLink} />
            </NavItem>
            <NavItem>
              <NavLinks.Notifications
                onClick={() => {
                  if (isNavOpen) {
                    setIsNavOpen(false);
                    setTimeout(() => setIsNotifOpen(true), 300); // Delay to allow Offcanvas to close
                  } else {
                    setIsNotifOpen(true);
                  }
                }}
              />
            </NavItem>
            <NavItem>
              <NavLinks.Friends closeOnClick={clickedLink} />
            </NavItem>
            <NavItem>
              <NavLinks.Messages
                className={styles.messages}
                onClick={() => {
                  toggleChat();
                  clickedLink();
                }}
              />
            </NavItem>
            <NavItem>
              <NavLinks.Settings closeOnClick={clickedLink} />
            </NavItem>
            <NavItem>
              <NavLinks.Logout closeOnClick={clickedLink} />
            </NavItem>
          </Nav>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default OffCanvasMenu;