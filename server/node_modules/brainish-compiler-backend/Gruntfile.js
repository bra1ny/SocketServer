module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['jsh/', 'jsh_test/', 'example/log/'],
    copy: {
      main: {
        expand: true,
        cwd: 'init',
        src: ['**/*'],
        dest: 'example/',
        filter: 'isFile'
      }
    },
    jison: {
      target: {
        files: {
          'jsh/grammar.js': 'src/grammar.jison'
        }
      }
    },
    coffee: {
      compileJsh: {
        expand: true,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: 'jsh/',
        ext: '.js'
      },
      compileTest: {
        expand: true,
        cwd: 'test',
        src: ['**/*.coffee'],
        dest: 'jsh_test/',
        ext: '.js'
      }
    },
    nodeunit: {
      all: ['jsh_test/**/*_test.js']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['clean', 'copy', 'jison', 'coffee']);
  grunt.registerTask('test', ['clean', 'copy', 'jison', 'coffee', 'nodeunit']);
}
