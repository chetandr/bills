// Policy Details page Controller
var datOS = angular.module('datOS');
var sc = {};
datOS.controller('dataSourceDetailsCtrl', ['$scope','$modal','$routeParams','getAll','getManagementObjectByAgtype','getAllVersions','removeSource',function($scope,$modal,$routeParams,getAll,getManagementObjectByAgtype,getAllVersions,removeSource) {
	 sc = $scope;
    $scope.pageClass = 'data-source-details';
    $scope.language = {	'mongo' : 'MongoDB','cassandra' : 'Cassandra','hadoop' : 'Haddop'}
    $scope.sourceTypeVal = $routeParams.agtype;
    $scope.shard_id = $routeParams.shardid;
	$scope.app_instance_id = $routeParams.aiid;
    
	$scope.allLoader = getAll($scope).then(function($scope) {
		return getManagementObjectByAgtype($scope);
	}).then(function($scope) {
		return getAllVersions($scope);
	});
	
	$scope.open = function(size) {

	var modalInstance = $modal.open({
			templateUrl : 'addDataSourceModal.html',
			controller : 'addDataSourceModalCtrl',
			size : size
		});

	};

	$scope.removeSource = function (){
		
		$scope.rmSourceDataObj = {
				"sourceType" : $scope.dataSourceType,
				"clusterName" : $scope.cluster[0]
		};
		console.log($scope.rmSourceDataObj);
		removeSource($scope);
}	
	
}]);
