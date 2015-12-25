import React, { Component } from 'react';
import { Link } from 'react-router';
import { Nav, Logo, PageSection, Footer } from 'components';
import config from '../../config';
import styleImporter from 'helpers/styleImporter';

const styles = styleImporter(require('./Home.scss'));

class Details extends React.Component {
  state = {
    expanded: false,
    height: 400,
  }

  expand(e) {
    e.preventDefault();
    this.setState({expanded: true, height: this.refs.container.offsetHeight});
  }

  renderExpanse() {
    const expandButton = (
      <div style={{position: 'absolute', bottom: 0, height: 400, width: '100%', background: 'linear-gradient(transparent, #20221F)'}}>
        <div className={styles.global.centered} style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <a href="#" onClick={this.expand} className={styles.global.button}>
            read more...
          </a>
        </div>
      </div>
    );

    return (
      <div style={{position: 'relative', overflow: 'hidden', height: this.state.height, transition: 'height 500ms ease'}} >
        <div ref="container" style={{padding: '1em 0'}}>
          {this.state.expanded ? null : expandButton}
          <div className={styles.global.container}>
            <p style={{marginTop: 0}}>And instead of just adding thoughts and events about the present, you can add events for any of your past weeks.</p>
          </div>
          <div className={styles.global.centered}>
            <img style={{width: 320}} src={require('./event-add-example.png')} alt="Entire.Life event creation form, with the event Made My First Sale being added"/>
          </div>
          <div className={styles.global.container}>
            <p>With all of that historic context, the present can start to feel like a gift again. We can remember how hard we worked to get where we're at, and spot plot arcs and foreshadowing that give us a sense of purpose.</p>
          </div>
          <div className={styles.global.centered}>
            <img style={{width: 320}} src={require('./past-calendar-example.png')} alt="Entire.Life calendar filled in, with different romantic events showing"/>
          </div>

          <div className={styles.global.container}>
            <h3 className={styles.global.brand}>But that's not all</h3>
            <p>Entire.Life also shows your whole unwritten future.</p>
          </div>
          <div className={styles.global.centered}>
            <img style={{width: 464}} src={require('./past-and-future.png')} alt="a row dark dots, fading out to the left, with This Week! The Present! in the middle, and then light dots after, fading out to the right"/>
          </div>
          <div className={styles.global.container}>
            <p>You can add plans to any future date. Once the date passes by, you can mark it as complete, snooze until next week, or forget about it forever.</p>
          </div>
          <div className={styles.global.centered}>
            <img style={{width: 320}} src={require('./expired-plan.png')} alt="a Finish Writing Book plan now in the past, with options to mark done, snooze, or delete"/>
          </div>
          <div className={styles.global.container}>
            <p>But you can even add farther-future events.</p>
          </div>
          <div className={styles.global.centered}>
            <img style={{width: 320}} src={require('./social-security.png')} alt="Entire.Life's week detail view showing a plan: Eligible For Social Security"/>
          </div>
          <div className={styles.global.container}>
            <p style={{marginBottom: 0}}>Just as reflecting on the past can give us a sense of gratitude, reflecting on the future can give us a sense of urgency. </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.global.container}>
          <h3 className={styles.global.brand}>So let's look from farther away</h3>
          <p>Entire.Life doesn't just give you the present. It also gives you your entire past, back to the day you were born.</p>
        </div>
        <div className={styles.global.centered}>
          <img style={{width: 454}} src={require('./past-weeks.png')} alt="a row of dots, fading out to the left, with This Week! The Present! on the far right"/>
        </div>

        {this.renderExpanse()}
      </div>
    );
  }
}

