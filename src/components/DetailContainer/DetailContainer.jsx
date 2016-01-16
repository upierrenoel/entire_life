import React from 'react';
const styles = require('./DetailContainer.scss');

const animationSpeed = 300;

export default class DetailContainer extends React.Component {
  static propTypes = {
    old: React.PropTypes.bool,
    children: React.PropTypes.element.isRequired,
  }

  static defaultProps = {
    old: false,
  }

  state = {
    animate: false,
    height: this.props.old ? 'auto' : 0,
  }

  componentDidMount() {
    this.animate();
  }

  componentWillReceiveProps() {
    this.setState({animate: true});
  }

  componentDidUpdate() {
    if (this.state.animate) {
      this.animate();
      this.setState({animate: false}); // eslint-disable-line react/no-did-update-set-state
    }
    if (!this.props.old) this.scrollToTop();
  }

  scrollToTop() {
    setTimeout(() => {
      this.scrollTo(this.refs.top.offsetTop - 115);
    }, animationSpeed);
  }

  scrollTo(to) {
    if (this.alreadyVisible()) return;

    window.scroll(0, to);
  }

  alreadyVisible() {
    return this.refs.top.offsetTop > window.pageYOffset &&
      this.refs.top.offsetTop < window.pageYOffset + window.innerHeight;
  }

  animate() {
    if (!this.refs.container) return;
    const height = this.refs.container.offsetHeight;
    this.setState({height}, () => {
      if (this.props.old) {
        setTimeout(() => { // wait for hard-coded height to be actually set, then animate shrink
          this.setState({height: 0});
        }, 1);
      } else {
        setTimeout(() => {
          this.setState({height: 'auto'});
        }, animationSpeed);
      }
    });
  }

  render() {
    const inlineStyles = {
      height: this.state.height,
      transition: `height ${animationSpeed}ms ease`,
      overflow: 'hidden',
    };
    return (
      <div ref="top" className={styles.container} style={inlineStyles}>
        <div ref="container" className={['containerWide', styles.inner].join(' ')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
