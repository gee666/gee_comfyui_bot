require('core-js/stable');
require('@babel/register')({
  presets: ['@babel/preset-env'],
  "plugins": [
    [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
    [ "@babel/plugin-proposal-class-properties", {"loose": true}],
    [ "@babel/plugin-proposal-private-methods", { "loose": true }],
    [ "@babel/plugin-proposal-private-property-in-object", { "loose": true }],
  ]
});

require('./server/index.js');
