import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Year} from 'components';
import tourSteps from 'utils/tourSteps';
import shallowEqual from 'helpers/shallowEqual';

const styles = require('./Calendar.scss');

@connect(
  state => {
    const events = state.events.data[state.router.params.slug] || {};
    const eventWeeks = Object.keys(events).map(v => +v);
    return {
      finalWeek: +eventWeeks.sort((a, b) => a - b)[eventWeeks.length - 1],
    };
  }
)
export default class Calendar extends Component {
  static propTypes = {
    finalWeek: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    addSteps: PropTypes.func,
    weekno: PropTypes.string,
    monthno: PropTypes.string,
    detail: PropTypes.element,
    showTour: PropTypes.bool,
    startTour: PropTypes.func,
  }

  state = {
    oldWeekno: null,
    oldMonthno: null,
  }

  componentDidMount() {
    this.props.addSteps(tourSteps);
    if (this.props.showTour) setTimeout(this.props.startTour, 100);
  }

  componentWillReceiveProps(newProps) {
    const oldWeekno = this.props.weekno;
    const oldMonthno = this.props.monthno;
    if (newProps.weekno !== oldWeekno) {
      this.setState({oldWeekno: oldWeekno});
    }
    if (newProps.monthno !== oldMonthno) {
      this.setState({oldMonthno: oldMonthno});
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.weekno !== nextProps.weekno ||
      this.props.monthno !== nextProps.monthno ||
      !this.props.detail && !!nextProps.detail ||
      !shallowEqual(this.props.user, nextProps.user);
  }

  year = (age) => {
    return React.createElement(Year, {
      ...this.props,
      key: age,
      age,
      endAge: this.endAge(),
      oldWeekno: this.state.oldWeekno,
      oldMonthno: this.state.oldMonthno,
    });
  }

  endAge = () => {
    if (this.props.user.died) return Math.floor(this.props.finalWeek / 52);
    return 100;
  }

  render() {
    const years = [];
    for (let i = 0; i <= this.endAge(); i++) {
      years.push(this.year(i));
    }
    return (
      <div className={styles.calendar}>
        {years}
      </div>
    );
  }
}
