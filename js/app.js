// define our application and pull in ngRoute and ngAnimate
var datOS = angular.module('datOS', ['ngRoute', 'ngAnimate', 'highcharts-ng', 'ui.bootstrap', 'ngBlowAnimate', 'cgBusy', 'common-directives', 'ngCookies','nsPopover'])
.run(function($rootScope){
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
			console.log('DO SOMETHING');
			if($('body').hasClass('modal-open')){
				$('body').removeClass('modal-open');
				$('.modal-backdrop').css('display','none');
			}
	});
});


datOS.config(function($routeProvider) {

	$routeProvider

	/*.when('/home', {
	templateUrl: 'partials/home.html',
	controller: 'homeCtrl'
	})*/

	// Dashboard Page
	.when('/dashboard', {
		templateUrl : 'partials/dashboard.html',
		controller : 'dashboardCtrl'
	})

	// Dashboard Page
	.when('/configurations', {
		templateUrl : 'partials/configuration.html',
		controller : 'configurationCtrl'
	})

	// Policy Config Page
	.when('/policyConfig', {
		templateUrl : 'partials/policy-config.html',
		controller : 'policyConfigCtrl'
	})

	// Restore Points Page
	.when('/restorePoints', {
		templateUrl : 'partials/restore-points.html',
		controller : 'restorePointsCtrl'
	})

	// Policy Summary Page
	.when('/policySummary', {
		templateUrl : 'partials/policy-summary.html',
		controller : 'policySummaryCtrl'
	})

	// Policy Details Page
	.when('/policyDetails/:agtype/:aiid/:fname/:policyName', {
		templateUrl : 'partials/policy-details.html',
		controller : 'policyDetailsCtrl'
	})

	// Data Source Summary Page
	.when('/dataSourceSummary', {
		templateUrl : 'partials/data-source-summary.html',
		controller : 'dataSourceSummaryCtrl'
	})

	// Data Source Details Page
	.when('/dataSourceDetails/:agtype/:aiid/:shardid', {
		templateUrl : 'partials/data-source-details.html',
		controller : 'dataSourceDetailsCtrl'
	}).when('/reports', {
		templateUrl : 'partials/reports.html',
		controller : 'reportsCtrl'
	}).when('/storageTarget', {
		templateUrl : 'partials/storage-target.html',
		controller : 'storageTargetCtrl'
	}).when('/metadata', {
		templateUrl : 'partials/metadata.html',
		controller : 'metadataCtrl'
	}).when('/datosHub', {
		templateUrl : 'partials/datosHub.html',
		controller : 'datosHubCtrl'
	}).when('/reportsView', {
		templateUrl : 'partials/reports-view.html',
		controller : 'dashboardCtrl'
	}).when('/test', {
		templateUrl : 'partials/test.html',
		controller : 'testCtrl'
	}).otherwise({
		redirectTo : '/dashboard'
	});
	
});
