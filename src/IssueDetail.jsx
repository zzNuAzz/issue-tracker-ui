import React from 'react';

export default function IssueDetail({ issue }) {
  if (issue) {
    if (issue.description) {
      return (
        <div>
          <h3>Description</h3>
          <pre>{issue.description}</pre>
        </div>
      );
    }
    return <h3>No description</h3>;
  }
  return null;
}
