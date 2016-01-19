import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import eventValidation from './eventValidation';
import {save} from 'redux/modules/events';
import EmojiPicker from 'react-emoji-picker';
import {DatePicker} from 'components';
import {startOf, endOf, eventsForMonth} from 'helpers/dateHelpers';

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
  state => {
    const weekno = state.router.params.weekno;
    const monthno = state.router.params.monthno;
    const user = state.router.params.slug && state.users.data[state.router.params.slug];
    const eventId = state.router.params.id;
    return {
      weekno: weekno && +weekno,
      monthno: monthno && +monthno,
      user,
      start: user && user.born && startOf({weekno: weekno || monthno * 4, born: user.born}),
      formKey: eventId || 'new',
      saveError: state.events.saveError,
    };
  },
  dispatch => bindActionCreators({save}, dispatch)
)
@reduxForm({
  form: 'event',
  fields: ['id', 'title', 'emoji', 'date', 'description'],
  validate: eventValidation,
},
(state, ownProps) => {
  const eventId = state.router.params.id;
  const events = ownProps.weekno
    ? eventId && state.events.data[ownProps.user.slug][ownProps.weekno] || []
    : eventId && eventsForMonth(state.events.data[ownProps.user.slug], ownProps.monthno);
  const event = eventId && events.filter(e => e.id === +eventId)[0];
  const date = ownProps.start.toISOString().replace(/T.+$/, '');

  return {
    initialValues: event || {date},
  };
})
export default class EventForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    start: PropTypes.object,
    weekno: PropTypes.number,
    monthno: PropTypes.number,
    save: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    formKey: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,
    resetForm: PropTypes.func.isRequired,
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
      weekno: this.props.weekno || (this.props.monthno * 4) + 3,
      born: this.props.user.born
    });
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

  pickedEmoji = (emoji) => {
    this.props.fields.emoji.onChange(emoji);
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

  linkTo() {
    return this.props.weekno
      ? `/${this.props.user.slug}/week/${this.props.weekno}`
      : `/${this.props.user.slug}/month/${this.props.monthno}`;
  }

  render() {
    if (!this.props.user) return null;

    const { fields: {title, emoji, date, description}, formKey, handleSubmit, invalid,
      pristine, submitting, saveError: {[formKey]: saveError}, values, resetForm } = this.props;
    return (
      <form role="form" style={{position: 'relative'}} onFocus={this.toggleEmojiPicker}
        onSubmit={handleSubmit(() => {
          this.props.save({slug: this.props.user.slug, event: values}).then(result => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(result.error);
            }
            resetForm();
            this.refs.description.value = ''; // resetForm doesn't catch this ¯\_(ツ)_/¯
            this.refs.title.focus();
            this.props.history.pushState(null, this.linkTo());
          });
        })}>
        <h3>
          {title.defaultValue ? 'Edit ' : this.newText()}
          {this.typeText()}:
        </h3>
        <p>
          <label htmlFor="title">Title</label>
          <input type="text" required ref="title" autoComplete="off" id={title.name} {...title}/>
          {title.error && title.touched &&
            <label htmlFor={title.name} className="errorText">{title.error}</label>}
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
            <label htmlFor={emoji.name} className="errorText"><br/>{emoji.error}</label>}
        </p>
        <p>
          <label htmlFor="description">Description</label>
          <textarea ref="description" id={description.name} {...description}/>
        </p>
        <DatePicker start={this.props.start} end={this.end()} {...date}/>
        <button type="submit" className="brand"
          disabled={pristine || invalid || submitting}>
          Save
        </button>
        {saveError && <div className="errorText">{saveError}</div>}
      </form>
    );
  }
}
