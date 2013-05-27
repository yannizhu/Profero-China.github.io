module.exports = function(grunt) {
	//configure the dest paths below to put the css/js/html files where you want
	//e.g. app/css/*
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: ['js/lib/jquery.min.js', 'js/lib/modernizr.custom.js', 'js/lib/carousel.js', 'js/lib/jquery.reveal.js', 'js/lib/jquery.touchwipe.js', 'js/lib/map.js', 'js/lib/testimonials.js', 'js/lib/waypoints.js', 'js/lib/proferotech.js'],
				dest: 'js/main.js'
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
				cwd: 'js/',
				src: 'main.js',
				dest: 'js/',
				ext: '.min.js'
			}
		},
		compress: {
			css: {
				options: {
					mode: 'gzip'
				},
				expand: true,
				cwd: 'css/',
				src: 'styles.min.css',
				dest: 'css/'
  			},
  			js: {
				options: {
					mode: 'gzip'
				},
				expand: true,
				cwd: 'js/',
				src: 'main.min.js',
				dest: 'js/'
  			}
		},
		watch: {
			files: ["js/lib/*.js", "css/styles.css"],
			tasks: ["concat", "cssmin", "uglify", "compress"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.registerTask('default', ['watch']);

	grunt.event.on('watch', function(action, filepath) {
		grunt.log.writeln(filepath + ' has ' + action);
	});
}