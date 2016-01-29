import React, {Component, PropTypes} from 'react';
import DayPicker, {DateUtils} from 'react-day-picker';
import {dateFromString} from 'helpers/dateHelpers';

export default class DetailContainer extends Component {
  static propTypes = {
    start: PropTypes.object,
    end: PropTypes.object,
    onChange: PropTypes.func,
  }

  onChange = (e, date) => {
    this.props.onChange(date.toISOString().replace(/T.+$/, ''));
  }

  render() {
    let {start, end, ...date} = this.props; // eslint-disable-line prefer-const
    end = new Date(this.props.end.getTime() + 86400000); // expects exclusive end
    const value = dateFromString(date.value || date.defaultValue);

    return (
      <div style={{margin: '1em 0'}}>
        <label htmlFor="date">Date</label>
        <DayPicker
          initialMonth={start}
          numberOfMonths={start.getMonth() === end.getMonth() ? 1 : 2}
          modifiers={{
            selected: day => DateUtils.isSameDay(value, day),
          }}
          onDayClick={this.onChange}
        />
      </div>
    );
  }
}
