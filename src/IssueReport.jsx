import React from 'react';
import { Panel, Table } from 'react-bootstrap';
import URLSearchParams from 'url-search-params';
import IssueFilter from './IssueFilter.jsx';
import withToast from './Toast.jsx';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];
class IssueReport extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
    ) {
      issueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ) {
        owner New Assigned Fixed Closed
      }
    }`;

    const params = new URLSearchParams(search);
    const vars = {};
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
    const stats = store.initialData ? store.initialData.issueCounts : null;
    delete store.initialData;
    this.state = { stats };
  }

  componentDidMount() {
    const { stats } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: { search },
      match,
      showError,
    } = this.props;
    const data = await IssueReport.fetchData(match, search, showError);
    if (data) {
      this.setState({ stats: data.issueCounts });
    }
  }

  render() {
    const { stats } = this.state;
    if (!stats) return null;
    const {
      location: { search },
    } = this.props;
    const hasFilter = search !== '';
    const headerColumns = statuses.map(status => (
      <th key={status}>{status}</th>
    ));
    const statRows = stats.map(counts => (
      <tr key={counts.owner}>
        <td>{counts.owner}</td>
        {statuses.map(status => (
          <td key={status}>{counts[status] ? counts[status] : '-'}</td>
        ))}
        <td>
          <b>{statuses.reduce((total, status) => total + counts[status], 0)}</b>
        </td>
      </tr>
    ));
    return (
      <div>
        <Panel defaultExpanded={hasFilter}>
          <Panel.Heading>
            <Panel.Title className="text-center" toggle>
              Filter
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <IssueFilter urlBase="/report" />
          </Panel.Body>
        </Panel>
        <Table bordered condensed hover responsive>
          <thead>
            <tr>
              <th />
              {headerColumns}
              <td>
                <b>Total</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {statRows}
            <tr key="total">
              <td>
                <b>Total</b>
              </td>
              {statuses.map(status => (
                <td key={status}>
                  <b>
                    {stats.reduce((total, count) => total + count[status], 0)
                      || '-'}
                  </b>
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.fetchData = IssueReport.fetchData;
export default IssueReportWithToast;
