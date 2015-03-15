// Restore Point Page Controller
var datOS = angular.module('datOS');
rssc = {};
rstat = {};
datOS.controller('restorePointsCtrl',['$q','$scope','$routeParams','$http','$modal','getAlldatasourceTypes','getManagementObjectByAgtype','getAllPolicies','getSchedule','getVersions','getAll','retrieve','$timeout', '$filter','$cookies', '$cookieStore','setTimeZoneData','getTimeZoneData','$interval',function($q,$scope,$routeParams,$http,$modal,getAlldatasourceTypes,getManagementObjectByAgtype,getAllPolicies,getSchedule,getVersions,getAll,retrieve,$timeout, $filter,$cookies, $cookieStore,setTimeZoneData,getTimeZoneData,$interval) {
	rssc = $scope;
	$scope.selected = 0;
    $scope.dsCount = 0 ;
    $scope.hasMongo = false;
    $scope.hasCassandra = false;
    $scope.hasHadoop = false;
    $scope.selectedRow = 0;
    $scope.hasPrevious = false;
    $scope.hasNext = false;
    $scope.shiftCount = 0;
    $scope.shiftOffset = 0;
    sc = $scope;
    $scope.select= function(index) {
       $scope.selected = index; 
    };

	// Get Time Zone setting data
	getTimeZoneData($scope);	
	
	// Keep watch for cookie value changed
	$interval( function(){ getTimeZoneData($scope); }, 3000);


	$scope.changeTime = function(tm){
		if(tm == undefined || tm == 0 ||  isNaN(tm)) {
			return '';
		}
		return moment(tm,'x').tz($scope.TimeZoneCountry).format('YYYY-MM-DD HH:mm');
    }
	
	


	$scope.select = function(index) {
		$scope.selected = index;
	};

	$scope.pageHeading = 'Time Travel';

	$scope.pageClass = 'restore-points';
	$scope.current = [];
	$scope.changeDatasourceTab = function(deactive) {
		console.log(apiURLs);
		apiURL = apiURLs[deactive];
		$scope.getDataSources();
		$scope.datasources = {};
		$scope.policies = {};
		$scope.policyCounts = {};
		$scope.restorePoints = {};
		$scope.current = {};
		$scope.RestoreType = 'now';
		//var active = $('.activeDatasource').attr('id');

		//$('#'+active).addClass('deactivateDatasource').removeClass('activeDatasource');
		//$('#'+deactive).addClass('activeDatasource').removeClass('deactivateDatasource');
	}
	$scope.language = {
		'mongo' : 'MongoDB',
		'cassandra' : 'Cassandra',
		'hadoop' : 'Hadoop'
	}

	$scope.objectLevelValues = {
		//'mongo' : "Database,Collection,Document",
        'mongo' : "Object",
		'cassandra' : "Keyspace,Column Family,Row"
	}
   $scope.allLoader = getAll($scope).then(function($scope) {
		return getManagementObjectByAgtype($scope);
	}).then(function($scope) {
		return getVersions($scope);
	});

	$scope.toggleModal = function(ev, index) {
		$(ev.currentTarget).attr('current', 'true');
		//console.log(ev.currentTarget);
        rssc = $scope;
        $scope.current.dataSourceName = $scope.dataSource;
        $scope.current.policyName = $scope.dbPolicies[$scope.dataSource].policy_name;
		$scope.current.app_instance_id = $scope.app_instance_id;
		$scope.current.agtype = $scope.dataSourceType;
		$scope.current.RestorePointNo = index + 1;
		$scope.current.RestoreTime = this.$parent.restorePoint;
		$scope.showModal = !$scope.showModal;
		console.log($scope.objectLevelValues);
        
		$scope.current.objectValues = $scope.objectLevelValues[$scope.dataSourceType].split(',');
		
		
		$scope.showSuccessMsg = false;
	
		if($scope.dataSourceType=='mongo'){
			$scope.current.objectValues = this.getMongoVerbose(index);
		} else if($scope.dataSourceType=='cassandra'){
			$scope.current.objectValues = this.getCassandraVerbose(index);
		}


			// Jquery spinner code moved due to toggleModal
		var spinner = $("#hours_list ,#minutes_list").spinner({});
		$("#hours_list").spinner("option", {
			min : 0,
			max : 12,
			numberFormat : "d2",
			icons : {
				down : "ui-icon ui-icon-minus",
				up : "ui-icon ui-icon-plus"
			}
		});

		$("#minutes_list").spinner("option", {
			min : 0,
			max : 60,
			numberFormat : "d2",
			icons : {
				down : "ui-icon ui-icon-minus",
				up : "ui-icon ui-icon-plus"
			}
		});
		var temp = $('#timeline-container').clone();
		$('.modal-chart-img').empty();
		temp.find('#timeline-range').remove();

		$('.modal-chart-img').append(temp);
		var newDiv = $('<div>')
		newDiv.css('position', 'absolute')
		newDiv.css('width', '100%')
		newDiv.css('height', '100%')
		newDiv.css('top', '0px')
		$('.modal-chart-img').css('position', 'relative');
		$('.modal-chart-img').append(newDiv);
		var title = $('.modal-summary-restore').attr('title');
		$('.modal-title').empty();
		//$('.modal-title').append($('<span id="restore-title">Hi</span><span id="restore-title-policy">Hello</span>'))
		$('.modal-title').append($("<span>Restoring Version " + $scope.current.RestorePointNo + 
										"(" + $scope.restorePointCount[$scope.dataSource] + ") of policy, <a href='#/policyDetails/"+
										$scope.current.agtype+"/"+
										$scope.current.app_instance_id+"/"+
										$scope.current.dataSourceName+"/"+
										$scope.current.policyName+"'>"+ $scope.current.policyName +"</a></span>"));
		angular.element("#timeFootLaterMsg").hide();
		angular.element("#timeFootRestoreMsg").hide();
		angular.element("#timeFootReDataMsg").hide();
		angular.element("#timeFootReAppMsg").hide();

		var carouselContainer = temp.find("#carousel-wrap");
		carouselContainer.css({
			'position' : 'relative',
			'height' : '100px',
			'margin-top' : '-90px'
		});
		var popover = temp.find("div.popover");
		popover.parent().addClass('currentpos');
		popover.css({
			'left' : '0px'
		});

		/*if ($scope.restorePoints.length >= 9) {

			if (index >= 9) {
				$(".currentpos").prevAll("li").hide().filter(':lt(9)').show();

			} else if (index <= 9) {
				var actualIndex = 9 - index;
				var num = actualIndex * 35 + 35;
				temp.find('.dock #carousel-wrap  ul').animate({
					marginLeft : num
				});
			}
		} else if ($scope.restorePoints.length <= 9) {
			var actualIndex = ($scope.restorePoints.length - 1) - index;
			var num = actualIndex * 35 + 35;
			temp.find('.dock #carousel-wrap  ul').animate({
				marginLeft : num
			});
		}*/
	};

	$scope.restorePointCarousel = function() {

		if ($('.restorepoint-list li').length >= 20) {
			$('#prv-testimonial').hide();
			$('#nxt-testimonial').hide();
		} else {

			$('#prv-testimonial').show();
			$('#nxt-testimonial').show();
		}

		// Slider carousel Default
		$('#prv-testimonial').on('click', function() {
			var $first = $('.restorepoint-list li:first');
			$first.animate({
				'margin-left' : '+=25px'
			}, function() {
				$first.css({
					'margin-left' : '+=0px'
				});
			});
		});

		$('#nxt-testimonial').on('click', function() {
			var $first = $('.restorepoint-list li:first');
			$first.animate({
				'margin-left' : '-=25px'
			}, function() {
				$first.css({
					'margin-left' : '-=0px'
				});
			});

		});

	}
	$scope.restorePointCarousel();

	$scope.cassCompletedCount = function(row, dataSourceType, dataSourceName) {

		//console.log(row);
		$scope.selectedRow = row;
		$scope.dataSource = this.statusData.fname;
		//console.log(this.statusData.dataSourceName);
		$scope.current.app_instance_id = this.app_instance_id;
		$scope.current.agtype = this.dataSourceType;
        $scope.restorePoints = {};
		if (dataSourceName == undefined) {
			dataSourceName = this.statusData.fname;
			$scope.current.dataSourceName = this.statusData.dataSourceName
		}
		$scope.current.dataSourceName = dataSourceName;
		if (dataSourceType == undefined) {
			dataSourceType = $scope.current.dataSourceType;
		}
		var policies = [], policyCounts = [];
		//$scope.restorePointCarousel();
		//getVersions($scope);
        $scope.dataTypeVal = dataSourceName;
        //getSchedule($scope)
        console.log($scope.policies[0]);
		$scope.restorPointNum($scope.dbPolicies[dataSourceName]);
        
	};

	$scope.restorPointNum = function(policyDetails) {

		//console.log('called');
		$scope.restorePointsPanel = true;
		$scope.showTimeline = true;
		$scope.showSuccessMsg = false;
		//console.log(policyDetails);
		$scope.restorePoints = {};
		$scope.current.policyName = "";
		

		if (policyDetails == undefined) {
	       	$scope.current.noOfRestorePoints = 0;
			//this.$parent.policy.noOfRestorePoints;
			if (this.policy == undefined)
				return;
			$scope.current.policyName = this.policy.policy_name;

		} else {
			
			$scope.current.policyName = policyDetails.policy_name;

		}
		
		getVersions($scope);

	};

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

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	// restore points grid data
	// init
	$scope.orderByField = 'points';
	$scope.reverseSort = false;

	$scope.changedBars = function() {
		alert('Hello');
	}

	$scope.submitRestorePointFields = function() {

		$scope.restoreDataObj = {
			"fname" : $scope.current.dataSourceName,
			"app_instance_id":$scope.current.app_instance_id,
			"agtype" : $scope.current.agtype,
			"time" : $scope.current.RestoreTime,
			"destdir" : this.restoreDestination,
			"restoreGranularity" : this.restoreGranularity
			//"restoreDate" : this.restoreDate
		}
		if ($scope.RestoreType == 'later') {
            console.log($filter('date'));
			var sttime = $filter('date')($('#policyDate').val(), 'mm/dd/yyyy') + " " + $('#hours_list').val() + ":" + $('#minutes_list').val() + " " + $scope.startTimeFormat;
			var sttime = moment(sttime).format('x');
			console.log(sttime);
			var today = moment().format('x');
			var timeDiffMs = sttime - today;
			var sttimeVal = timeDiffMs / 1000;
			var sttimeTyp = 's';
			if (sttimeVal > 59) {
				var sttimeVal = Math.ceil(sttimeVal / 60);
				var sttimeTyp = 'm';
				if (sttimeVal > 59) {
					var sttimeVal = Math.ceil(sttimeVal / 60);
					var sttimeTyp = 'h';
					if (sttimeVal > 23) {
						var sttimeVal = Math.ceil(sttimeVal / 24);
						var sttimeTyp = 'd';
					}
				}
			}
			var sttime = sttimeVal + sttimeTyp;
		}
        if(sttimeVal > 0) {
		  $scope.restoreDataObj.startTime = sttime;
        }
		$scope.showSuccessMsg = true;
		//Create a http request to submit the data to the REST server.
		retrieve($scope);
	}
	$scope.panelCssClass = function($index) {
		currentStatus = "status" + $index;
		//console.log($scope.status[$index].open);
		if ($scope.status[$index].open) {
			return 'fa-angle-down';
		} else {
			return 'fa-angle-right';
		}
		//return "{'fa-angle-up': status"+$index+".open, 'fa-angle-down': !status"+$index+".open}";
	}
	$scope.setPanelOpen = function($index, $first) {
		if ($first)
			return "{status" + $index + ".isFirstOpen}";
		else
			return "{status" + $index + ".open}";
	}

	$scope.clusterNameItems = [{
		"clusterNameVal" : "Cluster 1"
	}, {
		"clusterNameVal" : "Cluster 2"
	}, {
		"clusterNameVal" : "Cluster 3"
	}];
	$scope.clusterNameVal = $scope.clusterNameItems[0].clusterNameVal;
	
	$scope.changeClusterName = function() {
		if (this.clusterNameItem != undefined) {
			$scope.clusterNameVal = this.clusterNameItem.clusterNameVal;
		}
	}

	$scope.currentTime = function() {
		$scope.policyDate = new Date();
		$scope.year = $scope.policyDate.getUTCFullYear();
		$scope.month = $scope.policyDate.getUTCMonth() + 1;
		$scope.day = $scope.policyDate.getUTCDate();

		$scope.startTimeHrs = $scope.policyDate.getHours();
		$scope.startTimeMin = $scope.policyDate.getMinutes();
		$scope.startTimeFormat = $scope.startTimeHrs >= 12 ? 'PM' : 'AM';
		$scope.startTimeHrs = $scope.startTimeHrs % 12;
		$scope.startTimeHrs = $scope.startTimeHrs < 10 ? '0' + $scope.startTimeHrs : $scope.startTimeHrs;
		$scope.startTimeMin = $scope.startTimeMin < 10 ? '0' + $scope.startTimeMin : $scope.startTimeMin;

		// Setting system UTC

		$scope.timezone = new Date(Date.UTC($scope.startTimeHrs, $scope.startTimeMin));
		$scope.dateStr = $scope.timezone.toString();

		$scope.dateStrNew = $scope.dateStr.substr($scope.dateStr.indexOf("(") + 1);

		if (navigator.userAgent.indexOf('Mac OS X') != -1) {
			$scope.sysTimeZone = $scope.dateStrNew.replace(")", " ");
		} else {
			$scope.zoneString = $scope.dateStrNew.replace(")", " ");
			$scope.shortString = $scope.zoneString.match(/\b(\w)/g);
			$scope.sysTimeZone = $scope.shortString.join('');
		}

		$scope.restoreDateString = $scope.month + "/" + $scope.day + "/" + $scope.year + " " + $scope.startTimeHrs + ":" + $scope.startTimeMin + " " + $scope.startTimeFormat + " " + $scope.sysTimeZone;

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

		$scope.shouldBeOpen = true;

	};
	$scope.currentTime();

	angular.element('#restoreLaterFields').hide();

	$scope.restoreRadioClick = function(type) {
		$scope.RestoreType = type;
		if (type == 'now') {
			$scope.currentTime();
			angular.element('#restoreDateString').show();
			angular.element('#restoreLaterFields').hide();
			angular.element('#timeFootLater').attr('disabled', 'disabled');
			angular.element('#timeFootRestore').removeAttr('disabled');
		} else if (type == 'later') {

			angular.element('#restoreDateString').hide();
			angular.element('#restoreLaterFields').show();
			angular.element('#timeFootRestore').attr('disabled', 'disabled');
			angular.element('#timeFootLater').removeAttr('disabled');

		}

	}

	$scope.reifyData = function() {

		$scope.loading = true;
		$scope.checkmark = false;

		angular.element("#timeFootReDataMsg").show().fadeIn(7000);
		angular.element("#timeFootLaterMsg").hide();
		angular.element("#timeFootRestoreMsg").hide();
		angular.element("#timeFootReAppMsg").hide();

		$scope.reifyLoader = $http.get('js/controllers/reifyData.json').success(function(data, status, headers, config) {
			$scope.reifyDataItems = data;
			$timeout(function() {
				$scope.loading = false;
				$scope.checkmark = true;
			}, 3000);

		}).error(function(data, status, headers, config) {
			$scope.loading = true;
			$scope.checkmark = false;
		});
	};

	$scope.reifyApp = function() {
		$scope.loading = true;
		$scope.checkmark = false;

		angular.element("#timeFootReAppMsg").show().fadeIn(7000);
		angular.element("#timeFootReDataMsg").hide();
		angular.element("#timeFootLaterMsg").hide();
		angular.element("#timeFootRestoreMsg").hide();

		$scope.reifyAppLoader = $http.get('js/controllers/reifyApp.json').success(function(data, status, headers, config) {
			$scope.reifyAppItems = data;

			$timeout(function() {
				$scope.loading = false;
				$scope.checkmark = true;
			}, 13000);

		}).error(function(data, status, headers, config) {
			$scope.loading = true;
			$scope.checkmark = false;
		});
	};
    $scope.changestartTimeFormat = function(TimeFormat) {
		$scope.startTimeFormat = TimeFormat;
	}

	$scope.getMongoVerbose = function (index){
		console.log('getVerbose');
	}
	
	
	$scope.getCassandraVerbose = function (index){		
		var cassandraVerbose = $scope.current.dataSourceName.split('/');
		$scope.current.objectValues.forEach(function(objectValues,key) {
			if(objectValues=='Keyspace'){
				$scope.current.objectValues[key]=objectValues+" : "+cassandraVerbose[0];
			}else if(objectValues=='Column Family'){
				$scope.current.objectValues[key]=objectValues+" : "+cassandraVerbose[1];
			}else{			
				$scope.current.objectValues[key]=objectValues+" : "+$scope.restorePointsVerbose[index];
			}
		});
		return $scope.current.objectValues;
	}
    
    $scope.changeDataSource = function(){
        var dsTypes = $('.dsType:checked');
        var newdatasources = {};        
        $scope.dsCount=0;
        for(k in dsTypes){
            console.log(k);
            if(dsTypes.hasOwnProperty(k)) {
                if($scope.datasourcesAll[$(dsTypes[k]).val()] != undefined){
                    $scope.datasources[$(dsTypes[k]).val()] = $scope.datasourcesAll[$(dsTypes[k]).val()];   
                    $scope.dsCount++;
                } 
            }
        }
        
        
    }

	$scope.images = [{
		imageKey : 'Hello 1'
	}, {
		imageKey : 'Hello 2'
	}, {
		imageKey : 'Hello 3'
	}, {
		imageKey : 'Hello 4'
	}, {
		imageKey : 'Hello 5'
	}, {
		imageKey : 'Hello 6'
	}, {
		imageKey : 'Hello 7'
	}, {
		imageKey : 'Hello 8'
	}, {
		imageKey : 'Hello 9'
	}, {
		imageKey : 'Hello 10'
	}, {
		imageKey : 'Hello 11'
	}];
    
    $scope.openRestorePointModal = function(){
        var modalInstance = $modal.open({
			templateUrl : 'restore-status.html',
			controller : 'restoreStatusModalCtrl',
			size : 'md',
			resolve: {
			        postScope: function () {
			        	return $scope;
				}
			      }
			});
    }
    $scope.prev= function(){
    	
    	var versionCount = parseInt($scope.restorePointCount[$scope.dataSource]);
    	$scope.shiftCount--;
    	console.log('Previous');
    	console.log($scope.shiftCount);
    	console.log($scope.shiftCount);
    	if($scope.shiftCount >= 0) {
    		$scope.shiftOffset += 35;
    		$('#restorePointsPanel').animate({'margin-left':$scope.shiftOffset+'px'});
    		var showIndex = $scope.shiftCount;
    		var hideIndex = 21+$scope.shiftCount;
    		var allElements = $('#restorePointsPanel li');
    		var firstLegendContent = $(allElements[showIndex]).find('div.legend').first().text();
    		var lastLegendContent = $(allElements[(hideIndex-1)]).find('div.legend').first().text();
    		$('#first-legend').text(firstLegendContent);
    		$('#last-legend').text(lastLegendContent);
    		var hideElement = $('#restorePointsPanel li')[hideIndex];
    		var showElement = $('#restorePointsPanel li')[showIndex];
    		$(showElement).removeClass('ng-hide');
    		$(showElement).css('visibility','visible');
	    	$(hideElement).css('visibility','hidden');
    		if($scope.shiftCount == 0){
    			$scope.hasPrevious = false;
    		}
    		$scope.hasNext = true; 
    	} else {
    		$scope.shiftCount = 0;
    		$scope.hasPrevious = false;
    	}
    }
    $scope.next = function(element){
    	var versionCount = parseInt($scope.restorePointCount[$scope.dataSource]);
    	$scope.shiftCount++;
    		console.log($scope.shiftCount);
    	if($scope.shiftCount <= (versionCount - 21)) {
    		$scope.shiftOffset -= 35;	    	
	    	$('#restorePointsPanel').animate({'margin-left':$scope.shiftOffset+'px'});
	    	var showIndex = 20+$scope.shiftCount;
	    	var hideIndex = $scope.shiftCount - 1;
	    	var showLegendIndex = $scope.shiftCount;
	    	console.log('hideIndex:'+hideIndex);
	    	var allElements = $('#restorePointsPanel li');
	    	var showElement = allElements[showIndex];
	    	//var hideLegendElement = allElements[hideLegendIndex];
	    	var showLegendElement = allElements[showLegendIndex];
	    	//$(showElement).find('div.legend').removeClass('ng-hide').addClass('ng-show');
	    	firstLegendContent = $(showLegendElement).find('div.legend').text();
	    	lastLegendContent = $(showElement).find('div.legend').text();
	    	$('#first-legend').text(firstLegendContent);
	    	$('#last-legend').empty();
	    	$('#last-legend').text(lastLegendContent);
	    	var hideElement = allElements[hideIndex];
	    	$(showElement).removeClass('ng-hide');
	    	$(showElement).css('visibility','visible');
	    	$(hideElement).css('visibility','hidden');
	    	$scope.hasPrevious = true;
	    	if($scope.shiftCount == (versionCount - 21)	 ){
	    			$scope.hasNext = false;
	    	}  	
	    	console.log('Next');
	    
    	} else {
    		$scope.shiftCount = (versionCount - 21);
    		$scope.hasNext = false;
    	}
    	
    }
}]);

datOS.controller('restoreStatusModalCtrl', ['$q','$scope','$modal','$http','$modalInstance','getJobs','postScope','language',function($q,$scope, $modal,$http,$modalInstance,getJobs,postScope,language) {

    $scope.postData = postScope;
    $scope.clusterName = $scope.postData.cluster[0];
	rstat = $scope;
	language($scope);
    $scope.restorationStatuses = [
        {status:'Started',version_number:1,fname:'xy_db',timestamp:1424716657},
        {status:'Started',version_number:3,fname:'xy_db',timestamp:1424716657},
        {status:'Completed',version_number:7,fname:'xy_db',timestamp:1424716657},
        {status:'Started',version_number:6,fname:'xy_db',timestamp:1424716657},
        {status:'Completed',version_number:5,fname:'xy_db',timestamp:1424716657},
        {status:'Started',version_number:9,fname:'xy_db',timestamp:1424716657},
    ];
	$scope.jobType = 'restore';
    getJobs($scope);

    $scope.cancel = function() {
		$modalInstance.dismiss('cancel');
        };
}]);

