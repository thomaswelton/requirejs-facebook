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
				src: ['Facebook.js']
				dest: 'dist'
				ext: '.js'

		uglify:
			options:
				mangle: false
				banner: """/*!
						<%= pkg.name %> v<%= pkg.version %> 
						<%= pkg.description %>
						Build time: #{(new Date()).getTime()}
						*/\n\n"""

			javascript:
				files: {
					'dist/Facebook.js': ['dist/Facebook.js']
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
	
	grunt.registerTask 'default', ['coffee', 'removelogging', 'uglify']
	grunt.registerTask 'commit', ['default', 'git']
