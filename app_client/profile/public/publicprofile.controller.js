(function() {
  
  angular
    .module('meanApp')
    .controller('publicprofileCtrl', publicprofileCtrl);

  publicprofileCtrl.$inject = ['$location','$routeParams', 'meanData', '$scope', '$http', 'authentication'];
  function publicprofileCtrl($location, $routeParams, meanData, $scope, $http, authentication) {
    var vm = this;

    vm.user = {};
	var username = $routeParams.username;
    meanData.getPublicProfile(username)
      .success(function(data) {
        vm.jsondata = data;
	//var json_res=data;
	//alert();
	//var redirect_to=data.redirect_to;
	//alert(JSON.stringify(data));	
	//window.location = redirect_to;
	if(!data){
		$location.path('/');
	}
	if(authentication.isLoggedIn() && authentication.currentUser().email != data.email){
		document.getElementById("connect_btn").style.display = 'block';
	}else{
		document.getElementById("connect_btn").style.display = 'none';
	}
      })
      .error(function (e) {
        console.log(e);
      });

	vm.connect_user = function(){
		meanData.connectToUser(username)
		.success(function(data) {
	      	})
	      	.error(function (e) {
			console.log(e);
	       	});
	}
	

  }

})();
