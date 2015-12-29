const LOAD = 'entire-life/user/LOAD';
const LOAD_SUCCESS = 'entire-life/user/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/user/LOAD_FAIL';
const EDIT_START = 'entire-life/user/EDIT_START';
const EDIT_STOP = 'entire-life/user/EDIT_STOP';
const SAVE = 'entire-life/user/SAVE';
const SAVE_SUCCESS = 'entire-life/user/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/user/SAVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
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
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
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
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
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

export function isLoaded(globalState) {
  return globalState.user && globalState.user.loaded;
}

export function load(userSlug) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/users/${userSlug}`)
  };
}

export function save(user) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: user.id,
    promise: (client) => client.post(`/users/${user.id}`, {
      data: user
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
