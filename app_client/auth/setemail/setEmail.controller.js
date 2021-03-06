(function() {
  
  angular
    .module('meanApp')
    .controller('setEmailCtrl', ['$location','$scope','authentication','$routeParams','meanData',setEmailCtrl]);

    function setEmailCtrl ($location,$scope,authentication,$routeParams, meanData) {

	$("#setemail_input").focus();
	var vm = this;
  $scope.$watch("setemail", function(newValue, oldValue) {
	  if(newValue.length>0){	
		  $scope.checking = true;
	    meanData.isEmailUnique($scope.setemail)
	      .success(function(data) {
		//alert(JSON.stringify($scope.username));

			$scope.emailExists = !data.is_unique;

	      })
	      .error(function (e) {
		console.log(e);
	      })
	      .finally(function() {
		  $scope.checking = false;
	      });
	  }
    //return true;
  });

    vm.onSubmit = function () {
      meanData
        .saveEmail($scope.setemail)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

      	console.log('SetEmail controller is running');

    }

})();

