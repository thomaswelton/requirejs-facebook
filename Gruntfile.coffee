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
					src: ['dist/Facebook.js','dist/Facebook.min.js','dist/README.html']

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

		regarde:
			markdown:
				files: 'README.html'
				tasks: 'markdown'
			
			coffee:
				files: ['src/**/*.coffee']
				tasks: ['coffee']

		
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-remove-logging'
	grunt.loadNpmTasks 'grunt-git'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-markdown'
	grunt.loadNpmTasks 'grunt-regarde'
	
	grunt.registerTask 'default', ['compile', 'uglify']

	grunt.registerTask 'commit', ['default', 'git']
	
	grunt.registerTask 'compile', 'Compile coffeescript and markdown', ['coffee', 'markdown']
	grunt.registerTask 'watch', 'Watch coffee and markdown files for changes and recompile', ['regarde']
