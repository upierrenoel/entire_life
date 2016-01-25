import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Landing, PageSection, Footer} from 'components';
import config from '../../config';

import {connect} from 'react-redux';
import {cache} from 'redux/modules/auth';
import {reduxForm} from 'redux-form';
import tourValidation from './tourValidation';
import {loadStub as loadUser} from 'redux/modules/users';
import {loadStub as loadEvents} from 'redux/modules/events';
import {Calendar} from 'components';
import spinner from '../../../static/icon-loading-spinner.gif';

class Details extends React.Component {
  state = {
    expanded: false,
    height: 400,
  }

  expand = (event) => {
    event.preventDefault();
    this.setState({expanded: true, height: this.refs.container.offsetHeight});
  }

  renderExpanse() {
    const expandButton = (
      <div style={{position: 'absolute', bottom: 0, height: 400, width: '100%', background: 'linear-gradient(transparent, #20221F)'}}>
        <div className="centered" style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <a href="#" onClick={this.expand} className="button">
            read more...
          </a>
        </div>
      </div>
    );

    return (
      <div style={{position: 'relative', overflow: 'hidden', height: this.state.height, transition: 'height 500ms ease'}} >
        <div ref="container" style={{padding: '1em 0'}}>
          {this.state.expanded ? null : expandButton}
          <div className="container">
            <p style={{marginTop: 0}}>And instead of just adding thoughts and events about the present, you can add events for any of your past weeks.</p>
          </div>
          <div className="centered">
            <img style={{width: 320}} src={require('./event-add-example.png')} alt="Entire.Life event creation form, with the event Made My First Sale being added"/>
          </div>
          <div className="container">
            <p>With all of that historic context, the present can start to feel like a gift again. We can remember how hard we worked to get where we're at, and spot plot arcs and foreshadowing that give us a sense of purpose.</p>
          </div>
          <div className="centered">
            <img style={{width: 320}} src={require('./past-calendar-example.png')} alt="Entire.Life calendar filled in, with different romantic events showing"/>
          </div>

          <div className="container">
            <h3 className="brand">But that's not all</h3>
            <p>Entire.Life also shows your whole unwritten future.</p>
          </div>
          <div className="centered">
            <img style={{width: 464}} src={require('./past-and-future.png')} alt="a row dark dots, fading out to the left, with This Week! The Present! in the middle, and then light dots after, fading out to the right"/>
          </div>
          <div className="container">
            <p>You can add plans to any future date. Once the date passes by, you can mark it as complete, snooze until next week, or forget about it forever.</p>
          </div>
          <div className="centered">
            <img style={{width: 320}} src={require('./expired-plan.png')} alt="a Finish Writing Book plan now in the past, with options to mark done, snooze, or delete"/>
          </div>
          <div className="container">
            <p>But you can even add farther-future events.</p>
          </div>
          <div className="centered">
            <img style={{width: 320}} src={require('./social-security.png')} alt="Entire.Life's week detail view showing a plan: Eligible For Social Security"/>
          </div>
          <div className="container">
            <p style={{marginBottom: 0}}>Just as reflecting on the past can give us a sense of gratitude, reflecting on the future can give us a sense of urgency. </p>
          </div>

          <p className="centered">
            <Link to="/signin" className="button">
              Claim my free life calendar now
            </Link>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <h3 className="brand">So let's look from farther away</h3>
          <p>Entire.Life doesn't just give you the present. It also gives you your entire past, back to the day you were born.</p>
        </div>
        <div className="centered">
          <img style={{width: 454}} src={require('./past-weeks.png')} alt="a row of dots, fading out to the left, with This Week! The Present! on the far right"/>
        </div>

        {this.renderExpanse()}
      </div>
    );
  }
}

