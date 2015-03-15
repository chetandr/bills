var datOS = angular.module('datOS');
var sc = {};
datOS.factory('getAllPolicies', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		var target = apiURL + 'getpolicies';
		$scope.apiLoader = $scope.policyLoader = $http.get(target).success(function(data, status, headers, config) {
			//$scope.policiesRaw = data.Data;
			$scope.policyCount = 0;

			var policyCounts = [], policies = [], dbPolicies = {};
			$scope.policyDetails = 0;
			for(k in data.Data) {
				policyCounts[data.Data[k]['fname'].trim()] = policyCounts[data.Data[k]['fname'].trim()] == undefined ? 1 : parseInt(policyCounts[data.Data[k]['fname'].trim()]) + 1;
				console.log(data.Data[k]['fname']);
				dbPolicies[data.Data[k]['fname'].trim()] = data.Data[k];
				policies[policies.length] = data.Data[k];
				$scope.policyCount++;
				if(data.Data[k].policy_name == $scope.policyName) {
					$scope.policyDetails = data.Data[k];
					$scope.app_instance_id = $scope.policyDetails.app_instance_id;
					$scope.dataSource = $scope.dataTypeVal = $scope.policyDetails.fname;
					$scope.dataSourceType = $scope.policyDetails.agtype;
				}
			}
			dbPolicies['N/A'] = {
				'policy_name' : 'N/A'
			}
			$scope.policies = policies;
			$scope.dbPolicies = dbPolicies;
			$scope.policyCounts = policyCounts;
			//$scope.restorPointNum($scope.policies[0]);
			if($scope.fname != undefined) {
				$scope.policyDetails = $scope.dbPolicies[$scope.fname];

			}
			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Policy Details.");
		});
		return deferred.promise;
	}
}]);

// getAlldatasourceTypes : Get all the Data Sources
// used on : PolicyMakers page,Dashboard Page
datOS.factory('getAlldatasourceTypes', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		var target = apiURL + 'datasourceTypes';
		$scope.apiLoader = $scope.dataSourceTypeLoader = $http.get(target).success(function(data, status, headers, config) {
			$scope.sourceTypes = data.Data;
			$scope.sourceTypeVal = $scope.sourceTypes[0].agtype;
			$scope.shard_id = $scope.sourceTypes[0].shard_id;
			$scope.shard_port = $scope.sourceTypes[0].shard_port;
			$scope.app_instance_id = $scope.sourceTypes[0].app_instance_id;
			$scope.sourceTypeCount = 0;
			$scope.cluster = [];
			$scope.sourceTypesKeyed = {};
			for(k in $scope.sourceTypes) {
				if($scope.sourceTypes.hasOwnProperty(k)) {
					$scope.sourceTypesKeyed[$scope.sourceTypes[k]['app_instance_id']] = $scope.sourceTypes[k];
					$scope.cluster[$scope.cluster.length] = $scope.sourceTypes[k]['app_instance_id']
				}
			}

			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Data source Type.");
		});
		return deferred.promise;
	}
}]);

// getManagementObject : Get all the Management object , Schedule count for the Management object
// used on : PolicyMakers page,Dashboard Page
datOS.factory('getManagementObject', ['$http',
function($http) {

	return function($scope, chain) {
		if($scope.app_instance_id != undefined) {
			var target = apiURL + 'datasource/' + $scope.app_instance_id;

			$scope.apiLoader = $scope.managementObjectLoader = $http.get(target).success(function(data, status, headers, config) {
				/*$scope.dataTypes = data.Data[$scope.sourceTypeVal];
				 $scope.dataTypeVal = data.Data[$scope.sourceTypeVal][0].fname;
				 $scope.dataSourcesCount = data.Data[$scope.sourceTypeVal].length;
				 $scope.sourceDataTypes = data.Data[$scope.sourceTypeVal];
				 */
				$scope.dataTypes = data.Data;
				$scope.dataTypeVal = data.Data[0].fname;
				$scope.dataSourcesCount = data.Data.length;
				$scope.sourceDataTypes = data.Data;
				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}
			}).error(function(data, status, headers, config) {
				toastr["error"]("Error in retrieving Management object.");
			});
			return $scope.apiLoader;
		}
	}
}]);

