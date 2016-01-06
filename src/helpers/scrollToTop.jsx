import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';

/*
  This decorator scrolls to the top of the component after it mounts.
  This is a "good enough" solution to scroll position woes.
*/

export default function scrollToTop() {
  return function wrapWithScrollToTop(WrappedComponent) {
    class ScrollToTop extends Component {
      componentDidMount() {
        window.scroll(0, 0);
      }
      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    return hoistStatics(ScrollToTop, WrappedComponent);
  };
}
