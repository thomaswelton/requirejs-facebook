(function() {
  require(['Facebook', 'mootools', 'domReady!'], function(Facebook) {
    console.log('init');
    $$('[data-fb-logout]').addEvent('click', function(event) {
      return Facebook.logout(function() {
        return console.log('logged out');
      });
    });
    return $$('[data-fb-login]').addEvent('click', function(event) {
      var scope;

      scope = this.getProperty('data-fb-login');
      return Facebook.login({
        scope: scope,
        onLogin: function(authResponse) {
          return console.log(authResponse);
        },
        onCancel: function() {
          return console.log('login canceled');
        }
      });
    });
  });

}).call(this);