// getAllStore : Get all the Storage target
// used on : PolicyMakers page
datOS.factory('getAllStore', ['$http',
function($http) {
	return function($scope, chain) {
		var target = apiURL + 'liststore';
		$scope.apiLoader = $scope.storeLoader = $http.get(target).success(function(data, status, headers, config) {
			$scope.storageTargets = data.Data;
			$scope.storageName = $scope.storageTargets[0].store_name;
			$scope.storageTypeVal = $scope.storageTargets[0].agtype;
			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Storage target.");
		});
		return $scope.apiLoader;
	}
}]);

// getSchedule : Get all the Schedule
// used on : PolicyMakers page
datOS.factory('getSchedule', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		var target = apiURL + 'listschedule/' + $scope.app_instance_id + '/' + $scope.dataTypeVal;
		$scope.apiLoader = $scope.scheduleLoader = $http.get(target).success(function(data, status, headers, config) {
			if($scope.schedules == undefined) {
				$scope.schedules = {};
			}
			if($scope.policyDetails == undefined) {
				$scope.policyDetails = {};
			};
			$scope.schedules[$scope.dataTypeVal] = data.Data;
			$scope.policyDetails.schedules = data.Data;
			if(data.Data[0].app_instance_id != '') {
				$scope.schuduleCount = data.Data.length;
				$scope.newPolicy = false;
				$scope.policy_name = $scope.dbPolicies[$scope.dataTypeVal].policy_name;
				$('#policy_name').attr('readonly', 'readonly');
			} else {
				$scope.schuduleCount = 0;
				$scope.newPolicy = true;
				$('#policy_name').removeAttr('readonly');
				$scope.policy_name = "";
			}
			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Schedule Count.");
		});
		return deferred.promise;
	}
}]);

// getAllManagementObject : Get all the Data Sources for all Data Types
// used on : RestorePoints page
datOS.factory('getAllManagementObject', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		if($scope.app_instance_id != undefined) {
			var target = apiURL + 'datasource/' + $scope.app_intance_id;
			$scope.apiLoader = $scope.managementObjectLoader = $http.get(target).success(function(data, status, headers, config) {
				$scope.datasources = data.Data;
				$scope.datasourcesAll = data.Data;
				$scope.dataSourceCount = 0;
				//console.log($scope.datasources);
				var keys = [];
				for(k in $scope.datasources) {
					if(k == 'mongo')
						$scope.hasMongo = true;
					if(k == 'cassandra')
						$scope.hasCassandra = true;
					if(k == 'hadoop')
						$scope.hasHadoop = true;
					if($scope.datasources.hasOwnProperty(k)) {
						$scope.dsCount++;
						keys[keys.length] = k.trim();
					}
				}
				for(k in $scope.datasources) {
					if($scope.datasources.hasOwnProperty(k)) {
						for(j in $scope.datasources[k]) {

							if($scope.datasources[k].hasOwnProperty(j)) {
								if($scope.dataSource == undefined) {
									$scope.dataSource = $scope.datasources[k][j].fname;
								}
								$scope.dataSourceCount++;
							}
						}

					}
				}
				$scope.keys = keys;
				var dst = $scope.keys[0], ds = $scope.dataSource.trim();
				$scope.dataSourceType = dst;
				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}
				//console.log(ds);console.log($scope.datasources[$scope.keys[0]][0]['fname']);
				//$scope.cassCompletedCount(0, dst, ds);
				return deferred.resolve($scope);
			}).error(function(data, status, headers, config) {
				toastr["error"]("Error in retrieving Data sources.");
				// [messageType](message)
			});
			$scope.oneAtATime = true;
			$scope.status = [{
				isFirstOpen : true,
				isFirstDisabled : false,
				open : true
			}];
			$scope.showModal = false;
			return deferred.promise;
		}
	}
}]);

