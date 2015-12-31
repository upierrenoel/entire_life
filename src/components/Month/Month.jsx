import React from 'react';
import reactMixin from 'react-mixin';
import ReactEmoji from 'react-emoji';
import { Link } from 'react-router';
import { startOf } from 'helpers/dateHelpers';

class Month extends React.Component {
  static propTypes = {
    events: React.PropTypes.array,
    monthno: React.PropTypes.number.isRequired,
    selected: React.PropTypes.bool.isRequired,
    currentWeek: React.PropTypes.number.isRequired,
    user: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      born: React.PropTypes.string.isRequired,
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
    return `Month of ${date}` + append;
  }

  linkTo = () => {
    if (this.props.selected) return `/${this.props.user.slug}`;
    return `/${this.props.user.slug}/week/${this.props.monthno}`;
  }

  klass = () => {
    const currentMonth = Math.floor(this.props.currentWeek / 4);
    let klass;

    if (currentMonth - 1 === this.props.monthno) klass = 'past previous';
    else if (currentMonth + 1 === this.props.monthno) klass = 'next';
    else if (currentMonth > this.props.monthno) klass = 'past';
    else if (currentMonth === this.props.monthno) klass = 'now';

    return klass;
  }

  render() {
    const start = startOf({monthno: this.props.monthno * 4, born: this.props.user.born});
    return (
      <Link to={this.linkTo()} className={this.klass()}
        title={this.tooltip(start.toDateString())}>
        {this.emoji()}
        {this.props.selected ? <div className="arrow"/> : null}
      </Link>
    );
  }
}

reactMixin(Month.prototype, ReactEmoji);

export default Month;
