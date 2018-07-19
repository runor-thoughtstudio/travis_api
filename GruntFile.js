module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks
    grunt.initConfig({
      "babel": {
        options: {
          sourceMap: true
        },
        dist: {
			files: [{
		      expand: true,
		      cwd: 'src',
		      src: ['**/*.js'],
		      dest: 'app/dist',
		      ext: '.js'
		  }]
        }
       }
    });

    grunt.registerTask("default", ["babel"]);
};
