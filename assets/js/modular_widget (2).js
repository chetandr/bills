function FC_ChartUpdated(DOMId){  
      document.getElementById("policy_info").setAttribute('style', ' ');
      var chartRef = FusionCharts(DOMId);                              																	                                                           
	  var dialValue = chartRef.getData(1);										                               
      var divToUpdate = document.getElementById("contentDiv");
	  var dial_val = Math.floor(dialValue);
	  $(".dial-label").css('font-weight','normal');
	  $(".dial-label").css('font-size','16px');
	  //$(".do-rec-submessage").addClass("ng-hide");

	  if(dial_val >= 0 && dial_val <= 60){//sec
     	 document.getElementById("schedule-indicate").className = "schedule-indicate-seconds";
	     var el = document.getElementById("seconds");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';		
		 //document.getElementById("seconds").setAttribute("style","text-shadow:2px 10px 26px;");
		 dial_val = dial_val;		 
		 document.getElementById("recovery_time").value = dial_val;
		 document.getElementById("time_unit").innerHTML = "Seconds";
	  }
	  else if(dial_val > 60 && dial_val <= 120){//min
	     document.getElementById("schedule-indicate").className = "schedule-indicate-minutes";
	     var el = document.getElementById("minutes");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';	
		 dial_val = (dial_val - 60);
		 document.getElementById("recovery_time").value = dial_val;	
		 document.getElementById("time_unit").innerHTML = "Minutes";		 
	  }	 	  
	  else if(dial_val > 120 && dial_val <= 180){//hour
	     document.getElementById("schedule-indicate").className = "schedule-indicate-hours";
	     var el = document.getElementById("hours");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';
		 dial_val = Math.round((dial_val - 120) / 2.5);		
		 document.getElementById("recovery_time").value = dial_val;
		 document.getElementById("time_unit").innerHTML = "Hours";
	  }
	  else if(dial_val > 180 && dial_val <= 240){//days
    	 document.getElementById("schedule-indicate").className = "schedule-indicate-days";
         var el = document.getElementById("days");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';	  
		 dial_val = Math.round((dial_val - 180) / 8.6);
		 if(dial_val == 0){
		    dial_val = 1;
		 }
		 document.getElementById("recovery_time").value = dial_val;	
         document.getElementById("time_unit").innerHTML = "Days";		 
	  }
	  else if(dial_val > 240 && dial_val <= 300){//week
		document.getElementById("schedule-indicate").className = "schedule-indicate-weeks";
	     var el = document.getElementById("weeks");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';
		 dial_val = Math.round((dial_val - 240) / 12);
		 if(dial_val == 0){
		    dial_val = 1;
		 }
		 document.getElementById("recovery_time").value = dial_val;
	     document.getElementById("time_unit").innerHTML = "Weeks";
	  }
	  else if(dial_val > 300 && dial_val <= 360){//month
	     document.getElementById("schedule-indicate").className = "schedule-indicate-months";
	     var el = document.getElementById("months");
		 el.style.fontWeight = 'bold';
		 el.style.color = 'white';
		 el.style.fontSize = '120%';
		 dial_val = Math.round((dial_val - 300) / 5);
		 document.getElementById("recovery_time").value = dial_val;
		 document.getElementById("time_unit").innerHTML = "Months";
	  }	       
}

