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
  (state, ownProps) => {
    return {
      currentUser: state.auth.user,
      canEdit: !!(state.auth.user.slug && state.auth.user.slug === state.router.params.slug),
      user: state.users.data[state.router.params.slug] || {},
      events: state.router.params.slug
        ? state.events.data[state.router.params.slug]['' + ownProps.weekno]
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
    weekno: PropTypes.number,
    children: PropTypes.node,
  }

  whose = () => {
    if (this.props.canEdit) return 'your';
    return `${this.props.user.name.split(' ')[0]}'s`;
  }

  start = () => {
    return startOf({weekno: +this.props.weekno, born: this.props.user.born});
  }

  weekTitle = () => {
    let weekTitle = '';
    if (this.props.weekno) {
      weekTitle += `Week ${this.props.weekno} `;
      if (this.props.events) weekTitle += `⟡ ${this.props.events[0].title} `;
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
          <h2 className={styles.global.brand}>Week of {this.start().toDateString()}</h2>
          <span className={styles.local.age}>{`${Math.floor(+this.props.weekno / 52)} years old`}</span>
          <Link to={`/${this.props.user.slug}`} className={[styles.g.pullRight, styles.g.closeLink].join(' ')}>
            &times;
          </Link>
        </header>
        <div className={this.props.canEdit ? styles.local.twoCol : ''}>
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
