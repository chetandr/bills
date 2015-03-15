var globalKnob;
function redraw(selected_value,time_value){
	
}


function degToValue(deg, units, offset) {
	arc_angle = 50;	
	value = parseInt(Math.ceil((deg - offset) * (units / arc_angle)));	
	return value;
}


   
function draw(val){
    var cSatScoreChart = new FusionCharts({
        type: 'angulargauge',
        renderAt: 'chart-container',
        width: '400',
        height: '400',
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
        "upperlimit": "361",
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
		"gaugebordercolor": "#ffffff",
		"gaugeBorderThickness" : "1",	
		"gaugeBorderAlpha" : "90",
		"showTickMarks" : "0",
		"showMajorTickMarks" : "0",
		"showTickValues" : "0",		
		"manageValueOverlapping" : "1",

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
				"code": "#ff634f"
            },
            {
                "minvalue": "181",//days
                "maxvalue": "240",
				"code": "#ff7f76"
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