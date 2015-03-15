// Policy Details page Controller
var datOS = angular.module('datOS');

datOS.controller('policyDetailsCtrl', ['$scope', '$routeParams', '$http', 'getAll', 'getSchedule', 'getVersions', 'getTimeZoneData', 'removePolicy', '$location',
function($scope, $routeParams, $http, getAll, getSchedule, getAllVersions, getTimeZoneData, removePolicy, $location) {
	// define the constants required for this controller
	sc = $scope;
	$scope.pageClass = 'policy-details';
	$scope.policyName = $routeParams.policyName;
	$scope.aiid = $routeParams.aiid;
	$scope.agtype = $routeParams.agtype;
	$scope.fname = $routeParams.fname;
	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Hadoop'
	}
		$scope.oneAtATime = true;
	$scope.status = [{
		isFirstOpen : true,
		isFirstDisabled : false,
		//open : true
	}];
	
// get All the policies and assign them to the scope.
	$scope.allLoader = getAll($scope).then(function($scope) {
		return getSchedule($scope);
	}).then(function($scope) {
		return getAllVersions($scope);
	});
	getTimeZoneData($scope);
	$scope.changeTime = function(tm, fmt) {

		return moment(tm * 1000, 'x').tz($scope.TimeZoneCountry).format(fmt);
	}
	$scope.getScheduleStatus = function(scheduleStartTime) {
		if(moment().unix() > parseInt(scheduleStartTime)) {
			return 'Running';
		} else {
			return 'Scheduled';
		}
	}
	$scope.getDataSize = function(size){
		if(size < 1024){
			return size +' Bytes';
		} else if(size/1024 < 1024){
			return (size/1024).toFixed(2) +' KB';
		} else if((size/1024)/1024 < 1024){
			return ((size/1024)/1024).toFixed(2)  +' MB';
		} else if(((size/1024)/1024)/1024 < 1024){
			return (((size/1024)/1024)/1024).toFixed(2) +' GB';
		} else {
			return ((((size/1024)/1024)/1024)/1024).toFixed(2) +' TB';
		}
	}
	$scope.getPolicyState = function(policyStartTime) {
		if(moment().unix() > parseInt(policyStartTime)) {
			return 'Active';
		} else {
			return 'Scheduled';
		}
	}
	$scope.getPolicyActiveFor = function(policyStartTime) {
		var activeSeconds = moment().unix() - parseInt(policyStartTime)
		if(activeSeconds > 60) {
			if(activeSeconds / 60 > 60) {
				// minutes
				if((activeSeconds / 3600) > 60) {
					// hours
					if((activeSeconds / 3600) / 24 >= 1) {
						//Day(s)
						return Math.round(activeSeconds / 86400) + " days";
					}
				} else {
					return Math.round(activeSeconds / 3600) + " hrs";
				}
			} else {
				return Math.round(activeSeconds / 60) + " min";
			}
		} else {
			return activeSeconds + " sec";
		}
	}
	$scope.removePolicy = function($q) {
		$scope.rmDataObj = {
			'managementObject' : $scope.fname,
			'sourceType' : $scope.agtype,
			'clusterName' : $scope.aiid
		}
		removePolicy($scope).then(function($scope) {
			console.log($scope.resData);
			if($scope.resData.Status == 'Success') {
				toastr["success"]("You have successfully deleted the policy, " + $scope.policyName);
				$location.path('/policySummary');
			} else {
				toastr["error"]($scope.resData.Data.message);
			}
		});
	}
}]);
