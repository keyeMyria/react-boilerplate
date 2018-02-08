import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore, { history } from './store';
import { PrimaryLayout } from './containers/layout';
import registerServiceWorker from './registerServiceWorker';

import { Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

const store = configureStore();
const root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={PrimaryLayout} />
    </ConnectedRouter>
  </Provider>,
  root
);
registerServiceWorker();
