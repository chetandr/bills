// Policy Details Page Controller
var datOS = angular.module('datOS');
var gscope;
datOS.controller('policySummaryCtrl', ['$q', '$scope', '$http', '$modal', 'getAllPolicies', 'getStatistics', 'getAllSchedules', 'getAll', 'getJobs','language',
function($q, $scope, $http, $modal, getAllPolicies, getStatistics, getAllSchedules, getAll, getJobs,language) {
	sc = $scope;
	$scope.pageHeading = 'Policy Summary';
	$scope.pageClass = 'policy-summery';
	$scope.mostFrequent = '';
	$scope.policyMaxVersions = '';
	
	language($scope)

	$scope.totalItems = 50;
	$scope.currentPage = 1;

	$scope.setPage = function(pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
	};

	$scope.maxSize = 5;
	$scope.bigTotalItems = 175;
	$scope.bigCurrentPage = 1;
	$scope.jobType = 'restore';
	
	$scope.changeTime = function(tm){
		if(tm == undefined) {
			return '-';
		}
		return moment(tm,'x').tz($scope.TimeZoneCountry).format('YYYY-MM-DD HH:mm');
    }
	// Get the Most Recent policy.
	//getAll($scope,[getStatistics]);
	$scope.allLoader = $q.all([getAll($scope).then(function($scope) {
		return getJobs($scope);
	}), getStatistics($scope)]);

	//$scope.allLoader = $q.all([$scope.statsLoader,$scope.policySchedulesLoader]);
	$scope.openScheduledRestoration = function(size) {

		var modalInstance = $modal.open({
			templateUrl : 'ScheduledRestorationModalContent.html',
			controller : 'modalScheduledRestorationCtrl',
			size : size
		});

		modalInstance.result.then(function() {

		}, function() {

		});
	};
	
	//List Policy
}]);

datOS.controller('modalScheduledRestorationCtrl', function($scope, $modalInstance) {

	$scope.ok = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});
