import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './styles.css';

class Home extends React.Component {
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}

export default withRouter(connect(
  null
)(Home));
