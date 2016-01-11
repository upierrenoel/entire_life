const LOAD = 'entire-life/events/LOAD';
const LOAD_SUCCESS = 'entire-life/events/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/events/LOAD_FAIL';
const EDIT_START = 'entire-life/events/EDIT_START';
const EDIT_STOP = 'entire-life/events/EDIT_STOP';
const SAVE = 'entire-life/events/SAVE';
const SAVE_SUCCESS = 'entire-life/events/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/events/SAVE_FAIL';

const initialState = {
  data: {},
  editing: null,
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.slug]: action.result
        },
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.slug]: null
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
          slug: action.slug,
          weekno: action.event.weekno,
          index: state.data[action.slug][action.weekno].indexOf(action.event)
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: null
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = {...state.data[action.slug]};
      if (action.weekno) {
        // remove old
        data[action.weekno] = data[action.weekno].
          filter(event => event.id !== action.result.event.id);
        if (data[action.weekno] === []) data[action.weekno] = undefined;
      }
      // add new
      data[action.result.event.weekno] = (data[action.result.event.weekno] || []).
        push(action.result.event).sort((a, b) => a.date - b.date);

      return {
        ...state,
        editing: null,
        data: {
          ...state.data,
          [action.slug]: data,
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
  return globalState.events && globalState.events.data[slug];
}

export function load({userSlug}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    slug: userSlug,
    promise: (client) => client.get(`/users/${userSlug}/events`)
  };
}

function update({slug, event, weekno}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: event.id,
    slug,
    weekno,
    promise: (client) => client.post(`/users/${slug}/events/${event.id}`, {
      data: event
    })
  };
}

function create({slug, event}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    slug,
    promise: (client) => client.post(`/users/${slug}/events`, {
      data: event
    })
  };
}

export function save({slug, event, weekno}) {
  console.log("can we use event.user.slug? here's `event`:", event);
  if (event.id) return update({slug, event, weekno});
  return create({slug, event});
}

export function editStart({slug, event}) {
  console.log("can we use event.user.slug? here's `event`:", event);
  return {
    type: EDIT_START,
    slug,
    weekno: event.weekno,
    id: event.id,
  };
}

export function editStop() {
  return { type: EDIT_STOP };
}
