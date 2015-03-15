// Dashboard page Controller
dashsc = {};
datOS.controller('dashboardCtrl', ['$q', '$scope', '$routeParams', '$http', '$modal', 'getStatistics', 'getAll',
function($q, $scope, $routeParams, $http, $modal, getStatistics, getAll) {
	dashsc = $scope;
	$scope.pageHeading = 'Dashboard';
	$scope.pageClass = 'dashboard';
	$scope.listStoreLoader = false;

	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Haddop'
	}
	console.log($scope);
	$scope.allLoader = $q.all([getAll($scope),getStatistics($scope)]);
}]);
