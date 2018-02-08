import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/authAction';
import './styles.css';

class NavBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeItem: props.pageName,
      user: (typeof props.user !== 'undefined') ? props.user : null
    };
  }

  handleItemClick(e, {name}) {
    this.setState({
      activeItem: name
    });
  }

  render() {
    const { logout } = this.props;
    const { activeItem, user } = this.state;

    return (
      <Menu color='green' fixed='left' stackable={true} inverted vertical>
        <Menu.Item header>
          {user.name}
        </Menu.Item>
        <Menu.Item name='/report' as={Link} to='/' active={activeItem === '/report'} onClick={this.handleItemClick.bind(this)}>
          <Icon name='bar chart' />
          Report
        </Menu.Item>
        { (user.role === 'manager' || user.role === 'admin') &&
        <Menu.Item name='/users' as={Link} to='/users' active={activeItem === '/users'} onClick={this.handleItemClick.bind(this)}>
          <Icon name='users' />
          Users
        </Menu.Item>
        }
        <Menu.Item name='/times' as={Link} to='/times' active={activeItem === '/times'} onClick={this.handleItemClick.bind(this)}>
          <Icon name='table' />
          Times Tracked
        </Menu.Item>
        <Menu.Item name='/logout' onClick={logout}>
          <Icon name='log out' />
          Log Out
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
