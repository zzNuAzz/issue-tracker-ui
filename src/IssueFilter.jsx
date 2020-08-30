import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import {
  ButtonToolbar,
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  Row,
  Col,
} from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false,
    };

    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  onChangeEffortMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMin: e.target.value, changed: true });
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMax: e.target.value, changed: true });
    }
  }

  applyFilter() {
    const { status, effortMin, effortMax } = this.state;
    const { history, urlBase } = this.props;

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
    this.setState({ changed: false });
  }

  resetFilter() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const status = params.get('status') || '';
    const effortMin = params.get('effortMin') || '';
    const effortMax = params.get('effortMax') || '';
    this.setState({
      status,
      effortMin,
      effortMax,
      changed: false,
    });
  }

  clearFilter() {
    const { history, baseUrl } = this.props;
    this.setState({
      status: '',
      effortMin: '',
      effortMax: '',
      changed: false,
    });
    history.push({ pathname: baseUrl });
  }

  render() {
    const {
      status, changed, effortMin, effortMax,
    } = this.state;
    return (
      <Row>
        <Col xs={12} sm={4} md={4} lg={4}>
          <FormGroup>
            <ControlLabel>Status:</ControlLabel>
            <FormControl
              componentClass="select"
              value={status}
              onChange={this.onChangeStatus}
            >
              <option value="">All issues</option>
              <option value="New">New issues</option>
              <option value="Assigned">Assigned issues</option>
              <option value="Fixed">Fixed issues</option>
              <option value="Closed">Closed issues</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <FormGroup>
            <ControlLabel>Effort between: </ControlLabel>
            <InputGroup>
              <FormControl
                size={5}
                value={effortMin}
                onChange={this.onChangeEffortMin}
                placeholder="Min value"
              />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl
                size={5}
                value={effortMax}
                onChange={this.onChangeEffortMax}
                placeholder="Max value"
              />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={6} lg={4}>
          <ControlLabel>&nbsp;</ControlLabel>
          <ButtonToolbar>
            <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
              Apply
            </Button>
            <Button
              bsStyle="default"
              type="button"
              disabled={!changed}
              onClick={this.resetFilter}
            >
              Reset
            </Button>
            <Button bsStyle="default" type="button" onClick={this.clearFilter}>
              Clear
            </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    );
  }
}

export default withRouter(IssueFilter);
