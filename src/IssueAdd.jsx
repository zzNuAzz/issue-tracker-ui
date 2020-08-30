import React from 'react';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Button,
} from 'react-bootstrap';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      status: form.status.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const { createIssue } = this.props;
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return (
      <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Status: </ControlLabel>
          <FormControl componentClass="select" defaultValue="New" name="status">
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Owner:</ControlLabel>
          <FormControl type="text" name="owner" placeholder="Owner" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Title:</ControlLabel>
          <FormControl type="text" name="title" placeholder="Title" />
        </FormGroup>
        <Button bsStyle="primary" type="submit">
          Add
        </Button>
      </Form>
    );
  }
}
