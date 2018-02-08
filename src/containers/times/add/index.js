import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Modal, Form } from 'semantic-ui-react';
import { find, map, isEmpty } from 'lodash';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import '../styles.css';
import { DATE_FORMAT } from '../../../constants';

class AddTimeDialog extends React.Component {

  static propTypes = {
    onAddCancel: PropTypes.func.isRequired,
    onAddSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      date: '',
      distance: '',
      minutes: '',
      errors: [],
      showDialog: true
    };
  }

  validateFields = () => {
    const { date, distance, minutes } = this.state;
    const errors = [];

    if (isEmpty(date)) {
      errors.push({ field: 'date', message: 'Date is required' });
    }
    if (distance === '') {
      errors.push({ field: 'distance', message: 'Distance is required' });
    } else if (distance < 0) {
      errors.push({ field: 'distance', message: 'Distance can\'t be below zero.' });
    }
    if (minutes === '') {
      errors.push({ field: 'minutes', message: 'Minutes is required' });
    } else if (minutes < 0) {
      errors.push({ field: 'minutes', message: 'Minutes can\'t be below zero.' });
    }
    this.setState({
      errors: errors
    });

    return isEmpty(errors);
  }

  handleDateChange = (day) => {
    this.setState({
      date: moment(day).format(DATE_FORMAT)
    })
  }

  handleChange = (e, { name, value }) => {
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
      const time = {
        date: this.state.date,
        distance: this.state.distance,
        minutes: this.state.minutes
      };
      this.props.onAddSave(time);
    }
  }

  render() {
    const { showDialog, date, distance, minutes, errors } = this.state;

    return (
      <Modal
        open={showDialog}
        size='tiny'
        onClose={this.onAddCancel}
        closeOnRootNodeClick={false}
      >
        <Modal.Header>
          Edit Time
        </Modal.Header>
        <Modal.Content>
          <Form error={!isEmpty(errors)}>
            <Form.Field>
              <label>Date:</label>
              <div className="ui left icon input">
                <i aria-hidden="true" className="calendar icon"></i>
                <DayPickerInput
                  placeholder="Start Date"
                  onDayChange={this.handleDateChange}
                  value={date}
                />
              </div>
            </Form.Field>
            <Form.Field>
              <label>Distance(Miles):</label>
              <Form.Input
                placeholder='Distance'
                value={distance}
                name="distance"
                type="number"
                min={0}
                onChange={this.handleChange}
                error={!!find(errors, { field: 'distance' })}
              />
            </Form.Field>
            <Form.Field>
              <label>Time(Minutes):</label>
              <Form.Input
                placeholder='Time(Minutes)'
                value={minutes}
                name="minutes"
                type="number"
                min={0}
                onChange={this.handleChange}
                error={!!find(errors, { field: 'minutes' })}
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

export default AddTimeDialog;
