import React, {Component, PropTypes} from 'react';
import ReactEmoji from 'react-emoji';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {startOf, eventsForMonth} from 'helpers/dateHelpers';
const styles = require('../Week/Week.scss');

@connect(
  (state, ownProps) => {
    const slug = state.router.params.slug;
    return {
      events: slug && state.events.data[slug]
        ? eventsForMonth(state.events.data[slug], ownProps.monthno)
        : [],
    };
  }
)
export default class Month extends Component {
  static propTypes = {
    events: PropTypes.array,
    monthno: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      born: PropTypes.string.isRequired,
      current_week: PropTypes.number.isRequired,
      takingTour: PropTypes.bool,
    }).isRequired,
  }

  emoji = () => {
    return this.props.events && this.props.events[0]
      ? ReactEmoji.emojify(this.props.events[0].emoji, {attributes: {className: 'emoji'}})
      : '●';
  }

  tooltip = (date) => {
    let append = '';
    if (this.props.events && this.props.events[0]) {
      append = `: ${this.props.events[0].title}`;
    }
    return `Month of ${date}` + append;
  }

  linkTo = () => {
    if (this.props.user.takingTour) return '/signin';
    if (this.props.selected) return `/${this.props.user.slug}`;
    return `/${this.props.user.slug}/month/${this.props.monthno}`;
  }

  klass = () => {
    const currentMonth = Math.floor(this.props.user.current_week / 4);
    let klass;

    if (currentMonth - 1 === this.props.monthno) klass = [styles.past, 'previous'].join(' ');
    else if (currentMonth + 1 === this.props.monthno) klass = 'next';
    else if (currentMonth > this.props.monthno) klass = styles.past;
    else if (currentMonth === this.props.monthno) klass = 'now';

    return klass;
  }

  render() {
    const start = startOf({weekno: this.props.monthno * 4, born: this.props.user.born});
    return (
      <Link to={this.linkTo()} className={this.klass()}
        title={this.tooltip(start.toDateString())}>
        {this.emoji()}
        {this.props.selected ? <div className={styles.arrow}/> : null}
      </Link>
    );
  }
}
