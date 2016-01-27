require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  app: {
    title: 'Entire.Life',
    description: 'Entire.Life is a symbolic life calendar that helps you remember the good and plan for the better.',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Entire.Life',
        'og:image': 'https://entire.life/social-share.png',
        'og:image:width': '600',
        'og:image:height': '375',
        'og:locale': 'en_US',
        'og:title': 'Entire.Life',
        'og:description': 'Entire.Life is a symbolic life calendar that helps you remember the good and plan for the better.',
        'twitter:card': 'summary',
        'twitter:site': '@yourentirelife',
        'twitter:creator': '@chadoh',
        'twitter:title': 'Entire.Life',
        'twitter:description': 'Entire.Life is a symbolic life calendar that helps you remember the good and plan for the better.',
        'twitter:image': 'https://entire.life/social-share.png',
      }
    }
  }
}, environment);
