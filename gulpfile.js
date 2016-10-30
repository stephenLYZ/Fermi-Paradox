var
  gulp = require('gulp'),
  gladius = require('gladius-forge'),
  server = require('./app');


gladius.config(gulp, {
  modules: {

    styles: 'less'
  },
  paths: {
    src: {
      base: '',

      styles: 'less/',

      scripts: '',

      esnextExtension: '.js',

      templates: '',
      partials: '',

    },

    out: {
      base: 'public/',

      styles: 'css/',

      scripts: 'js/'
    }
  },
  server: server,
  port: null,
  liveReloadPort: null
});



gladius.setupTasks({
  'bundle-js': {
    deps: [],
    src: []
  },
  'bundle-js:dev': {
    deps: [],
    src: []
  },
  'lint': {
    deps: [],
    src: [
      '!src/scripts/vendor/**/*',
      '!src/scripts/mock/lib/**/*'
    ]
  }
});

var $ = gladius.getPlugins();

gulp.task('publish-helpers', function() {
  return gulp.src(['handlebars.helpers.js'])
  .pipe($.uglify())
  .pipe(gulp.dest('public/js/'));
});

gladius.setupWatchers(function(gulp) {
  gulp.watch('handlebars.helpers.js', ['publish-helpers']);
});

gladius.setupMain({
  'development': [
    'publish-helpers'
  ],
  'test': [],
  'production': [
    'publish-helpers'
  ]
});