function redraw(selected_value){
	var value,value1, time_value;
        name = selected_value;

    if( name == 'recovery_time'){	   
	   time_value = document.getElementById("time_unit").innerHTML;	   
	   if(time_value == 'Seconds'){
	      document.getElementById("recovery_time").setAttribute("max",60);
	      value = parseInt(document.getElementById("recovery_time").value);	
		  if(document.getElementById("recovery_time").value > 60){
			value = 0;
		  }
	   }
	   else if(time_value == 'Minutes'){
	      document.getElementById("recovery_time").setAttribute("max",60);
		  value = parseInt(document.getElementById("recovery_time").value) + 60;	
		  if(document.getElementById("recovery_time").value > 60){
			value = 0;
		  }
	   }
	   else if(time_value == 'Hours'){
	      document.getElementById("recovery_time").setAttribute("max",24);
		  value = parseInt(document.getElementById("recovery_time").value)*  2.5 + 120;
		  if(document.getElementById("recovery_time").value > 24){
			value = 0;
		  }
	   }
	   else if(time_value == 'Days'){
	      document.getElementById("recovery_time").setAttribute("max",7);
	      value = parseInt(document.getElementById("recovery_time").value)*4 + 180;
		  if(document.getElementById("recovery_time").value > 7){
			value = 0;
		  }
	   }
	   else if(time_value == 'Weeks'){
	      document.getElementById("recovery_time").setAttribute("max",5);
	      value = parseInt(document.getElementById("recovery_time").value)*6 + 250;
		  if(document.getElementById("recovery_time").value > 5){
			value = 0;
		  }
	   }
	   else if(time_value == 'Months'){
	      document.getElementById("recovery_time").setAttribute("max",12);
	      value = parseInt(document.getElementById("recovery_time").value)*2.5 + 330;
		  if(document.getElementById("recovery_time").value > 12){
			value = 0;
		  }
	   }
	   else{
	      document.getElementById("recovery_time").setAttribute("max",1);
	      value = parseInt(document.getElementById("recovery_time").value) *6 + 330;
		  if(document.getElementById("recovery_time").value > 1){
			value = 0;
		  }
	   }

	   draw(value);
	}	
}
   
function draw(val){
    var cSatScoreChart = new FusionCharts({
        type: 'angulargauge',
        renderAt: 'chart-container',
        width: '500',
        height: '500',
        dataFormat: 'json',
		id: "ChId1",
        dataSource: {
        "chart": {
        "manageresize": "1",
        "origw": "300",
        "origh": "300",
        "palette": "3",
        "bgcolor": "#f5f5f5",
        "bgalpha": "100",
        "lowerlimit": "0",
        "upperlimit": "360",
        "gaugestartangle": "90",
        "gaugeendangle": "-270",
        "gaugeouterradius": "120",
        "gaugeinnerradius": "70%",
        "gaugefillmix": "{color}",
        "gaugefillratio": "",
        "basefontcolor": "white",
        "tooltipbgcolor": "black",
        "tooltipbordercolor": "black",
        "decimals": "0",
        "gaugeoriginx": "150",
        "gaugeoriginy": "150",
        "showborder": "0",
		"showToolTip": "0",		
		"editmode":"1",
		"pivotRadius" : "10",	
		"showPivotBorder" : "1",
		"pivotBorderThickness" : "8",
	    "pivotBorderColor" : "#000000",
		"gaugebordercolor": "#FFFFFF",
		"gaugeBorderThickness" : "4",	
		"gaugeBorderAlpha" : "100",
		"showTickMarks" : "0",
		"showMajorTickMarks" : "0",
		"showTickValues" : "0",		
		"manageValueOverlapping" : "0"
    },
    "colorrange": {
        "color": [
            {               
                "minvalue": "0",//seconds
                "maxvalue": "60",
				"code": "#d91e19"				
            },
            {
                "minvalue": "61",//minute
                "maxvalue": "120",
				"code": "#e84c3d"
            },
            {
                "minvalue": "121",//hour
                "maxvalue": "180",
				"code": "#d1527f"
            },
            {
                "minvalue": "181",//days
                "maxvalue": "240",
				"code": "#e26a6b"
            },
            {
                "minvalue": "241",//weeks
                "maxvalue": "300",
				"code": "#eb9532"
            },
            {
                "minvalue": "301",//months
                "maxvalue": "360",
				"code": "#f6ab36"
            }
        ]
    },
	
    "dials": {
        "dial": [
            {
                "id": "Dial1",
                "value": val || 0,
                "basewidth": "6",
                "topwidth": "5",
                "editmode": "1",               
                "rearextension": "25",
                "valuey": "170",
				"bgColor": "#000000",
				"radius" : "80"
            }
        ]
    }
        }
    });
    cSatScoreChart.render();
}

function show_policy(){
document.getElementById("policy_info").setAttribute('style', 'display:none');
document.getElementById("policy_info").setAttribute('ng-show', 'showRecoveryData');
draw(0);
}