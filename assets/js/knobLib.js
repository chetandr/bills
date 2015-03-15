var Knob;
var globalPercentage, globalDegree;
Knob = function(input, ui) {
  var container = document.createElement('div');
  container.setAttribute('tabindex', 0);
  input.parentNode.replaceChild(container, input);
  input.style.cssText = 'position: absolute; top: -10000px';
  input.setAttribute('tabindex', -1);
  container.appendChild(input);

  var settings = this.settings = this._getSettings(input);
  
  this.value = input.value = settings.min + settings.range / 2;
  this.input = input;
  this.min = settings.min;

  this.ui = ui;
  input.addEventListener('change', this.changed.bind(this), false);

  var events = {
    //keydown: this._handleKeyEvents.bind(this),
    //mousewheel: this._handleWheelEvents.bind(this),
    //DOMMouseScroll: this._handleWheelEvents.bind(this),
    touchstart: this._handleMove.bind(this, 'touchmove', 'touchend'),
    mousedown: this._handleMove.bind(this, 'mousemove', 'mouseup')
  };

  for (var event in events) {
    container.addEventListener(event, events[event], false);
  }

  container.style.cssText = 'position: relative; width:' + settings.width + 'px;' + 'height:' + settings.height + 'px;';

  ui.init(container, settings);
  this.container = container;
  this.changed(0);

};

