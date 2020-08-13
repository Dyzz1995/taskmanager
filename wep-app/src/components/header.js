import PropTypes from "prop-types"
import React from "react"
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Header = ({ siteTitle, user }) => (
  <Navbar collapseOnSelect expand="lg" bg="blue" variant="blue">
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
        </Nav>
        <Nav>
          {user &&
            <NavDropdown title={user} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/">Logout</NavDropdown.Item>
            </NavDropdown>
          }
        </Nav>
      </Navbar.Collapse>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
