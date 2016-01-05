import React from 'react';
import {connect} from 'react-redux';
import {Week, DetailContainer} from 'components';
// import IsMobileStore from '../stores/IsMobileStore';
// import tourSteps from '../lib/tourSteps';
// import shallowEqual from 'helpers/shallowEqual';
import styleImporter from 'helpers/styleImporter';

const styles = styleImporter(require('./Calendar.scss'));

@connect(
  state => {
    const events = state.events.data[state.router.params.slug];
    const eventWeeks = Object.keys(events).map(v => +v);
    return {
      finalWeek: eventWeeks.sort((a, b) => a - b)[eventWeeks.length - 1],
    };
  }
)
export default class Calendar extends React.Component {
  static propTypes = {
    finalWeek: React.PropTypes.number.isRequired,
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

  shouldComponentUpdate(nextProps) {
    return this.props.weekno !== nextProps.weekno ||
      this.props.monthno !== nextProps.monthno;// ||
      // !shallowEqual(this.props.user, nextProps.user);
  }

  // monthsFor = ({age}) => {
  //   let months = [];
  //   for(var i = 0; i < 13; i++) {
  //     const monthno = age * 13 + i;
  //
  //     const selected = +this.props.monthno === monthno ||
  //       Math.floor(+this.props.weekno/4) === monthno;
  //     months.push(
  //       <Month key={monthno} monthno={monthno}
  //         selected={selected}
  //       />
  //     )
  //   }
  //   return months;
  // }

  weeksIn = (age) => {
    if (this.props.user.died && this.endAge() === age) {
      return this.props.finalWeek % 52;
    }
    return 51;
  }

  weeksFor = ({age}) => {
    const weeks = [];
    for (let i = 0; i <= this.weeksIn(age); i++) {
      const weekno = age * 52 + i;
      const selected = +this.props.weekno === weekno ||
        +this.props.monthno * 4 === weekno;
      weeks.push(
        <Week key={weekno} weekno={weekno}
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

  year = (age) => {
    return (
      <div key={age} className="year-wrap">
        <div className={[
          styles.global.containerWide,
          styles.local.year,
          styles.local.inWeeks,
          // !this.props.isMobile ? styles.local.inWeeks : null
        ].join(' ')}>
          <small className={styles.local.age}>{!(age % 5) && age !== 100 ? age : null }</small>
          {this.renderDots({age})}
        </div>
        {this.renderDetail(age)}
      </div>
    );
  }

  endAge = () => {
    if (this.props.user.died) return Math.floor(this.props.finalWeek / 52);
    return 101;
  }

  renderDetail = (age) => {
    if (!this.props.detail) return null;

    const hasCurrent = this.selectedAge({age, weekno: this.props.weekno, monthno: this.props.monthno});
    const hadCurrent = this.selectedAge({age, weekno: this.state.oldWeekno, monthno: this.state.oldMonthno});
    const sameRow = hasCurrent && hadCurrent;

    if (hasCurrent) {
      return <DetailContainer>{this.renderDetailInner()}</DetailContainer>;
    } else if (hadCurrent && !sameRow) {
      return <DetailContainer old>{this.renderDetailInner()}</DetailContainer>;
    }
  }

  renderDetailInner = () => {
    return (
      React.cloneElement(
        this.props.detail, { params: {
          slug: this.props.user.slug,
          weekno: this.state.oldWeekno,
          monthno: this.state.oldMonthno,
        }})
    );
  }

  renderDots = ({age}) => {
    // if (this.props.isMobile) return this.monthsFor({age})
    return this.weeksFor({age});
  }

  render() {
    const years = [];
    for (let i = 0; i <= this.endAge(); i++) {
      years.push(this.year(i));
    }
    return (
      <div className={styles.local.calendar}>
        {years}
      </div>
    );
  }
}
