import React from 'react';
import {Week} from 'components';
// import DetailContainer from './DetailContainer';
// import IsMobileStore from '../stores/IsMobileStore';
// import connectToStores from 'alt/utils/connectToStores';
// import Immutable from 'immutable';
// import tourSteps from '../lib/tourSteps';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter(require('./Calendar.scss'));

export default class Calendar extends React.Component {
  static propTypes = {
    events: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    addSteps: React.PropTypes.func,
    showTour: React.PropTypes.bool,
    weekno: React.PropTypes.string,
    monthno: React.PropTypes.string,
    detail: React.PropTypes.element,
  }

  state = {
    oldWeekno: null,
    oldMonthno: null,
  }

  // componentDidMount() {
  //   this.props.addSteps(tourSteps)
  //   if (this.props.showTour) setTimeout(this.props.startTour, 100)
  // }

  componentWillReceiveProps(newProps) {
    const oldWeekno = this.props.weekno;
    const oldMonthno = this.props.monthno;
    if (oldWeekno && newProps.weekno !== oldWeekno) {
      this.setState({oldWeekno: oldWeekno});
    }
    if (oldMonthno && newProps.monthno !== oldMonthno) {
      this.setState({oldMonthno: oldMonthno});
    }
  }

  // monthsFor = ({age, events}) => {
  //   let months = [];
  //   for(var i = 0; i < 13; i++) {
  //     const monthno = age * 13 + i;
  //
  //     const selected = +this.props.monthno === monthno ||
  //       Math.floor(+this.props.weekno/4) === monthno;
  //     months.push(
  //       <Month key={monthno} monthno={monthno}
  //         events={EventStore.eventsForMonth(monthno)}
  //         selected={selected}
  //       />
  //     )
  //   }
  //   return months;
  // }

  weeksIn = (age) => {
    if (this.props.user.died && this.endAge() === age) {
      return this.finalWeek() % 52;
    }
    return 51;
  }

  weeksFor = ({age, events}) => {
    const weeks = [];
    for (let i = 0; i <= this.weeksIn(age); i++) {
      const weekno = age * 52 + i;
      const selected = +this.props.weekno === weekno ||
        +this.props.monthno * 4 === weekno;
      weeks.push(
        <Week key={weekno} weekno={weekno} events={events['' + weekno]}
          selected={selected} user={this.props.user}
        />
      );
    }
    return weeks;
  }

  selectedAge = ({age, weekno, monthno}) => {
    if (!weekno && !monthno) return false;

    if (weekno) return (weekno >= age * 52) && (weekno < (age + 1) * 52);

    return (monthno >= age * 13) && (monthno < (age + 1) * 13);
  }

  // renderDetail(age) {
  //   if (!this.props.detail) return null;
  //
  //   const hasCurrent = this.selectedAge({age, weekno: this.props.weekno, monthno: this.props.monthno});
  //   const hadCurrent = this.selectedAge({age, weekno: this.state.oldWeekno, monthno: this.state.oldMonthno});
  //   const sameRow = hasCurrent && hadCurrent;
  //
  //   if (hasCurrent) {
  //     return <DetailContainer>
  //       {React.cloneElement(
  //         this.props.detail, { params: {
  //           slug: this.props.slug,
  //           weekno: this.props.weekno,
  //           monthno: this.props.monthno,
  //       }})}
  //     </DetailContainer>
  //   } else if (hadCurrent && !sameRow) {
  //     return <DetailContainer old={true}>
  //       {React.cloneElement(
  //         this.props.detail, { params: {
  //           slug: this.props.slug,
  //           weekno: this.state.oldWeekno,
  //           monthno: this.state.oldMonthno,
  //       }})}
  //     </DetailContainer>
  //   }
  // }

  year = (age, events) => {
    return (
      <div key={age} className={styles.local.yearWrap}>
        <div className={[
          styles.global.containerWide,
          styles.local.year,
          // !this.props.isMobile ? styles.local.inWeeks : null
        ].join(' ')}>
          <small className={styles.local.age}>{!(age % 5) && age !== 100 ? age : null }</small>
          {this.renderDots({age, events})}
        </div>
        {/* {this.renderDetail(age)} */}
      </div>
    );
  }

  finalWeek = () => {
    const eventWeeks = Object.keys(this.props.events).map(v => +v);
    return eventWeeks.sort()[eventWeeks.length - 1];
  }

  endAge = () => {
    if (this.props.user.died) return Math.floor(this.finalWeek() / 52);
    return 101;
  }

  renderDots = ({age, events}) => {
    // if (this.props.isMobile) return this.monthsFor({age, events})
    return this.weeksFor({age, events});
  }

  render() {
    const years = [];
    for (let i = 0; i <= this.endAge(); i++) {
      years.push(this.year(i, this.props.events));
    }
    return (
      <div className={styles.local.calendar}>
        {years}
      </div>
    );
  }
}
