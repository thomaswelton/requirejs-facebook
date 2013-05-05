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
        console.log('do logged in stuff');
        return Facebook.getUserInfo(['name', 'hometown'], function(response) {
          return console.log('I did logged in stuff', response);
        });
      } else {
        return console.log('do logged out stuff');
      }
    });
    return $('getEmail').addEvent('click', function(event) {
      return Facebook.requireUserInfo(['email', 'languages', 'name', 'hometown', 'religion', 'relationship_status'], function(response) {
        return console.log(response);
      });
    });
  });

}).call(this);
