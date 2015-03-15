// Policy Configuration Dial Page Controller
datOS.controller('policyConfigCtrl',['$q','$scope','$routeParams','$http','getAlldatasourceTypes','getManagementObjectByAgtype','getAllStore','getSchedule','getAll','createPolicy','createSchedule','$modal','$cookies', '$cookieStore','setTimeZoneData','getTimeZoneData','$interval',function($q,$scope,$routeParams,$http,getAlldatasourceTypes,getManagementObjectByAgtype,getAllStore,getSchedule,getAll,createPolicy,createSchedule,$modal,$cookies, $cookieStore,setTimeZoneData,getTimeZoneData,$interval) {
    sc = $scope;
	$scope.pageHeading = 'Policy Maker';
	$scope.validPolicyData = true;
	$scope.hidePanelOnSubmit = true;
	$scope.schuduleCount = 0;
	$scope.pageClass = 'policy-config';
	$scope.recoveryTimeType = "Minutes";
	$scope.recoveryTime = "15"
	$scope.dataRetention = '1';
	$scope.newPolicy = true;
    
    //Change the Source type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeSourceType = function() {
       	if (this.sourceType != undefined) {
			$scope.sourceTypeVal = this.sourceType.agtype;
		}
		getManagementObjectByAgtype($scope);
	}
    
	$scope.allLoader = getAll($scope).then(function($scope) {
		return getManagementObjectByAgtype($scope);
	}).then(function($scope) {
		return getSchedule($scope);
	});
	
	$scope.policyDate = new Date();
	$scope.startTimeHrs = $scope.policyDate.getHours();
	$scope.startTimeMin = $scope.policyDate.getMinutes();
	$scope.startTimeFormat = $scope.startTimeHrs >= 12 ? 'PM' : 'AM';
	$scope.startTimeHrs = $scope.startTimeHrs % 12;
	$scope.startTimeHrs = $scope.startTimeHrs < 10 ? '0' + $scope.startTimeHrs : $scope.startTimeHrs;
	$scope.startTimeMin = $scope.startTimeMin < 10 ? '0' + $scope.startTimeMin : $scope.startTimeMin;
	// Get Time Zone setting data
	getTimeZoneData($scope);
	

	$scope.language = {	'mongo' : 'MongoDB','cassandra' : 'Cassandra','hadoop' : 'Haddop'}

	
	$scope.dataRetentionTypes = [{
									name : 'Hours',
									value : 'Hours'
								}, {
									name : 'Days',
									value : 'Days'
								}, {
									name : 'Weeks',
									value : 'Weeks'
								}, {
									name : 'Months',
									value : 'Months'
								}];
	$scope.dataRetentionType = $scope.dataRetentionTypes[2].name;
	//Reset the Policy Operation form.

	$scope.resetRecoveryFileds = function() {
		$scope.newPolicy = true;
		$scope.sname = '';
		$scope.recoveryTime = '15';
		$scope.recoveryTimeType = "Minutes";
		globalKnob.changed(20.83);
		globalKnob.svgUpdateValue(15, 'Minute');
		$scope.stopTimeHrs = '00';
		$scope.stopTimeMin = '00';
		$scope.dataRetentionDay = '';
		$scope.dataRetentionWeek = '';
		$scope.dataRetentionMonth = '';
		$scope.dataRetention = '1';
		$scope.policyDate = new Date();
		angular.element('#hours_list').val($scope.startTimeHrs);
		angular.element('#minutes_list').val($scope.startTimeMin);
		angular.element('#policy_name').val('');
		angular.element('#storage_target').val('');
		angular.element('#schedule_name').val('');
		$scope.policy_name = '';
		$scope.storage_target = '';
		$scope.schedule_name = '';
		$scope.schuduleCount = 0;
		$scope.showSuccessMsg = false;
		$("#sliderSelectedVal").html('1 Week');
		  $scope.dataRetentionType = 'Weeks';
		$('#dataRetentionPeriod').labeledslider({
			min : 1,
			max : 7,
			value : 1,
			slide : function(event, ui) {
				if (ui.value < 2) {
					$("#sliderSelectedVal").html(ui.value + " " + "Week");
				} else {
					$("#sliderSelectedVal").html(ui.value + " " + "Weeks");
				}

			}
		});
	};


	//Create a POST data array for display and use the same array for sending the data to REST server.
	$scope.saveRecoveryFileds = function() {
		$scope.policyConfig.$invalid = true;
		$scope.showSuccessMsg = true;

		//Catch the Dial values.Could not bind the values as the dial uses external js.
		$scope.recoveryTime = angular.element('#recovery_time').val();
		$scope.recoveryTimeType = angular.element('#time_unit').val();
		$scope.dataRetention = $('#dataRetentionPeriod').labeledslider("value");
		$scope.startTimeHrs = angular.element('#hours_list').val();
		$scope.startTimeMin = angular.element('#minutes_list').val();
		$scope.startTimeFormat = angular.element('#startTimeFormat').val();
		$scope.policyDateApi = angular.element('#policyDateApi').val();
		$scope.systemTime = angular.element('#systemTime').val();
		$scope.policy_name = angular.element('#policy_name').val();
		$scope.api_date = angular.element('#aipDate').val();
		$scope.sname = angular.element('#storageName').val();
		$scope.stype = angular.element('#storageTypeVal').val();
		$scope.submitRecoveryData = false;

		if ($scope.dataRetentionType == 'Days') {
			$scope.dataRetentionDays = $scope.dataRetention * 24;
		} else if ($scope.dataRetentionType == 'Weeks') {
			$scope.dataRetentionDays = ($scope.dataRetention * 7) * 24;
		} else if ($scope.dataRetentionType == 'Months') {
			$scope.dataRetentionDays = ($scope.dataRetention * 30) * 24;
		} else {
			$scope.dataRetentionDays = $scope.dataRetention
		}

		
		var date1 = new Date();
		var scheduleStartDate = $scope.policyDateApi;
		scheduleStartDate = scheduleStartDate.split('/');
		var Hrs = ($scope.startTimeFormat == 'PM') ? (parseInt($scope.startTimeHrs) + 12) : $scope.startTimeHrs;
		var date2 = new Date(scheduleStartDate[0], scheduleStartDate[1] - 1, scheduleStartDate[2], Hrs, $scope.startTimeMin);
		var newTimeStamp = date2.getTime();
		
		// Relative time diffrence
		 var relativeTimeHrs = this.dateDiff(date1, date2);

		// New logic for relative time 
		/*var clientTime = new Date();

		// Client time
		var clientZone = (moment().format('Z')).toString();
		var ctime = clientZone.split(':');
		
		//New time Zone
		var newZone = $scope.zoneCode.toString();
		var newTime = newZone.split(':');

		clientTime.setHours(clientTime.getHours() - parseInt(ctime[0]) );
		clientTime.setMinutes(clientTime.getMinutes() - parseInt(ctime[1]) );
		
		var gmtTime = clientTime ;

		gmtTime.setHours(gmtTime.getHours() + parseInt(newTime[0]) );
		gmtTime.setMinutes(gmtTime.getMinutes() + parseInt(newTime[1]) );
		console.log(gmtTime);
		var relativeTimeHrs = parseInt(this.dateDiff(gmtTime,date2)) * 60;
*/
		if (relativeTimeHrs < 0) {
				relativeTimeHrs = 1;
		}
		
		//Time Format
		$scope.startTimeHrsDisplay = ($scope.startTimeHrs.length < 2) ? '0' + $scope.startTimeHrs : $scope.startTimeHrs;
		$scope.recoveryDataObj = {
				"fname" : $scope.dataTypeVal,
				"nalist" : $scope.nalist,
				"agtype" : $scope.sourceTypeVal,
				"time" : $scope.recoveryTime + $scope.recoveryTimeType[0].toLowerCase(),
				"app_instance_id" : $scope.app_instance_id,
				"sname" : $scope.sname,
				"stype" : $scope.stype,
				"policy_name" : $scope.policy_name,
				"consistency_type" : $scope.consistency_type,
				"startTime" : relativeTimeHrs + 'm',
				"timeDiff" : $scope.zoneCode,
				"retention_time" : $scope.dataRetentionDays + 'h',
				"schedule_name" : $scope.schedule_name
		}

		$scope.sheduleDataObj = {
				"fname" : $scope.dataTypeVal,
				"time" : $scope.recoveryTime + $scope.recoveryTimeType[0].toLowerCase(),
				"app_instance_id" : $scope.app_instance_id,
				"sname" : $scope.schedule_name,
				"startTime" : relativeTimeHrs + 'm',
				"timeDiff" : $scope.zoneCode,
				"retention_time" : $scope.dataRetentionDays + 'h'
		}

		$scope.hideRecoveryData = true;
		$scope.showRecoveryData = true;
		
		if ($scope.newPolicy) {
			this.submitRecoveryFileds();
		} else {
		  this.submitScheduleFileds();
        }
		
		$scope.newPolicy = false;
	};
	

	//Hide the Policy Operation form element for displaying the data.
	$scope.editRecoveryFileds = function() {
		$scope.hideRecoveryData = false;
		$scope.showRecoveryData = false;
		$scope.submitRecoveryData = true;
		$scope.showSuccessMsg = false;
		$scope.policyConfig.$invalid = false;
	};

	$scope.addAnotherSchedule = function() {
		angular.element('#schedule_name').val('');
		$scope.showSuccessMsg = false;
		angular.element('#schedule_name').val('');
		$scope.schedule_name = '';
	}

	//Submit the Policy Operation form
	$scope.submitRecoveryFileds = function() {
		console.log($scope.recoveryDataObj);
		createPolicy($scope);
		$scope.showSuccessMsg = true;
	};
	
	//Submit the submitScheduleFileds form
	$scope.submitScheduleFileds = function() {
		$scope.schuduleCount ++;
		//Create a http request to submit the data to the REST server.
		createSchedule($scope);

	};
	
	$scope.openrecoveryPanel = function() {
		$scope.showSuccessMsg = false;
		$scope.hidePanelOnSubmit = false;
		$scope.hideRecoveryData = false;
		$scope.showRecoveryData = false;
	};

	$scope.changeStorageTarget = function() {
		if (this.storageTarget != undefined) {
			$scope.storageTypeVal = this.storageTarget.agtype;
			$scope.storageName = this.storageTarget.store_name;
		}
	}
	

	//Change the Source type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeSourceType = function() {
		if (this.sourceType != undefined) {
			$scope.sourceTypeVal = this.sourceType.agtype;
		}
		getManagementObject($scope,[getSchedule]);
	}
	
	//Change the Data type for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changeDataType = function(dataType) {
		$scope.dataSource =  $scope.dataTypeVal = this.data.fname;
        
		getSchedule($scope);
	}

	$scope.changestartTimeFormat = function(TimeFormat) {
		$scope.startTimeFormat = TimeFormat;
	}
	

	// show hide policy configuration type
	$scope.modelsArray = [{
							name : 'basic',
							visible : true
						}, {
							name : 'composite',
							visible : false
						}, {
							name : 'complex',
							visible : false
						}];

	$scope.toggleVisibility = function(index) {
		angular.forEach($scope.modelsArray, function(model) {
			model.visible = false;
		});
		$scope.modelsArray[index].visible = true;
	};

	$scope.hideMessage = function() {
		$scope.showSuccessMsg = false;
	}
	//date picker
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
	};

	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'fullDate'];
	$scope.format = $scope.formats[3];

	$scope.changeDataRetentionType = function() {
		$scope.dataRetention = '';
		$scope.dataRetentionType = this.dataRetentionType.name;
		if (this.dataRetentionType.name == 'Hours') {
			$("#days_list").spinner("option", "max", 24);
		} else if (this.dataRetentionType.name == 'Days') {
			$("#days_list").spinner("option", "max", 7);
		} else if (this.dataRetentionType.name == 'Weeks') {
			$("#days_list").spinner("option", "max", 5);
		} else if (this.dataRetentionType.name == 'Months') {
			$("#days_list").spinner("option", "max", 12);
		}
	}

	//Change the changerecoveryTimeType for data binding on drop-down selection.Drop-down is in ul il format.
	$scope.changerecoveryTimeType = function(type) {
		if (this.recoveryTimeType != undefined) {
			$scope.recoveryTimeType = type;
		}
	}

	$scope.changed = function() {
		console.log($scope);
	}

	$scope.shouldBeOpen = true;

	$scope.changeClusterName = function() {
		if (this.clusterNameItem != undefined) {
			$scope.clusterNameItem = this.clusterNameItem.clusterNameVal;
			$scope.dropdownSelect = true;
		}
	}

	$scope.dateDiff = function(date1, date2) {
		// Date diffrence in milSce
		var diff = date2 - date1;
		//Coonvert the diffrence in human redable
		var msec = diff;

		var hh = Math.floor(msec / 1000 / 60 / 60);
		//msec -= hh * 1000 * 60 * 60;

		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;

		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		return mm;

	}
	
	// Keep watch for cookie value changed
	$interval( function(){ getTimeZoneData($scope); }, 3000);

	/*	$scope.setTimezone = function(size) {
		var modalInstance = $modal.open({
			templateUrl : 'timezoneModalContent.html',
			controller : 'ModalInstanceTimezoneCtrl',
			size : size
		});

		modalInstance.result.then(function(result) {
			$scope.timeDiff = result;
			$scope.sysTimeZone = result.zoneCode;
			$scope.zoneCode = result.timeDiff;
			alert( $scope.sysTimeZone);
			//$cookieStore.put('sysTimeZone', $scope.sysTimeZone);
			
		}, function() {
			//alert(result);
		});
	};
*/
}]);




/*

datOS.controller('ModalInstanceTimezoneCtrl', function($scope, $modalInstance) {

		$scope.ok = function() {
		//$modalInstance.dismiss('cancel');
		var  result =  {'zoneName' : $scope.timeZoneName,'timeDiff':$scope.timeDiff,'zoneCode':$scope.timeZone };
		$modalInstance.close(result);
		 
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
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
});*/
datOS.directive('focusMe', function($timeout, $parse) {
	return {
		link : function(scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			scope.$watch(model, function(value) {
				console.log('value=', value);
				if (value === true) {
					$timeout(function() {
						element[0].focus();
					});
				}
			});
			element.bind('blur', function() {
				console.log('blur')
				scope.$apply(model.assign(scope, false));
			})
		}
	};
});
