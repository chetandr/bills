$(document).ready(function() {

	// set window height and width dynamically
	
	var winWidth = $(document).width();
	var winHeight = $(document).height();

	//var midHeight = $('.do-mid-panel').height();

	$('.do-menu-vertical.sidebar').height(winHeight + 20);

	//Left Panel
	$('.do-left-panel').width('60px');
	$('.do-left-panel').height(winHeight);
	
	
	$('.do-menu-vertical').height(winHeight);
	var leftNavheight = $('.height-control').height();
	$('.do-dash-alerts-task').height(winHeight);
	
	//Middle Panel
	$('.do-mid-panel').width(winWidth - 60);
	//$('.do-mid-panel').height(winHeight);

	// adjust middle content and right content on click of sidebar items
	$('#justify-icon').click(function() {


		$('#justify-icon span').css({
			'padding-bottom' : '10px',
			'margin-left' : '3px'
		});

		if ($(".do-menu-vertical").hasClass("sidebar-menu-expanded")) {
			// collapse
			$('.do-mid-panel').css('margin-left', 0);
			$('.do-mid-panel').width(winWidth - 60);
			$('#justify-icon span').css({
				'float' : 'left'
			});

		} else if ($(".do-menu-vertical").hasClass("sidebar-menu-collapsed")) {
			// Expand
			$('.do-mid-panel').css('margin-left', 173);
			$('.do-mid-panel').width(winWidth - 233);
			$('#justify-icon span').css({
				'float' : 'right'
			});

		}

	});

	// left navigation script starts
	(function() {
		$(function() {
			var SideBAR;
			SideBAR = (function() {
				function SideBAR() {
				}


				SideBAR.prototype.expandMyMenu = function() {
					return $(".do-menu-vertical").removeClass("sidebar-menu-collapsed").addClass("sidebar-menu-expanded");
				};

				SideBAR.prototype.collapseMyMenu = function() {
					return $(".do-menu-vertical").removeClass("sidebar-menu-expanded").addClass("sidebar-menu-collapsed");
				};

				SideBAR.prototype.showMenuTexts = function() {
					return $(".do-menu-vertical ul a span.expanded-element").show();
				};

				SideBAR.prototype.hideMenuTexts = function() {
					return $(".do-menu-vertical ul a span.expanded-element").hide();
				};

				SideBAR.prototype.showActiveSubMenu = function() {
					$("li.active ul.level2").show();
					return $("li.active a.expandable").css({
						width : "100%"
					});
				};

				SideBAR.prototype.hideActiveSubMenu = function() {
					return $("li.active ul.level2").hide();
				};

				SideBAR.prototype.adjustPaddingOnExpand = function() {
					$("ul.level1 li a.expandable").css({
						padding : "1px 4px 4px 0px"
					});
					return $("ul.level1 li.active a.expandable").css({
						padding : "1px 4px 4px 4px"
					});
				};

				SideBAR.prototype.resetOriginalPaddingOnCollapse = function() {
					$("ul.nbs-level1 li a.expandable").css({
						padding : "4px 4px 4px 0px"
					});
					return $("ul.level1 li.active a.expandable").css({
						padding : "4px"
					});
				};

				SideBAR.prototype.ignite = function() {
					return (function(instance) {
						return $("#justify-icon").click(function(e) {
							if ($(this).parent(".do-menu-vertical").hasClass("sidebar-menu-collapsed")) {
								instance.adjustPaddingOnExpand();
								instance.expandMyMenu();
								instance.showMenuTexts();
								instance.showActiveSubMenu();
								$(this).css({
									color : "#fff"
								});
							} else if ($(this).parent(".do-menu-vertical").hasClass("sidebar-menu-expanded")) {
								instance.resetOriginalPaddingOnCollapse();
								instance.collapseMyMenu();
								instance.hideMenuTexts();
								instance.hideActiveSubMenu();
								$(this).css({
									color : "#FFF"
								});
							}
							return false;
						});
					})(this);
				};

				return SideBAR;

			})();
			return (new SideBAR).ignite();
		});

	}).call(this);

});

