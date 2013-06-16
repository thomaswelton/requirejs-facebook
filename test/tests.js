define(['Facebook'], function(Facebook){
  describe('Facebook init', function(){
    it('should return and object', function(){
      	(typeof(Facebook)).should.equal("object");
    });
  });
});