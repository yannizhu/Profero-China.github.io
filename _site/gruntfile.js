module.exports = function(grunt) {
	//configure the dest paths below to put the css/js/html files where you want
	//e.g. app/css/*
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		stylus: {
			compile: {
				expand: true,
				cwd: 'css/',
				src: ['styles.styl', 'ie.styl', 'blog/blog-styles.styl'],
				dest: 'css/',
				ext: '.css'
			}
		},
		concat: {
			js: {
				src: ['javascript/!(main*).js','!javascript/lib/*'],
				dest: 'javascript/main.js'
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['styles.css', 'blog/blog-styles.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		},
		uglify: {
			compressjs: {
				expand: true,
				cwd: 'javascript/',
				src: 'main.js',
				dest: 'javascript/',
				ext: '.min.js'
			}
		},
		watch: {
			files: ["css/**/*.styl", "javascript/!(main*).js"],
			tasks: ["stylus", "concat", "cssmin", "uglify"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['watch']);

	grunt.event.on('watch', function(action, filepath) {
		grunt.log.writeln(filepath + ' has ' + action);
	});
}