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
			options:
				mangle: false
				compress: true
				banner: """/*!
						<%= pkg.name %> v<%= pkg.version %> 
						<%= pkg.description %>
						Build time: #{(new Date()).toString('dddd, MMMM ,yyyy')}
						*/\n\n"""
					
			javascript:
				files: {
					'dist/Facebook.min.js': 'dist/Facebook.js'
				}

		git:
			javascript:
				options:
					command: 'commit'
					message: 'Grunt build'

				files:
					src: ['dist/Facebook.js']

		markdown:
			readmes:
				files: [
					{
						expand: true
						src: 'README.md'
						dest: 'dist'
						ext: '.html'
					}
				]

		
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-remove-logging'
	grunt.loadNpmTasks 'grunt-git'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-markdown'
	
	grunt.registerTask 'default', ['coffee', 'uglify', 'markdown']
	grunt.registerTask 'commit', ['default', 'git']