export default class Home extends Component {
  render() {
    return (
      <div>
        <PageSection type="sunset" style={{textAlign: 'center'}}>
          <Nav>
            <Logo type="white" style={{float: 'left'}}/>
          </Nav>
          <h1 className={styles.global.container}>
            <div className={styles.global.brand}>Plan. Remember.</div>
            <div style={{fontSize: '.8em'}}>Live a Meaningful Life.</div>
          </h1>
          <div className={styles.global.containerWide} style={{fontSize: '.9em'}}>
            <p>{config.app.description}</p>
          </div>
          <p style={{marginTop: 0}}>
            <Link to="/signin" className={styles.global.button} style={{boxShadow: '-1px 1px 8px rgba(255,255,255,0.5)'}}>
              Claim my free life calendar now
            </Link>
          </p>
          <div className={styles.local.screenshots}>
            <img src={require('./screenshots.png')} alt="Entire.Life works on all devices"/>
          </div>
        </PageSection>

        <PageSection type="light">
          <div className={styles.global.container}>
            <div className={styles.global.row + ' ' + styles.global.verticallyCentered}>
              <div className={styles.global.col4}>
                <img src={require('./plot-points.png')} className={styles.global.circle} alt="section of a life calendar showing ages 20 to 30, with a kissy emoji and a bride emoji showing"/>
              </div>
              <div className={styles.global.col8}>
                <h2 className={styles.global.brand}>Track Meaning</h2>
                <p>
                  Your life tells a story. Use Entire.Life to track the plot
                  twists that have lead to where you are. You can add as little
                  or as much detail as you want—even using Entire.Life as a
                  journal!
                </p>
              </div>
            </div>
            <div className={`${styles.global.row} ${styles.global.reverse} ${styles.global.verticallyCentered}`}>
              <div className={styles.global.col4}>
                <img src={require('./pay-off-debt.png')} className={styles.global.circle} alt="a goal to pay of student loans by a date that's now in the past, with buttons to mark complete, snooze, or delete it"/>
              </div>
              <div className={styles.global.col8}>
                <h2 className={styles.global.brand}>Plan Ahead</h2>
                <p>
                  Add plans for next week, next year, or even your hundredth
                  birthday! Once the date of a plan has passed by, you can mark
                  it as completed, snooze it until next week, or just forget
                  all about it.
                </p>
              </div>
            </div>
            <div className={`${styles.global.row} ${styles.global.verticallyCentered}`}>
              <div className={styles.global.col4}>
                <img src={require('./spoon.png')} alt="a spoon"/>
              </div>
              <div className={styles.global.col8}>
                <h2 className={styles.global.brand}>Stay Motivated</h2>
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
          </div>
        </PageSection>
        <PageSection type="dark">
          <div className="rounded-images">
            <div className={styles.global.container}>
              <h2 className={styles.global.brand} id="how-it-works">How it works</h2>
              <p>Most websites and apps keep us focused on <em>right now</em>, or maybe <em>this week</em>:</p>
              <div className={styles.global.centered}>
                <img style={{width: 207}} src={require('./this-week-present.png')} alt="a gift, labelled This week! The present!"/>
              </div>
              <p>There's nothing wrong with the present! It's a great place to be. But without context, the present can start to feel sorta drab:</p>
              <div className={styles.global.centered}>
                <img style={{width: 198}} src={require('./this-week-drab.png')} alt="a plain white box, labelled This week, I guess..."/>
              </div>
              <p>That's because, no matter how awesome our lives look from far away, our actual day-in, day-out activities can often seem like a monotonous slog.</p>
            </div>

            <Details/>
          </div>
        </PageSection>

        <PageSection type="sunset">
          <div className={styles.global.container} style={{display: 'flex', minHeight: '100vh', justifyContent: 'space-around', flexDirection: 'column'}}>
            <div className="bg-tint">
              <h2 className={styles.global.brand}>The Forest &amp; The Branches</h2>
              <p>It's easy to get stuck in the monotonous slog of the present.</p>
              <p>It's easy to lose awareness, and to let each week slip by without thought.</p>
              <p>It's easy to stop being intentional about how we live our lives.</p>
              <p>Most likely, all the other websites and apps that you use today will only increase your tendency to lose context. They'll keep you focused on a view of the branches right around you.</p>
              <p>Entire.Life will lift you above it all, and show you a view of the whole forest. The whole, beautiful forest of your life.</p>
              <p className={styles.global.centered}>
                <Link to="/signin" className={styles.global.button} style={{boxShadow: '-1px 1px 8px rgba(255,255,255,0.5)'}}>
                  Claim my free life calendar now
                </Link>
              </p>
            </div>
          </div>
        </PageSection>

        <PageSection type="dark">
          <div className={styles.global.container}>
            <h2 className={styles.global.brand}>Hall of Fame</h2>
            <p>People we celebrate. Click through to see their life calendars.</p>
          </div>
          <div className={`${styles.global.containerWide} ${styles.global.smaller}`}>
            <div className={styles.global.row}>
              <div className={styles.global.col6}>
                <div className={`${styles.global.row} ${styles.global.verticallyCentered}`}>
                  <div className={styles.global.col4}>
                    <Link to="/bessie-coleman">
                      <img className={styles.global.circle} src={require('./bessie-coleman.jpg')} alt="photo of Bessie Coleman as a young woman in aviator garb"/>
                    </Link>
                  </div>
                  <div className={styles.global.col8}>
                    <h3 className={styles.global.brand}>Bessie Coleman</h3>
                    <p>Black daredevil aviatrix. When no one in racist America would teach her to fly, this badass went to flight school in France. Never got to start her own flight school.</p>
                    <Link to="/bessie-coleman" className={styles.global.button}>View her Entire.Life</Link>
                  </div>
                </div>
              </div>
              <div className={styles.global.col6}>
                <div className={`${styles.global.row} ${styles.global.verticallyCentered}`}>
                  <div className={styles.global.col4}>
                    <Link to="/bayard-rustin">
                      <img className={styles.global.circle} src={require('./bayard-rustin.jpg')} alt="photo of Bessie Coleman as a young woman in aviator garb"/>
                    </Link>
                  </div>
                  <div className={styles.global.col8}>
                    <h3 className={styles.global.brand}>Bayard Rustin</h3>
                    <p>A voice behind many of the voices of the American Civil Rights movement. Organizer of the 1963 March on Washington for Jobs and Freedom. American hero.</p>
                    <Link to="/bayard-rustin" className={styles.global.button}>View his Entire.Life</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageSection>
        <Footer/>
      </div>
    );
  }
}
