define ['json!data', 'module', 'EventEmitter'], (permissionsMap, module, EventEmitter) ->
	class Facebook extends EventEmitter
		constructor: (@config) ->
			## Init EventEmitter
			super()

			## Init Facebook
			console.log 'Facebook init'

			defaults = 
				status     : true
				cookie     : true
				xfbml      : true

			## Merge default values
			for key, value of @config
				defaults[key] = value

			@config = defaults
			@api = null
			@isIframe = top isnt self

			if FB?
				@fbAsyncInit()
			else
				window.fbAsyncInit = @fbAsyncInit
				@injectFB()
			
			## Facebook like tracking
			@onReady (FB) =>
				FB.Event.subscribe 'edge.create', (url) =>
					@fireEvent 'onLike', url

				FB.Event.subscribe 'edge.remove', (url) =>
					@fireEvent 'onUnlike', url

		ui: (args...) =>
			@onReady (FB) ->
				FB.ui args...
		
		logout: (cb) =>
			@onReady (FB) =>
				console.log @loginStatus
				if @loginStatus?.status? and @loginStatus.status is 'connected'	
					FB.logout (response) ->
						cb response if typeof cb is 'function'
				else
					console.warn 'User is already logged out'
					cb() if typeof cb is 'function'

		hasPermissions: (perms) =>
			return true if perms.trim().length is 0

			permsArray = perms.split(',')

			intersection = (a, b) ->
				[a, b] = [b, a] if a.length > b.length
				value for value in a when value in b

			grantedPerms = intersection permsArray, @grantedPermissions
		
			return grantedPerms.length is permsArray.length

		requestPermission: (scope, cb) =>
			FB.ui
				method: 'oauth'
				scope: scope,
				display: 'popup'
			, () =>
				@getPermissions()
				cb() if typeof cb is 'function'

		login: (obj) =>
			scope = if obj.scope? then obj.scope.trim() else ''
			onLogin = if obj.onLogin? then obj.onLogin else () ->
			onCancel = if obj.onCancel? then obj.onCancel else () ->

			## If already logged
			if @loginStatus?.status? and @loginStatus.status is 'connected'
				## Check the user has granted all perms in scope
				if @hasPermissions scope
					## Granted all required perms, callback
					onLogin @loginStatus.authResponse
				else
					## Prompt for required perms
					console.log 'request', scope

					@requestPermission scope, (response) =>
						## User may not have granted all perms
						onLogin @loginStatus.authResponse
			else
				## Login the user
				@onReady (FB) ->
					FB.login (response) ->
						if response.authResponse
							if obj.onLogin?
								obj.onLogin response.authResponse
						else 
							onCancel()
					, scope

		getLoginStatus: (cb) =>
			FB.getLoginStatus (@loginStatus) =>
				console.log "Login Status:", @loginStatus
				cb @loginStatus if typeof cb is 'function'

		getPermissions: (cb) =>
			@onReady (FB) =>
				FB.api '/me?fields=permissions', (response) =>
					@grantedPermissions = (permission for permission of response.permissions.data[0])
					cb @grantedPermissions if typeof cb is 'function'

		getUserInfo: (data, cb) =>
			fields = data.join(',')

			@onReady (FB) =>
				FB.api "/me?fields=#{fields}", (response) =>
					cb response if typeof cb is 'function'

		requireUserInfo: (data, cb) =>
			requiredPermissions = (permissionsMap[field] for field in data when permissionsMap[field]?)
			requiredScope = requiredPermissions.join(',')

			getInfo = () => @getUserInfo data, cb

			if @loginStatus.status isnt 'connected'
				@login 
					scope: requiredScope
					onLogin: getInfo
			else
				if @hasPermissions requiredScope
					getInfo()
				else
					@requestPermission requiredScope, getInfo
				

		onReady: (callback) =>
			if FB?
				callback FB
			else
				@once 'fbInit', () => callback FB

		fbAsyncInit: () =>
			@fbInit()
			@fbiFrameInit() if @isIframe

		fbInit: () =>
			FB.init @config
				
			@getLoginStatus (loginStatus) =>
				if loginStatus.status is 'connected'
					@getPermissions () => @fireEvent 'fbInit'
				else
					@fireEvent 'fbInit'

			FB.Event.subscribe 'auth.login', (@loginStatus) =>
				console.log 'FB.Event: auth.login'
				@fireEvent 'onLogin'

			FB.Event.subscribe 'auth.statusChange', (@loginStatus) =>
				console.log 'FB.Event: auth.statusChange'
				@fireEvent 'onStatusChange'

			FB.Event.subscribe 'auth.authResponseChange', (@loginStatus) =>
				console.log 'FB.Event: auth.authResponseChange'
				@fireEvent 'onAuthChange', (@loginStatus.status is 'connected')

		fbiFrameInit: () =>
			FB.Canvas.scrollTo 0,0
			FB.Canvas.setSize
				width: 810
				height: document.body.offsetHeight
			
			if @config.autoResize? and @config.autoResize
				resizeInterval = () ->
					FB.Canvas.setSize
						width: 810
						height: document.body.offsetHeight

				window.setInterval resizeInterval, 500

		injectFB: () ->
			return if document.getElementById 'facebook-jssdk'

			if !document.getElementById 'fb-root'
				root = document.createElement 'div'
				root.setAttribute 'id','fb-root'

				document.body.appendChild root

			## Allows us to load the SDK via http:// when the site may be loaded via file://
			protocol = if location.protocol is 'https:' then 'https:' else 'http:'
			requirejs [protocol + '//connect.facebook.net/en_US/all.js']

		renderPlugins: (cb) ->
			@onReady () ->
				## Parse only unrendered plugins for browser that support querySelectorAll
				if document.querySelectorAll?
					plugins = document.body.querySelectorAll '.fb-like:not([fb-xfbml-state=rendered])'

					## Each plugin renders async, count the amount to render
					unrenderedCount = plugins.length

					cbStack = () ->
						## Decrement the unrendered count
						## Call the main callback once all done
						cb() if --unrenderedCount is 0

					for plugin in plugins
						FB.XFBML.parse plugin, cbStack

				else
					FB.XFBML.parse document.body, cb

		## http://developers.facebook.com/docs/reference/javascript/FB.Canvas.getPageInfo/
		getCanvasInfo: (cb) ->
			@onReady (FB) ->
				FB.Canvas.getPageInfo (info) -> cb info

		setCanvasSize: (width, height) ->
			@onReady (FB) ->
				FB.Canvas.setSize
					width: width
					height: height
				    

	## Create and return a new instance of Facebook
	## module.config() returns a JSON object as defined in requirejs.config.Facebook
	new Facebook module.config()
