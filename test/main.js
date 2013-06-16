requirejs.config({
    config:{
        'Facebook': {
            'appId'      : '359907880785611',
            'channelUrl' : 'http://localhost:9001/channel.html'
        }
    },
    paths:{
        'domReady' : '../demo/components/requirejs-domready/domReady',
        'EventEmitter': '../demo/components/EventEmitter/dist/EventEmitter',
        'Facebook' : '../demo/Facebook',
        'chai': 'chai'
    }
});

require(['chai'], function(chai, Facebook){
	
	// Chai
	  var should = chai.should();
	 
	  /*globals mocha */
	  mocha.setup('bdd');
	 
	  require([
	    'tests.js',
	  ], function(require) {
	    mocha.run();
	  });

});