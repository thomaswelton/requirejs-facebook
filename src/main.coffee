require ['Facebook', 'mootools', 'domReady!'], (Facebook) ->
	console.log 'main init'

	$('logout').addEvent 'click', (event) ->
		 Facebook.logout () -> console.log 'logged out'

	$$('[data-fb-login]').addEvent 'click', (event) ->
		scope = this.getProperty 'data-fb-login'

		Facebook.login
			scope: scope
			onLogin: (authResponse) -> console.log 'logged in', authResponse
			onCancel: () -> console.log 'login canceled'

	Facebook.addEvent 'onAuthChange', (loggedIn) ->
		if loggedIn
			console.log 'do logged in stuff'

			Facebook.getUserInfo ['name','hometown'], (response) ->
				console.log 'I did logged in stuff', response
		else
			console.log 'do logged out stuff'


	$('getEmail').addEvent 'click', (event) ->
		Facebook.requireUserInfo ['email','languages','name','hometown','religion','relationship_status'], (response) ->
			console.log response



