# Bower Facebook
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/917637450c836ec0373668c8df3c3d06 "githalytics.com")](http://githalytics.com/thomaswelton/bower-facebook)
[![Build Status](https://travis-ci.org/thomaswelton/bower-facebook.png)](https://travis-ci.org/thomaswelton/bower-facebook)
[![Dependency Status](https://david-dm.org/thomaswelton/bower-facebook.png)](https://david-dm.org/thomaswelton/bower-facebook)


AMD compatible Bower component written in CoffeeScript.


## Setup

This module utilises requirejs module configuration. It requires the following JS to be added to the page

```javascript
requirejs.config({
	config:{
		'Facebook': {
			'appId'      	: 'APP_ID',
			'channelUrl'	: 'CHANNEL_URL',
			'autoResize'	: false	,
			'status'     	: true,
			'cookie'     	: true,
			'xfbml'			: true,
		}
	}
});
```

* appId - FB Application ID (required)
* channelUrl - Absolute URL to your Fb channel.html file (required)
* autoResize - true / false (optional)
* status - FB.init config (optional - default true)
* cookie - FB.init config (optional - default true)
* xfbml - FB.init config (optional - default true)

The contents of `config.Facebook` will be passed to the contructor of the Facebook module when loaded.
The Faceobok module scan then be loaded as a requirejs module. It returns a single instance of the Facebook module.

The Facebook SDK can be accessed directly via `Facebook.FB`
Or can be access through helpers and wrappers


## Helpers

`Facebook.UI`
FB onReady wrapper for the [FB.ui method](https://developers.facebook.com/docs/reference/javascript/FB.ui/)

`Facebook.login`
FB onReady wrapper for the [FB.login method](http://developers.facebook.com/docs/reference/javascript/FB.login/)
It will also chech the login status of the user, so that calls to Facebook.login immeditaley execute the callback if the suer is logged in with triggering another FB.login call

`Facebook.renderPlugins`
Renders any XFBML plugins 

`Facebook.getCanvasInfo`
Wrapper for the [FB.Canvas.getPageInfo method](http://developers.facebook.com/docs/reference/javascript/FB.Canvas.getPageInfo/)

`Facebook.setCanvasSize(width, height)`
Wrapper for the [FB.Canvas.setSize method](http://developers.facebook.com/docs/reference/javascript/FB.Canvas.setSize/)


## Events

* onLike
* onUnlike
* fbInit

