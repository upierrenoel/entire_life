import React from 'react';
const styles = require('./DetailContainer.scss');

const animationSpeed = 300;
const transition = `height ${animationSpeed}ms ease`;

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
    styles: { transition },
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
      if (this.refs.top) this.scrollTo(this.refs.top.offsetTop - 115);
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
          this.setState({styles: {transition: 'none'}, height: 'auto'});
          setTimeout(() => {
            this.setState({styles: {transition}});
          }, animationSpeed);
        }, animationSpeed);
      }
    });
  }

  render() {
    const inlineStyles = {
      ...this.state.styles,
      height: this.state.height,
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
