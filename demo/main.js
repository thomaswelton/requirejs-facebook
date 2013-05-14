(function() {
  require(['Facebook', 'mootools', 'domReady!'], function(Facebook) {
    console.log('main init');
    $('logout').addEvent('click', function(event) {
      return Facebook.logout(function() {
        return console.log('logged out');
      });
    });
    $$('[data-fb-login]').addEvent('click', function(event) {
      var scope;

      scope = this.getProperty('data-fb-login');
      return Facebook.login({
        scope: scope,
        onLogin: function(authResponse) {
          return console.log('logged in', authResponse);
        },
        onCancel: function() {
          return console.log('login canceled');
        }
      });
    });
    Facebook.addEvent('onAuthChange', function(loggedIn) {
      if (loggedIn) {
        return console.log('The user logged in');
      } else {
        return console.log('The user logged out');
      }
    });
    return $$('form.permissions')[0].addEvent('submit', function(event) {
      var checked, el, form, requestedFields, resultsOutput;

      form = event.target;
      resultsOutput = form.getElement('textarea');
      event.preventDefault();
      checked = form.getElements('input:checked');
      requestedFields = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = checked.length; _i < _len; _i++) {
          el = checked[_i];
          _results.push(el.getProperty('value'));
        }
        return _results;
      })();
      return Facebook.requireUserInfo(requestedFields, function(response) {
        console.log(response);
        return resultsOutput.innerText = JSON.encode(response);
      });
    });
  });

}).call(this);
