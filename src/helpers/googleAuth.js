import cookie from 'js-cookie';

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', 'https://apis.google.com/js/platform.js');
document.body.appendChild(script);

const onFailure = (err) => {
  console.error('initClient failed', err);
};

const initClient = () => {
  window.gapi.load('auth2', () => {
    window.gapi.auth2.init({
      client_id: '195265380701-61hrjl5crf1fvlmpp0l7br2lp27m55rg.apps.googleusercontent.com',
      scope: 'profile email',
      failure: onFailure,
    }).then(auth => {
      if (!auth.isSignedIn.get() && cookie.get('idToken')) {
        // user's session expired;
        // would do this in LOGIN_FAIL action of auth reducer,
        // but on the server it has no access to cookies.
        // this works for now.
        cookie.remove('idToken');
        cookie.remove('user');
      }
    });
  });
};

const waitForLoaded = setInterval(() => {
  if (window.gapi) {
    clearInterval(waitForLoaded);
    initClient();
  }
}, 30);

export default {};