Knob.prototype = {
  _handleKeyEvents: function(e) {
    var keycode = e.keyCode;
    if (keycode >= 37 && keycode <= 40) {
      e.preventDefault();
      var f = 1 + e.shiftKey * 9;
      this.changed({37: -1, 38: 1, 39: 1, 40: -1}[keycode] * f);
    }
  },

  _handleWheelEvents: function(e) {
    e.preventDefault();
    var deltaX = -e.detail || e.wheelDeltaX;
    var deltaY = -e.detail || e.wheelDeltaY;
    var val = deltaX > 0 || deltaY > 0 ? 1 : deltaX < 0 || deltaY < 0 ? -1 : 0;
    this.changed(val);   
  },

  _handleMove: function(onMove, onEnd) {
    this.centerX = this.container.offsetLeft + this.settings.width / 2;
    this.centerY = this.container.offsetTop + this.settings.height / 2;
    var fnc = this._updateWhileMoving.bind(this);
    var body = document.body;
    body.addEventListener(onMove, fnc, false);
    body.addEventListener(onEnd, function() {
      body.removeEventListener(onMove, fnc, false);
    }, false);
  },

  _updateWhileMoving: function(event) {
    event.preventDefault();
    var e = event.changedTouches ? event.changedTouches[0] : event;
	
	// IMPORTANT: offest needs to be calculated for the SVG element
	var svg_offset = $('svg').offset();
	
    var x = this.centerX - e.pageX + svg_offset.left;
    var y = this.centerY - e.pageY + svg_offset.top;
    var deg = Math.atan2(-y, -x) * 180 / Math.PI + 90 - this.settings.angleoffset;
    var percent;

    if (deg < 0) {
      deg += 360;
    }
	//deg = 90;
    deg = deg % 360;
	
    if (deg <= this.settings.anglerange + 1) {
      percent = Math.max(Math.min(1, deg / this.settings.anglerange), 0);
	  
	}  else {	
      percent = +(deg - this.settings.anglerange < (360 - this.settings.anglerange) / 2);
	} 
	var t = Math.abs(globalPercentage - percent) > 0.005;
	
	/*IMPORTANT: pointer should not cut across from first to last section and vice versa*/
	if ((globalPercentage==0 || globalPercentage==1) && Math.abs(globalPercentage - percent) > 0.1 ) {
		return false;
	}
	
    var range = this.settings.range;
    var value = this.min + range * percent;

    var step = (this.settings.max - this.min) / range;
    this.value = this.input.value = Math.round(value / step) * step;
    this.ui.update(percent, this.value);
	
	/*CHANGED CODE: Retrive the degree and percentage of rotation*/
	globalPercentage = percent;
	globalDegree = deg;
	
	percent = percent * 100;
	//console.log('Degree = ' + globalDegree + " , Percent = "  + globalPercentage.toFixed(2));
	var timeLabel='';
	// update the input model and dropdown based on pointer position
	if(deg <= 50) {
		offset = 0;
		timeLabel = "Second";
		value = degToValue(deg, 60, offset);
		
	} else if(deg <= 100) {
		offset = 50;
		timeLabel = "Minute";
		value = degToValue(deg, 60, offset);
		
	}else if(deg <= 150) {
		offset = 100;
		timeLabel = "Hour";
		value = degToValue(deg, 24, offset);
		
	}else if(deg <= 200) {
		offset = 150;
		timeLabel = "Day";
		value = degToValue(deg, 7, offset);
		
	}else if(deg <= 250) {
		offset = 200;
		timeLabel = "Week";
		value = degToValue(deg, 5, offset);
		
	}else if(deg <= 300) {
		offset = 250;
		timeLabel = "Month";
		value = degToValue(deg, 12, offset);
		
	} else if(percent == 100) {
		offset = 250;
		timeLabel = "Month";
		value = 12		
	}	
	
	this.svgUpdateValue(value, timeLabel);	
  },

  changed: function(percent) {
  percent = percent / 100;
   // this.input.value = this.limit(parseFloat(this.input.value) + direction * (this.input.step || 1));
   // this.value = this.input.value;
    //this.ui.update(this._valueToPercent(), this.value);
	this.ui.update(percent);
  },
  
  svgUpdateValue: function (value, units) {
  
	//if(value.length && units.length) {alert(value);
		// update the SVG with value(i.e. number) and value type (i.e. seconds, minutes, etc)	
		$('.policy_time_label').remove();
		var valueText = new Ui.El.Text(value , 200, 320, 100, 100);
		valueText.node.setAttribute("class", "policy_time_label policy_value");
		valueText.node.setAttribute("text-anchor", "middle");	
		this.ui.el.node.appendChild(valueText.node);
		$('#recovery_time').val(value);
		
		if(value>1) units +='s';
		var valueTimeLabel = new Ui.El.Text(units, 200, 350, 100, 100);
		valueTimeLabel.node.setAttribute("class", "policy_time_label time_text");
		valueTimeLabel.node.setAttribute("text-anchor", "middle");	
		this.ui.el.node.appendChild(valueTimeLabel.node);	
		$('#time_unit').val(units);
		
	//}
  
  },

  _valueToPercent: function() {
    return  this.value != null ? 100 / this.settings.range * (this.value - this.min) / 100 : this.min;
  },

  limit: function(value) {
    return Math.min(Math.max(this.settings.min, value), this.settings.max);
  },
  _getSettings: function(input) {    
    var labels; 
	labels = 'Seconds,Minutes,Hours,Days,Weeks,Months';
    //if(input.dataset.labels){
      labels = labels.split(',');
    //}
    var settings = {
      max: labels ? labels.length-1 : parseFloat(input.max),
      min: labels ? 0 : parseFloat(input.min),
      step: parseFloat(input.step) || 1,
      angleoffset: 210,
      anglerange: 300,
      labels: labels,
	  width: 400, // width of svg containing dial
	  height: 400  // heightof svg containing dial
    };
    settings.range = settings.max - settings.min;
    var data = input.dataset;
    for (var i in data) {
      if (data.hasOwnProperty(i) && i!=='labels') {
        var value = +data[i];
        settings[i] = isNaN(value) ? data[i] : value;
      }
    }
    return settings;
  }
};



var Ui = function() {
};

Ui.prototype = {
  init: function(parentEl, options) {
    this.options || (this.options = {});
    this.merge(this.options, options);
    this.width = options.width;
    this.height = options.height;
    this.createElement(parentEl);
    if (!this.components) {
      return;
    }
    this.components.forEach(function(component) {
      component.init(this.el.node, options);
    }.bind(this));
  },

  merge: function(dest, src) {
    for (var i in src) {
	  if (src.hasOwnProperty(i)) {
        dest[i] = src[i];
      }
    }
    return dest;
  },

  addComponent: function(component) {
    this.components || (this.components = []);
    this.components.push(component);
  },

  update: function(percent, value) {

    if (!this.components) {
      return;
    }
    this.components.forEach(function(component) {
      component.update(percent, value);
    });
  },

  createElement: function(parentEl) {
    this.el = new Ui.El(this.width, this.height);
    this.el.create("svg", {
      version: "1.2",
      baseProfile: "tiny",
      width: this.width,
      height: this.height
    });
    this.appendTo(parentEl);
  },
  appendTo: function(parent) {
    parent.appendChild(this.el.node);
  }

};

Ui.Pointer = function(options) {
  this.options = options || {};
  this.options.type && Ui.El[this.options.type] || (this.options.type = 'Triangle');
};

