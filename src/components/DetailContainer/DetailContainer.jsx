import React from 'react';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter(require('./DetailContainer.scss'));

const scrollTimers = [];

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
    this.scrollToTop();
  }

  scrollToTop() {
    if (this.props.old) return;
    if (scrollTimers[0]) clearTimeout(scrollTimers[0]);

    scrollTimers.push(
      setTimeout(() => this.scrollTo(this.refs.top.offsetTop - 115), 100)
    );
  }

  scrollTo(to) {
    if (this.alreadyVisible()) return;

    window.scroll(0, to);
  }

  alreadyVisible() {
    return this.refs.top.offsetTop > document.body.scrollTop &&
      this.refs.top.offsetTop < document.body.scrollTop + window.innerHeight;
  }

  animate() {
    const height = this.refs.container.offsetHeight;
    this.setState({height}, () => {
      if (this.props.old) {
        this.setState({height: 0});
      }
    });
  }

  render() {
    const inlineStyles = {
      height: this.state.height,
      transition: 'height 500ms ease',
      overflow: 'hidden',
    };
    return (
      <div className={styles.local.container} style={inlineStyles} ref="top">
        {React.cloneElement(this.props.children, {ref: 'container'})}
      </div>
    );
  }
}
