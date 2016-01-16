const SIZE_CHANGED = 'entire-life/winsize/SIZE_CHANGED';

const initialState = {
  isMobile: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIZE_CHANGED:
      return {
        ...state,
        isMobile: action.isMobile,
      };
    default:
      return state;
  }
}

function isMobile() {
  return window.innerWidth < 700;
}

export function resize() {
  return {
    type: SIZE_CHANGED,
    isMobile: isMobile(),
  };
}
