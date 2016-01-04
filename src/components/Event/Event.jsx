import React from 'react';
import reactMixin from 'react-mixin';
import ReactEmoji from 'react-emoji';
import Linkify from 'react-linkify';

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

class Event extends React.Component {
  static propTypes = {
    slug: React.PropTypes.string.isRequired,
    event: React.PropTypes.object.isRequired,
    weekno: React.PropTypes.number.isRequired,
    authed: React.PropTypes.bool.isRequired,
    onEdit: React.PropTypes.func,
  }

  // deleteEvent = () => {
  //   EventService.destroy(this.props.slug, this.props.event.id, this.props.weekno)
  // }

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
    return this.props.authed && this.isPlan() &&
      this.props.event.date < (new Date()).toISOString();
  }

  renderActions = () => {
    // if(this.props.authed && this.props.onEdit) {
    //   return (
    //     <span>
    //       <a onClick={this.props.onEdit} className="action-link">
    //         {this.emojify(':pencil2:', {attributes: {height: '10px', width: '10px'}})}
    //       </a>
    //       <a className="action-link" onClick={this.deleteEvent}>
    //         {this.emojify(':x:', {attributes: {height: '10px', width: '10px'}})}
    //       </a>
    //     </span>
    //   )
    // }
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
        <div className="button-group">
          <button className="success" onClick={this.markDone}>
            {this.emojify(':checkered_flag:', {singleEmoji: true})}
          </button>
          <button className="warning" onClick={this.snooze}>
            {this.emojify(':sleeping:', {singleEmoji: true})}
          </button>
          <button className="error" onClick={this.deleteEvent}>
            {this.emojify(':boom:', {singleEmoji: true})}
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <li className={this.expiredPlan() ? 'expired-plan' : ''}>
        <h5>
          {this.emojify(this.props.event.emoji, {attributes: {className: 'emoji'}})}
          {this.isPlan() ? ' Plan: ' : ' '}
          {this.props.event.title}
        </h5>
        <small className="text-muted">{this.date()}</small>
        <span className="pull-right">{this.props.event.id ? this.renderActions() : null}</span>
        <br/>
        <small className="description">
          <Linkify>{this.props.event.description}</Linkify>
        </small>
        {this.renderExpiredPlanActions()}
      </li>
    );
  }
}

reactMixin(Event.prototype, ReactEmoji);

export default Event;
