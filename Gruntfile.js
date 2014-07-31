/* jslint node: true */

'use strict';

var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cards: {
      compile: {}
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'dist',
          middleware: function (connect, options) {
            var middlewares = [];
            var directory = options.directory || options.base[options.base.length - 1];

            // enable Angular's HTML5 mode
            middlewares.push(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));

            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            options.base.forEach(function(base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      }
    },
    copy: {
      javascripts: {
        files: [{
          expand: true,
          src: 'javascripts/*.js',
          dest: 'dist/',
          cwd: 'src'
        }]
      },
      images: {
        files: [{
          expand: true,
          src: 'images/*',
          dest: 'dist/',
          cwd: 'src'
        }]
      },
      hearthStoneDb: {
        files: {
          'dist/all-collectibles.json': ['bower_components/hearthstone-db/cards/all-collectibles.json']
        }
      }
    },
    jade: {
      compile: {
        files: {
          'dist/index.html': ['src/templates/index.jade'],
          'dist/heroes.html': ['src/templates/heroes.jade'],
          'dist/builder.html': ['src/templates/builder.jade']
        }
      }
    },
    stylus: {
      compile: {
        files: {
          'dist/stylesheets/style.css': 'src/stylesheets/style.styl'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      stylesheets: {
        files: 'src/stylesheets/*.styl',
        tasks: ['stylus']
      },
      javascripts: {
        files: 'src/javascripts/*.js',
        tasks: ['copy:javascripts']
      },
      templates: {
        files: 'src/templates/*.jade',
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['copy', 'jade', 'stylus']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('default', ['build']);
};
