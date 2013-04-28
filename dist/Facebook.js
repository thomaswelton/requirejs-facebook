(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['EventEmitter', 'module', 'jquery'], function(EventEmitter, module, $) {
    var Facebook;

    Facebook = (function(_super) {
      __extends(Facebook, _super);

      function Facebook(config) {
        var _this = this;

        this.config = config;
        this.fbiFrameInit = __bind(this.fbiFrameInit, this);
        this.fbInit = __bind(this.fbInit, this);
        this.fbAsyncInit = __bind(this.fbAsyncInit, this);
        this.onReady = __bind(this.onReady, this);
        this.login = __bind(this.login, this);
        this.ui = __bind(this.ui, this);
        this.api = null;
        this.isIframe = top !== self;
        Facebook.__super__.constructor.call(this);
        if (typeof FB !== "undefined" && FB !== null) {
          this.fbAsyncInit();
        } else {
          window.fbAsyncInit = this.fbAsyncInit;
          this.injectFB();
        }
        this.onReady(function(FB) {
          FB.Event.subscribe('edge.create', function(url) {
            return _this.fireEvent('onLike', url);
          });
          return FB.Event.subscribe('edge.remove', function(url) {
            return _this.fireEvent('onUnlike', url);
          });
        });
      }

      Facebook.prototype.ui = function() {
        var args;

        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.onReady(function(FB) {
          return FB.ui.apply(FB, args);
        });
      };

      Facebook.prototype.login = function(callback, scope) {
        var _ref;

        if ((((_ref = this.loginStatus) != null ? _ref.status : void 0) != null) && this.loginStatus.status === 'connected') {
          return callback(this.loginStatus);
        }
        return this.onReady(function(FB) {
          return FB.login(callback, scope);
        });
      };

      Facebook.prototype.onReady = function(callback) {
        var _this = this;

        if (typeof FB !== "undefined" && FB !== null) {
          return callback(FB);
        } else {
          return this.addEvent('fbInit', function() {
            return callback(FB);
          });
        }
      };

      Facebook.prototype.fbAsyncInit = function() {
        var _this = this;

        this.fbInit();
        if (this.isIframe) {
          this.fbiFrameInit();
        }
        FB.getLoginStatus(function(loginStatus) {
          _this.loginStatus = loginStatus;
        });
        return this.fireEvent('fbInit');
      };

      Facebook.prototype.fbInit = function() {
        return FB.init({
          appId: this.config.appId,
          channelUrl: this.config.channelUrl,
          status: true,
          cookie: true,
          xfbml: true
        });
      };

      Facebook.prototype.fbiFrameInit = function() {
        var resizeInterval;

        FB.Canvas.scrollTo(0, 0);
        FB.Canvas.setSize({
          width: 810,
          height: document.body.offsetHeight
        });
        resizeInterval = function() {
          return FB.Canvas.setSize({
            width: 810,
            height: document.body.offsetHeight
          });
        };
        return window.setInterval(resizeInterval, 500);
      };

      Facebook.prototype.injectFB = function() {
        var fbsrc, root, script;

        if ($('facebook-jssdk').length) {
          return;
        }
        if ($('fb-root').length === 0) {
          root = $("<div id='fb-root'></div>");
          $('body').append(root);
        }
        fbsrc = '//connect.facebook.net/en_US/all.js';
        script = $("<script async=true src='" + fbsrc + "'></script>");
        return $('script').first().prepend(script);
      };

      Facebook.prototype.renderPlugins = function(cb) {
        return this.onReady(function() {
          var button, fbLike, _i, _len, _results;

          fbLike = $('.fb-like:not([fb-xfbml-state=rendered])');
          _results = [];
          for (_i = 0, _len = fbLike.length; _i < _len; _i++) {
            button = fbLike[_i];
            _results.push(FB.XFBML.parse(button.getParent(), cb));
          }
          return _results;
        });
      };

      Facebook.prototype.getCanvasInfo = function(cb) {
        return this.onReady(function(FB) {
          return FB.Canvas.getPageInfo(function(info) {
            return cb(info);
          });
        });
      };

      Facebook.prototype.setCanvasSize = function(width, height) {
        return this.onReady(function(FB) {
          return FB.Canvas.setSize({
            width: width,
            height: height
          });
        });
      };

      return Facebook;

    })(EventEmitter);
    return new Facebook(module.config());
  });

}).call(this);
