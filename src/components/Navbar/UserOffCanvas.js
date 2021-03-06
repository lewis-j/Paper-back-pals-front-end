import React, { useState } from "react";
import {
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const UserOffCanvas = ({ expandSize }) => {
  const [canvasToggle, setCanvasToggle] = useState(false);
  const userName = "Lewis";
  return (
    <div className={`d-none d-${expandSize}-block ms-2`}>
      <Button
        color="light"
        className="text-decoration-none text-reset border-0"
        style={{ backgroundColor: "inherit" }}
        onClick={() => {
          setCanvasToggle(!canvasToggle);
        }}
      >
        <FontAwesomeIcon icon={faCircleUser} size="xl" />
      </Button>
      <Offcanvas
        direction="end"
        isOpen={canvasToggle}
        toggle={() => {
          setCanvasToggle(!canvasToggle);
        }}
      >
        <OffcanvasHeader
          toggle={() => {
            setCanvasToggle(!canvasToggle);
          }}
        >
          {userName}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Nav vertical tabs>
            <NavItem>
              <NavLink href="#">Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Notifications</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Friends</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Messages</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Settings</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Log Out</NavLink>
            </NavItem>
          </Nav>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default UserOffCanvas;
