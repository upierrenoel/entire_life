const LOAD = 'entire-life/events/LOAD';
const LOAD_SUCCESS = 'entire-life/events/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/events/LOAD_FAIL';
const SAVE = 'entire-life/events/SAVE';
const SAVE_SUCCESS = 'entire-life/events/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/events/SAVE_FAIL';
const DELETE = 'entire-life/events/DELETE';
const DELETE_SUCCESS = 'entire-life/events/DELETE_SUCCESS';
const DELETE_FAIL = 'entire-life/events/DELETE_FAIL';

const initialState = {
  data: {},
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
      data[action.result.event.weekno] = data[action.result.event.weekno].concat() || [];
      data[action.result.event.weekno].push(action.result.event);
      data[action.result.event.weekno].sort((a, b) => a.date - b.date);

      return {
        ...state,
        data: {
          ...state.data,
          [action.slug]: data,
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
    case DELETE:
      return {
        ...state,
        deleting: [action.event.id]
      };
    case DELETE_SUCCESS:
      const old = state.data[action.slug][action.event.weekno];
      const i = old.indexOf(action.event);
      const j = state.deleting.indexOf(action.event.id);
      return {
        ...state,
        deleting: state.deleting.slice(0, j).concat(state.deleting.slice(j + 1)),
        data: {
          [action.slug]: {
            ...state.data[action.slug],
            [action.event.weekno]: old.slice(0, i).concat(old.slice(i + 1))
          }
        }
      };
    case DELETE_FAIL:
      const k = state.deleting.indexOf(action.event.id); // eslint-ignore-line no-redeclare
      return typeof action.error === 'string' ? {
        ...state,
        deleteError: {
          ...state.deleteError,
          [action.event.id]: action.error
        },
        deleting: state.deleting.slice(0, k).concat(state.deleting.slice(k + 1)),
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
    promise: (client) => client.put(`/users/${slug}/events/${event.id}`, {
      data: {event}
    })
  };
}

function create({slug, event}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    slug,
    promise: (client) => client.post(`/users/${slug}/events`, {
      data: {event}
    })
  };
}

export function save({slug, event, weekno}) {
  if (event.id) return update({slug, event, weekno});
  return create({slug, event});
}

export function destroy({slug, event}) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    event,
    slug,
    promise: (client) => client.del(`/users/${slug}/events/${event.id}`)
  };
}
