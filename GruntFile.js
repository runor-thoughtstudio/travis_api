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
		},
		eslint: {
            target: ['src/**/*.js']
       	},
	   	mochaTest: {
		  test: {
		    options: {
		      reporter: 'spec',
		      require: 'babel-register'
		    },
		    src: ['app/dist/test/**/*.js']
		    // src: ['app/dist/test/users-spec.js', 'app/dist/test/entries-spec.js']
		  }
	   	}
    });

    grunt.registerTask("default", ["babel"]);
};
