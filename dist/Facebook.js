(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['EventEmitter', 'module'], function(EventEmitter, module) {
    var Facebook;

    Facebook = (function(_super) {
      __extends(Facebook, _super);

      function Facebook(config) {
        var defaults, key, value, _ref,
          _this = this;

        this.config = config;
        this.fbiFrameInit = __bind(this.fbiFrameInit, this);
        this.fbInit = __bind(this.fbInit, this);
        this.fbAsyncInit = __bind(this.fbAsyncInit, this);
        this.onReady = __bind(this.onReady, this);
        this.getLoginStatus = __bind(this.getLoginStatus, this);
        this.login = __bind(this.login, this);
        this.logout = __bind(this.logout, this);
        this.ui = __bind(this.ui, this);
        Facebook.__super__.constructor.call(this);
        console.log('Facebook init');
        defaults = {
          status: true,
          cookie: true,
          xfbml: true
        };
        _ref = this.config;
        for (key in _ref) {
          value = _ref[key];
          console.log(key, value);
          defaults[key] = value;
        }
        this.config = defaults;
        this.api = null;
        this.isIframe = top !== self;
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

      Facebook.prototype.logout = function(cb) {
        var _this = this;

        return this.onReady(function(FB) {
          var _ref;

          console.log(_this.loginStatus);
          if ((((_ref = _this.loginStatus) != null ? _ref.status : void 0) != null) && _this.loginStatus.status === 'connected') {
            return FB.logout(function(response) {
              if (typeof cb === 'function') {
                return cb(response);
              }
            });
          } else {
            console.warn('User is already logged out');
            if (typeof cb === 'function') {
              return cb();
            }
          }
        });
      };

      Facebook.prototype.login = function(obj) {
        var scope, _ref;

        scope = obj.scope != null ? obj.scope : '';
        if ((((_ref = this.loginStatus) != null ? _ref.status : void 0) != null) && this.loginStatus.status === 'connected') {
          if (obj.onLogin != null) {
            obj.onLogin(this.loginStatus.authResponse);
          }
          return;
        }
        return this.onReady(function(FB) {
          return FB.login(function(response) {
            if (response.authResponse) {
              if (obj.onLogin != null) {
                return obj.onLogin(response.authResponse);
              }
            } else {
              if (obj.onCancel != null) {
                return obj.onCancel();
              }
            }
          }, scope);
        });
      };

      Facebook.prototype.getLoginStatus = function(cb) {
        var _this = this;

        return FB.getLoginStatus(function(loginStatus) {
          _this.loginStatus = loginStatus;
          if (typeof cb === 'function') {
            return cb(_this.loginStatus);
          }
        });
      };

      Facebook.prototype.onReady = function(callback) {
        var _this = this;

        if (typeof FB !== "undefined" && FB !== null) {
          return callback(FB);
        } else {
          return this.once('fbInit', function() {
            return callback(FB);
          });
        }
      };

      Facebook.prototype.fbAsyncInit = function() {
        this.fbInit();
        if (this.isIframe) {
          return this.fbiFrameInit();
        }
      };

      Facebook.prototype.fbInit = function() {
        var _this = this;

        FB.init({
          appId: this.config.appId,
          channelUrl: this.config.channelUrl,
          status: this.config.status,
          cookie: this.config.cookie,
          xfbml: this.config.xfbml
        });
        this.getLoginStatus();
        FB.Event.subscribe('auth.login', function(loginStatus) {
          _this.loginStatus = loginStatus;
          return _this.fireEvent('onLogin');
        });
        FB.Event.subscribe('auth.statusChange', function(loginStatus) {
          _this.loginStatus = loginStatus;
          return _this.fireEvent('onStatusChange');
        });
        FB.Event.subscribe('auth.authResponseChange', function(loginStatus) {
          _this.loginStatus = loginStatus;
          return _this.fireEvent('onAuthChange');
        });
        return this.fireEvent('fbInit');
      };

      Facebook.prototype.fbiFrameInit = function() {
        var resizeInterval;

        FB.Canvas.scrollTo(0, 0);
        FB.Canvas.setSize({
          width: 810,
          height: document.body.offsetHeight
        });
        if ((this.config.autoResize != null) && this.config.autoResize) {
          resizeInterval = function() {
            return FB.Canvas.setSize({
              width: 810,
              height: document.body.offsetHeight
            });
          };
          return window.setInterval(resizeInterval, 500);
        }
      };

      Facebook.prototype.injectFB = function() {
        var protocol, root;

        if (document.getElementById('facebook-jssdk')) {
          return;
        }
        if (!document.getElementById('fb-root')) {
          root = document.createElement('div');
          root.setAttribute('id', 'fb-root');
          document.body.appendChild(root);
        }
        protocol = location.protocol === 'https:' ? 'https:' : 'http:';
        return requirejs([protocol + '//connect.facebook.net/en_US/all.js']);
      };

      Facebook.prototype.renderPlugins = function(cb) {
        return this.onReady(function() {
          var cbStack, plugin, plugins, unrenderedCount, _i, _len, _results;

          if (document.querySelectorAll != null) {
            plugins = document.body.querySelectorAll('.fb-like:not([fb-xfbml-state=rendered])');
            unrenderedCount = plugins.length;
            cbStack = function() {
              unrenderedCount--;
              if (unrenderedCount === 0) {
                return cb();
              }
            };
            _results = [];
            for (_i = 0, _len = plugins.length; _i < _len; _i++) {
              plugin = plugins[_i];
              _results.push(FB.XFBML.parse(document.body, cbStack));
            }
            return _results;
          } else {
            return FB.XFBML.parse(document.body, cb);
          }
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
