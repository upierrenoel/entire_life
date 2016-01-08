import cookie from 'js-cookie';

const LOAD = 'entire-life/auth/LOAD';
const LOAD_SUCCESS = 'entire-life/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'entire-life/auth/LOAD_FAIL';
const LOGIN = 'entire-life/auth/LOGIN';
const LOGIN_SUCCESS = 'entire-life/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'entire-life/auth/LOGIN_FAIL';
const LOGOUT = 'entire-life/auth/LOGOUT';

const initialState = {
  loaded: false
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
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        idToken: action.idToken,
        user: {
          ...state.user,
          ...action.user,
        },
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      const user = {
        ...cookie.getJSON('user'),
        slug: action.result.user.slug,
        id: action.result.user.id,
        born: action.result.user.born,
        paid: action.result.user.paid,
        payment_frequency: action.result.user.payment_frequency,
        is_private: action.result.user.is_private,
      };
      cookie.set('user', user);
      return {
        ...state,
        loggingIn: false,
        user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        idToken: null,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
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
    idToken,
    promise: (client) => client.post('/users/record_login')
  };
}

export function logout() {
  cookie.remove('idToken');
  cookie.remove('user');
  const waitForLoaded = setInterval(() => {
    if (window.gapi) {
      clearInterval(waitForLoaded);
      if (window.gapi.auth2) {
        window.gapi.auth2.getAuthInstance().signOut();
      }
    }
  }, 30);

  return {
    type: LOGOUT
  };
}