datOS.factory('getManagementObjectByAgtype', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		if($scope.app_instance_id != undefined) {
			var target = apiURL + 'datasource/' + $scope.app_instance_id;
			$scope.apiLoader = $scope.managementObjectLoader = $http.get(target).success(function(data, status, headers, config) {
				if($scope.datasources == undefined) {
					$scope.datasources = {};
				}
				if($scope.datasourcesAll == undefined) {
					$scope.datasourcesAll = {};
				}
				$scope.datasources[$scope.sourceTypeVal] = data.Data;
				$scope.dataSourcelist = [];
				$scope.datasourcesAll[$scope.sourceTypeVal] = data.Data;
				$scope.datasourcesForInstance = {};
				$scope.datasourcesForInstance[$scope.app_instance_id] = data.Data;

				$scope.dataTypeVal = data.Data[0] != undefined ? data.Data[0].fname : '';
				$scope.dataSourceCount = 0;
				$scope.dbClusters = {};
				$scope.dbSourceTypes = {}
				var keys = [];
				for(k in $scope.datasources) {
					if(k == 'mongo')
						$scope.hasMongo = true;
					if(k == 'cassandra')
						$scope.hasCassandra = true;
					if(k == 'hadoop')
						$scope.hasHadoop = true;
					if($scope.datasources.hasOwnProperty(k)) {
						$scope.dsCount++;
						keys[keys.length] = k.trim();
						for(j in $scope.datasources[k]) {

							if($scope.datasources[k].hasOwnProperty(j)) {
								if($scope.dataSource == undefined) {
									$scope.dataSource = $scope.datasources[k][j].fname;
								}
								$scope.dbClusters[$scope.datasources[k][j].fname] = $scope.app_instance_id;
								$scope.dataSourcelist[$scope.dataSourcelist.length] = $scope.datasources[k][j];
								$scope.dataSourceCount++;
								$scope.dbSourceTypes[$scope.datasources[k][j].fname] = k;
								var instance = $scope.app_instance_id.trim();
								if($scope.datasourcesForInstance[instance] == undefined) {
									$scope.datasourcesForInstance[instance] = []
								}
							}
						}

					}
				}
				$scope.keys = keys;
				var dst = $scope.keys[0], ds = $scope.dataSource ? $scope.dataSource.trim() : "";
				$scope.dataSourceType = dst;
				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}
				return deferred.resolve($scope);
			}).error(function(data, status, headers, config) {
				toastr["error"]("Error in retrieving Data sources.");
				// [messageType](message)
			});
			$scope.oneAtATime = true;
			$scope.status = [{
				isFirstOpen : true,
				isFirstDisabled : false,
				open : true
			}];
			$scope.showModal = false;
			return deferred.promise;
		}
	}
}]);

