import React, {Component, PropTypes} from 'react';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

export default class Sibling extends Component {

  static propTypes = {
    onSave: PropTypes.func,
    skip: PropTypes.func,
    user: PropTypes.shape({
      born: PropTypes.string,
    }),
    user101date: PropTypes.string,
  }

  state = {
    prompts: [this.prompt1(), this.props.skip()]
  }

  prompt1(value) {
    return [
      <p key="prompt1">
        Do you have any younger siblings?
      </p>,
      <p key="answer1" className={styles.g.horizontalSpacing}>
        <label style={{minWidth: 200}}>
          <input type="radio" name="prompt1" value="yes" autoFocus
            onChange={this.prompt1answer1.bind(this)} checked={value === 'yes'}/>
          <span className={styles.g.checkable}>Yes</span>
        </label>
        <label style={{minWidth: 200}}>
          <input type="radio" name="prompt1" value="no"
            onChange={this.prompt1answer2.bind(this)} checked={value === 'no'}/>
          <span className={styles.g.checkable}>No</span>
        </label>
      </p>
    ];
  }

  prompt1answer1() {
    this.setState({
      prompts: [
        this.prompt1('yes'),
        this.prompt2(),
        this.props.skip(),
      ]
    });
  }

  prompt1answer2(e) {
    this.setState({prompts: [
      this.prompt1('no'),
    ]});
    this.save(e);
  }

  prompt2(value) {
    return [
      <p key="prompt2">
        <label htmlFor="name">What's the first one's name?</label>
        <input type="text" name="name" id="name"
          onChange={this.prompt2answer.bind(this)} value={value}
          autoComplete="off"
        />
      </p>
    ];
  }

  prompt2answer(e) {
    this.setState({name: e.target.value});
    this.setState({
      prompts: [
        this.prompt1('yes'),
        this.prompt2(e.target.value),
        this.prompt3({name: e.target.value}),
        this.props.skip(),
      ]
    });
  }

  prompt3({name, date}) {
    return [
      <p key="prompt3A">
        <label htmlFor="date">When was {name} born?</label>
        <input type="date" required id="date" autoComplete="off"
          min={this.props.user.born} max={this.props.user101date}
          onChange={this.prompt3answer.bind(this)} value={date}
        />
      </p>
    ];
  }

  prompt3answer(e) {
    this.setState({
      date: e.target.value,
      prompts: [
        this.prompt1('yes'),
        this.prompt2(this.state.name),
        this.prompt3({name: this.state.name, date: e.target.value}),
        this.saveButton()
      ]
    });
  }

  saveButton() {
    return (
      <button key="saveButton" type="submit" className={styles.g.brand}>
        Next Question !
      </button>
    );
  }

  save(e) {
    e.preventDefault();
    this.props.onSave({
      emoji: ':baby_bottle:',
      title: `Sibling ${this.state.name} born`,
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
