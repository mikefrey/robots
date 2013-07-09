module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      bundle: {
        src: ['js/script.js'],
        dest: 'bundle.js'
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['browserify']
      }
    }
  })

  grunt.registerTask('default', ['browserify'])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browserify')
}