datOS.factory('getStatistics', ['$http', '$q',
function($http, $q) {
	var deferred = $q.defer();

	return function($scope, chain) {
		$scope.stats = {};
		$scope.apiLoader = $scope.statsLoader = $http.get(apiURL + 'getstats').success(function(data, status, headers, config) {
			if(data.Status == 'Success') {
				console.log(data.Data[0]);
				$scope.stats = data.Data[0];
				if($scope.stats.data_size != undefined) {
					$scope.stats.data_size.totalRet = $scope.stats.data_size.physical_data_size + $scope.stats.data_size.logical_data_size;
					$scope.stats.data_size.percentage = 0.0;
					if($scope.stats.data_size.physical_data_size && $scope.stats.data_size.physical_data_size > 0) {
						$scope.stats.data_size.percentage = (($scope.stats.data_size.logical_data_size - $scope.stats.data_size.physical_data_size) / $scope.stats.data_size.logical_data_size);
						$scope.stats.data_size.percentage = $scope.stats.data_size.percentage * 100;
						$scope.stats.data_size.percentage = Math.round($scope.stats.data_size.percentage);
						if($scope.stats.data_size.percentage * 1000 < 1 && $scope.stats.data_size.percentage > 0) {
							$scope.stats.data_size.percentage = 0;
						}
					}
				}
				dats = $scope;
				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Statistics.");
		});
		return deferred.promise;
	}
}]);

datOS.factory('getAllVersions', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {

		var deferred = $q.defer();
		$scope.restorePoints = {};
		var dbcounts = $scope.datasources[$scope.dataSourceType].length;
		var successCounts = 0;
		for(dbIndex in $scope.datasources[$scope.dataSourceType]) {
			if($scope.datasources[$scope.dataSourceType].hasOwnProperty(dbIndex)) {
				$scope.database = $scope.datasources[$scope.dataSourceType][dbIndex].fname;
				$scope.apiLoader = $scope.versionsLoader = $http.get(apiURL + 'restorePoints/' + $scope.app_instance_id + '/' + encodeURIComponent($scope.dataSourceType) + '/' + encodeURIComponent($scope.database)).success(function(data, status, headers, config) {
					this.sCount = successCounts++;
					this.db = $scope.datasources[$scope.dataSourceType][this.sCount].fname;
					if(data.Data.length) {
						$scope.restorePointsPanel = true;
						$scope.restorePoints = [];
						$scope.policyDetails.versions = $scope.restorePoints.length;
						if($scope.restorePointCount == undefined) {
							$scope.restorePointCount = {};
						}
						$scope.firstLegend = 0;
						$scope.lastLegend = 0;
						if($scope.current == undefined) {
							$scope.current = {};
						}
						$scope.current.noOfRestorePoints = $scope.restorePoints.length;
						$scope.restorePointsVerbose = data.Statistic;
						$scope.restorePointsData = {};
						switch($scope.dataSourceType) {
							case 'mongo' :
								var cumulativePhysical = 0, count = 0;
								for(k in $scope.restorePointsVerbose) {
									if($scope.restorePointsVerbose.hasOwnProperty(k)) {
										count++;
										$scope.restorePointsData[k] = {};
										var dataCollection = $scope.restorePointsVerbose[k].split('^');
										$scope.restorePointsData[k].logical = dataCollection.pop();
										$scope.restorePointsData[k].physical = dataCollection.pop();
										cumulativePhysical += parseInt($scope.restorePointsData[k].physical);
										$scope.restorePointsData[k].cumulativeSaving = cumulativePhysical - $scope.restorePointsData[k].logical;
										$scope.restorePointsData[k].collectionCount = 0;
										$scope.restorePointsData[k].documentCount = 0;
										var dataCount = dataCollection.length - 1;
										// Since we are looping 2 elements at a time.
										for( j = 0; j < dataCount; j += 2) {
											if($scope.restorePointsData[k].collections == undefined) {
												$scope.restorePointsData[k].collections = {};
												$scope.restorePointsData[k].collectionList = "<ul>";
											}
											$scope.restorePointsData[k].collections[dataCollection[j]] = dataCollection[j + 1];
											$scope.restorePointsData[k].collectionList += "<li>" + dataCollection[j + 1] + "</li>"
											if(j == dataCount - 1) {
												$scope.restorePointsData[k].collectionList += "<ul/>";
											}
											$scope.restorePointsData[k].collectionCount++;
											$scope.restorePointsData[k].documentCount += parseInt(dataCollection[j + 1]);
										}
									}
								}
								break
						}
						$scope.restorePointCount[this.db] = 0;

						var count = 0
						for(k in data.Data) {
							if(data.Data.hasOwnProperty(k) && data.Data[k].trim() != "") {
								$scope.restorePointCount[this.db]++;
								console.log('counting:' + this.db + ':' + $scope.restorePointCount[this.db]);
								$scope.restorePoints[k] = parseInt(data.Data[k]);

								if(count == 0) {
									$scope.firstLegend = data.Data[k];
								}
								count++;

							}
						}
					} else {
						$scope.policyDetails.versions = 0;
						if($scope.current == undefined) {
							$scope.current = {};
						}
						$scope.current.noOfRestorePoints = 0;
						$scope.restorePointsVerbose = null;
					}
					$scope.lastLegend = $scope.restorePoints[$scope.restorePoints.length - 1];
					$scope.firstLegend = $scope.restorePoints[$scope.restorePoints.length - 21] != undefined ? $scope.restorePoints[$scope.restorePoints.length - 21] : $scope.restorePoints[0];
					if($scope.restorePoints.length > 21) {
						$scope.hasPrevious = true;
						$scope.shiftCount = $scope.restorePoints.length - 21;
						$scope.shiftOffset = -($scope.shiftCount * 35);
					}
					if(chain != undefined) {
						if(chain[0] != undefined) {
							chain.shift().call(this, $scope, chain);
						}
					}
					console.log('scccnt' + successCounts + ':' + dbcounts);
					if(successCounts == dbcounts) {
						return deferred.resolve($scope);
					}
				});
			}
		}
		return deferred.promise;
	}
}]);

