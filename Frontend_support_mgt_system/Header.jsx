import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

function Header() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Navbar</Navbar.Brand>

          <Nav className="me-auto">
            <Link className="nav-link" to="/">
              Home
            </Link>

            <Link className="nav-link" to="/login">
              Login
            </Link>

            <Link className="nav-link" to="/register">
              Register
            </Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
