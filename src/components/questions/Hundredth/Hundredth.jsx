import React, {Component, PropTypes} from 'react';

export default class Hundredth extends Component {

  static propTypes = {
    onSave: PropTypes.func,
    skip: PropTypes.func,
    user: PropTypes.shape({
      born: PropTypes.string,
    }),
  }

  state = {
    prompts: [this.prompt1(), this.props.skip()]
  }

  prompt1(value) {
    return [
      <p key="prompt1">
        What do you want to do on your 100th birthday?
      </p>,
      <p key="answer1">
        {[['runner', 'Go for a run'], ['bike', 'Ride a bike'],
          ['mount_fuji', 'Climb a mountain'],
          ['tropical_fish', 'Go for a swim'],
          ['sunrise', 'Paint a sunrise'],
        ].map(([emoji, title]) => {
          return (
            <label key={emoji} style={{display: 'inline-block', minWidth: 200}}>
              <input type="radio" name="prompt1" value={emoji} autoFocus={emoji === 'runner'}
                onChange={this.prompt1answer.bind(this, emoji, title)} checked={value === emoji}/>
              <span className="checkable">{title}</span>
            </label>
          );
        })}
      </p>
    ];
  }

  prompt1answer(emoji, title) {
    this.setState({
      emoji: emoji,
      title: title,
      prompts: [
        this.prompt1(emoji),
        this.props.skip(),
      ]
    });
    setTimeout(() => this.save(), 20);
  }

  save(e) {
    if (e) e.preventDefault();
    this.props.onSave({
      emoji: `:${this.state.emoji}:`,
      title: this.state.title,
      date: this.date(),
    });
  }

  date() {
    const [year, month, day] = this.props.user.born.split('-');
    return `${+year + 100}-${month}-${day}`;
  }

  render() {
    return (
      <form role="form" onSubmit={this.save.bind(this)}>
        {this.state.prompts}
      </form>
    );
  }
}