datOS.factory('getVersions', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		$scope.restorePoints = {};

		$scope.apiLoader = $scope.versionsLoader = $http.get(apiURL + 'restorePoints/' + $scope.app_instance_id + '/' + encodeURIComponent($scope.dataSourceType) + '/' + encodeURIComponent($scope.dataSource)).success(function(data, status, headers, config) {
			if(data.Data.length) {
				$scope.restorePointsPanel = true;
				$scope.restorePoints = [];
				$scope.policyDetails.versions = $scope.restorePoints.length;

				$scope.restorePointCount = {};
				$scope.firstLegend = 0;
				$scope.lastLegend = 0;
				if($scope.current == undefined) {
					$scope.current = {};
				}
				$scope.current.noOfRestorePoints = $scope.restorePoints.length;
				$scope.restorePointsVerbose = data.Statistic;
				$scope.restorePointsData = {};
				switch($scope.dataSourceType) {
					case 'mongo' :
						var cumulativePhysical = 0, count = 0;
						for(k in $scope.restorePointsVerbose) {
							if($scope.restorePointsVerbose.hasOwnProperty(k)) {
								count++;
								$scope.restorePointsData[k] = {};
								var dataCollection = $scope.restorePointsVerbose[k].split('^');
								$scope.restorePointsData[k].logical = dataCollection.pop();
								$scope.restorePointsData[k].physical = dataCollection.pop();
								cumulativePhysical += parseInt($scope.restorePointsData[k].physical);
								$scope.restorePointsData[k].cumulativeSaving = cumulativePhysical - $scope.restorePointsData[k].logical;
								$scope.restorePointsData[k].collectionCount = 0;
								$scope.restorePointsData[k].documentCount = 0;
								var dataCount = dataCollection.length - 1;
								// Since we are looping 2 elements at a time.
								for( j = 0; j < dataCount; j += 2) {
									if($scope.restorePointsData[k].collections == undefined) {
										$scope.restorePointsData[k].collections = {};
										$scope.restorePointsData[k].collectionList = "<ul>";
									}
									$scope.restorePointsData[k].collections[dataCollection[j]] = dataCollection[j + 1];
									$scope.restorePointsData[k].collectionList += "<li>" + dataCollection[j + 1] + "</li>"
									if(j == dataCount - 1) {
										$scope.restorePointsData[k].collectionList += "<ul/>";
									}
									$scope.restorePointsData[k].collectionCount++;
									$scope.restorePointsData[k].documentCount += parseInt(dataCollection[j + 1]);
								}
							}
						}
						break
				}
				$scope.restorePointCount[$scope.dataSource] = 0;
				var count = 0
				for(k in data.Data) {
					if(data.Data.hasOwnProperty(k) && data.Data[k].trim() != "") {
						$scope.restorePointCount[$scope.dataSource]++;
						$scope.restorePoints[k] = parseInt(data.Data[k]);

						if(count == 0) {
							$scope.firstLegend = data.Data[k];
						}
						count++;

					}
				}
			} else {
				$scope.policyDetails.versions = 0;
				if($scope.current == undefined) {
					$scope.current = {}
				}
				$scope.current.noOfRestorePoints = 0;
				$scope.restorePointsVerbose = null;
			}
			$scope.lastLegend = $scope.restorePoints[$scope.restorePoints.length - 1];
			$scope.firstLegend = $scope.restorePoints[$scope.restorePoints.length - 21] != undefined ? $scope.restorePoints[$scope.restorePoints.length - 21] : $scope.restorePoints[0];
			$scope.shiftCount = 0;
			$scope.shiftOffset = 0;
			if($scope.restorePoints.length > 21) {
				$scope.hasPrevious = true;
				$scope.shiftCount = $scope.restorePoints.length - 21;
				$scope.shiftOffset = -($scope.shiftCount * 35);
			}
			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
			return deferred.resolve($scope);
		});
		return deferred.promise;
	}
}]);

datOS.factory('getAllSchedules', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		var target = apiURL + 'listallschedules';
		$scope.apiLoader = $scope.storeLoader = $http.get(target).success(function(data, status, headers, config) {
			$scope.allschedules = data.Data;
			$scope.dbSchedules = {};
			$scope.instanceSchedules = {};
			$scope.scheduledCount = $scope.allschedules.length;
			for(k in $scope.allschedules) {
				if($scope.dbSchedules[$scope.allschedules[k].fname] == undefined) {
					$scope.dbSchedules[$scope.allschedules[k].fname] = [];
				}
				$scope.dbSchedules[$scope.allschedules[k].fname][$scope.dbSchedules[$scope.allschedules[k].fname].length] = $scope.allschedules[k];

				if($scope.instanceSchedules[$scope.allschedules[k].app_instance_id] == undefined) {
					$scope.instanceSchedules[$scope.allschedules[k].app_instance_id] = [];
				}
				$scope.instanceSchedules[$scope.allschedules[k].app_instance_id] = $scope.allschedules[k];
			}
			if(chain != undefined) {
				if(chain[0] != undefined) {
					chain.shift().call(this, $scope, chain);
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving schedules.");
		});
		return deferred.promise;
	}
}]);

