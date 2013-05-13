module.exports = function(grunt) {
	//configure the dest paths below to put the css/js/html files where you want
	//e.g. app/css/*
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: ['js/*.js'],
				dest: 'js/final/main.js'
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/',
				src: 'styles.css',
				dest: 'css/',
				ext: '.min.css'
			}
		},
		uglify: {
			compressjs: {
				expand: true,
				cwd: 'js/final/',
				src: 'main.js',
				dest: 'js/final/',
				ext: '.min.js'
			}
		},
		watch: {
			files: ["js/*.js", "css/styles.css"],
			tasks: ["concat", "cssmin", "uglify"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['watch']);

	grunt.event.on('watch', function(action, filepath) {
		grunt.log.writeln(filepath + ' has ' + action);
	});
}