import React, { useState, useEffect } from 'react';
import {
  Grid,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Glyphicon,
  Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Contents from './Contents.jsx';
import graphQLFetch from './graphQLFetch.js';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import SearchBar from './SearchBar.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

function NavBar({ user, onUserChange }) {
  return (
    <Navbar fixedTop>
      <Navbar.Header>
        <LinkContainer to="/" style={{ cursor: 'pointer' }}>
          <Navbar.Brand>Issue Tracker</Navbar.Brand>
        </LinkContainer>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/home">
          <NavItem> Home </NavItem>
        </LinkContainer>
        <LinkContainer to="/issues">
          <NavItem> IssueList </NavItem>
        </LinkContainer>
        <LinkContainer to="/report">
          <NavItem> Report </NavItem>
        </LinkContainer>
        {/* <LinkContainer to="/about">
          <NavItem> About </NavItem>
        </LinkContainer> */}
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <SearchBar />
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <IssueAddNavItem user={user} />
        <SignInNavItem user={user} onUserChange={onUserChange} />
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="menu-hamburger" />}
          noCaret
        >
          <LinkContainer isActive={() => false} to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

function Footer() {
  const style = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
  };
  return (
    <small style={style}>
      <hr />
      <div className="text-center">
        Contact me at{' '}
        <a href="https://facebook.com/SoNguyenTo216"> Facebook Profile </a>
      </div>
    </small>
  );
}

export default function Page(props) {
  const initUser = store.userData ? store.userData.user : null;
  delete store.userData;
  const [user, setUser] = useState(initUser);

  const onUserChange = user => {
    setUser(user);
  };

  useEffect(() => {
    (async () => {
      if (user == null) {
        const data = await Page.fetchData();
        if (data) {
          const { user } = data;
          setUser(user ? user : { signedIn: false });
        }
      }
    })();
  }, []);
  if (user == null) return null;
  return (
    <div>
      <NavBar user={user} onUserChange={onUserChange} />
      <Grid>
        <UserContext.Provider value={user}>
          <Contents />
        </UserContext.Provider>
      </Grid>
      <Footer />
    </div>
  );
}

Page.fetchData = async cookie => {
  const query = `query {user {
    signedIn givenName picture
  }}`;
  const data = await graphQLFetch(query, null, null, cookie);
  return data;
};