datOS.factory('getAll', ['$http', '$q',
function($http, $q) {
	return function($scope, chain) {
		var deferred = $q.defer();
		var target = apiURL + 'all';
		//+'?'+Math.random();
		$scope.getAllLoader = $scope.storeLoader = $http.get(target).success(function(data, status, headers, config) {
			if(data.Status != 'Failure') {
				var scopeData = data.Data;
				// all policies
				var policies = scopeData.listpolicy;
				$scope.policyCount = 0;
				$scope.policyCountsInstance = [];
				var policyCounts = [], dbPolicies = {}, policyCountsInstance = [];
				$scope.policyDetails = 0;

				for(k in policies) {

					if(policies.hasOwnProperty(k) && policies[k].fname != undefined) {
						if($scope.policies == undefined)
							$scope.policies = {};
						$scope.policies[k] = policies[k];
						console.log(policies[k]);
						policyCounts[policies[k]['fname'].trim()] = policyCounts[policies[k]['fname'].trim()] == undefined ? 1 : parseInt(policyCounts[policies[k]['fname'].trim()]) + 1;
						var instance = policies[k]['app_instance_id'].trim();
						policyCountsInstance[instance] = (policyCountsInstance[instance] == undefined) ? 1 : parseInt(policyCountsInstance[instance]) + 1;

						dbPolicies[policies[k]['fname'].trim()] = policies[k];
						$scope.policyCount++;
						if(policies[k].policy_name == $scope.policyName) {
							$scope.policyDetails = policies[k];
							$scope.app_instance_id = $scope.policyDetails.app_instance_id;
							$scope.dataSource = $scope.dataTypeVal = $scope.policyDetails.fname;
							$scope.dataSourceType = $scope.policyDetails.agtype;
						}
					}
				}
				dbPolicies['N/A'] = {
					'policy_name' : 'N/A'
				}

				$scope.dbPolicies = dbPolicies;
				$scope.policyCounts = policyCounts;
				$scope.policyCountsInstance = policyCountsInstance;
				//$scope.restorPointNum($scope.policies[0]);
				if($scope.fname != undefined) {
					$scope.policyDetails = $scope.dbPolicies[$scope.fname];

				}

				// all stores//
				$scope.storageTargets = scopeData.liststore;
				$scope.storageName = $scope.storageTargets.length ? $scope.storageTargets[0].store_name : '';
				$scope.storageTypeVal = $scope.storageTargets.length ? $scope.storageTargets[0].agtype : '';

				// all schedules
				$scope.allschedules = scopeData.listschedule;
				$scope.dbSchedules = {};
				$scope.instanceSchedules = {};
				$scope.scheduledCount = $scope.allschedules.length;
				for(k in $scope.allschedules) {
					if($scope.dbSchedules[$scope.allschedules[k].fname] == undefined) {
						$scope.dbSchedules[$scope.allschedules[k].fname] = [];
					}
					$scope.dbSchedules[$scope.allschedules[k].fname][$scope.dbSchedules[$scope.allschedules[k].fname].length] = $scope.allschedules[k];

					if($scope.instanceSchedules[$scope.allschedules[k].app_instance_id] == undefined) {
						$scope.instanceSchedules[$scope.allschedules[k].app_instance_id] = [];
					}
					$scope.instanceSchedules[$scope.allschedules[k].app_instance_id][$scope.instanceSchedules[$scope.allschedules[k].app_instance_id].length] = $scope.allschedules[k];
				}

				// all datasources
				$scope.sourceTypes = scopeData.listsource;
				if($scope.sourceTypes.length) {
					$scope.sourceTypeVal = $scope.sourceTypes[0].agtype;
					$scope.shard_id = $scope.sourceTypes[0].shard_id;
					$scope.shard_port = $scope.sourceTypes[0].shard_port;
					$scope.app_instance_id = $scope.sourceTypes[0].app_instance_id;
					$scope.sourceTypeCount = 0;
				}
				$scope.cluster = [];
				$scope.sourceTypesKeyed = {};
				for(k in $scope.sourceTypes) {
					if($scope.sourceTypes.hasOwnProperty(k)) {
						$scope.sourceTypesKeyed[$scope.sourceTypes[k]['app_instance_id']] = $scope.sourceTypes[k];
						$scope.cluster[$scope.cluster.length] = $scope.sourceTypes[k]['app_instance_id'];
					}
				}
				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}

			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			//toastr["error"]("Error in retrieving All Data.");
		});
		return deferred.promise;
	}
}]);

