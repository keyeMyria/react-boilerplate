import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Dimmer, Message, Table, Button, Icon, Modal, Header, Segment, Form, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
  fetchTimes,
  addTime,
  updateTime,
  removeTime
} from '../../actions/timesAction';
import EditTimeDialog from './edit';
import AddTimeDialog from './add';
import './styles.css';
import 'react-day-picker/lib/style.css';

const DAY_FORMAT = 'MM-DD-YYYY';

class Times extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      times: (typeof props.times !== 'undefined') ? props.times.results: [],
      isLoading : (typeof props.isLoading !== 'undefined') ? props.isLoading: false,
      error: (typeof props.error !== 'undefined') ? props.error: null,
      selectedTime: null,
      startDate: '',
      endDate: '',
      addTime: false,
      removeIndex: -1
    };
  }

  componentDidMount() {
    this.props.fetchTimes();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        times: (typeof nextProps.times !== 'undefined') ? nextProps.times.results: [],
        isLoading : (typeof nextProps.isLoading !== 'undefined') ? nextProps.isLoading: false,
        error: (typeof nextProps.error !== 'undefined') ? nextProps.error: null
      })
    }
  }

  onRowEdit = (data) => {
    this.setState({
      selectedTime: data
    });
  }

  onRowRemove = (index) => {
    this.setState({
      removeIndex: index
    });
  }

  onEditSave = (time, index) => {
    this.props.updateTime(time, index);
    this.setState({
      selectedTime: null
    });
  }

  onEditCancel = () =>  {
    this.setState({
      selectedTime: null
    });
  }

  onAddSave = (time) => {
    this.props.addTime(time);
    this.setState({
      addTime: false
    });
  }

  onAddCancel = () =>  {
    this.setState({
      addTime: false
    });
  }

  onRemoveConfirm = () => {
    this.props.removeTime(this.state.removeIndex);
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
      addTime: true
    });
  }

  onClickStartDate = (day) => {
    const startDate = day !== '' ? moment(day).format(DAY_FORMAT) : '';
    this.setState({
      startDate: startDate
    });
  }

  onClickEndDate = (day) => {
    const endDate = day !== '' ? moment(day).format(DAY_FORMAT) : '';
    this.setState({
      endDate: endDate
    });
  }

  onClickFilter = () => {
    this.props.fetchTimes(this.state.startDate, this.state.endDate);
  }

  onClickClear = () => {
    this.setState({
      startDate: '',
      endDate: ''
    });
  }

  renderTimes() {
    const { times } = this.state;

    return times.map((row, index) => {
      let avgSpeed, date;
      if (row.minutes === 0) {
        avgSpeed = 0;
      } else {
        avgSpeed = parseFloat(row.distance) / parseFloat(row.minutes) / 60;
      }
      date = moment(row.date).format(DAY_FORMAT);
      return (
        <Table.Row key={index}>
          <Table.Cell collapsing>{date}</Table.Cell>
          <Table.Cell collapsing>{row.distance}</Table.Cell>
          <Table.Cell collapsing>{row.minutes}</Table.Cell>
          <Table.Cell collapsing>{avgSpeed.toFixed(2)}</Table.Cell>
          <Table.Cell collapsing>
            <Button color='green' icon='edit' size='mini' onClick={this.onRowEdit.bind(this, row)} />
            <Button color='red' icon='delete' size='mini' onClick={this.onRowRemove.bind(this, row._id)} />
          </Table.Cell>
        </Table.Row>);
    });
  }

  render() {
    
    const { isLoading, error, selectedTime, addTime, removeIndex, startDate, endDate } = this.state;
    const startDateFormatted = startDate ? moment(startDate).format(DAY_FORMAT):'';
    const endDateFormatted = endDate ? moment(endDate).format(DAY_FORMAT):'';
    return (
      <Grid.Row>
        { isLoading &&
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
        }
        <Header as='h2'>
          <Icon name='clock' />
          <Header.Content>
            Times Tracked
          </Header.Content>
        </Header>
        <Segment stacked>
          { error && error.message &&
            <Message negative>
              <Message.Header>Sorry ...</Message.Header>
              <p>{error.message}</p>
            </Message>
          }
          <Form.Group widths='equal'>
            <label>Start Date</label>
            <div className="ui left icon input">
              <i aria-hidden="true" className="calendar icon"></i>
              <DayPickerInput
                placeholder="Start Date"
                onDayChange={this.onClickStartDate}
                value={startDateFormatted}
              />  
            </div>
            <label>End Date</label>
            <div className="ui left icon input">
              <i aria-hidden="true" className="calendar icon"></i>
              <DayPickerInput
                placeholder="End Date"
                onDayChange={this.onClickEndDate}
                value={endDateFormatted}
              />
            </div>
            <Button onClick={this.onClickFilter} positive>Filter</Button>
            <Button onClick={this.onClickClear}>Clear</Button>
          </Form.Group>
          <Table compact='very' celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Distance(Miles)</Table.HeaderCell>
                <Table.HeaderCell>Time(Minutes)</Table.HeaderCell>
                <Table.HeaderCell>Avg. Speed(mph)</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
        
            <Table.Body>
              {this.renderTimes()}
            </Table.Body>
        
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='5'>
                  <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onClickAdd}>
                    <Icon name='time' /> Add Time
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Segment>
        {
          addTime &&
          <AddTimeDialog
            onAddCancel={this.onAddCancel.bind(this)}
            onAddSave={this.onAddSave.bind(this)}
          />
        }
        {
          selectedTime !== null &&
          <EditTimeDialog
            time = {selectedTime}
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
            Remove tracked time?
          </Modal.Header>
          <Modal.Content>
            <p>Do you really want to delete your time?</p>
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
  times: state.times.times,
  isLoading: state.times.isLoading,
  error: state.times.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTimes,
  addTime,
  updateTime,
  removeTime
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Times));
