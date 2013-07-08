module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		coffee: {
			agegateway: {
				options: {
					bare: true
				},
				files: {
					"./pp/javascript/pp.js": ["./src/coffee/pp.coffee"]
				}
			},
			test: {
				expand: true,
				cwd: './test/',
				src: 'pp.spec.coffee',
				dest: './test/',
				ext: '.spec.js'
			}
		},
		jade: {
			agegateway: {
				options: {
					pretty: false,
					data: {
						debug: false
					}
				},
				files: {
					"./pp/pp.html": ["./src/jade/pp.jade"]
				}
			},
			nocookies: {
				options: {
					pretty: false,
					data: {
						debug: false
					}
				},
				files: {
					"./pp/nocookies.html": ["./src/jade/nocookies.jade"]
				}
			}
		},
		stylus: {
			compile: {
				expand: true,
				cwd: './src/stylus/',
				src: 'pp.styl',
				dest: './pp/css/',
				ext: '.css'
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: './pp/css/',
				src: 'pp.css',
				dest: './pp/css/',
				ext: '.min.css'
			}
		},
		uglify: {
			compressjs: {
				expand: true,
				cwd: './pp/javascript/',
				src: 'pp.js',
				dest: './pp/javascript/',
				ext: '.min.js'
			}
		},
		jasmine: {
			customTemplate: {
				src: './pp/javascript/pp.js',
				options: {
					specs: './test/pp.spec.js',
					vendor: 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js'
				}
			}
		},
		watch: {
			files: ["./src/coffee/pp.coffee", "./test/pp.spec.coffee", "./src/stylus/**/*.styl", "./src/jade/**/*.jade", "./pp/javascript/pp.js", "./pp/css/pp.css"],
			tasks: ["coffee", "jade", "stylus", "cssmin", "uglify", "jasmine"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.registerTask('default', ['watch']);

	grunt.event.on('watch', function(action, filepath) {
		grunt.log.writeln(filepath + ' has ' + action);
	});
}