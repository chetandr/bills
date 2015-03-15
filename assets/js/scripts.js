$(document).ready(function() {

	// set window height and width dynamically

	var winWidth = $(document).width();
	var winHeight = $(document).height();
//	$('.do-menu-vertical.sidebar').height(winHeight);
	$('.do-menu-vertical.sidebar').height('1100px');
	var appScrollHeight = $('body')[0].scrollHeight;
	var newScrollHeight = appScrollHeight-450;
	$('.do-footer').css({
		'margin-bottom' : '-' + newScrollHeight + 'px'
	});

	// adjust middle content and right content on click of sidebar items
	$('#justify-icon').click(function() {
		if($('.do-menu-vertical').hasClass('sidebar-menu-expanded'))
		{
			$('.left-nav-slide').hide();
		}
		
		$('#justify-icon span').css({
			'padding-bottom' : '10px',
			'margin-left' : '3px'
		});
		
		
			
		if ($(".do-menu-vertical").hasClass("sidebar-menu-expanded")) {
			// collapse
			$('#justify-icon span').css({
				'float' : 'left'
			});

			$('.report-nav-menu').css('display', 'block');

			$('.report-acc').css('display', 'none');
			
			$('.do-menu-vertical .left-nav-slide').css({
				'background' : '#ff0000 !important'
			}); 
			
			
			$('.dropdown-submenu').hover(function(){
				$(this).children( ".left-nav-slide" ).css('display', 'block');
			}, function(){
				$(this).children( ".left-nav-slide" ).css('display', 'none');
			});

		} else if ($(".do-menu-vertical").hasClass("sidebar-menu-collapsed")) {
			// Expand
			
			$('#justify-icon span').css({
				'float' : 'right'
			});
			$('.do-menu-vertical ul.level1 li a.expandable span.expanded-element').css('display', 'block');

			$('.report-acc').hover(function() {
				$('.report-acc a').css({
					'background' : 'none',
					'color' : '#fff!important'
				});
			}, function() {
				$('.report-acc a').css({
					'background' : 'none',
					'color' : '#fff!important'
				});

			});
			$('.report-nav-menu').css('display', 'none');

			$('.report-acc').css('display', 'block');
			
			
			$('.dropdown-submenu').hover(function(){
				$(this).children( ".left-nav-slide" ).css('display', 'none');
			}, function(){
				$(this).children( ".left-nav-slide" ).css('display', 'none');
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

