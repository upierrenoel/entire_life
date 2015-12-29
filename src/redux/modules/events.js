const LOAD = 'entire-life/events/LOAD';
const LOAD_SUCCESS = 'entire-life/events/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/events/LOAD_FAIL';
const EDIT_START = 'entire-life/events/EDIT_START';
const EDIT_STOP = 'entire-life/events/EDIT_STOP';
const SAVE = 'entire-life/events/SAVE';
const SAVE_SUCCESS = 'entire-life/events/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/events/SAVE_FAIL';

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
  return globalState.events && globalState.events.loaded;
}

export function load({userSlug}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/users/${userSlug}/events`)
  };
}

function update({userSlug, event}) {
  console.log("can we use event.user.slug? here's `event`:", event);
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: event.id,
    promise: (client) => client.post(`/users/${userSlug}/events/${event.id}`, {
      data: event
    })
  };
}

function create({userSlug, event}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post(`/users/${userSlug}/events`, {
      data: event
    })
  }
}

export function save({userSlug, event}) {
  if(event.id) return update({userSlug, event});
  else return create({userSlug, event});
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
