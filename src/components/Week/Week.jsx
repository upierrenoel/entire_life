import React from 'react';
import reactMixin from 'react-mixin';
import ReactEmoji from 'react-emoji';
import { Link } from 'react-router';
import { startOf } from 'helpers/dateHelpers';

class Week extends React.Component {
  static propTypes = {
    events: React.PropTypes.array,
    weekno: React.PropTypes.number.isRequired,
    selected: React.PropTypes.bool.isRequired,
    user: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      born: React.PropTypes.string.isRequired,
      current_week: React.PropTypes.number.isRequired,
    }).isRequired,
  }

  emoji = () => {
    return this.props.events && this.props.events[0]
      ? this.emojify(this.props.events[0].emoji, {attributes: {className: 'emoji'}})
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
    if (this.props.selected) return `/${this.props.user.slug}`;
    return `/${this.props.user.slug}/week/${this.props.weekno}`;
  }

  klass = () => {
    const currentWeek = this.props.user.current_week;
    let klass;

    if (currentWeek - 1 === this.props.weekno) klass = 'past previous';
    else if (currentWeek + 1 === this.props.weekno) klass = 'next';
    else if (currentWeek > this.props.weekno) klass = 'past';
    else if (currentWeek === this.props.weekno) klass = 'now';

    return klass;
  }

  render() {
    const start = startOf({weekno: this.props.weekno, born: this.props.user.born});
    return (
      <Link to={this.linkTo()} className={this.klass()}
        title={this.tooltip(start.toDateString())}>
        {this.emoji()}
        {this.props.selected ? <div className="arrow"/> : null}
      </Link>
    );
  }
}

reactMixin(Week.prototype, ReactEmoji);

export default Week;
