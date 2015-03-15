// Policy Configuration Dial Page Controller
var datOS = angular.module('datOS');
var sc = {};
datOS.controller('headerConfigCtrl',['$q','$scope','$routeParams','$http','getAlldatasourceTypes','getManagementObjectByAgtype','getAllStore','getSchedule','getAll','createPolicy','createSchedule','$modal','$cookies', '$cookieStore','setTimeZoneData','getTimeZoneData',function($q,$scope,$routeParams,$http,getAlldatasourceTypes,getManagementObjectByAgtype,getAllStore,getSchedule,getAll,createPolicy,createSchedule,$modal,$cookies, $cookieStore,setTimeZoneData,getTimeZoneData) {
  


	sc = $scope;
	$scope.pageHeading = 'Header';
	

	$scope.setTimezone = function(size) {
		var modalInstance = $modal.open({
			templateUrl : 'timezoneModalContent.html',
			controller : 'ModalInstanceTimezoneCtrl',
			size : size
		});

		modalInstance.result.then(function(result) {
			$scope.timeDiff = result;
			$scope.sysTimeZone = result.zoneCode;
			$scope.zoneCode = result.timeDiff;
			$scope.zoneCountry = result.zoneCountry;
			setTimeZoneData($scope);
			console.log(result);
		}, function() {
			//alert(result);
		});
	};

}]);





datOS.controller('ModalInstanceTimezoneCtrl',['$q','$scope','$modalInstance','$cookies', '$cookieStore','setTimeZoneData','getTimeZoneData',function($q,$scope,$modalInstance,$cookies, $cookieStore,setTimeZoneData,getTimeZoneData) {


	$scope.ok = function() {
		//$modalInstance.dismiss('cancel');
		var  result =  {'zoneName' : $scope.timeZoneName,'timeDiff':$scope.timeDiff,'zoneCode':$scope.timeZone,'zoneCountry':$scope.zoneCountry };
		$modalInstance.close(result);
		 
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	getTimeZoneData($scope);
	$scope.timeZones = moment.tz.names();
	
	$scope.timeDiff = $scope.TimeZoneCode;
	$scope.timeZone = $scope.TimeZoneCode;
	$scope.zoneCountry = $scope.TimeZoneCountry;
	var country =  $scope.TimeZoneCountry.split('/')
	$scope.timeZoneName = "("+$scope.TimeZoneName+" "+$scope.TimeZoneCode+") " + country[0] +" ("+country[1]+") Time";
	
	
	
	
	$scope.changeZoneName = function() {
		if (this.timeZone != undefined) {
			$scope.timeZoneName = this.timeZone.zoneName;
			$scope.timeDiff = this.timeZone.timeDiff;
			$scope.timeZone = this.timeZone.zoneCode;
			$scope.zoneCountry = this.timeZone.zoneCountry;
		}
	}
}]);

