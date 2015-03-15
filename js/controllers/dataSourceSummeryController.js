// Data Source Summery Page Controller
var datOS = angular.module('datOS');

var sc = {};

datOS.controller('dataSourceSummaryCtrl', ['$q', '$scope', '$modal', '$http', 'getStatistics', 'getAll', 'getManagementObjectByAgtype',
function($q, $scope, $modal, $http, getStatistics, getAll, getManagementObjectByAgtype) {
	sc = $scope;
	console.log('Data SourceSummary Called');
	$scope.pageHeading = 'Data Source Summary';
	$scope.pageClass = 'data-source-summery';

	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Hadoop'
	}
	// Table Pagination
	$scope.totalItems = 50;
	$scope.currentPage = 1;

	//getAll($scope, [getManagementObjectByAgtype, getStatistics]);
	//getAllPoliciesWithSchedules($scope);
	$scope.allLoader = getAll($scope).then(function($scope) {
		return getManagementObjectByAgtype($scope);
	}).then(function($scope) {
		getStatistics($scope)
	});

	$scope.setPage = function(pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
	};

	$scope.maxSize = 5;
	$scope.bigTotalItems = 175;
	$scope.bigCurrentPage = 1;

	$scope.addPolicyClick = function(path) {
		$location.path(path);
	};
	$http.get(apiURL + 'getstats').success(function(data, status, headers, config) {
		console.log(data);
		$scope.stats = data.Data;
	});
	$scope.open = function(size) {

		var modalInstance = $modal.open({
			templateUrl : 'addDataSourceModal.html',
			controller : 'addDataSourceModalInstanceCtrl',
			size : size
		});

	};
}]);

datOS.controller('addDataSourceModalInstanceCtrl', ['$q', '$scope', '$modal', '$http', '$modalInstance', 'addsource',
function($q, $scope, $modal, $http, $modalInstance, addsource) {
	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Hadoop'
	}
	$scope.submitDsModalData = function() {

		$scope.submitDataObj = {
			"app_instance_id" : $scope.app_instance_id,
			"sourceType" : $scope.sourceTypeVal,
			"source_ip" : angular.element('#source_ip').val(),
			"source_port" : angular.element('#source_port').val(),
			"cluster_name" : angular.element('#cluster_name').val(),
			"userName" : angular.element('#userName').val(),
			"password" : angular.element('#dsPassword').val()
		}
		console.log($scope.submitDataObj);

		//Create a http request to submit the data to the REST server.
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
	// Get the source Type	.
	/*$http.get(apiURL+'datasourceTypes').
	 success(function(data, status, headers, config) {
	 $scope.sourceTypes = data.Data;
	 $scope.sourceTypeVal = $scope.sourceTypes[0].agtype;
	 $scope.sourceType = $scope.sourceTypes[0].app_instance_id;
	 $scope.shard_id = $scope.sourceTypes[0].shard_id;

	 }).
	 error(function(data, status, headers, config) {
	 alert("Error");
	 });
	 */
	$scope.sourceTypes = [{
		"app_instance_id" : "mongo0",
		"agtype" : "mongo",
	}, {
		"app_instance_id" : "cc",
		"agtype" : "cassandra",
	}];

	$scope.app_instance_id = $scope.sourceTypes[0].app_instance_id;
	$scope.sourceTypeVal = $scope.sourceTypes[0].agtype;

	//Change the Source type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeSourceType = function() {
		if(this.sourceType != undefined) {
			$scope.sourceTypeVal = this.sourceType.agtype;
			$scope.sourceType = this.sourceType.app_instance_id;
		}
	}
}]);
