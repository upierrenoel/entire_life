const LOAD = 'entire-life/users/LOAD';
const LOAD_SUCCESS = 'entire-life/users/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/users/LOAD_FAIL';
const EDIT_START = 'entire-life/users/EDIT_START';
const EDIT_STOP = 'entire-life/users/EDIT_STOP';
const SAVE = 'entire-life/users/SAVE';
const SAVE_SUCCESS = 'entire-life/users/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/users/SAVE_FAIL';

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
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.slug]: null, // user's slug may have changed
          [action.result.user.slug]: action.result.user
        },
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
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

export function save(user) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: user.id,
    slug: user.slug,
    promise: (client) => client.patch(`/users/${user.id}`, {
      data: {user}
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
