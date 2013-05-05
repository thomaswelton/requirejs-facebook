(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['json!data', 'module', 'EventEmitter'], function(permissionsMap, module, EventEmitter) {
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
        this.requireUserInfo = __bind(this.requireUserInfo, this);
        this.getUserInfo = __bind(this.getUserInfo, this);
        this.getPermissions = __bind(this.getPermissions, this);
        this.getLoginStatus = __bind(this.getLoginStatus, this);
        this.login = __bind(this.login, this);
        this.requestPermission = __bind(this.requestPermission, this);
        this.hasPermissions = __bind(this.hasPermissions, this);
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

      Facebook.prototype.hasPermissions = function(perms) {
        var grantedPerms, intersection, permsArray;

        if (perms.trim().length === 0) {
          return true;
        }
        permsArray = perms.split(',');
        intersection = function(a, b) {
          var value, _i, _len, _ref, _results;

          if (a.length > b.length) {
            _ref = [b, a], a = _ref[0], b = _ref[1];
          }
          _results = [];
          for (_i = 0, _len = a.length; _i < _len; _i++) {
            value = a[_i];
            if (__indexOf.call(b, value) >= 0) {
              _results.push(value);
            }
          }
          return _results;
        };
        grantedPerms = intersection(permsArray, this.grantedPermissions);
        return grantedPerms.length === permsArray.length;
      };

      Facebook.prototype.requestPermission = function(scope, cb) {
        var _this = this;

        return FB.ui({
          method: 'oauth',
          scope: scope,
          display: 'popup'
        }, function() {
          _this.getPermissions();
          if (typeof cb === 'function') {
            return cb();
          }
        });
      };

      Facebook.prototype.login = function(obj) {
        var onCancel, onLogin, scope, _ref,
          _this = this;

        scope = obj.scope != null ? obj.scope.trim() : '';
        onLogin = obj.onLogin != null ? obj.onLogin : function() {};
        onCancel = obj.onCancel != null ? obj.onCancel : function() {};
        if ((((_ref = this.loginStatus) != null ? _ref.status : void 0) != null) && this.loginStatus.status === 'connected') {
          if (this.hasPermissions(scope)) {
            return onLogin(this.loginStatus.authResponse);
          } else {
            console.log('request', scope);
            return this.requestPermission(scope, function(response) {
              return onLogin(_this.loginStatus.authResponse);
            });
          }
        } else {
          return this.onReady(function(FB) {
            return FB.login(function(response) {
              if (response.authResponse) {
                if (obj.onLogin != null) {
                  return obj.onLogin(response.authResponse);
                }
              } else {
                return onCancel();
              }
            }, scope);
          });
        }
      };

      Facebook.prototype.getLoginStatus = function(cb) {
        var _this = this;

        return FB.getLoginStatus(function(loginStatus) {
          _this.loginStatus = loginStatus;
          console.log("Login Status:", _this.loginStatus);
          if (typeof cb === 'function') {
            return cb(_this.loginStatus);
          }
        });
      };

      Facebook.prototype.getPermissions = function(cb) {
        var _this = this;

        return this.onReady(function(FB) {
          return FB.api('/me?fields=permissions', function(response) {
            var permission;

            _this.grantedPermissions = (function() {
              var _results;

              _results = [];
              for (permission in response.permissions.data[0]) {
                _results.push(permission);
              }
              return _results;
            })();
            if (typeof cb === 'function') {
              return cb(_this.grantedPermissions);
            }
          });
        });
      };

      Facebook.prototype.getUserInfo = function(data, cb) {
        var fields,
          _this = this;

        fields = data.join(',');
        return this.onReady(function(FB) {
          return FB.api("/me?fields=" + fields, function(response) {
            if (typeof cb === 'function') {
              return cb(response);
            }
          });
        });
      };

      Facebook.prototype.requireUserInfo = function(data, cb) {
        var field, getInfo, requiredPermissions, requiredScope,
          _this = this;

        requiredPermissions = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            field = data[_i];
            if (permissionsMap[field] != null) {
              _results.push(permissionsMap[field]);
            }
          }
          return _results;
        })();
        requiredScope = requiredPermissions.join(',');
        getInfo = function() {
          return _this.getUserInfo(data, cb);
        };
        if (this.loginStatus.status !== 'connected') {
          return this.login({
            scope: requiredScope,
            onLogin: getInfo
          });
        } else {
          if (this.hasPermissions(requiredScope)) {
            return getInfo();
          } else {
            return this.requestPermission(requiredScope, getInfo);
          }
        }
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

        FB.init(this.config);
        this.getLoginStatus(function(loginStatus) {
          if (loginStatus.status === 'connected') {
            return _this.getPermissions(function() {
              return _this.fireEvent('fbInit');
            });
          } else {
            return _this.fireEvent('fbInit');
          }
        });
        FB.Event.subscribe('auth.login', function(loginStatus) {
          _this.loginStatus = loginStatus;
          console.log('FB.Event: auth.login');
          return _this.fireEvent('onLogin');
        });
        FB.Event.subscribe('auth.statusChange', function(loginStatus) {
          _this.loginStatus = loginStatus;
          console.log('FB.Event: auth.statusChange');
          return _this.fireEvent('onStatusChange');
        });
        return FB.Event.subscribe('auth.authResponseChange', function(loginStatus) {
          _this.loginStatus = loginStatus;
          console.log('FB.Event: auth.authResponseChange');
          return _this.fireEvent('onAuthChange', _this.loginStatus.status === 'connected');
        });
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
              if (--unrenderedCount === 0) {
                return cb();
              }
            };
            _results = [];
            for (_i = 0, _len = plugins.length; _i < _len; _i++) {
              plugin = plugins[_i];
              _results.push(FB.XFBML.parse(plugin, cbStack));
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
