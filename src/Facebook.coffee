define ['EventEmitter', 'module', 'jquery'], (EventEmitter, module, $) ->
	class Facebook extends EventEmitter
		constructor: (@config) ->
			@api = null
			@isIframe = top isnt self

			##Init EventEmitter
			super()

			if FB?
				@fbAsyncInit()
			else
				window.fbAsyncInit = @fbAsyncInit
				@injectFB()
			
			##facebook like tracking
			@onReady (FB) =>
				FB.Event.subscribe 'edge.create', (url) =>
					@fireEvent 'onLike', url

				FB.Event.subscribe 'edge.remove', (url) =>
					@fireEvent 'onUnlike', url

		ui: (args...) =>
			@onReady (FB) ->
				FB.ui args...

		login: (callback, scope) =>
			if @loginStatus?.status? and @loginStatus.status is 'connected'
				return callback @loginStatus
			##else
			@onReady (FB) ->
				FB.login callback, scope

		onReady: (callback) =>
			if FB?
				callback FB
			else
				@addEvent 'fbInit', () =>
					callback FB

		fbAsyncInit: () =>
			@fbInit()
			@fbiFrameInit() if @isIframe

			FB.getLoginStatus (@loginStatus) => return

			@fireEvent 'fbInit'

		fbInit: () =>
			FB.init
				appId      : @config.appId
				channelUrl : @config.channelUrl
				status     : true
				cookie     : true
				xfbml      : true

		fbiFrameInit: () =>
			FB.Canvas.scrollTo 0,0
			FB.Canvas.setSize
				width: 810
				height: document.body.offsetHeight
			
			resizeInterval = () ->
				FB.Canvas.setSize
					width: 810
					height: document.body.offsetHeight

			window.setInterval resizeInterval, 500

		injectFB: () ->
			console.log $ 'facebook-jssdk'
			return if $ 'facebook-jssdk'

			if !$ 'fb-root'
				new Element('div'
					id: 'fb-root'
				).inject document.body

			script = new Element('script'
				async: true
				src: "//connect.facebook.net/en_US/all.js"
			).inject $$('script')[0], 'before'

		renderPlugins: (cb) ->
			@onReady () ->
				fbLike = $('.fb-like:not([fb-xfbml-state=rendered])')
				
				for button in fbLike
					FB.XFBML.parse button.getParent(), cb

		## http://developers.facebook.com/docs/reference/javascript/FB.Canvas.getPageInfo/
		getCanvasInfo: (cb) ->
			@onReady (FB) ->
				FB.Canvas.getPageInfo (info) ->
					cb info

		setCanvasSize: (width, height) ->
			@onReady (FB) ->
				FB.Canvas.setSize
					width: width
					height: height
				    

	return new Facebook module.config()
