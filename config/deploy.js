'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
  };

  ENV.git = {
    repo: 'git@github.com:kpfefferle/bluecoats.git',
    branch: 'gh-pages',
    worktreePath: '/tmp/deploy-bluecoats',
    commitMessage: 'Deployed %@',
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
