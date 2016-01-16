import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Week, Month, DetailContainer} from 'components';

const styles = require('./Year.scss');

@connect(
  state => {
    return {
      isMobile: state.winsize.isMobile,
    };
  }
)
export default class Calendar extends Component {
  static propTypes = {
    age: PropTypes.number,
    endAge: PropTypes.number,
    finalWeek: PropTypes.number,
    user: PropTypes.object.isRequired,
    weekno: PropTypes.string,
    monthno: PropTypes.string,
    oldWeekno: PropTypes.string,
    oldMonthno: PropTypes.string,
    detail: PropTypes.element,
    isMobile: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps) {
    return this.hasCurrent(nextProps) ||
      this.hadCurrent(nextProps) ||
      this.props.isMobile !== nextProps.isMobile;
  }

  months = () => {
    const {age} = this.props;
    const months = [];
    for (let i = 0; i < 13; i++) {
      const monthno = age * 13 + i;

      const selected = +this.props.monthno === monthno ||
        Math.floor(+this.props.weekno / 4) === monthno;
      months.push(
        <Month key={monthno} monthno={monthno}
          selected={selected} user={this.props.user}
        />
      );
    }
    return months;
  }

  weeksIn = () => {
    if (this.props.user.died && this.props.endAge === this.props.age) {
      return this.props.finalWeek % 52;
    }
    return 51;
  }

  weeks = () => {
    const {age} = this.props;
    const weeks = [];
    for (let i = 0; i <= this.weeksIn(); i++) {
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

  selectedAge = ({weekno, monthno}) => {
    if (!weekno && !monthno) return false;

    const {age} = this.props;

    if (weekno) return (weekno >= age * 52) && (weekno < (age + 1) * 52);

    return (monthno >= age * 13) && (monthno < (age + 1) * 13);
  }

  hasCurrent = (props = this.props) => {
    const {weekno, monthno} = props;
    return this.selectedAge({weekno, monthno});
  }

  hadCurrent = (props = this.props) => {
    const {oldWeekno, oldMonthno} = props;
    return this.selectedAge({weekno: oldWeekno, monthno: oldMonthno});
  }

  renderDetail = () => {
    if (!this.props.detail) return null;
    const {weekno, monthno, oldWeekno, oldMonthno} = this.props;
    const sameRow = this.hasCurrent() && this.hadCurrent();

    if (this.hasCurrent()) {
      return (
        <DetailContainer>
          {React.cloneElement(
            this.props.detail, {
              weekno: weekno ? +weekno : undefined,
              monthno: monthno ? +monthno : undefined,
            })}
        </DetailContainer>
      );
    } else if (this.hadCurrent() && !sameRow) {
      return (
        <DetailContainer old>
          {React.cloneElement(
            this.props.detail, {
              weekno: oldWeekno ? +oldWeekno : undefined,
              monthno: oldMonthno ? +oldMonthno : undefined,
            })}
        </DetailContainer>
      );
    }
  }

  renderDots = () => {
    if (this.props.isMobile) return this.months();
    return this.weeks();
  }

  render() {
    const {age} = this.props;
    return (
      <div className="year-wrap">
        <div className={[
          'containerWide',
          styles.year,
          this.props.isMobile || styles.inWeeks
        ].join(' ')}>
          <small className={styles.age}>{!(age % 5) ? age : null }</small>
          {this.renderDots()}
        </div>
        {this.renderDetail()}
      </div>
    );
  }
}
