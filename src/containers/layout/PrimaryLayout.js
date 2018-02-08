import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { AuthorizedLayout, UnauthorizedLayout } from './';
import { AuthorizedRoute } from '../../components/route';

class PrimaryLayout extends React.Component {
  render() {
    return (
      <Container fluid>
        <Switch>
          <Route path="/auth" component={UnauthorizedLayout} />
          <AuthorizedRoute path="/" component={AuthorizedLayout} />
          <Redirect to="/auth" />
        </Switch>
      </Container>
    );
  }
}

export default PrimaryLayout;
