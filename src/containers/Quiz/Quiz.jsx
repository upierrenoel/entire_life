import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {save} from 'redux/modules/events';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {PageSection, Logo, Nav} from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

import {
  // Children,
  // Hundredth,
  Move,
  // Relationship,
  // Sibling,
  // Vacation,
} from 'components/questions';
import spinner from '../../../static/icon-loading-spinner.gif';

const Loading = () => {
  return (
    <p style={{clear: 'both', textAlign: 'center', paddingTop: '5em'}}>
      <img src={spinner} alt="loading..." width="100"/>
    </p>
  );
};

@connect(
  state => ({
    user: state.auth.user,
    query: state.router.location.query,
  }),
  dispatch => bindActionCreators({save}, dispatch)
)
export default class Quiz extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
  }

  static defaultProps = {
    questions: [
      <Move/>,
      // <Sibling/>,
      // <Vacation/>,
      // <Children/>,
      // <Relationship/>,
      // <Hundredth/>,
      <Loading/>,
    ]
  }

  state = {
    answers: {},
  }

  currentQuestion = () => {
    return +this.props.query.n || 0;
  }

  updateAnswers = ({questionNumber, ...opts}) => {
    const answers = this.state.answers;
    answers[questionNumber] = {...opts};
    this.setState({answers});
  }

  nextUnanswered = () => {
    for (let i = 0; i < this.props.questions.length; i++) {
      if (!this.state.answers[i]) return i;
    }
  }

  save = ({emoji, title, date} = {}) => {
    const event = {emoji, title, date};
    const questionNumber = this.currentQuestion();
    this.updateAnswers({...event, questionNumber});
    this.props.history.pushState(null, '/quiz', {n: this.nextUnanswered()});

    if (!date || !title) return setTimeout(this.possiblyFinishQuiz.bind(this), 100);

    this.props.save({slug: this.props.user.slug, event}).
      then(result => {
        const {id, weekno} = result;
        this.updateAnswers({questionNumber, id, emoji, title, date, weekno});
        this.possiblyFinishQuiz();
      });
  }

  possiblyFinishQuiz = () => {
    if (this.currentQuestion() === this.props.questions.length - 1) {
      this.props.history.pushState(null, `/${this.props.user.slug}`, {tour: true});
    }
  }

  skipQuestion = (e) => {
    e.preventDefault();
    this.save({emoji: ':x:'});
  }

  skipLink = () => {
    return (
      <p key="skip">
        <Link to="/quiz" query={{n: this.nextUnanswered() + 1}}
          onClick={this.skipQuestion.bind(this)} className="close-link"
        >
          <small>Skip this question</small>
        </Link>
        {this.currentQuestion() || <Link to={`/${this.props.user.slug}`}
          className={[styles.g.pullRight, styles.g.closeLink].join(' ')}>
          <small>No thanks</small>
        </Link>}
      </p>
    );
  }

  user101 = () => {
    const born = this.props.user.born;
    if (!born) return '2300-12-31';
    const [year, month, day] = this.props.user.born.split('-');
    return `${+year + 101}-${month}-${+day - 1}`;
  }

  render() {
    const title = `Welcome Quiz ⟡ ${this.currentQuestion() + 1} ⟡ Entire.Life`;
    return (
      <PageSection type="sunset-blocked" styleInner={{display: 'block'}} className={styles.g.container}>
        <DocumentMeta {...metaData(title)} extend/>
        <Nav lower>
          <Logo type="black" style={{float: 'left'}}/>
          <h1 className={styles.g.brand}>Welcome Quiz</h1>
        </Nav>
        <div style={{clear: 'both'}}>
          {React.cloneElement(
            this.props.questions[this.currentQuestion()], {
              onSave: this.save,
              user: this.props.user,
              skip: this.skipLink.bind(this),
              user101date: this.user101(),
            })}
        </div>
      </PageSection>
    );
  }
}
