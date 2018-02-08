import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Message, Dimmer, Loader, Image, Divider, Button, Form, Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmail } from 'validator';
import { find, map, isEmpty } from 'lodash';
import { login } from '../../../actions/authAction';
import logo from '../../../logo.svg';

class AuthMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, loginError } = this.props;
    const newUser = nextProps.currentUser;
    const newError = nextProps.loginError;

    if (newUser && (newUser !== currentUser)) {
      this.props.history.push('/');
    } else if (newError !== loginError) {
      const errors = [];
      if (newError) {
        errors.push({ message: 'Incorrect username or password' });
      }
      this.setState({ errors });
    }
  }

  validateFields = () => {
    const { email, password } = this.state;
    const errors = [];
    if (isEmpty(email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter valid email'});
    }
    if (isEmpty(password)) {
      errors.push({ field: 'password', message: 'Password is required' });
    }

    this.setState({ errors });

    return isEmpty(errors);
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value, errors: [] })

  handleSubmit = () => {
    if (this.validateFields()) {
      const { email, password } = this.state;
      this.props.login(email, password);
    }
  }

  render() {
    const { email, password, errors } = this.state;
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
                  <Message error color="red">
                    {map(errors, err =>
                      <Message.Item key={err.message}>{err.message}</Message.Item>
                    )}
                  </Message>
                  <Form.Button
                    color="green"
                    content="Login"
                    fluid
                  />
                </Form>
                <Divider horizontal section>or</Divider>
              </Grid.Row>
              <Grid.Row>
                <label>Don't you have an account?</label>
                <Button
                  color="green"
                  fluid
                  as={Link}
                  to='/auth/signup'
                >
                  Sign Up
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
  isLoading: state.auth.isLoading,
  loginError: state.auth.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  login
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthMain));
