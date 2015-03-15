// datosHub Page Controller
var datOS = angular.module('datOS');

datOS.controller('datosHubCtrl', function($scope, $http) {
	$scope.tabs = [{
		title : 'Sources',
		content : [{
			heading : "Sources Sample Data 1 ",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"
		}, {
			heading : "Sources Sample Data 2",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"

		}]
	}, {
		title : 'Targets',
		content : [{
			heading : "Targets Sample Data 1 ",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"
		}, {
			heading : "Targets Sample Data 2",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"

		}]
	}, {
		title : 'Metadata',
		content : [{
			heading : "Metadata Sample Data 1 ",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"
		}, {
			heading : "Metadata Sample Data 2",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"

		}]
	}, {
		title : 'Policies',
		content : [{
			heading : "Policies Sample Data 1 ",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"
		}, {
			heading : "Policies Sample Data 2",
			content : 'This is Sample ContentThis is one of the records retruned for your searches in Sources.This records are dummy records,they have no meaning ',
			href : "http:www.sampledata.com/"

		}]
	}];
	$scope.showSearchData = false;
	$scope.currentTab = 'sources-Tab';

	$scope.onClickTab = function(tab) {
		$scope.currentTab = tab.url;
	}

	$scope.isActiveTab = function(tabUrl) {
		return tabUrl == $scope.currentTab;
	}
	//Search Form
	$scope.searchSubmit = function() {
		//console.log($scope.search.length);
		if ($scope.search.length > 0) {
			$scope.showSearchData = true;
		}

	}
});
