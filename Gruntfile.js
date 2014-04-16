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
			jsDir:{
				files:["frontend/js/**.js"],
				tasks:"buildJS"
			},
			cssDir:{
				files:["frontend/css/**"],
				tasks:["buildCSS", "copy:css"]
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
						src: ['frontend/css/*.css'],
						dest: 'bin/css/../'
					}
				]
			}
			,statics:{
				files:[
					{
						expand: true,
						src: ['frontend/img/**'],
						dest: 'bin/img/../'
					},
					{
						src:"frontend/index.html",
						dest:"bin/index.html"
					}
				]
			}
		},

		concat:{
			vendor:{
				src: '<%=app.vendor.files %>',
				dest:"bin/js/vendor.js"
			},
			app:{
				src: ['<%=app.main.files %>'],
				dest:"bin/js/main.js"
			}
		},

		uglify: {
			vendor: {
				options:{
					preserveComments:"all",
					report:"min"
				},
				files: {
					'bin/js/vendor.min.js': ['<%=concat.vendor.dest %>']
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
					'bin/js/main.min.js': ['<%=concat.app.dest %>']
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
				cwd: 'bin/img/',                   // Src matches are relative to this path
				src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
				dest: 'bin/img/'                  // Destination path prefix
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
						dest: 'bin/',   // Destination path prefix.
						ext: '.html',   // Dest filepaths will have this extension.
					},
				]
			}
		},


		express: {
			options: {
				port: 9000,
				hostname: '*'
			},
			livereload: {
				options: {
					port:36000,
					//server: "",
					livereload: true,
					serverreload: true,
					bases: ["bin"]
				}
			},
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

	//other
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.loadNpmTasks('grunt-express');





	grunt.registerTask('buildJS', [
		"concat:vendor"
		,"concat:app"
		,"uglify"
	]);

	grunt.registerTask('buildCSS', [
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

		,"copy:statics"
		,"buildIMG"
	]);


	grunt.registerTask('default', [
		'build'
		,'express'
		,'watch'
	]);

};
