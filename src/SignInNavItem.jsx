import React, { Fragment, useState, useEffect } from 'react';
import { NavItem, NavDropdown, Modal, Button } from 'react-bootstrap';
import withToast from './Toast.jsx';

function SignInNavItem({ user, onUserChange, showError }) {
  const [showing, setShowing] = useState(false);

  const [ggSignInDisabled, setGgSignInDisabled] = useState(true);
  const [fbSignInDisabled, setFbSignInDisabled] = useState(true);
  const showModal = () => {
    const ggClientId = window.ENV.GOOGLE_CLIENT_ID;
    const fbClientId = window.ENV.FACEBOOK_APP_ID_OAUTH;
    if (!ggClientId && !fbClientId) {
      showError(
        'Missing environment variable GOOGLE_CLIENT_ID and FACEBOOK_APP_ID_OAUTH'
      );
      return;
    }
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };
  const googleSignIn = async () => {
    hideModal();
    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError(
        `Error authenticating with Google: ${
          error.error ? error.error : 'Unknown'
        }`
      );
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken, type: 'gg' }),
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const { signedIn, givenName, picture } = result;
      onUserChange({ signedIn, givenName, picture, type: 'gg' });
    } catch (error) {
      showError(
        `Error authenticating with Google: ${
          error.error ? error.error : 'Unknown'
        }`
      );
    }
  };

  const facebookSignIn = async () => {
    hideModal();

    try {
      FB.login(
        async response => {
          let facebookToken;
          let userID;
          if (response.status == 'connected') {
            facebookToken = response.authResponse.accessToken;
            userID = response.authResponse.userID;
          } else {
            showError(`Authenticate with Facebook failed: ${response.status}`);
            return;
          }
          const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
          const res = await fetch(`${apiEndpoint}/signin`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facebook_token: facebookToken,
              user_id: userID,
              type: 'fb',
            }),
          });
          const body = await res.text();
          console.log(body);
          const result = JSON.parse(body);
          const { signedIn, givenName, picture } = result;
          onUserChange({ signedIn, givenName, picture, type: 'fb' });
        },
        { scope: 'public_profile,email' }
      );
    } catch (error) {
      showError(
        `Error authenticating with Facebook: ${
          error.error ? error.error : 'Unknown'
        }`
      );
    }
  };
  const signOut = async () => {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ type: user.type }),
      });
      switch (user.type) {
        case 'gg':
          const auth2 = window.gapi.auth2.getAuthInstance();
          await auth2.signOut();
        case 'fb':
          FB.logout(function (response) {
            // user is now logged out
            console.log(response);
          });
      }
      onUserChange({ signedIn: false });
    } catch (error) {
      showError(`Singing out failed: ${error}`);
    }
  };

  useEffect(() => {
    (async () => {
      const ggClientId = window.ENV.GOOGLE_CLIENT_ID;
      const fbAppId = window.ENV.FACEBOOK_APP_ID_OAUTH;

      if (ggClientId) {
        window.gapi.load('auth2', () => {
          if (!window.gapi.auth2.getAuthInstance()) {
            window.gapi.auth2.init({ client_id: ggClientId }).then(() => {
              setGgSignInDisabled(false);
            });
          }
        });
      }
      if (fbAppId) {
        setFbSignInDisabled(false);
      }
    })();
  }, []);

  if (user.signedIn) {
    const title = (
      <>
        <img
          src={user.picture}
          style={{
            borderRadius: '50%',
            margin: '0 0.3em 0.2em 0',
            height: '1.2em',
          }}
        />
        {user.givenName}
      </>
    );
    return (
      <NavDropdown title={title} id="user" noCaret>
        <NavItem onClick={signOut}>Sign out</NavItem>
      </NavDropdown>
    );
  }
  return (
    <Fragment>
      <NavItem onClick={showModal}>Sign in</NavItem>
      <Modal keyboard show={showing} onHide={hideModal} bsSize="sm">
        <Modal.Header>Sign In</Modal.Header>
        <Modal.Body>
          <Button
            block
            bsStyle="primary"
            disabled={ggSignInDisabled}
            onClick={googleSignIn}
          >
            Sign In with Google
          </Button>
          <Button
            block
            bsStyle="primary"
            disabled={fbSignInDisabled}
            onClick={facebookSignIn}
          >
            Sign In with Facebook
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={hideModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default withToast(SignInNavItem);
