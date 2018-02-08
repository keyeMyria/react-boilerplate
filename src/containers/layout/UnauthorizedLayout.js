import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthMain, AuthSignup } from '../auth';

class UnauthorizedLayout extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}`} exact component={AuthMain} />
        <Route path={`${match.path}/signup`} exact component={AuthSignup} />
        <Redirect to={`${match.url}`} />
      </Switch>
    );
  }
}

export default connect(
  null,
)(UnauthorizedLayout);
