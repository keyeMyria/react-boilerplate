import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Modal, Form } from 'semantic-ui-react';
import { find, map, isEmpty } from 'lodash';
import '../styles.css';

class EditUserDialog extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      _id: props.user._id,
      name: props.user.name,
      email: props.user.email,
      role: props.user.role,
      errors: [],
      showDialog: true
    };
  }

  validateFields() {
    const { name, email, role } = this.state;
    const errors = [];
    const regex = new RegExp("^([a-z0-9]{5,})$");
    if (isEmpty(name)) {
      errors.push({ field: 'name', message: 'Username is required' });
    }
    else if (!regex.test(name)) {
      errors.push({field: 'name', message: 'Username is invalid. '})
    }
    if (email === '') {
      errors.push({ field: 'email', message: 'Email is required' });
    }
    if (role === '') {
      errors.push({ field: 'role', message: 'Role is required' });
    }
    this.setState({
      errors: errors
    });

    return isEmpty(errors);
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value, errors: [] 
    });
  }

  onEditCancel = () => {
    this.setState({
      showDialog: false
    });
    if (this.props.onEditCancel) {
      this.props.onEditCancel();
    }
  }

  onEditSave = () => {
    if (this.props.onEditSave && this.validateFields()) {
      const user = {
        name: this.state.name,
        email: this.state.email,
        role: this.state.role
      };
      this.props.onEditSave(user, this.state._id);
    }
  }

  render() {
    const { showDialog, name, email, role, errors } = this.state;
    const roles =  [
      { key: 'admin', value: 'admin', text: 'Admin' },
      { key: 'manager', value: 'manager', text: 'Manager' },
      { key: 'user', value: 'user', text: 'User' },
    ];
    const isAdmin = role === 'admin' ? true : false;
    return (
      <Modal
        open={showDialog}
        size='tiny'
        onClose={this.onEditCancel.bind(this)}
        closeOnRootNodeClick={false}
      >
        <Modal.Header>
          Edit User
        </Modal.Header>
        <Modal.Content>
          <Form error={!isEmpty(errors)}>
            <Form.Field>
              <label>Name:</label>
              <Form.Input
                placeholder='name'
                value={name}
                name="name"
                onChange={this.handleChange}
                disabled={isAdmin}
                error={!!find(errors, { field: 'name' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Email:</label>
              <Form.Input
                placeholder='email'
                value={email}
                name="email"
                type="email"
                disabled={isAdmin}
                onChange={this.handleChange}
                error={!!find(errors, { field: 'email' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Role:</label>
              <Form.Select
                name="role"
                value={role}
                options={roles}
                disabled={isAdmin}
                onChange={this.handleChange}
                error={!!find(errors, { field: 'role' })}
              />
            </Form.Field>
            <Message error color="red">
              {map(errors, err =>
                <Message.Item key={err.message}>{err.message}</Message.Item>
              )}
            </Message>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.onEditCancel}>Cancel</Button>
          {!isAdmin && <Button positive labelPosition='right' icon='checkmark' content='Save' onClick={this.onEditSave} />}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default EditUserDialog;
