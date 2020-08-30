import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Glyphicon,
  Tooltip,
  OverlayTrigger,
  Table,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

//eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends Component {
  render() {
    const {
      issue,
      closeIssue,
      deleteIssue,
      index,
      location: { search },
    } = this.props;
    const user = this.context;
    const selectedLocation = { pathname: `/issues/${issue.id}`, search };
    const editTooltip = <Tooltip id="edit-tooltip">Edit</Tooltip>;
    const closeTooltip = <Tooltip id="close-tooltip">Close</Tooltip>;
    const removeTooltip = <Tooltip id="remove-tooltip">Remove</Tooltip>;
    const onClose = e => {
      e.preventDefault();
      closeIssue(index);
    };
    const onDelete = e => {
      e.preventDefault();
      deleteIssue(index);
    };
    const tableRow = (
      <tr>
        <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.toDateString()}</td>
        <td>{issue.effort}</td>
        <td>{issue.due ? issue.due.toDateString() : ''}</td>
        <td>{issue.title}</td>
        <td>
          <LinkContainer to={`/edit/${issue.id}`}>
            <OverlayTrigger
              delayShow={1000}
              placement="top"
              overlay={editTooltip}
            >
              <Button bsSize="xsmall" type="button">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          <OverlayTrigger
            delayShow={1000}
            overlay={closeTooltip}
            placement="top"
          >
            <Button
              disabled={!user.signedIn}
              bsSize="xsmall"
              type="button"
              onClick={onClose}
            >
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            delayShow={1000}
            overlay={removeTooltip}
            placement="top"
          >
            <Button
              disabled={!user.signedIn}
              bsSize="xsmall"
              type="button"
              onClick={onDelete}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );
    return <LinkContainer to={selectedLocation}>{tableRow}</LinkContainer>;
  }
}

const IssueRow = withRouter(IssueRowPlain);
IssueRowPlain.contextType = UserContext;

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}
