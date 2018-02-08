import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Dimmer, Message, Table, Button, Icon, Modal, Header, Segment, Loader } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import {
  fetchUsers,
  addUser,
  updateUser,
  removeUser
} from '../../actions/usersAction';
import EditUserDialog from './edit';
import AddUserDialog from './add';
import { connect } from 'react-redux';
import './styles.css';

class Users extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: (typeof props.users !== 'undefined') ? props.users.results: [],
      isLoading : (typeof props.isLoading !== 'undefined') ? props.isLoading: false,
      error: (typeof props.error !== 'undefined') ? props.error: null,
      selectedUser: null,
      addUser: false,
      removeIndex: -1
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        users: (typeof nextProps.users !== 'undefined') ? nextProps.users.results: [],
        isLoading : (typeof nextProps.isLoading !== 'undefined') ? nextProps.isLoading: false,
        error: (typeof nextProps.error !== 'undefined') ? nextProps.error: null
      })
    }
  }

  onRowEdit = (data) => {
    this.setState({
      selectedUser: data
    });
  }

  onRowRemove = (index) => {
    this.setState({
      removeIndex: index
    });
  }

  onEditSave = (user, index) => {
    this.props.updateUser(user, index);
    this.setState({
      selectedUser: null
    });
  }

  onEditCancel = () =>  {
    this.setState({
      selectedUser: null
    });
  }

  onAddSave = (user) => {
    this.props.addUser(user);
    this.setState({
      addUser: false
    });
  }

  onAddCancel = () =>  {
    this.setState({
      addUser: false
    });
  }

  onRemoveConfirm = () => {
    this.props.removeUser(this.state.removeIndex);
    this.setState({
      removeIndex: -1
    });
  }

  onRemoveClose = () => {
    this.setState({
      removeIndex: -1
    });
  }

  onClickAdd = () => {
    this.setState({
      addUser: true
    });
  }

  renderUsers() {
    const { users } = this.state;
    const { currentUser } = this.props;
    return users.map((row, index) => {
      const visible = row.role !== 'admin' && currentUser._id !== row._id;
      return (
        <Table.Row key={index}>
          <Table.Cell collapsing>{row.name}</Table.Cell>
          <Table.Cell collapsing>{row.email}</Table.Cell>
          <Table.Cell collapsing>{row.role}</Table.Cell>
          <Table.Cell collapsing>
            <Button color='green' icon='edit' size='mini' onClick={this.onRowEdit.bind(this, row)} />
            {visible && <Button color='red' icon='delete' size='mini' onClick={this.onRowRemove.bind(this, row._id)} />}
          </Table.Cell>
        </Table.Row>);
    });
  }

  render() {
    const { isLoading, error, selectedUser, addUser, removeIndex } = this.state;
    return (
      <Grid.Row>
        { isLoading &&
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
        }
        <Header as='h2'>
          <Icon name='user' />
          <Header.Content>
            Users
          </Header.Content>
        </Header>
        <Segment stacked>
          { error && error.message &&
            <Message negative>
              <Message.Header>Sorry ...</Message.Header>
              <p>{error.message}</p>
            </Message>
          }
          <Table compact='very' celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
        
            <Table.Body>
              {this.renderUsers()}
            </Table.Body>
        
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='5'>
                  <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onClickAdd}>
                    <Icon name='user' /> Add User
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Segment>
        {
          addUser &&
          <AddUserDialog
            onAddCancel={this.onAddCancel.bind(this)}
            onAddSave={this.onAddSave.bind(this)}
          />
        }
        {
          selectedUser !== null &&
          <EditUserDialog
            user = {selectedUser}
            onEditCancel={this.onEditCancel.bind(this)}
            onEditSave={this.onEditSave.bind(this)}
          />
        }
        <Modal
          open={removeIndex !== -1}
          size='mini'
          onClose={this.onRemoveClose.bind(this)}
        >
          <Modal.Header>
            Remove tracked user?
          </Modal.Header>
          <Modal.Content>
            <p>Do you really want to delete your user?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.onRemoveClose.bind(this)}>No</Button>
            <Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={this.onRemoveConfirm.bind(this)} />
          </Modal.Actions>
        </Modal>
      </Grid.Row>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.users,
  currentUser: state.auth.user,
  isLoading: state.users.isLoading,
  error: state.users.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers,
  addUser,
  updateUser,
  removeUser
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Users));
