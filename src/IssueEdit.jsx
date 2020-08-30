import React from 'react';
import {
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  ButtonToolbar,
  Button,
  Col,
  Alert,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import TextInput from './TextInput.jsx';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import store from './store.js';
import withToast from './Toast.jsx';
import UserContext from './UserContext.js';

class IssueEdit extends React.Component {
  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);

    // this.showError = this.showError.bind(this);
    // this.showSuccess = this.showSuccess.bind(this);
    // this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { issue } = this.state;
    if (issue == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(e, naturalValue) {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  onValidityChange(e, valid) {
    const { name } = e.target;
    this.setState(prevState => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) {
      return null;
    }
    const query = `mutation ($id:Int!, $changes:IssueUpdateInput!) {
      issueUpdate(id:$id, changes:$changes) {
        id
      }
    }`;
    const { id, created, ...changes } = issue;
    const { showError, showSuccess } = this.props;
    const res = await graphQLFetch(query, { id, changes }, showError);
    if (res) {
      showSuccess(`Updated Issue ${id}`);
    }
    return null;
  }

  static async fetchData(match, search, showError) {
    const query = `query issue($id: Int!){
      issue(id: $id) {
        id
        title
        status
        owner
        effort
        created
        due
        description
      }
    }`;
    const {
      params: { id },
    } = match;
    const result = await graphQLFetch(
      query,
      { id: parseInt(id, 10) },
      showError
    );
    return result;
  }

  async loadData() {
    const { match, showError } = this.props;

    const data = await IssueEdit.fetchData(match, null, showError);
    if (data) {
      const { issue } = data;
      this.setState({ issue, invalidFields: {} });
    } else {
      this.setState({ issue: {}, invalidFields: {} });
    }
  }

  render() {
    const { issue } = this.state;
    if (issue == null) return null;
    const {
      issue: { id, created, status, owner, effort, due, title, description },
      invalidFields,
      showingValidation,
    } = this.state;
    const {
      match: {
        params: { id: propsId },
      },
    } = this.props;
    let invalidFieldMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      invalidFieldMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid field before submitting.
        </Alert>
      );
    }
    if (id == null) {
      if (propsId) {
        return (
          <Panel>
            <Panel.Heading>
              <Panel.Title>{`Issue with ID ${propsId}`}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div style={{ height: 533 }}>
                <h1 className="text-center">Nothing found</h1>
              </div>
            </Panel.Body>
            <Panel.Footer>
              <LinkContainer to={`/edit/${parseInt(propsId, 10) - 1}`}>
                <Button>Prev</Button>
              </LinkContainer>
              <LinkContainer to={`/edit/${parseInt(propsId, 10) + 1}`}>
                <Button>Next</Button>
              </LinkContainer>
            </Panel.Footer>
          </Panel>
        );
      }
      return <div>null</div>;
    }
    const user = this.context;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Edit for issue ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Created:
              </Col>
              <Col componentClass={FormControl.Static} sm={9}>
                {created.toDateString()}
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Status:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="status"
                  value={status}
                  onChange={this.onChange}
                  key={id}
                >
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Owner
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="owner"
                  value={owner}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Effort:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="effort"
                  value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={invalidFields.due ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>
                Due:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  name="due"
                  value={due}
                  onChange={this.onChange}
                  onValidityChange={this.onValidityChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Title:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="title"
                  value={title}
                  size="50"
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Description:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  name="description"
                  value={description}
                  cols="50"
                  rows="8"
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>
                <ButtonToolbar>
                  <Button
                    disabled={!user.signedIn}
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>
                {invalidFieldMessage}
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <LinkContainer to={`/edit/${id - 1}`}>
            <Button>Prev</Button>
          </LinkContainer>{' '}
          <LinkContainer to={`/edit/${id + 1}`}>
            <Button>Next</Button>
          </LinkContainer>
        </Panel.Footer>
      </Panel>
    );
  }
}

IssueEdit.contextType = UserContext;

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
export default IssueEditWithToast;
