import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {Events} from 'components';
import {startOf, endOf, shortDate} from 'helpers/dateHelpers';
const styles = require('./WeekDetail.scss');

@connect(
  (state, ownProps) => {
    const user = state.users.data[state.router.params.slug] || {};
    const weekno = ownProps.weekno || Math.floor(ownProps.monthno / 4);
    const slug = state.router.params.slug;
    return {
      currentUser: state.auth.user,
      canEdit: !!(state.auth.user.slug && state.auth.user.slug === slug),
      user,
      events: slug
        ? state.events.data[slug] && state.events.data[slug].events['' + ownProps.weekno]
        : [],
      editEventId: state.router.params.id,
      start: user && user.born && startOf({weekno: weekno, born: user.born}),
      end: user && user.born && endOf({weekno: weekno, born: user.born}),
    };
  },
  {pushState}
)
export default class WeekDetail extends Component {

  static propTypes = {
    currentUser: PropTypes.object,
    canEdit: PropTypes.bool,
    user: PropTypes.object.isRequired,
    events: PropTypes.array,
    editEventId: PropTypes.string,
    pushState: PropTypes.func.isRequired,
    weekno: PropTypes.number,
    children: PropTypes.node,
    start: PropTypes.object,
    end: PropTypes.object,
  }

  whose = () => {
    if (this.props.canEdit) return 'your';
    return `${this.props.user.name.split(' ')[0]}'s`;
  }

  weekTitle = () => {
    let weekTitle = '';
    if (this.props.weekno) {
      weekTitle += `Week ${this.props.weekno} `;
      if (this.props.events && this.props.events[0]) {
        weekTitle += `⟡ ${this.props.events[0].title} `;
      }
      weekTitle += '⟡ ';
    }
    return weekTitle;
  }

  render() {
    if (!this.props.user.slug) return null;

    const title = `${this.weekTitle()}${this.props.user.name} ⟡ a life `;
    return (
      <div>
        <DocumentMeta {...metaData(title)} extend />
        <header>
          <Link to={`/${this.props.user.slug}`} className="pullRight closeLink">
            &times;
          </Link>
          <h2 className="brand">{shortDate(this.props.start)} &ndash; {shortDate(this.props.end)}</h2>
          <nobr className={styles.age}>{`${Math.floor(this.props.weekno / 52)} years old`}</nobr>
        </header>
        <div className={this.props.canEdit ? styles.twoCol : ''}>
          <div>
            <h3>This week in {this.whose()} life:</h3>
            <Events events={this.props.events} born={this.props.user.born}
              slug={this.props.user.slug} weekno={+this.props.weekno}
              canEdit={this.props.canEdit} editEventId={this.props.editEventId}
            />
          </div>
          <div>
            {this.props.canEdit && this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
