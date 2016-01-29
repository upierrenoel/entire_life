import React, {Component, PropTypes} from 'react';
import ReactEmoji from 'react-emoji';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {startOf} from 'helpers/dateHelpers';
const styles = require('./Week.scss');

@connect(
  (state, ownProps) => {
    const slug = ownProps.user.slug;
    return {
      events: slug && state.events.data[slug] && state.events.data[slug].events
        ? state.events.data[slug].events[ownProps.weekno]
        : [],
    };
  }
)
class Week extends Component {
  static propTypes = {
    events: PropTypes.array,
    weekno: PropTypes.number.isRequired,
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
    return `Week of ${date}` + append;
  }

  linkTo = () => {
    if (this.props.user.takingTour) return '/signin';
    if (this.props.selected) return `/${this.props.user.slug}`;
    return `/${this.props.user.slug}/week/${this.props.weekno}`;
  }

  klass = () => {
    const currentWeek = this.props.user.current_week;
    let klass;

    if (currentWeek - 1 === this.props.weekno) klass = [styles.past, 'previous'].join(' ');
    else if (currentWeek + 1 === this.props.weekno) klass = 'next';
    else if (currentWeek > this.props.weekno) klass = styles.past;
    else if (currentWeek === this.props.weekno) klass = 'now';

    return klass;
  }

  render() {
    const start = startOf({weekno: this.props.weekno, born: this.props.user.born});
    return (
      <Link to={this.linkTo()} className={this.klass()}
        title={this.tooltip(start.toDateString())}>
        {this.emoji()}
        {this.props.selected ? <div className={styles.arrow}/> : null}
      </Link>
    );
  }
}

export default Week;
