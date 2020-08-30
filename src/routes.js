import Home from './Home.jsx';
import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import About from './About.jsx';
import IssueEdit from './IssueEdit.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/home', component: Home },
  { path: '/issues/:id?', component: IssueList },
  { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '/edit/:id', component: IssueEdit },
  { path: '*', component: NotFound },
];
export default routes;
