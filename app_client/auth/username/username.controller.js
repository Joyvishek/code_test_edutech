(function() {
  
  angular
    .module('meanApp')
    .controller('usernameCtrl', ['$location','$scope','authentication','$routeParams','meanData',usernameCtrl]);

    function usernameCtrl ($location,$scope,authentication,$routeParams, meanData) {


	var vm = this;

      	console.log('Username controller is running');

    }

})();