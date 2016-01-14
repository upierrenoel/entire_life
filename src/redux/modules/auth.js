import cookie from 'js-cookie';

const LOAD = 'entire-life/auth/LOAD';
const LOGIN = 'entire-life/auth/LOGIN';
const LOGIN_SUCCESS = 'entire-life/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'entire-life/auth/LOGIN_FAIL';
const LOGOUT = 'entire-life/auth/LOGOUT';
const SAVE = 'entire-life/auth/SAVE';
const SAVE_SUCCESS = 'entire-life/auth/SAVE_SUCCESS';
const SAVE_FAIL = 'entire-life/auth/SAVE_FAIL';
const DELETE = 'entire-life/auth/DELETE';
const DELETE_SUCCESS = 'entire-life/auth/DELETE_SUCCESS';
const DELETE_FAIL = 'entire-life/auth/DELETE_FAIL';

const initialState = {
  loaded: false,
  user: {}, // user is signed in if user.slug is present
  saveError: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loggingIn: true,
      };
    case LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user,
        },
        loggingIn: true,
      };
    case LOGIN_SUCCESS:
      const user = {
        ...JSON.parse(action.cookies.user),
        slug: action.result.user.slug,
        id: action.result.user.id,
        born: action.result.user.born,
        paid: action.result.user.paid,
        payment_frequency: action.result.user.payment_frequency,
        is_private: action.result.user.is_private,
      };
      return {
        ...state,
        loggingIn: false,
        loaded: true,
        idToken: action.cookies.idToken,
        user,
        loginError: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loaded: true,
        loggingIn: false,
        idToken: null,
        user: {},
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        idToken: null,
        user: {},
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.result.user,
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
      return state;
    case DELETE_SUCCESS:
      cookie.remove('idToken');
      cookie.remove('user');
      return {
        ...state,
        idToken: null,
        user: {},
        deleteError: null,
      };
    case DELETE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        deleteError: action.error
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/users/record_login', {
      onlyIf: cookies => cookies.idToken
    })
  };
}

export function login(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  const profile = googleUser.getBasicProfile();
  const user = {
    googleId: profile.getId(),
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
  };
  cookie.set('idToken', idToken);
  cookie.set('user', user);

  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/users/record_login')
  };
}

function logoutGoogle() {
  const waitForLoaded = setInterval(() => {
    if (window.gapi) {
      clearInterval(waitForLoaded);
      if (window.gapi.auth2) {
        window.gapi.auth2.getAuthInstance().signOut();
      }
    }
  }, 30);
}

export function logout() {
  cookie.remove('idToken');
  cookie.remove('user');
  logoutGoogle();

  return {
    type: LOGOUT
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

export function destroy(user) {
  logoutGoogle();
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del(`/users/${user.slug}`)
  };
}
