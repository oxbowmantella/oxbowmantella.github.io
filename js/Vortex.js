var angle = 0;
var normUserCoordsX = null;
var normUserCoordsY = null;
var size = null;
var offset = null

// gui controls
var gui = new dat.GUI();
var ctrl = {
	wireframeMode: false,
	speed: 0.1,
	numRects: 50,
	motionMode: 'rotation',
	trackUserCoords: false,
	motionModes: {
		rotation: true,
		static: false,
		tangentSine: false
	},
	motionSetup: {
		rotation: function() {
			ctrl.disableAllMotions();
			ctrl.motionModes.rotation = true;
		},
		tangentSine: function() {
			ctrl.disableAllMotions();
			ctrl.motionModes.tangentSine = true;
		},
		static: function() {
			ctrl.disableAllMotions();
			ctrl.motionModes.static = true;
		}
	},
	disableAllMotions: function() {
		var keys = Object.keys(this.motionModes);
		for (var key in this.motionModes) {
			this.motionModes[key] = false;
		}
		
		// reset angle state
		angle = 0;
	},
	resetMotion: function() {
		angle = 0;
	}
};

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("content");
  
  rectMode(CENTER);
  angleMode(DEGREES);
	
	makeGuiControls();
}

function draw() {
	normUserCoordsX = map(
		touches.length ? touches[0].x : mouseX, 
		0, windowWidth, 
		-1, 1
	);
	normUserCoordsY = map(
		touches.length ? touches[0].y : mouseY, 
		0, windowHeight, 
		-1, 1
	);
	
	size = min(width, height) * 0.65;
  offset = size / ctrl.numRects;
  
  background(ctrl.wireframeMode ? 255 : 0);
  
  for (var i = 0; i < ctrl.numRects; i++) {
		
		if(ctrl.trackUserCoords) {
			var userCoordsX = normUserCoordsX * i * offset;
			var userCoordsY = normUserCoordsY * i * offset;	 
		}
		
    rectC(
      ctrl.trackUserCoords 
				? (width / 2) + userCoordsX 
				: width / 2,
      ctrl.trackUserCoords 
				? (height / 2) + userCoordsY 
				: height / 2,
      size - i * offset,
      size - i * offset,
      angle * (i + 1),
      i
    );
  }
  
	if(ctrl.motionMode !== 'static') angle += ctrl.speed;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function rectC(x, y, width, height, rotation, valCtrl) {
  push();
	
	// transform ----------------------
	translate(x, y);
	if(!ctrl.motionModes.static) {
		if(ctrl.motionModes.tangentSine) {
			rotate(tan(frameCount * ctrl.speed) * sin(rotation) * valCtrl);	 
		} else if(ctrl.motionModes.rotation) rotate(rotation);
	}
	
	// format -------------------------
	if(!ctrl.wireframeMode) {
		noStroke();
		fill(getFillNoise(valCtrl));
	} else {
		noFill();	
	}
	
	// draw ---------------------------
	rect(0, 0, width, height);
	
  pop();
}

function getFillNoise(valCtrl) {
	return [
		noise(frameCount * valCtrl * 0.0001) * 255,
		noise(frameCount * valCtrl * 0.001) * 255,
		noise(frameCount * valCtrl * 0.01) * 255,
		noise(frameCount * valCtrl * 0.0001) * 255
	];
}

function makeGuiControls() {
	gui.add(ctrl, 'numRects', 10, 100);
	gui.add(ctrl, 'speed', -0.5, 0.5);
	gui.add(ctrl, 'motionMode', ['rotation', 'tangentSine', 'static']).onChange(function() {
		// setup animation mode
		ctrl.motionSetup[ctrl.motionMode]();
	});
	gui.add(ctrl, 'wireframeMode');
	gui.add(ctrl, 'trackUserCoords');
	gui.add(ctrl, 'resetMotion');
}

