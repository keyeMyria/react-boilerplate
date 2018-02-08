import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Message, Dimmer, Loader, Image, Divider, Button, Form, Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmail } from 'validator';
import { find, map, isEmpty } from 'lodash';
import { signup } from '../../../actions/authAction';
import logo from '../../../logo.svg';

class AuthSignup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      repassword: '',
      errors: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { loginError } = this.props;
    const newError = nextProps.loginError;

    if (newError !== loginError) {
      const errors = [];
      if (newError && newError.message) {
        errors.push({ message: newError.message });
      }
      this.setState({ errors });
    }

    if (nextProps.signedUp === true) {
      this.props.history.push('/auth');
    }
  }

  validateFields = () => {
    const { name, email, password, repassword } = this.state;
    const errors = [];
    if (isEmpty(name)) {
      errors.push({ field: 'name', message: 'Name is required' })
    }
    if (isEmpty(email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter valid email'});
    }
    if (isEmpty(password)) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    if (password !== repassword) {
      errors.push({ field: 'repassword', message: 'Password does not match' });
    }

    this.setState({ errors });
    return isEmpty(errors);
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value, errors: [] })

  handleSubmit = () => {
    if (this.validateFields()) {
      const { name, email, password } = this.state;
      this.props.signup({name, email, password});
    }
  }

  render() {
    const { name, email, password, repassword, errors } = this.state;
    const { isLoading } = this.props;

    return (
      <div className="page f-align-center m-t-4 m-b-4">
        <Grid centered>
          {
            isLoading &&
            <Dimmer active inverted>
              <Loader size='medium' />
            </Dimmer>
          }
          <Grid.Column
            widescreen={6}
            largeScreen={6}
            computer={6}
            tablet={10}
            mobile={16}
          >
            <Segment padded="very">
              <Grid.Row>
                <Image className="m-t-1 m-b-4" src={logo} size="small" centered />
              </Grid.Row>
              <Grid.Row>
                <Form
                  onSubmit={this.handleSubmit}
                  error={!isEmpty(errors)}
                  noValidate
                >
                  <Form.Field>
                    <label>Your Name:</label>
                    <Form.Input
                      placeholder='Your Name'
                      type="text"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      error={!!find(errors, { field: 'name' })}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Your Email:</label>
                    <Form.Input
                      placeholder='Your Email'
                      type="email"
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                      error={!!find(errors, { field: 'email' })}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Password:</label>
                    <Form.Input
                      placeholder='Your Password'
                      type="password"
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                      error={!!find(errors, { field: 'password' })}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>RePassword:</label>
                    <Form.Input
                      placeholder='Your Password'
                      type="password"
                      name="repassword"
                      value={repassword}
                      onChange={this.handleChange}
                      error={!!find(errors, { field: 'preassword' })}
                    />
                  </Form.Field>
                  <Message error color="red">
                    {map(errors, err =>
                      <Message.Item key={err.message}>{err.message}</Message.Item>
                    )}
                  </Message>
                  <Form.Button
                    color="green"
                    content="SignUp"
                    fluid
                  />
                </Form>
                <Divider horizontal section>or</Divider>
              </Grid.Row>
              <Grid.Row>
                <Button
                  color="green"
                  fluid
                  as={Link}
                  to='/auth/'
                >
                  Login
                </Button>
              </Grid.Row>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  signedUp: state.auth.signedUp,
  isLoading: state.auth.isLoading,
  loginError: state.auth.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signup
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthSignup));