@connect(
  state => ({
    saveError: state.auth.saveError,
    formKey: String(state.auth.user.id),
  }),
  {cache}
)
@reduxForm({
  form: 'tour',
  fields: ['slug', 'born'],
  validate: tourValidation,
},
state => ({
  initialValues: state.auth.user
}))
class BornForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,
    cache: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

  renderForm() {
    if (this.props.user.email) {
      return (
        <p>
          You can take a tour by clicking the "?" icon on&nbsp;
          <Link to={`/${this.props.user.slug}`}>your calendar page</Link>.
        </p>
      );
    }
    const { fields: {born}, formKey, handleSubmit, invalid,
      pristine, submitting, saveError: { [formKey]: saveError }, values } = this.props;
    return (
      <form role="form"
        onSubmit={handleSubmit(() => this.props.cache(values))}>
        <p>
          <label htmlFor="born">When were you born? This will be the first date on your calendar.</label>
          <input type="date" {...born}/>
          {born.error && born.touched &&
            <label htmlFor={born.name} className="errorText">{born.error}</label>}
        </p>
        <button type="submit" className="brand"
          disabled={pristine || invalid || submitting}>
          Start tour !
        </button>
        {saveError && <div className="errorText">{JSON.stringify(saveError)}</div>}
      </form>
    );
  }
  render() {
    return (
      <PageSection type="dark" className="container">
        <h2 className="brand" style={{paddingTop: 0}}>Take a Tour</h2>
        {this.renderForm()}
      </PageSection>
    );
  }
}

let Joyride;

@connect(
  state => {
    const user = state.auth.user;
    return {
      currentUser: user,
      user: state.users.data[user.slug],
      events: state.events.data[user.slug],
      isUserLoading: !!state.users.loading,
      isEventsLoading: !!state.events.loading,
      location: state.router.location,
    };
  }
)
class ShowTour extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    user: PropTypes.object,
    isUserLoading: PropTypes.bool.isRequired,
    isEventsLoading: PropTypes.bool.isRequired,
    events: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
  }

  state = {
    steps: [],
    showTour: false,
  }

  componentDidMount() {
    if (!this.props.user) {
      this.props.dispatch(loadUser(this.props.currentUser));
    }
    if (!this.props.events) {
      this.props.dispatch(loadEvents(this.props.currentUser));
    }

    // joyride calls 'window'; using componentDidMount to only render on client
    Joyride = require('react-joyride');
    this.setState({showTour: true}); // eslint-disable-line react/no-did-mount-set-state
  }

  startTour = (e) => {
    if (e) e.preventDefault();
    this.refs.joyride.reset();
    this.refs.joyride.start(true);
  }

  endTour = () => {
    this.props.dispatch(cache({tookTour: true}));
  }

  addSteps = (steps, start) => {
    let _steps = steps;
    if (!Array.isArray(_steps)) _steps = [_steps];
    if (!_steps.length) return false;

    // can't render on server; need to wait for componentDidMount
    const waitForLoaded = setInterval(() => {
      if (this.refs.joyride) {
        clearInterval(waitForLoaded);
        const {joyride} = this.refs;

        this.setState(currentState => {
          currentState.steps = currentState.steps.concat(joyride.parseSteps(_steps));
          return currentState;
        }, () => {
          if (start) joyride.start();
        });
      }
    }, 30);
  }

  renderJoyride() {
    if (this.state.showTour) {
      return (
        <Joyride ref="joyride" steps={this.state.steps} type="guided"
          locale={{back: 'Back', close: 'Close', last: 'Okay!', next: 'Next', skip: 'Skip'}}
          completeCallback={this.endTour} showSkipButton stepCallback={this.stepCallback}
        />
      );
    }
  }

  renderCalendar = () => {
    if (this.props.isUserLoading || this.props.isEventsLoading) {
      return (
        <p style={{clear: 'both', textAlign: 'center'}}>
          <img src={spinner} alt="loading..." width="100"/>
        </p>
      );
    }
    if (!this.props.user) {
      return <p className="containerWide">Aw, shucks. Something went wrong.</p>;
    }
    return (
      <Calendar addSteps={this.addSteps}
        startTour={this.startTour}
        showTour={!this.props.currentUser.tookTour}
        user={this.props.user}
      />
    );
  }

  render() {
    return (
      <PageSection type="white">
        {this.renderJoyride()}
        <div className="containerWide">
          <h2 className="brand">Your Life</h2>
        </div>
        {this.renderCalendar()}
      </PageSection>
    );
  }
}

@connect(
  state => ({currentUser: state.auth.user})
)
class Tour extends Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      born: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
  }

  render() {
    const {currentUser} = this.props;
    if (!currentUser.born || currentUser.email) {
      return <BornForm user={currentUser}/>;
    }
    return <ShowTour/>;
  }
}

