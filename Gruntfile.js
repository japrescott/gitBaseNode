module.exports = function(grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),
		server:{
			port:8888
		},
		meta:{
			name:"<%= pkg.name %>",
			version:"<%= pkg.version %>",
			versionKey:"<%= pkg.version %>"
		},

		app:{
			vendor:{
				files:[
					"frontend/js/main/lodash.ui.min.js"
					,"frontend/js/main/zepto.min.js"
					,"frontend/js/main/modernizr.min.js"
					,"frontend/js/main/backbone.min.js"
				]
			},
			main:{
				files:[
					"frontend/js/**.js",
				]
			}
		},




		watch:{
			buildDir:{
				files: ["build/**"],
				tasks: "copy:moveToBin"
			}
			,jsDir:{
				files: ["frontend/js/**.js"],
				tasks: "buildJS"
			},
			cssDir:{
				files: ["frontend/css/**"],
				tasks: ["buildCSS"]
			},
			htmlDir:{
				files: ["frontend/**.jade"],
				tasks: ["buildHTML"]
			},
			livereload:{
				files:[
					"bin/**"
				],
				options: {
					livereload: 36000
				}
			}
		},


		copy:{
			css:{
				files:[
					{
						expand: true,
						cwd: "frontend/css/",
						src: ['**.css'],
						dest: 'build/css/'
					}
				]
			}
			,moveToBin:{
				files:[
					{
						nonull:true,
						expand:true,
						cwd: "build/",
						src: "**",
						dest: "bin/"
					}
				]
			}
		},

		concat:{
			vendor:{
				src: '<%=app.vendor.files %>',
				dest:"build/js/vendor.js"
			},
			app:{
				src: ['<%=app.main.files %>'],
				dest:"build/js/main.js"
			}
		},

		uglify: {
			vendor: {
				options:{
					preserveComments:"all",
					report:"min"
				},
				files: {
					'build/js/vendor.min.js': ['<%=concat.vendor.dest %>']
				}
			},
			app:{
				options:{
					banner: "/* Developed by Jeremy A. Prescott - jap@prescore.ch*/",
					preserveComments:"some",
					mangle: {
						except: ["$", "_", "Backbone", "Modernizr" ]
					},
					compress: {
						global_defs: {
							"DEBUG":false
						},
						dead_code: true
					},
					report:"min"
				},
				files: {
					'build/js/main.min.js': ['<%=concat.app.dest %>']
				}
			}
		},


		imagemin: {                          // Task
			options: {                       // Target options
				optimizationLevel: 4,
				progressive: true,
				interlaced: true,
				pngquant: true
			},
			files:
			{
				expand: true,                  // Enable dynamic expansion
				cwd: 'frontend/img/',                   // Src matches are relative to this path
				src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
				dest: 'build/img/'                  // Destination path prefix
			}
		},



		jade: {
			release: {
				options: {
					pretty:true,
					data: {
						debug: true,
						t:function(key, options){
							options=options || {};
							options.defaultValue=options.defaultValue || "ResNotLoaded"
							return translate(key, options);
						},
						phonegap:true
					}
				},
				files: [
					{
					expand: true,     // Enable dynamic expansion.
						cwd: 'frontend/',      // Src matches are relative to this path.
						src: ['**/*.jade'], // Actual pattern(s) to match.
						dest: 'build/',   // Destination path prefix.
						ext: '.html',   // Dest filepaths will have this extension.
					},
				]
			}
		},

		stylus:{
			compile: {
				options: {
					compress:false,
					linenos:true,
					firebug:true,
					//paths: ['path/to/import', 'another/to/import'],
					urlfunc: 'url', // use embedurl('test.png') in our code to trigger Data URI embedding
					use: [
						require('nib') // use stylus plugin at compile time
					]
				},
				files: {
					'build/css/main.css': 'frontend/css/main.styl'
				}
			}
		}

	});




	//sys util
	grunt.loadNpmTasks('grunt-contrib-copy');

	//script tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//html/jade tasks
	grunt.loadNpmTasks('grunt-contrib-jade');

	//css/stylus tasks
	grunt.loadNpmTasks('grunt-contrib-stylus');

	//other
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.loadNpmTasks('grunt-express');





	grunt.registerTask('server', '(re)starting Dev Server', function() {
		grunt.log.writeln('Starting Server in "'+__dirname);

		var exec = require('child_process').exec;
		exec("supervisor -w backend backend/index.js" );

	});





	grunt.registerTask('buildJS', [
		"concat:vendor"
		,"concat:app"
		,"uglify"
	]);

	grunt.registerTask('buildCSS', [
	    "stylus",
		"copy:css"
	]);

	grunt.registerTask('buildHTML', [
		"jade"
	]);

	grunt.registerTask('buildIMG', [
		"imagemin"
		//,"sprite"
	]);

	grunt.registerTask('build', [
		"buildJS"
		,"buildCSS"
		,"buildHTML"
		,"buildIMG"
		,"copy:moveToBin"
	]);


	grunt.registerTask('default', [
		'build'
		,'server'
		,'watch'
	]);

};
