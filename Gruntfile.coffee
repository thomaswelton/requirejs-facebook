module.exports = (grunt) =>
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		## Compile coffeescript
		coffee:
			compile:
				files: [
					expand: true
					cwd: 'src'
					src: ['Facebook.coffee']
					dest: 'dist'
					ext: '.js'
				]

		removelogging:
			files:
				expand: true
				cwd: 'dist'
				src: ['Facebook.min.js']
				dest: 'dist'
				ext: '.js'

		uglify:
			javascript:
				mangle: false
				compress: true
				banner: """/*!
						<%= pkg.name %> v<%= pkg.version %> 
						<%= pkg.description %>
						Build time: #{(new Date()).getTime()}
						*/\n\n"""
				files: {
					'dist/Facebook.min.js': ['dist/Facebook.js']
				}

		git:
			javascript:
				options: {
	                command: 'commit'
	                message: 'Grunt build'
	            }

	            files: {
	            	src: ['dist/Facebook.js']
	            }

		
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-remove-logging'
	grunt.loadNpmTasks 'grunt-git'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	
	grunt.registerTask 'default', ['coffee']
	grunt.registerTask 'commit', ['default', 'git']
