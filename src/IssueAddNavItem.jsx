import React, { Component } from 'react';
import {
  NavItem,
  OverlayTrigger,
  Glyphicon,
  Tooltip,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ButtonToolbar,
  ButtonGroup,
  InputGroup,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import withToast from './Toast.jsx';

class IssueAddNavItem extends Component {
  constructor() {
    super();
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAddModalForm;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const query = `mutation 
    issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;
    const { showError, showSuccess } = this.props;
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
      showSuccess('Issue created !!!');
    }
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    const { showing } = this.state;
    const {
      user: { signedIn },
    } = this.props;
    return (
      <>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-issue"> Create Issue </Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>IssueAdd</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAddModalForm" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Owner</ControlLabel>
                <FormControl name="owner" component="input" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" component="input" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button bsStyle="default" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button
                className="pull-right"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withRouter(withToast(IssueAddNavItem));
