const LOAD = 'entire-life/users/LOAD';
const LOAD_SUCCESS = 'entire-life/users/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/users/LOAD_FAIL';

const initialState = {
  data: {},
  editing: {},
  saveError: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.slug]: action.result.user
        },
        error: {
          ...state.error,
          [action.slug]: null
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.slug]: null,
        },
        error: {
          ...state.error,
          [action.slug]: action.error
        }
      };
    default:
      return state;
  }
}

export function isLoaded(globalState, slug) {
  return globalState.users && globalState.users.data[slug];
}

export function load(userSlug) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    slug: userSlug,
    promise: (client) => client.get(`/users/${userSlug}`)
  };
}
