import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
function Header() {
  return (
    <>
      <Navbar className="bg-teal-400 text-white-50">
        <Container fluid>
          <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/" className="text-black">
                Home
              </Nav.Link>
            </Nav>
            <Nav.Link as={Link} to="/register" className="text-black me-3">
              Register
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="text-black">
              Login
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
