import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Button } from 'react-bootstrap';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueDetail from './IssueDetail.jsx';
import graphQLFetch from './graphQLFetch';
import store from './store.js';
import withToast from './Toast.jsx';
import PaginationBar from './Pagination.jsx';

class IssueList extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query (
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
			$hasSelection:Boolean!
      $selectedId:Int!
      $page: Int
      ) {
    issueList(
     	status: $status
      effortMin: $effortMin
      effortMax: $effortMax
      page: $page
      ) {
        issues {
          id title status owner
          created effort due
        }
        pages
      }
    issue(id: $selectedId) @include (if : $hasSelection){
      id description
    }
  }`;
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    const {
      params: { id },
    } = match;

    let page = parseInt(params.get('page', 10));
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }
    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { issueList: {} };
    const {
      issueList: { issues, pages },
      issue: selectedIssue,
    } = initialData;
    delete store.initialData;
    this.state = {
      issues,
      pages,
      selectedIssue,
    };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.restoreIssue = this.restoreIssue.bind(this);
  }

  componentDidMount() {
    const { issues } = this.state;
    issues || this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      location: { search },
      match: {
        params: { id },
      },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    } else if (prevId != id) {
      this.loadSelectedIssue();
    }
  }

  async loadSelectedIssue() {
    const {
      match: {
        params: { id },
      },
      showError,
    } = this.props;
    const query = `query issue($id : Int!){
      issue(id: $id) {
        id description
      }
    }`;
    if (id == null) {
      this.setState({ selectedIssue: null });
      return;
    }
    const data = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
    if (data) this.setState({ selectedIssue: data.issue });
  }

  async loadData() {
    const {
      location: { search },
      match,
      showError,
    } = this.props;

    const data = await IssueList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        issues: data.issueList.issues,
        pages: data.issueList.pages,
        selectedIssue: data.issue,
      });
    }
  }

  async createIssue(issue) {
    const query = `mutation 
        issueAdd($issue: IssueInputs!) {
          issueAdd(issue: $issue) {
            id
          }
        }`;
    const { showError, showSuccess } = this.props;
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      this.loadData();
      showSuccess('created issue');
    }
  }

  async closeIssue(index) {
    const query = `
      mutation issueClose($id: Int!) {
        issueUpdate(id:$id, changes: {status: Closed}) {
         id title status owner
          effort created due description
        }
      }`;
    const { issues } = this.state;
    const { showError, showSuccess } = this.props;
    const data = await graphQLFetch(query, { id: issues[index].id }, showError);
    if (data) {
      showSuccess('Issue Closed');
      this.setState(prevState => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return { issues: newList };
      });
    } else {
      this.loadData();
    }
  }

  async restoreIssue(id) {
    const query = `
      mutation issueRestore($id: Int!) {
        issueRestore(id: $id)
      }
    `;
    const { showError, showSuccess, dismissToast } = this.props;
    dismissToast();
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.issueRestore) {
      showSuccess(`Restore issue ${id} successfully`);
      this.loadData();
    }
  }

  async deleteIssue(index) {
    const query = `
      mutation issueDelete($id: Int!) {
        issueDelete(id:$id)
      }`;
    const { issues } = this.state;
    const {
      location: { pathname, search },
      history,
      showError,
      showSuccess,
    } = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.issueDelete) {
      const undoMessage = (
        <React.Fragment>
          {`Deleted issue ${id}`}
          <Button bsStyle="link" onClick={() => this.restoreIssue(id)}>
            UNDO
          </Button>
        </React.Fragment>
      );
      showSuccess(undoMessage);
      this.setState(prevState => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: '/issues', search });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
    } else {
      this.loadData();
    }
  }

  render() {
    const { issues } = this.state;
    const { selectedIssue, pages } = this.state;
    if (issues == null) return null;
    const {
      location: { search },
    } = this.props;
    const hasFilter = search.replace(/page=\d*/, '').replace('?', '') !== '';
    const params = new URLSearchParams(search);
    return (
      <React.Fragment>
        <Panel defaultExpanded={hasFilter}>
          <Panel.Heading>
            <Panel.Title className="text-center" toggle>
              Filter
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <IssueFilter urlBase="/issues" />
          </Panel.Body>
        </Panel>
        <hr />
        <IssueTable
          issues={issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
        />
        <PaginationBar params={params} pages={pages} />
        <IssueDetail issue={selectedIssue} />
      </React.Fragment>
    );
  }
}

const IssueListWithToast = withToast(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;
export default IssueListWithToast;