Ui.Pointer.prototype = Object.create(Ui.prototype);

Ui.Pointer.prototype.update = function(percent) {
  this.el.rotate(this.options.angleoffset + percent * this.options.anglerange, this.width / 2,
    this.height / 2);
};

Ui.Pointer.prototype.createElement = function(parentEl) {
  this.options.pointerHeight || (this.options.pointerHeight = this.height / 2);
  if (this.options.type == 'Arc') {
    this.el = new Ui.El.Arc(this.options);
    this.el.setAngle(this.options.size);
  } else {
    this.el = new Ui.El[this.options.type](this.options.pointerWidth,
      this.options.pointerHeight, this.width / 2,
      this.options.pointerHeight / 2 + this.options.offset, this.options.rightAngledCorner);
  }
  var className = this.options.className || 'pointer';
  this.el.addClassName(className);
  this.appendTo(parentEl);

};

Ui.Arc = function(options) {
  this.options = options || {};
};

Ui.Arc.prototype = Object.create(Ui.prototype);

Ui.Arc.prototype.createElement = function(parentEl) {
  this.el = new Ui.El.Arc(this.options);
  this.appendTo(parentEl);
};

Ui.Arc.prototype.update = function(percent) {
  this.el.setAngle(percent * this.options.anglerange);
};

Ui.Scale = function(options) {
  this.options = this.merge({
    steps: options.range / options.step,
    radius: this.width / 2,
    tickWidth: 2,
    tickHeight: 3
  }, options);
  this.options.type = Ui.El[this.options.scaleType || 'Rect'];
};

Ui.Scale.prototype = Object.create(Ui.prototype);

Ui.Scale.prototype.createElement = function(parentEl) {
  this.el = new Ui.El(this.width, this.height);
  this.startAngle = this.options.angleoffset || 0;
  this.options.radius || (this.options.radius = this.height / 2.5);
  this.el.create("g");
  this.el.addClassName('scale');
  if (this.options.drawScale) {
  /*CHANGED CODE: commented  if condition to show markers along with text */
    //if(!this.options.labels){
	
	
	var original_steps = this.options.steps;
	var original_angle_range = this.options.anglerange;
	var original_start_angle = this.startAngle;
		
	if (Array.isArray(this.options.steps)) {
		steps = this.options.steps;
		var steps_length = original_steps = steps.length;
		this.options.anglerange = 50;
		
		for(var j = 0; j < steps_length; j++) {
			this.options.steps = steps[j];

			var step = this.options.anglerange / this.options.steps;
			var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
			this.ticks = [];
			var Shape = this.options.type;
			for (var i = 0; i < end; i++) {
			  var rect = new Shape(this.options.tickWidth, this.options.tickHeight, this.width / 2,
			  (this.options.tickHeight / 2) + this.options.tickOffset);
			rect.rotate(original_start_angle + i * step, this.width / 2, this.height / 2);
			rect.addClassName("marker");
			this.el.append(rect);
			this.ticks.push(rect);
		}
		original_start_angle += 50;
	}
	} else {
		steps_length = this.options.steps;
		this.options.anglerange = 325;
	
		for(var j = 0; j < steps_length; j++) {
			this.options.steps = steps_length;

			var step = this.options.anglerange / this.options.steps;
			var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
			this.ticks = [];
			var Shape = this.options.type;
			for (var i = 0; i < end; i++) {
				var rect = new Shape(this.options.tickWidth, this.options.tickHeight, this.width / 2,
					(this.options.tickHeight / 2) + this.options.tickOffset);
				rect.rotate(original_start_angle + i * step, this.width / 2, this.height / 2);
				this.el.append(rect);
				this.ticks.push(rect);
			}
	
	
	
     // }  
		} 
	} // else end
	this.options.anglerange = original_angle_range;
	this.options.steps = original_steps;
  }
  this.appendTo(parentEl);
  if (this.options.drawDial) {
    this.dial();
  }
};

