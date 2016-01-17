import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {Events} from 'components';
import {startOf, endOf, eventsForMonth, shortDate} from 'helpers/dateHelpers';
const styles = require('../WeekDetail/WeekDetail.scss');

@connect(
  (state, ownProps) => {
    const slug = state.router.params.slug;
    const user = state.users.data[slug] || {};
    const monthno = ownProps.monthno || ownProps.weekno * 4;
    return {
      currentUser: state.auth.user,
      canEdit: !!(slug && slug === state.auth.user.slug),
      user,
      events: slug
        ? eventsForMonth(state.events.data[slug], ownProps.monthno)
        : [],
      editEventId: state.router.params.id,
      start: user && user.born && startOf({weekno: monthno * 4, born: user.born}),
      end: user && user.born && endOf({weekno: monthno * 4 + 3, born: user.born}),
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
    monthno: PropTypes.number,
    children: PropTypes.node,
    start: PropTypes.object,
    end: PropTypes.object,
  }

  whose = () => {
    if (this.props.canEdit) return 'your';
    return `${this.props.user.name.split(' ')[0]}'s`;
  }

  monthTitle = () => {
    let monthTitle = '';
    if (this.props.monthno) {
      monthTitle += `Month ${this.props.monthno} `;
      if (this.props.events && this.props.events[0]) {
        monthTitle += `⟡ ${this.props.events[0].title} `;
      }
      monthTitle += '⟡ ';
    }
    return monthTitle;
  }

  render() {
    if (!this.props.user.slug) return null;

    const title = `${this.monthTitle()}${this.props.user.name} ⟡ a life `;
    return (
      <div>
        <DocumentMeta {...metaData(title)} extend />
        <header>
          <Link to={`/${this.props.user.slug}`} className="pullRight closeLink">
            &times;
          </Link>
          <h2 className="brand">{shortDate(this.props.start)} &ndash; {shortDate(this.props.end)} </h2>
          <nobr className={styles.age}>{`${Math.floor(this.props.monthno / 13)} years old`}</nobr>
        </header>
        <div className={this.props.canEdit ? styles.twoCol : ''}>
          <div>
            <h3>This month in {this.whose()} life:</h3>
            <Events events={this.props.events} born={this.props.user.born}
              slug={this.props.user.slug} monthno={this.props.monthno}
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
