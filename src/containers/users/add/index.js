import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Modal, Form } from 'semantic-ui-react';
import { find, map, isEmpty } from 'lodash';
import '../styles.css';

class AddUserDialog extends React.Component {

  static propTypes = {
    onAddCancel: PropTypes.func.isRequired,
    onAddSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      role: '',
      password: '',
      errors: [],
      showDialog: true
    };
  }

  validateFields = () => {
    const { name, email, role, password } = this.state;
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
    if (password === '') {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    this.setState({
      errors: errors
    });

    return isEmpty(errors);
  }

  handleChange = (e, { name, value }) => {
    console.log(name, value);
    this.setState({
      [name]: value, errors: [] 
    });
  }

  onAddCancel = () => {
    this.setState({
      showDialog: false
    });
    if (this.props.onAddCancel) {
      this.props.onAddCancel();
    }
  }

  onAddSave = () => {
    if (this.props.onAddSave && this.validateFields()) {
      const user = {
        name: this.state.name,
        email: this.state.email,
        role: this.state.role,
        password: this.state.password
      };
      this.props.onAddSave(user);
    }
  }

  render() {
    const { showDialog, name, email, password, errors } = this.state;

    const roles =  [
      { key: 'admin', value: 'admin', text: 'Admin' },
      { key: 'manager', value: 'manager', text: 'Manager' },
      { key: 'user', value: 'user', text: 'User' },
    ];
    return (
      <Modal
        open={showDialog}
        size='tiny'
        onClose={this.onAddCancel}
        closeOnRootNodeClick={false}
      >
        <Modal.Header>
          Edit User
        </Modal.Header>
        <Modal.Content>
          <Form error={!isEmpty(errors)}>
            <Form.Field>
              <label>Name</label>
              <Form.Input
                placeholder='Name'
                value={name}
                name="name"
                onChange={this.handleChange}
                error={!!find(errors, { field: 'name' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Email:</label>
              <Form.Input
                placeholder='Email'
                value={email}
                name="email"
                type="email"
                onChange={this.handleChange}
                error={!!find(errors, { field: 'email' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Role</label>
              <Form.Select
                name="role"
                options={roles}
                onChange={this.handleChange}
                error={!!find(errors, { field: 'role' })}
              />
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <Form.Input
              placeholder='Password'
              value={password}
              name="password"
              type="password"
              onChange={this.handleChange}
              error={!!find(errors, { field: 'password' })}
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
          <Button negative onClick={this.onAddCancel}>Cancel</Button>
          <Button positive labelPosition='right' icon='checkmark' content='Add' onClick={this.onAddSave} />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddUserDialog;
