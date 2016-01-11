import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import eventValidation from './eventValidation';
import {save, editStop} from 'redux/modules/events';
import EmojiPicker from 'react-emoji-picker';
import {endOf} from 'helpers/dateHelpers';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

const emojiPickerStyles = {
  position: 'absolute',
  left: 0, top: '3.5em',
  backgroundColor: 'white',
  width: '100%',
  padding: '.3em .6em',
  border: '1px solid #B36A30',
  borderTop: 'none',
  zIndex: '2'
};

@connect(
  null,
  dispatch => bindActionCreators({save, editStop}, dispatch)
)
@reduxForm({
  form: 'event',
  fields: ['id', 'title', 'emoji', 'date', 'description'],
  validate: eventValidation,
},
state => {
  const events = state.events;
  return {
    initialValues: events.editing &&
      events.data[events.editing.slug][events.editing.weekno][events.editing.index],
  };
})
export default class EventForm extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    start: PropTypes.object.isRequired,
    weekno: PropTypes.number.isRequired,
    save: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,
  }

  state = {
    showEmojiPicker: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleEmojiPicker, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleEmojiPicker, false);
  }

  end = () => {
    return endOf({
      weekno: this.props.weekno,
      born: this.props.user.born
    });
  }

  selectDate = (e) => {
    this.setState({date: e.target.value});
  }

  // FIXME: mismatches with what's on server
  dates = (dateField) => {
    const dates = [];
    let date = this.props.start;
    while (date < this.end()) {
      const dateString = date.toISOString().replace(/T.+/, '');
      dates.push(
        <label key={date}>
          <br/>
          <input type="radio" {...dateField} value={dateString}
            checked={dateField.value === dateString}/>
          <span className={styles.g.checkable}>{date.toDateString()}</span>
        </label>
      );
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
    return dates;
  }

  emojiPicker = () => {
    if (this.state.showEmojiPicker) {
      return (
        <EmojiPicker
          style={emojiPickerStyles} onSelect={this.pickedEmoji}
          query={this.props.fields.emoji.value}
          />
      );
    }
  }

  // FIXME: remove state
  pickedEmoji = (emoji) => {
    console.log('set emoji', emoji);
    this.refs.description.focus();
  }

  toggleEmojiPicker = (e) => {
    if (this.refs.emoji.contains(e.target)) {
      this.setState({showEmojiPicker: true});
    } else {
      this.setState({showEmojiPicker: false});
    }
  }

  grabKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  tense = () => {
    const now = new Date();
    if (this.end() < now) return -1;
    else if (this.props.start > now) return 1;
    return 0;
  }

  typeText = () => {
    const tense = this.tense();
    if (tense < 0) return 'event';
    else if (tense > 0) return 'plan';
    return 'event/plan';
  }

  newText = () => {
    const tense = this.tense();
    if (tense <= 0) return 'Record an ';
    return 'Make a ';
  }

  render() {
    const { fields: {title, emoji, date, description}, handleSubmit, invalid,
      pristine, submitting, saveError, values } = this.props;
    return (
      <form role="form" style={{position: 'relative'}} onFocus={this.toggleEmojiPicker}
        onSubmit={handleSubmit(() => {
          this.props.save(values).then(result => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(result.error);
            }});
        })}>
        <h3>
          {title.defaultValue ? 'Edit' : this.newText()}
          {this.typeText()}:
        </h3>
        <p>
          <label htmlFor="title">Title</label>
          <input type="text" autoComplete="off" id={title.name} {...title}/>
          {title.error && title.touched &&
            <label htmlFor={title.name} className={styles.g.errorText}>{title.error}</label>}
        </p>
        <p style={{position: 'relative'}} ref="emoji">
          <label htmlFor="emoji">Single-symbol summary</label>
          <input id={emoji.name} autoComplete="off"
            type={this.state.showEmojiPicker ? 'search' : 'text'}
            onKeyDown={this.grabKeyPress} {...emoji}
          />
          {this.emojiPicker()}
          <small>Describe it with one small picture</small>
          {emoji.error && emoji.touched &&
            <label htmlFor={emoji.name} className={styles.g.errorText}><br/>{emoji.error}</label>}
        </p>
        <p>
          <label htmlFor="description">Description</label>
          <textarea ref="description" id={description.name} {...description}/>
        </p>
        <p>
          <label htmlFor="date">Date</label>
          {this.dates(date)}
        </p>
        <button type="submit" className={styles.g.brand}
          disabled={pristine || invalid || submitting}>
          Save
        </button>
        {saveError && <div className={styles.g.errorText}>{saveError}</div>}
      </form>
    );
  }
}
