import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {Events} from 'components';
import {startOf, eventsForMonth} from 'helpers/dateHelpers';
const styles = require('../WeekDetail/WeekDetail.scss');

@connect(
  (state, ownProps) => {
    const slug = state.router.params.slug;
    return {
      currentUser: state.auth.user,
      canEdit: !!(slug && slug === state.auth.user.slug),
      user: state.users.data[slug] || {},
      events: slug
        ? eventsForMonth(state.events.data[slug], ownProps.monthno)
        : [],
      editEventId: state.router.params.id,
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
  }

  whose = () => {
    if (this.props.canEdit) return 'your';
    return `${this.props.user.name.split(' ')[0]}'s`;
  }

  start = () => {
    return startOf({weekno: +this.props.monthno * 4, born: this.props.user.born});
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
          <h2 className="brand">Month of {this.start().toDateString()}</h2>
          <span className={styles.age}>{`${Math.floor(+this.props.monthno / 13)} years old`}</span>
          <Link to={`/${this.props.user.slug}`} className="pullRight closeLink">
            &times;
          </Link>
        </header>
        <div className={this.props.canEdit ? styles.twoCol : ''}>
          <div>
            <h3>This month in {this.whose()} life:</h3>
            <Events events={this.props.events} born={this.props.user.born}
              slug={this.props.user.slug} monthno={+this.props.monthno}
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
