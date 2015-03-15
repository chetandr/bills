// Data Source Summery Page Controller
var datOS = angular.module('datOS');
var rScope = {}
datOS.controller('configurationCtrl', ['$scope', '$modal', '$location','getAll',function($scope, $modal, $location,getAll) {
    sc = $scope;
    console.log('Configuration Called');
	$scope.pageHeading = 'Workflows';
	$scope.pageClass = 'data-source-summery';
	$scope.openCreatePolicy = function(path) {
		$location.path(path);
	};
    getAll($scope);
    rScope = $scope;
	$scope.open = function(size) {

		var modalInstance = $modal.open({
			templateUrl : 'addDataSourceModal.html',
			controller : 'addDataSourceModalCtrl',
			size : size
		});

	};

	$scope.open2 = function(size) {
		var modalInstance = $modal.open({
			templateUrl : 'addStorageTargetModal.html',
			controller : 'addDataSourceModalCtrl',
			size : size
		});

	};

}]);


datOS.controller('addDataSourceModalCtrl', ['$q','$scope','$modal','$http','$modalInstance','addsource','addstore',function($q,$scope, $modal,$http,$modalInstance,addsource,addstore) {

	$scope.submitDsModalData = function() {
		
	$scope.submitDataObj = {
			"app_instance_id":angular.element('#cluster_name').val(),
			"sourceType":$scope.sourceTypeVal,
			"source_ip":angular.element('#source_ip').val(),
			"source_port":angular.element('#source_port').val(),
			"cluster_name":angular.element('#cluster_name').val(),
			"userName":angular.element('#userName').val(),
			"password":-4//angular.element('#dsPassword').val()
	}
	console.log($scope.submitDataObj);
	//Create a http request to submit the data to the REST server.
        $scope.rScope = rScope;
	addsource($scope);

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
	$scope.rScope = rScope;
	var sauth = angular.element('#storageAuthUsername').val();
	if(sauth == ""){
		sauth = 'none';
	}
	$scope.submitDataObj = {
			"stype":$scope.storageType,
			"sname":angular.element('#storage_name').val(),
			"surl":angular.element('#storage_URL').val(),
			"sauth":sauth,
			"storageAuthPass":angular.element('#storageAuthPass').val(),
			"storageAuthRole":angular.element('#storageAuthRole').val()
	}
	
	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Haddop'
	}
    
	//Create a http request to submit the data to the REST server.
	addstore($scope);

		$scope.dataSourceModalSucess = true;
		$scope.dataSourceModalSubmit = true;
	};
	
}]);
