import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Dimmer, Icon, Header, Loader, Form, Segment, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import ReactHighcharts from 'react-highcharts';
import { fetchTimes } from '../../actions/timesAction';
import './styles.css';

const DAY_FORMAT = 'YYYY-MM-DD';

class Report extends React.Component {
  
  constructor(props) {
    super(props);

    const startDate = moment(new Date()).startOf('isoWeek').format(DAY_FORMAT);
    const endDate = moment(new Date()).endOf('isoWeek').format(DAY_FORMAT);

    this.state = {
      times: [],
      startDate: startDate,
      endDate: endDate,
      isLoading : false,
      error: null
    };

    this.props.fetchTimes(startDate, endDate);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== nextProps) {
      this.setState({
        times: (typeof nextProps.times !== 'undefined') ? nextProps.times.results: [],
        isLoading : (typeof nextProps.isLoading !== 'undefined') ? nextProps.isLoading: false,
        error: (typeof nextProps.error !== 'undefined') ? nextProps.error: null
      })
    }
  }

  renderTimes() {
    const { times } = this.state;
    let avgSpeedArray = {
      avgSpeed: [],
      distance: [],
      categories: [],
    };
    
    times.sort((a, b) => moment(a.date) - moment(b.date)).forEach((time) => {
      let avgSpeed;
      if (time.minutes === 0) {
        avgSpeed = 0;
      } else {
        avgSpeed = parseFloat(time.distance) / parseFloat(time.minutes) / 60;
      }
      avgSpeedArray.avgSpeed.push(parseFloat(avgSpeed.toFixed(2)));
      avgSpeedArray.distance.push(time.distance);
      avgSpeedArray.categories.push(moment(time.date).format(DAY_FORMAT));
    });
    return avgSpeedArray;
  }
  
  onClickDate = (day) => {
    const selectedDate = day !== '' ? moment(day).format(DAY_FORMAT) : '';
    const startDate = moment(selectedDate).startOf('isoWeek').format(DAY_FORMAT);
    const endDate = moment(selectedDate).endOf('isoWeek').format(DAY_FORMAT);
    this.setState({ 
      startDate: startDate,
      endDate: endDate
    });
    this.props.fetchTimes(startDate, endDate);
  }

  render() {
    const { isLoading, startDate, endDate } = this.state;
    const { avgSpeed, categories, distance } = this.renderTimes();
    const avgSpd = avgSpeed.length !==0 ? (avgSpeed.reduce((a, b) => a + b)/avgSpeed.length).toFixed(2) : 0;
    const avgDis = distance.length !==0 ? (distance.reduce((a, b) => a + b)/distance.length).toFixed(2) : 0;
    // const avg = sum/avgSpeed.length;
    const configAvg = {
      title : {
        text: `Average Speed - ${avgSpd}mph`
      },
      xAxis: {
        categories: categories
      },
      series: [{
        name: 'Average Speed',
        data: avgSpeed,
      }]
    };
    const configDis = {
      title : {
        text: `Average Distance - ${avgDis}mi`
      },
      xAxis: {
        categories: categories
      },
      series: [{
        name: 'Distance',
        data: distance
      }]
    };
    return (
      <Grid.Row>
        { isLoading &&
          <Dimmer active inverted>
            <Loader inverted content='Loading' />
          </Dimmer>
        }
        <Header as='h2'>
          <Icon name='bar chart' />
          <Header.Content>
            Report
          </Header.Content>
        </Header>
        <Segment stacked>
          <Grid.Row>
            <Form.Group widths='equal'>
              <div className="ui left icon input">
                <i aria-hidden="true" className="calendar icon"></i>
                <DayPickerInput
                  placeholder="Select Date"
                  onDayChange={this.onClickDate}
                />
              </div>
            </Form.Group>
          </Grid.Row>
          <Grid.Row>
            <Message visible>
              <Header as='h2'>
                Report from {startDate} to {endDate}
              </Header>
              { avgSpeed.length ===0 && <p>No time track found during this period.</p> }
            </Message>
            <Grid.Row>
              
              { avgSpeed.length !==0 && <ReactHighcharts config = {configAvg}></ReactHighcharts> }
            </Grid.Row>
            <Grid.Row>
              { distance.length !==0 && <ReactHighcharts config = {configDis}></ReactHighcharts> }
            </Grid.Row>
          </Grid.Row>
        </Segment>
      </Grid.Row>
    );
  }
}

const mapStateToProps = state => ({
  times: state.times.times
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTimes
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Report));