export default class Home extends Component {
  render() {
    return (
      <div>
        <Landing>
          <div className="containerWide" style={{fontSize: '.9em'}}>
            <p>{config.app.description}</p>
          </div>
          <p style={{marginTop: 0}}>
            <Link to="/signin" className="button" style={{boxShadow: '-1px 1px 8px rgba(255,255,255,0.5)'}}>
              Claim my free life calendar now
            </Link>
          </p>
        </Landing>

        <PageSection type="sunset-blocked" className="container">
          <div>
            <h2 className="brand">The Forest &amp; The Branches</h2>
            <p>It's easy to get stuck in the monotonous slog of the present.</p>
            <p>It's easy to lose awareness, and to let each week slip by without thought.</p>
            <p>It's easy to stop being intentional about how we live our lives.</p>
            <p>Most likely, all the other websites and apps that you use today will only increase your tendency to lose context. They'll keep you focused on a view of the branches right around you.</p>
            <p>Entire.Life will lift you above it all, and show you a view of the whole forest. The whole, beautiful forest of your life.</p>
            <div className="centered">
              <Link to="/signin" className="button">
                Claim my free life calendar now
              </Link>
            </div>
          </div>
        </PageSection>

        <Tour/>

        <PageSection type="light">
          <div className="container">
            <div className="row verticallyCentered">
              <div className="col4">
                <img src={require('./plot-points.png')} className="circle" alt="section of a life calendar showing ages 20 to 30, with a kissy emoji and a bride emoji showing"/>
              </div>
              <div className="col8">
                <h2 className="brand">Track Meaning</h2>
                <p>
                  Your life tells a story. Use Entire.Life to track the plot
                  twists that have lead to where you are. You can add as little
                  or as much detail as you want—even using Entire.Life as a
                  journal!
                </p>
              </div>
            </div>
            <div className="row reverse verticallyCentered">
              <div className="col4">
                <img src={require('./pay-off-debt.png')} className="circle" alt="a goal to pay of student loans by a date that's now in the past, with buttons to mark complete, snooze, or delete it"/>
              </div>
              <div className="col8">
                <h2 className="brand">Plan Ahead</h2>
                <p>
                  Add plans for next week, next year, or even your hundredth
                  birthday! Once the date of a plan has passed by, you can mark
                  it as completed, snooze it until next week, or just forget
                  all about it.
                </p>
              </div>
            </div>
            <div className="row verticallyCentered">
              <div className="col4">
                <img src={require('./spoon.png')} alt="a spoon"/>
              </div>
              <div className="col8">
                <h2 className="brand">Stay Motivated</h2>
                <p>
                  If you had a diamond for each week of your life, the whole
                  lot of them would fill one spoonful. Entire.Life helps keep
                  you in a zoomed-out view of your life. It's natural to feel
                  some angst about that at first, but once we get past our fear
                  of being tiny, seeing our diamonds for how vanishing and
                  finite they are can help to motivate and free us.
                </p>
              </div>
            </div>
            <div className="centered" style={{marginTop: '1em'}}>
              <Link to="/signin" className="button">
                Claim my free life calendar now
              </Link>
            </div>
          </div>
        </PageSection>

        <PageSection type="dark">
          <div className="rounded-images">
            <div className="container">
              <h2 className="brand" id="how-it-works">How it works</h2>
              <p>Most websites and apps keep us focused on <em>right now</em>, or maybe <em>this week</em>:</p>
              <div className="centered">
                <img style={{width: 207}} src={require('./this-week-present.png')} alt="a gift, labelled This week! The present!"/>
              </div>
              <p>There's nothing wrong with the present! It's a great place to be. But without context, the present can start to feel sorta drab:</p>
              <div className="centered">
                <img style={{width: 198}} src={require('./this-week-drab.png')} alt="a plain white box, labelled This week, I guess..."/>
              </div>
              <p>That's because, no matter how awesome our lives look from far away, our actual day-in, day-out activities can often seem like a monotonous slog.</p>
            </div>

            <Details/>
          </div>
        </PageSection>
        <Footer/>
      </div>
    );
  }
}
