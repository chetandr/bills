var datOS = angular.module('datOS');

// createPolicy : Post  policy Data
// used on : PolicyMakers page
datOS.factory('createPolicy', ['$http',
function($http) {
	return function($scope) {
		var target = apiURL + 'policy/' + $scope.agtype + '/' + $scope.aiid + '/' + $scope.fname + '/' + $scope.policyName;
		$scope.LoaderAddPolicy = true;
		$scope.apiLoader = $http({
			method : 'POST',
			url : apiURL + 'policy',
			data : $.param($scope.recoveryDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.successAddPolicy = true;
			$scope.LoaderAddPolicy = false;
			console.log(data);
		});
	}
}]);

// removePolicy : Post  policy Data
// used on : Policy Details page
datOS.factory('removePolicy', ['$http', '$q',
function($http, $q) {
	return function($scope) {
		var deferred = $q.defer();
		$scope.LoaderRemovePolicy = true;
		$scope.rmPolicyLoader = $http({
			method : 'POST',
			url : apiURL + 'rmpolicy',
			data : $.param($scope.rmDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {

			$scope.successAddPolicy = true;
			$scope.LoaderAddPolicy = false;
			$scope.resData = data;
			return deferred.resolve($scope);
		});
		return deferred.promise;
	}
}]);

// createSchedule : Post Schedule Data
// used on : PolicyMakers page
datOS.factory('createSchedule', ['$http',
function($http) {
	return function($scope) {
		$scope.LoaderAddSchedule = true;
		$scope.apiLoader = $http({
			method : 'POST',
			url : apiURL + 'addSchedule',
			data : $.param($scope.sheduleDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.LoaderAddSchedule = false;
			$scope.successAddSchedule = true;
			console.log(data);
		});
	}
}]);

// retrieve : Post Policy retrieve Data
// used on : Restore Point page
datOS.factory('retrieve', ['$http',
function($http) {
	return function($scope) {
		$scope.LoaderRetrieve = true;
		$scope.apiLoader = $http({
			method : 'POST',
			url : apiURL + 'retrieve',
			data : $.param($scope.restoreDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.LoaderRetrieve = false;
			$scope.successRetrieve = true;
			console.log(data);
		});
	}
}]);

// addsource : Post addsource Data
// used on : Data Source summary page
datOS.factory('addsource', ['$http',
function($http) {

	return function($scope) {

		// $scope.rScope.$apply();

		$scope.LoaderAddSource = $http({
			method : 'POST',
			url : apiURL + 'addsource',
			data : $.param($scope.submitDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			if(data.Status == 'Success') {
				$scope.successAddSource = true;
				$scope.rScope.sourceTypes = [];
				for(k in $scope.submitDataObj) {
					$scope.rScope.sourceTypes[$scope.rScope.sourceTypes.length] = $scope.submitDataObj[k];
				}
			} else {
				toastr["error"](data.Data.message);
				$scope.dataSourceModalSubmit = false;
			}
		});
	}
}]);

// addstore : Post addstore Data
// used on : Configuration page
datOS.factory('addstore', ['$http',
function($http) {
	return function($scope) {

		$scope.LoaderAddStore = $http({
			method : 'POST',
			url : apiURL + 'addstore',
			data : $.param($scope.submitDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.successAddStore = true;
			$scope.rScope.storageTargets = [];
			for(k in $scope.submitDataObj) {
				$scope.rScope.storageTargets[$scope.rScope.storageTargets.length] = $scope.submitDataObj[k];
			}
			console.log(data);
		});
	}
}]);

// removeSource : Post Source  Data
// used on : Data Source Details page
datOS.factory('removeSource', ['$http', '$q',
function($http, $q) {
	return function($scope) {
		var deferred = $q.defer();
		$scope.LoaderRemovePolicy = true;
		$scope.rmPolicyLoader = $http({
			method : 'POST',
			url : apiURL + 'rmsource',
			data : $.param($scope.rmSourceDataObj),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			return deferred.resolve($scope);
		});
		return deferred.promise;
	}
}]);
