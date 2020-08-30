import React from 'react';
import AsyncSelect from 'react-select/async';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch';
import withToast from './Toast.jsx';

function SearchBar(props) {
  const loadOptions = async (term) => {
    if (term.length < 3) return [];
    const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id title}
      }
    }`;
    const { showError } = props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`,
      value: issue.id,
    }));
  };

  const onChangeSelection = ({ value }) => {
    const { history } = props;
    history.push(`/edit/${value}`);
  };

  return (
    <AsyncSelect
      instanceId="search-select"
      value=""
      loadOptions={loadOptions}
      filterOption={() => true}
      onChange={onChangeSelection}
      components={{ DropdownIndicator: null }}
      noOptionsMessage={() => 'No matching records found'}
    />
  );
}
export default withRouter(withToast(SearchBar));
