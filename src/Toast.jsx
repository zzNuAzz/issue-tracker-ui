import React, { Component } from 'react';
import { Alert, Collapse } from 'react-bootstrap';

class Toast extends Component {
  componentDidUpdate() {
    const { showing, onDismiss } = this.props;
    if (showing) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(onDismiss, 5000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.dismissTimer);
  }

  render() {
    const {
      showing, bsStyle, onDismiss, children,
    } = this.props;
    const style = {
      position: 'fixed',
      bottom: 20,
      left: 20,
      zIndex: 10,
    };
    return (
      <Collapse in={showing}>
        <div style={style}>
          <Alert bsStyle={bsStyle} onDismiss={onDismiss}>
            {children}
          </Alert>
        </div>
      </Collapse>
    );
  }
}

export default function withToast(OriginalComponent) {
  return class componentWithToast extends Component {
    constructor() {
      super();
      this.state = {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success',
      };
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
      this.dismissToast = this.dismissToast.bind(this);
    }

    showSuccess(message) {
      this.setState({
        toastVisible: true,
        toastMessage: message,
        toastType: 'success',
      });
    }

    showError(message) {
      this.setState({
        toastVisible: true,
        toastMessage: message,
        toastType: 'danger',
      });
    }

    dismissToast() {
      this.setState({ toastVisible: false });
    }

    render() {
      const { toastVisible, toastMessage, toastType } = this.state;
      return (
        <React.Fragment>
          <OriginalComponent
            showError={this.showError}
            showSuccess={this.showSuccess}
            dismissToast={this.dismissToast}
            {...this.props}
          />
          <Toast
            showing={toastVisible}
            bsStyle={toastType}
            onDismiss={this.dismissToast}
          >
            {toastMessage}
          </Toast>
        </React.Fragment>
      );
    }
  };
}
