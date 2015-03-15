/*We have single input box dealing with Seconds/Minutes/Hours.
  'seconds_list' id is used to work with the same input element to change from Seconds/Minutes/Hours
*/
function FC_ChartUpdated(DOMId,$scope){		

      var chartRef = FusionCharts(DOMId);                              																	                                                           
	  var dialValue = chartRef.getData(1);										                               
      var divToUpdate = document.getElementById("contentDiv");
	  var dial_val = Math.floor(dialValue);
	 
	  if(dial_val >= 0 && dial_val <= 30){//sec
		 document.getElementById('timeFormat').innerHTML='Seconds';
		 dial_val = dial_val * 2;		 
		 document.getElementById("seconds_list").value = dial_val;
		 document.getElementById("recoveryTimeType").value = 'seconds_list';
	  }
	  else if(dial_val > 30 && dial_val <= 60){//min
		 document.getElementById('timeFormat').innerHTML='Minutes';
		 dial_val = (dial_val - 30) * 2;
		 document.getElementById("seconds_list").value = dial_val;		
		 document.getElementById("recoveryTimeType").value = 'minutes_list';		 
	  }	 	  
	  else if(dial_val > 60 && dial_val <= 90){//hour
	     document.getElementById('timeFormat').innerHTML='Hours';
		 dial_val = Math.round((dial_val - 60) / 1.25);		
		 document.getElementById("seconds_list").value = dial_val;
		 document.getElementById("recoveryTimeType").value = 'hours_list';
	  }
	  else if(dial_val > 90 && dial_val <= 120){//days
		 dial_val = Math.round((dial_val - 90) / 4.28);
		 if(dial_val == 0){
		    dial_val = 1;
		 }
		 document.getElementById("days_list").value = dial_val;		
	  }
	  else if(dial_val > 120 && dial_val <= 150){//week
		 dial_val = Math.round((dial_val - 120) / 6);
		 if(dial_val == 0){
		    dial_val = 1;
		 }
		 document.getElementById("weeks_list").value = dial_val;		 
	  }
	  else if(dial_val > 150 && dial_val <= 180){//month
		 dial_val = Math.round((dial_val - 150) / 2.5);
		 document.getElementById("months_list").value = dial_val;		 
	  }
	  else
	  {
		dial_val = Math.round((dial_val - 180) / 6);
		if(dial_val == 0){
		    dial_val = 1;
		}
		 dial_val = 2009 + dial_val; 		 
	  }    
	  
}

function redraw(selected_value){
	var value,value1 ;
        name = selected_value;
	if( name == 'months_list'){
	   value1 = parseInt(document.getElementById("months_list").value)*2.5 + 150;
	   draw(value1);
	}
	else if( name == 'weeks_list'){
	   value1 = parseInt(document.getElementById("weeks_list").value)*6 + 120;
	   draw(value1);
	}
	else if( name == 'days_list'){
	   value1 = parseInt(document.getElementById("days_list").value)*4.28 + 90;
	   draw(value1);
	}
	else if( name == 'hours_list'){
	   value = parseInt(document.getElementById("seconds_list").value)* 1.25 + 60;	
	   draw(value);
	}
	else if( name == 'seconds_list'){
	   value = parseInt(document.getElementById("seconds_list").value)/2 + 0;
	   draw(value);
	}
	else if( name == 'minutes_list'){
	   value = (document.getElementById("seconds_list").value)/2 + 30;	   
	   draw(value);
	}
	else{
	   value1 = parseInt(document.getElementById("years_list").value) *6 + 180;
	   draw(value1);
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
        "upperlimit": "210",
        "gaugestartangle": "90",
        "gaugeendangle": "-270",
        "gaugeouterradius": "126",
        "gaugeinnerradius": "75%",
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
		"majorTMNumber":"20",
		"majorTMHeight":"6",
		"majorTMThickness":"3",
		"editmode":"1",
		"pivotRadius" : "10",
		"pivotfillcolor": "FFFFFF",		
		"pivotfillmix": "{light}, {dark}",
		"pivotfillratio": "",
		"pivotfillradius": "7",
		"showpivotborder": "1",
		"pivotborderthickness": "10",
		"pivotbordercolor": "000000",
    },
    "colorrange": {
        "color": [
            {               
                "minvalue": "0",//seconds
                "maxvalue": "30",
				"code": "#d91e19"				
            },
            {
                "minvalue": "30",//minute
                "maxvalue": "60",
				"code": "#e84c3d"
            },
            {
                "minvalue": "60",//hour
                "maxvalue": "90",
				"code": "#d1527f"
            },
            {
                "minvalue": "90",//days
                "maxvalue": "120",
				"code": "#e26a6b"
            },
            {
                "minvalue": "120",//weeks
                "maxvalue": "150",
				"code": "#eb9532"
            },
            {
                "minvalue": "150",//months
                "maxvalue": "180",
				"code": "#f6ab36"
            },
            {
                "minvalue": "180",//years
                "maxvalue": "210",
				"code": "#23a7f1"
            }
        ]
    },
	
    "dials": {
        "dial": [
            {
                "id": "Dial1",
                "value": val || 0,
                "basewidth": "7",
                "topwidth": "7",
                "editmode": "1",               
                "rearextension": "0",
                "valuey": "170",
				"bgColor": "#000000",
				"radius" : "80",
				"rearextension": "25"
            }
        ]
    }
        }
    });
    cSatScoreChart.render();
}
