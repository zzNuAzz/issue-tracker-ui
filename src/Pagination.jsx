import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Pagination } from 'react-bootstrap';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

export default class PaginationBar extends Component {
  constructor() {
    super();
  }

  render() {
    const { params, pages } = this.props;
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push(
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>,
      );
    }
    return (
      <Pagination>
        <PageLink params={params} page={prevSection}>
          <Pagination.Item>{'<'}</Pagination.Item>
        </PageLink>
        {items}
        <PageLink params={params} page={nextSection}>
          <Pagination.Item>{'>'}</Pagination.Item>
        </PageLink>
      </Pagination>
    );
  }
}
