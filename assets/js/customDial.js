Ui.DIAL = function() {
};

Ui.DIAL.prototype = Object.create(Ui.prototype);

Ui.DIAL.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);   
	var traingleParams = {
		type: 'Triangle',
		pointerWidth: 30,
		pointerHeight: this.width / 4 + 2,	
		offset: 77.5,		
	};	
	// adds rotating pointer
	this.addComponent(new Ui.Pointer(this.merge({rightAngledCorner: 'right',className: 'pointer1'}, traingleParams))); 	
	this.addComponent(new Ui.Pointer(this.merge({rightAngledCorner: 'left',className: 'pointer2'}, traingleParams)));	
  
	// adds path to rotate pointer through specified angle
	this.addComponent(new Ui.Scale(this.merge(this.options, {
		scaleType: 'Rect',
		drawDial:true,					// draw the labels in arc
		drawScale: true,				// draw the markers
		steps: [18, 10, 6, 5, 4, 3],  		// number of markers in each arc
		tickHeight: 20,					// marker height
		tickOffset: this.width /27 ,				// marker offset
		rotateLabels: 26,				// shifts the labels 33 degrees
		radius: (this.width)/3.1})));			
  
  function drawArc(element, offset_angle, arc_ang, arc_number) {
	  element.options.angleoffset = offset_angle;
	  var arc = new Ui.El.Arc(element.options);
	  arc.setAngle(arc_ang);
	  element.el.node.appendChild(arc.node);	 
  }   
   
 // circle in white background 
  var arc = new Ui.El.Circle(175, this.width / 2, this.height / 2);
  this.el.node.appendChild(arc.node); 
   
  var offset_angle;
  offset_angle = this.options.angleoffset - 65;
  var arc_ang = 50;
  var start_ang = offset_angle;
  var number_of_arcs = 6;
  this.options.center = this.width/2; 
  
   /* Middle Arc 1 to 6 */
  this.options.width = this.width - 50;
  this.options.arcWidth = 60;  
  
  for(var i=0; i < number_of_arcs; i++) {
	drawArc(this, offset_angle, arc_ang, i);
	offset_angle += arc_ang;
  }
  
  /* Inner Arc 1: 7 to 12 */
  this.options.width = this.width - 50 - 120;
  this.options.arcWidth = 25;
  offset_angle = start_ang;
  for(var i=0; i < number_of_arcs; i++) {
	drawArc(this, offset_angle, arc_ang);
	offset_angle += arc_ang;
  }
  
  /* Inner Arc 2: 13 to 18 */
  this.options.width = this.width - 50 - 170;
  this.options.arcWidth = 25;
  offset_angle = start_ang;
  for(var i=0; i < number_of_arcs; i++) {
	drawArc(this, offset_angle, arc_ang);
	offset_angle += arc_ang;
  }
	  
	
  /* Central Pin */
  var arc = new Ui.El.Circle(22, this.width / 2, this.height / 2);
  this.el.node.appendChild(arc.node);
  
  var arc = new Ui.El.Circle(10, this.width / 2, this.height / 2);
  this.el.node.appendChild(arc.node);
  
  this.el.node.setAttribute("class", "policy_dial");


};