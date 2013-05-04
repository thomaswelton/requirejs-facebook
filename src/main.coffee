require ['Facebook', 'mootools', 'domReady!'], (Facebook) ->
	console.log 'init'

	$$('[data-fb-logout]').addEvent 'click', (event) ->
		 Facebook.logout () ->
		 	console.log 'logged out'

	$$('[data-fb-login]').addEvent 'click', (event) ->
		scope = this.getProperty 'data-fb-login'

		Facebook.login
			scope: scope
			onLogin: (authResponse) ->
				console.log authResponse
			onCancel: () ->
				console.log 'login canceled'