Ui.Scale.prototype.dial = function() {
  var step = this.options.anglerange / this.options.steps;
  var min = this.options.min;
  var dialStep = (this.options.max - min) / this.options.steps;
  var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
  this.dials = [];
  if(!this.options.labels){
    for (var i = 0; i < end; i++) {
      var text = new Ui.El.Text(Math.abs(min + dialStep * i), this.width / 2 - 2.5,
        this.height / 2 - this.options.radius, 5, 5);
      this.el.append(text);
      text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
      this.dials.push(text);
    }
  } else {
	/*CHANGED CODE*/
    
	var offset_arr = [15,63,118,170,218,267];
	var label_spacing = 4.5;
	step = this.options.anglerange / (this.options.labels.length);
    for(var i=1; i<this.options.labels.length + 1; i++){
      var label = this.options.labels[i-1];
	 
      for(j=0; j< label.length; j++) {
		var chars = label[j];
		  var text = new Ui.El.Text(chars, this.width / 2 - 2.5, this.height / 2 - this.options.radius, 5, 5);
      this.el.append(text);
		  text.rotate(this.startAngle + ( j) * label_spacing + offset_arr[i-1], this.width / 2, this.height / 2);
      text.attr('text-anchor', 'middle');	   
      this.dials.push(text);
    }
	  offset_arr[i-1] += offset_arr[i-1];
	  
    }
  }
  
};

Ui.Scale.prototype.update = function(percent) {
  // if (this.ticks) {
    // if (this.activeStep) {
      // this.activeStep.attr('class', '');
    // }
    // this.activeStep = this.ticks[Math.round(this.options.steps * percent)];
    // this.activeStep.attr('class', 'active');
  // }
   
  if (this.dials) {
	var dialCount = this.dials.length;
	for( i = 0; i < dialCount; i++) {
		 this.dials[i].attr('class', '');
		 
	}
  
    if (this.activeDial) {
       this.activeDial.attr('class', '');
	}
	/*
	CHANGED CODE
	Old line: this.activeDial = this.dials[Math.random(this.options.steps * percent)];
	rounding value cahnge from random to floor to make the correctlly highlight labels when pointer is in respective section
	*/	
	
	// remove active from all dials
		
	
	for(var i = 0; i < dialCount; i++){
		$('.scale text').eq(i).css('fill', '');		
	}
	
	var textElementNumber, activeDials;
	var labelsCount = this.options.labels.length;
	if(percent == 1)  {
		textElementNumber = this.options.steps - 1;
		
	} else {
		textElementNumber = Math.floor(this.options.steps * percent);
	}
	
	var index, skipCount = 0;
	// array having length of each label
	var mappArr = [7, 7, 5, 4 ,5, 6];
	for(i=0; i<= textElementNumber - 1; i++){
		if(textElementNumber == 0) {
			skipCount = 0;
			break;
		}
		skipCount += mappArr[i];
	}
	
	var lastEl = skipCount + mappArr[textElementNumber];
	for(i = skipCount; i < lastEl ; i++) {
		this.dials[i].attr('class', 'active');
    }
  }
};

Ui.Text = function() {};

Ui.Text.prototype = Object.create(Ui.prototype);

Ui.Text.prototype.createElement = function(parentEl) {
  this.parentEl = parentEl
  this.el = new Ui.El.Text('', 0, this.height);
  this.appendTo(parentEl);
  this.el.center(parentEl);
};

Ui.Text.prototype.update = function(percent, value) {
  this.el.node.textContent = value;
  this.el.center(this.parentEl);
};

Ui.El = function() {};

Ui.El.prototype = {
  svgNS: "http://www.w3.org/2000/svg",

  init: function(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
    this.left = this.x - width / 2;
    this.right = this.x + width / 2;
    this.top = this.y - height / 2;
    this.bottom = this.y + height / 2;
  },
  create: function(type, attributes) {
    this.node = document.createElementNS(this.svgNS, type);
    for (var key  in attributes) {
      this.attr(key, attributes[key]);
    }
  },

  rotate: function(angle, x, y) {
    this.attr("transform", "rotate(" + angle + " " + (x || this.x) + " " + (y || this.y ) + ")");
  },

  attr: function(attributeName, value) {
    if (value == null) return this.node.getAttribute(attributeName) || '';
	
	// if attributeName has xlink then use setAttributeNS
	/* if(attributeName.indexOf('xlink') !== -1) {
		this.node.setAttributeNS("http://www.w3.org/2000/svg", attributeName, value);
	} else { */
		this.node.setAttribute(attributeName, value);
	/* } */
  },

  append: function(el) {
    this.node.appendChild(el.node);
  },

  addClassName: function(className) {
    this.attr('class', this.attr('class') + ' ' + className);
  }
};

