import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {Events} from 'components';
import {startOf} from 'helpers/dateHelpers';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter(require('./WeekDetail.scss'));

@connect(
  state => {
    return {
      user: state.users.data[state.router.params.slug] || {},
      events: state.router.params.slug
        ? state.events.data[state.router.params.slug][state.router.params.weekno]
        : [],
      weekno: state.router.params.weekno,
    };
  },
  {pushState}
)
export default class WeekDetail extends Component {

  static propTypes = {
    // signedInUser: PropTypes.object,
    user: PropTypes.object.isRequired,
    events: PropTypes.array,
    pushState: PropTypes.func.isRequired,
    weekno: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.weekno !== nextProps.weekno || // navigated to different week
      this.props.user.slug !== nextProps.user.slug || // navigated to different user (not sure if possible)
      this.props.events !== nextProps.events;// || // updated an event
      // (!this.props.signedInUser && nextProps.signedInUser) || // user logged in
      // (this.props.signedInUser && !nextProps.signedInUser) || // user logged out
  }

  authed = () => {
    return false;
    // return LoginStore.canEdit(UserStore.getState().get('user'));
  }

  editEvent = (event) => {
    console.log('FIXME: WeekDetail#editEvent needs to dispatch an action', event);
    // this.setState({eventUnderEdit: event});
  }

  whose = () => {
    if (this.authed()) return 'your';
    return `${this.props.user.name.split(' ')[0]}'s`;
  }

  // form = () => {
  //   if(this.authed()) {
  //     return <EventForm weekno={+this.props.weekno} start={this.start()}
  //       slug={this.props.slug} eventUnderEdit={this.state.eventUnderEdit}
  //     />
  //   }
  // }

  start = () => {
    return startOf({weekno: +this.props.weekno, born: this.props.user.born});
  }

  weekTitle = () => {
    let weekTitle = '';
    if (this.props.weekno) {
      weekTitle += `Week ${this.props.weekno} `;
      if (this.props.events) weekTitle += `⟡ ${this.props.events[0].title}`;
      weekTitle += '⟡ ';
    }
    return weekTitle;
  }

  render() {
    if (!this.props.weekno) return null;

    const title = `${this.weekTitle()}${this.props.user.name} ⟡ a life `;
    return (
      <div ref="container" className={[styles.global.containerWide, styles.local.container].join(' ')}>
        <DocumentMeta {...metaData(title)} extend />
        <header>
          <h2 className={styles.global.brand}>Week of {this.start().toDateString()}</h2>
          <span className={styles.local.age}>{`${Math.floor(+this.props.weekno / 52)} years old`}</span>
          <Link to={`/${this.props.user.slug}`} className={[styles.global.pullRight, styles.local.closeLink].join(' ')}>
            &times;
          </Link>
        </header>
        <div className={this.authed() ? styles.local.twoCol : ''}>
          <div>
            <h3>This week in {this.whose()} life:</h3>
            <Events events={this.props.events} born={this.props.user.born}
              slug={this.props.user.slug} weekno={+this.props.weekno}
              authed={this.authed()} onEdit={this.editEvent}
            />
          </div>
          <div>
            {/* {this.form()} */}
          </div>
        </div>
      </div>
    );
  }
}
