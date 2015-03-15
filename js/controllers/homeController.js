// Data Source Summery Page Controller
var datOS = angular.module('datOS');

datOS.controller('homeCtrl', function($scope, $modal, $location) {
    
	$scope.open = function(size) {

		var modalInstance = $modal.open({
			templateUrl : 'homeSettings.html',
            controller : 'homeSettingsModalCtrl',
			size : size
		});

	};

});




datOS.controller('homeSettingsModalCtrl', function($scope, $http, $modalInstance) {

	$scope.languages = [
        {"lang" : "English"},        
        {"lang" : "French"},
        {"lang" : "Spanish"}
    ];
    
    $scope.selectedLang = 'English';
    
	$scope.changeLanguage = function() {
		if (this.ele != undefined) {
			 $scope.selectedLang = this.ele.lang;
			$scope.dropdownSelect = true;
		}
	}
    
	$scope.timeZones = moment.tz.names();
	$scope.timeZoneName = "(GMT - 08:00) United States (Los Angeles) Time";
	$scope.timeDiff = '-08:00';
	$scope.timeZone = 'GMT';
	$scope.changeZoneName = function() {
		if (this.timeZone != undefined) {
			$scope.timeZoneName = this.timeZone.zoneName;
			$scope.timeDiff = this.timeZone.timeDiff;
			$scope.timeZone = this.timeZone.zoneCode;
		}
	}
    
	
    $scope.submitDsModalData = function() {
		
	$scope.submitDataObj = {
			"app_instance_id":$scope.app_instance_id,
			"sourceType":$scope.sourceTypeVal,
			"source_ip":angular.element('#source_ip').val(),
			"source_port":angular.element('#source_port').val(),
			"cluster_name":angular.element('#cluster_name').val(),
			"userName":angular.element('#userName').val(),
			"password":angular.element('#dsPassword').val()
	}
	console.log($scope.submitDataObj);
	//Create a http request to submit the data to the REST server.
	$http({
			method  : 'POST',
			url     : apiURL + 'addsource',
			data    : $.param($scope.submitDataObj),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		})
		.success(function(data) {
			if(data.Data[0].message.search('[ERROR]')>0){
				toastr["error"]("Failed to add source.");
			} else {
				$scope.dataSourceModalSucessMessage = true;
			}
		});

		$scope.dataSourceModalSucess = true;
		$scope.dataSourceModalSubmit = true;
	};
	$scope.edit = function() {
		console.log("edited");
		$scope.dataSourceModalSucess = false;
		$scope.dataSourceModalSubmit = false;
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');

	};

	$scope.sourceTypes = [{
		"app_instance_id" : "mongo0",
		"agtype" : "mongo",
		"shard_id" : "ip-172-31-9-244",
		"shard_port" : "27017",
		"undefined" : ""
	}, {
		"app_instance_id" : "cc",
		"agtype" : "cassandra",
		"shard_id" : "127.0.0.2",
		"shard_port" : "7199",
		"undefined" : ""
	}];
	$scope.sourceType = $scope.sourceTypes[0].app_instance_id;
	$scope.sourceTypeVal = $scope.sourceTypes[0].agtype;

	//Change the Source type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeSourceType = function() {
		if (this.sourceType != undefined) {
			$scope.sourceTypeVal = this.sourceType.agtype;
			$scope.sourceType = this.sourceType.app_instance_id;
		}
	}

	$scope.storageTypes = [{
		"app_instance_id" : "vfs_store",
		"agtype" : "NFS",

	}, {
		"app_instance_id" : "swift_store",
		"agtype" : "Swift",

	}];
	$scope.storageType = $scope.storageTypes[0].app_instance_id;
	$scope.storageTypeVal = $scope.storageTypes[0].agtype;
	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Haddop'
	}
    
	//Change the Source type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeStorageType = function() {
		if (this.storageType != undefined) {
			$scope.storageTypeVal = this.storageType.agtype;
			$scope.storageType = this.storageType.app_instance_id;
		}

		if ($scope.storageType == "swift_store") {
			$scope.showSwift = true;
		} else {
			$scope.showSwift = false;
		}

	}
	
	$scope.submitStorageTargetData = function() {
	
	$scope.submitDataObj = {
			"stype":$scope.storageType,
			"sname":angular.element('#storage_name').val(),
			"surl":angular.element('#storage_URL').val(),
			"sauth":angular.element('#storageAuthUsername').val(),
			"storageAuthPass":angular.element('#storageAuthPass').val(),
			"storageAuthRole":angular.element('#storageAuthRole').val()
	}
	console.log($scope.submitDataObj);
	//Create a http request to submit the data to the REST server.
	$http({
			method  : 'POST',
			url     : apiURL + 'addstore',
			data    : $.param($scope.submitDataObj),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		})
		.success(function(data) {
			if(data.Data[0].message.search('[ERROR]')>0){
				toastr["error"]("Failed to add Store.");
			} else {
				$scope.dataSourceModalSucessMessage = true;
			}
		});

		$scope.dataSourceModalSucess = true;
		$scope.dataSourceModalSubmit = true;
	};
	
});