Ui.El.Triangle = function() {
  this.init.apply(this, arguments);
  
  // if JSON string with modifications to triangle is specified then change the tiangle coordinates
  if(arguments[4].length) {
	
		var adjustment= 5;
		if(arguments[4] == 'right') {		
			this.create("polygon", {
			'points': this.left + ',' + this.bottom + ' ' + this.x + ',' + this.top + ' ' + this.x + ',' + (this.bottom - adjustment)			
			});
			
		} else {
			this.create("polygon", {
			'points': this.x + ',' + (this.bottom - adjustment) + ' ' + this.x + ',' + this.top + ' ' + this.right + ',' + this.bottom
			});
		}
	
	
  } else {
	this.create("polygon", {
		'points': this.left + ',' + this.bottom + ' ' + this.x + ',' + this.top + ' ' + this.right + ',' + this.bottom
	});
  }
  
  
};

Ui.El.Triangle.prototype = Object.create(Ui.El.prototype);

Ui.El.Rect = function() {
  this.init.apply(this, arguments);
  this.create("rect", {
    x: this.x - this.width / 2,
    y: this.y,
    width: this.width,
    height: this.height
  });
};

Ui.El.Rect.prototype = Object.create(Ui.El.prototype);

Ui.El.Circle = function(radius, x, y) {
  if (arguments.length == 4) {
    x = arguments[2];
    y = arguments[3];
  }
  this.init(radius * 2, radius * 2, x, y);
  this.create("circle", {
    cx: this.x,
    cy: this.y,
    r: radius
  });
};

Ui.El.Circle.prototype = Object.create(Ui.El.prototype);

Ui.El.Text = function(text, x, y, width, height) {
  this.create('text', {
    x: x,
    y: y,
    width: width,
    height: height
  });
  this.node.textContent = text;
};

Ui.El.Text.prototype = Object.create(Ui.El.prototype);

Ui.El.Text.prototype.center = function(element) {
  var width = element.getAttribute('width');
  var height = element.getAttribute('height');
  this.attr('x', width / 2 - this.node.getBBox().width / 2);
  this.attr('y', height / 2 + this.node.getBBox().height / 4);
};

Ui.El.Image = function(x, y, width, height) {
  this.create('image', {
    x: x,
    y: y,
    width: width,
    height: height,
});
  
};
Ui.El.Image.prototype = Object.create(Ui.El.prototype);

Ui.El.Image.prototype.setImageSource = function(source) {
  this.attr('xlink:href', source);
};




Ui.El.Arc = function(options) {
  this.options = options;
  //when there are lables, do not shift the arc other wise it will be 180 degree off 
  //compared to the labels
  this.options.angleoffset = (options.angleoffset || 0) - (this.options.labels?0:90);
  this.create('path');
};

Ui.El.Arc.prototype = Object.create(Ui.El.prototype);

Ui.El.Arc.prototype.setAngle = function(angle) {
  this.attr('d', this.getCoords(angle));
};


Ui.El.Arc.prototype.getCoords = function(angle) {
  var startAngle = this.options.angleoffset;
  var outerRadius = this.options.outerRadius || this.options.width / 2;
  var innerRadius = this.options.innerRadius || this.options.width / 2 - this.options.arcWidth;
  //position the arc so that it's shifted half an angle backward so that it's middle aligned
  //when there're lables
  
  if(this.options.labels){
   startAngle -= angle/2;
   
  }
  var startAngleDegree = Math.PI * startAngle / 180;
  var endAngleDegree = Math.PI * (startAngle + angle) / 180;
  var center = this.options.center || this.options.width / 2;

  var p1 = pointOnCircle(outerRadius, endAngleDegree);
  var p2 = pointOnCircle(outerRadius, startAngleDegree);
  var p3 = pointOnCircle(innerRadius, startAngleDegree);
  var p4 = pointOnCircle(innerRadius, endAngleDegree);

  var path = 'M' + p1.x + ',' + p1.y;
  var largeArcFlag = ( angle < 180 ? 0 : 1);
  path += ' A' + outerRadius + ',' + outerRadius + ' 0 ' + largeArcFlag + ' 0 ' + p2.x + ',' + p2.y;
  path += 'L' + p3.x + ',' + p3.y;
  path += ' A' + innerRadius + ',' + innerRadius + ' 0 ' + largeArcFlag + ' 1 ' + p4.x + ',' + p4.y;
  path += 'L' + p1.x + ',' + p1.y;
  return  path;

  function pointOnCircle(radius, angle) {
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  }
};