// setTimeZone : Set Data related to TimeZone Settings
// used on : PolicyMakers page , RestorePoint Timeline
datOS.factory('setTimeZoneData', ['$cookies', '$cookieStore',
function($cookies, $cookieStore) {
	return function($scope, chain) {

		var sysTimeZone = {
			'TimeZoneName' : $scope.sysTimeZone,
			'TimeZoneCode' : $scope.zoneCode,
			'TimeZoneCountry' : $scope.zoneCountry
		};
		$cookieStore.put('sysTimeZone', sysTimeZone);
		$scope.TimeZoneName = $scope.sysTimeZone;
		$scope.TimeZoneCode = $scope.zoneCode;
		$scope.TimeZoneCountry = $scope.zoneCountry;
		if(chain != undefined) {
			if(chain[0] != undefined) {
				chain.shift().call(this, $scope, chain);
			}
		}
		return $scope.apiLoader;
	}
}]);

// getTimeZoneData : Get Data related to TimeZone Settings
// used on : PolicyMakers page , RestorePoint Timeline
datOS.factory('getTimeZoneData', ['$http', '$cookies', '$cookieStore',
function($http, $cookies, $cookieStore) {
	return function($scope, chain) {

		if($cookieStore.get('sysTimeZone')) {
			var sysTimeZone = $cookieStore.get('sysTimeZone');
			$scope.TimeZoneName = sysTimeZone.TimeZoneName;
			$scope.TimeZoneCode = sysTimeZone.TimeZoneCode;
			$scope.TimeZoneCountry = sysTimeZone.TimeZoneCountry;
			$scope.zoneCode = $scope.TimeZoneCode;
		} else {
			// Setting system UTC
			$scope.timezone = new Date(Date.UTC($scope.startTimeHrs, $scope.startTimeMin));
			$scope.dateStr = $scope.timezone.toString();
			$scope.dateStrNew = $scope.dateStr.substr($scope.dateStr.indexOf("(") + 1);

			if(navigator.userAgent.indexOf('Mac OS X') != -1) {
				$scope.sysTimeZone = $scope.dateStrNew.replace(")", " ");
			} else {
				$scope.zoneString = $scope.dateStrNew.replace(")", " ");
				$scope.shortString = $scope.zoneString.match(/\b(\w)/g);
				$scope.sysTimeZone = $scope.shortString.join('');
			}
			$scope.browserTimeZone = $scope.sysTimeZone;
			$scope.zoneCode = moment().format('Z');
			$scope.TimeZoneCode = moment().format('Z');
			var timezone = jstz.determine();
			$scope.TimeZoneCountry = timezone.name();
			$scope.TimeZoneName = moment.tz(timezone.name()).zoneAbbr();
		}

		if(chain != undefined) {
			if(chain[0] != undefined) {
				chain.shift().call(this, $scope, chain);
			}
		}
		return $scope.apiLoader;
	}
}])

// getJobs : Get all the Jobs
// used on : Restore point popup page
datOS.factory('getJobs', ['$http', '$q',
function($http, $q) {
	var deferred = $q.defer();
	return function($scope, chain) {
		if($scope.clusterName == undefined) {
			$scope.clusterName = $scope.app_instance_id;
		}
		var target = apiURL + 'listjobs/' + $scope.clusterName + '/' + $scope.jobType;
		$scope.apiLoader = $scope.jobsLoader = $http.get(target).success(function(data, status, headers, config) {
			if(data.Status == 'Success') {
				$scope.jobs = data.Data;

				if(chain != undefined) {
					if(chain[0] != undefined) {
						chain.shift().call(this, $scope, chain);
					}
				}
			}
			return deferred.resolve($scope);
		}).error(function(data, status, headers, config) {
			toastr["error"]("Error in retrieving Storage target.");
		});
		return deferred.promise;
	}
}]);

// language : Get all the Jobs
// used on : Restore point popup page
datOS.factory('language', [
function() {
	return function($scope) {
		$scope.language = {
			'mongo' : 'MongoDB',
			'cassandra' : 'Cassandra',
			'hadoop' : 'Hadoop',
			'job_successful' : 'Completed',
			'job_scheduled' : 'Scheduled',
			'vfs_store' : 'nfs_store'
		}
	}
}]);
