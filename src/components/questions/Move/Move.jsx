import React, {Component, PropTypes} from 'react';

export default class Move extends Component {
  static propTypes = {
    onSave: PropTypes.func,
    user: PropTypes.shape({
      slug: PropTypes.string,
      born: PropTypes.string,
    }),
    user101date: PropTypes.string,
    skip: PropTypes.func,
  }

  state = {
    prompts: [this.prompt1(), this.props.skip()]
  }

  prompt1(date) {
    return [
      <header>
        Answer a few quick questions to make your calendar more fun!
      </header>,
      <p key="prompt1">
        <label htmlFor="date">When's the last time you moved?</label>
        <input type="date" id="date" autoComplete="off"
          min={this.props.user.born} max={this.props.user101date}
          onChange={this.prompt1answer.bind(this)} value={date} autoFocus
        />
      </p>
    ];
  }

  prompt1answer(e) {
    this.setState({
      date: e.target.value,
      prompts: [
        this.prompt1(e.target.value),
        this.prompt2(),
      ]
    });
  }

  prompt2(value) {
    return [
      <p key="prompt2">
        <label htmlFor="where">Where to?</label>
        <input type="text" id="where" autoComplete="off"
          onChange={this.prompt2answer.bind(this)} value={value}
        />
      </p>
    ];
  }

  prompt2answer(e) {
    this.setState({
      where: e.target.value,
      prompts: [
        this.prompt1(this.state.date),
        this.prompt2(e.target.value),
        this.saveButton(),
      ]
    });
  }

  saveButton() {
    return (
      <button key="save" type="submit" className="brand">
        Next Question !
      </button>
    );
  }

  save(e) {
    e.preventDefault();
    this.props.onSave({
      emoji: ':truck:',
      title: `Moved to ${this.state.where}`,
      date: this.state.date,
    });
  }

  render() {
    return (
      <form role="form" onSubmit={this.save.bind(this)}>
        {this.state.prompts}
      </form>
    );
  }
}
