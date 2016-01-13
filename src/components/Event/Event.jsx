import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactEmoji from 'react-emoji';
import Linkify from 'react-linkify';
import styleImporter from 'helpers/styleImporter';
import {destroy as deleteEvent} from 'redux/modules/events';

const styles = styleImporter(require('./Event.scss'));

const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

@connect()
class Event extends Component {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    weekno: PropTypes.number.isRequired,
    canEdit: PropTypes.bool.isRequired,
    onEdit: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  deleteEvent = () => {
    this.props.dispatch(deleteEvent({slug: this.props.slug, event: this.props.event}));
  }

  date = () => {
    let [, month, day] = this.props.event.date.split('-');
    day = day.replace(/^0/, '');
    month = months[month];
    return `${day} ${month}`;
  }

  isPlan = () => {
    const event = this.props.event;
    return event.date > event.created_at;
  }

  expiredPlan = () => {
    return this.props.canEdit && this.isPlan() &&
      this.props.event.date < (new Date()).toISOString();
  }

  renderActions = () => {
    if (this.props.canEdit && this.props.onEdit) {
      return (
        <span>
          <a onClick={this.props.onEdit} className={styles.l.actionLink}>
            {ReactEmoji.emojify(':pencil2:', {attributes: {height: '10px', width: '10px'}})}
          </a>
          <a className={styles.l.actionLink} onClick={this.deleteEvent}>
            {ReactEmoji.emojify(':x:', {attributes: {height: '10px', width: '10px'}})}
          </a>
        </span>
      );
    }
  }

  // createEvent = () => {
  //   const event = this.props.event;
  //   EventService.create({
  //     slug: this.props.slug,
  //     title: event.title,
  //     emoji: event.emoji,
  //     date: event.date,
  //     description: event.description,
  //   })
  // }

  // markDone = () => {
  //   this.createEvent()
  //   this.deleteEvent()
  // }

  // snooze = () => {
  //   const event = this.props.event;
  //   const nextWeek = new Date(604800000 + (new Date()).getTime())
  //   EventService.update({
  //     slug: this.props.slug,
  //     id: event.id,
  //     date: nextWeek.toISOString(),
  //     weekno: this.props.weekno,
  //   })
  // }

  renderExpiredPlanActions = () => {
    if (this.expiredPlan()) {
      return (
        <div className={styles.l.buttonGroup}>
          <button className={styles.g.success} onClick={this.markDone}>
            {ReactEmoji.emojify(':checkered_flag:', {singleEmoji: true})}
          </button>
          <button className={styles.g.warning} onClick={this.snooze}>
            {ReactEmoji.emojify(':sleeping:', {singleEmoji: true})}
          </button>
          <button className={styles.g.error} onClick={this.deleteEvent}>
            {ReactEmoji.emojify(':boom:', {singleEmoji: true})}
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <li className={this.expiredPlan() && styles.l.expiredPlan}>
        <h5>
          {ReactEmoji.emojify(this.props.event.emoji, {attributes: {className: styles.g.emoji}})}
          {this.isPlan() ? ' Plan: ' : ' '}
          {this.props.event.title}
        </h5>
        <small className={styles.g.mutedText}>{this.date()}</small>
        <span className={styles.g.pullRight}>{this.props.event.id ? this.renderActions() : null}</span>
        <br/>
        <small className={styles.l.description}>
          <Linkify>{this.props.event.description}</Linkify>
        </small>
        {this.renderExpiredPlanActions()}
      </li>
    );
  }
}

export default Event;
