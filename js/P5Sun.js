let MouseScrollPos = 25;
let SpaceMan;

let sliderGroup = [];
let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let h = 20;

var MouseMovementCounter = 0;
const frameMax = 360;
var zAxis = 4000;
var yAxis = 0;
var xAxis = 0;
var AxisModifier = 50;
var mod = 0;
var StrokeColor = 1;
var StrokeTrigger = false;
var tourTrigger = false;
var resetLock = false;
let zAxisCamera = 1000;
let yAxisCamera = 0;
let xAxisCamera = 0;

let zAxisCameraLast = 500;
let yAxisCameraLast = 0;
let xAxisCameraLast = 0;
let curCameraFrame = 0;
let maxCameraFrames = 60;
//Stars
const starColorsHsb = [
  [226,  72, 86],
  [ 61, 100, 94],
  [267,  71, 75],
  [309,  60, 93],
  [  3,  81, 82]
];
let stars;

function preload() {
  SpaceMan = loadModel('models/SpaceManBody.obj');
}

function setup () {
  createCanvas(windowWidth, windowHeight, WEBGL);
  c1 = color(100, 0, 125);
  c2 = color(0, 125, 255);
  pg = createGraphics(256,256);
  //create sliders
  for (var i = 0; i < 6; i++) {
    if (i === 2) {
      sliderGroup[i] = createSlider(10, 400, 200);
    } else {
      sliderGroup[i] = createSlider(-400, 400, 0);
    }
    h = map(i, 0, 6, 5, 85);
    sliderGroup[i].position(10, height + h);
    sliderGroup[i].style('width', '80px');
  }
  function r() {
  	return random(-700, 700);
	}

  stars = Array.apply(null, Array(1000)).map(() => [
  	createVector(r(), r(), r()),
  	int(random(starColorsHsb.length))
  ]);

}


function mouseWheel(event) {
  //print(event.delta);
  //move the square according to the vertical scroll amount
  if(event.delta >= 0){
    print("Mouse Scrolled +");
    MouseMovementCounter++;
    //print(MouseMovementCounter);
  }
  if(event.delta <= 0){
    print("Mouse Scrolled -");
    MouseMovementCounter--;
    //print(MouseMovementCounter);
  }
  if(MouseMovementCounter == 1){POS1();}
  if(MouseMovementCounter == 2){POS2();}
  if(MouseMovementCounter == 3){POS3();}
  if(MouseMovementCounter == 4){POS4();}
  if(MouseMovementCounter == 5){POS5(); MouseMovementCounter = 0;}

  MouseScrollPos += event.delta;
  //uncomment to block page scrolling
  //return false;
}


function draw () {
   //-----------------------CameraTraverse-----------------------//
  if(tourTrigger == false){curCameraFrame = curCameraFrame + 1;}    
  if(tourTrigger == true){
    if(zAxisCamera <= 1800){
        curCameraFrame = curCameraFrame + 0.03;
      }
      if(zAxisCamera >= 1800){
        curCameraFrame = curCameraFrame + 0.25;
      }
    }
    if(curCameraFrame > maxCameraFrames) {
      xAxisCamera = xAxis;
      yAxisCamera = yAxis;
      zAxisCamera = zAxis;
    }
    else {
      xAxisCamera = map(curCameraFrame, 0, maxCameraFrames, xAxisCameraLast, xAxis)
      yAxisCamera = map(curCameraFrame, 0, maxCameraFrames, yAxisCameraLast, yAxis)
      zAxisCamera = map(curCameraFrame, 0, maxCameraFrames, zAxisCameraLast, zAxis)
    }
   //-----------------------scene setup-----------------------//
  translate(0, 0, -600);
  let cur_frame = frameCount % frameMax;
  let cur_frac = map(cur_frame, 0, frameMax, 0, 1);
  background(0);
  //camera(xAxisCamera-1000, yAxisCamera, zAxisCamera, xAxisCamera, yAxisCamera, 0, 0.0, 1.0, 0.0);
  //translate(0, 0, 600);
  X = sliderGroup[0].value();
  Y = sliderGroup[1].value();
  Z = sliderGroup[2].value();
  centerX = sliderGroup[3].value();
  centerY = sliderGroup[4].value();
  centerZ = sliderGroup[5].value();
  camera(xAxisCamera, yAxisCamera, zAxisCamera, xAxisCamera, yAxisCamera, 0, 0.0, 1.0, 0.0);
  
  //-----------------------Scene Lighting-----------------------//
  var locX = height / 2;
  var locY = width;
  
  //Turn Lights and Materials off when shader is running
  ambientMaterial(250);
  directionalLight(255, 0, 255, 0.25, 0.25, 0);
  directionalLight(0, 150, 250, 0, 0, -10);
  pointLight(0, 0, 255, locX, locY, 250);
  specularMaterial(50, 900, 100);
  //-----------------------Scene Objects-------------------------//
  strokeWeight(0.1);                
  //stroke(96,72,167);  //purple
  stroke(255,255,255);  //white
  rotate(120);
  //rotateX(frameCount * 0.003);
  //rotateY(frameCount * 0.002);
  //rotateZ(frameCount * 0.002);
  scale(2);
  model(SpaceMan);

  //-----------------------Star Objects-------------------------//
  rotateZ(frameCount / 100);
  for (const star of stars) {
    push();
    const pos = star[0];
    const z = cos(frameCount / 150) * 500;
    translate(pos.x, pos.y, z + pos.z);
    stroke(...starColorsHsb[star[1]]);
    sphere(1);
    pop();
  }

}

function startCameraAnimation() {
  curCameraFrame = 0;
  xAxisCameraLast = xAxis;
  yAxisCameraLast = yAxis;
  zAxisCameraLast = zAxis;
}
function POS1(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 500;
  yAxis = 0;
  xAxis = 0; 
}
function POS2(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 370;
  yAxis = 0;
  xAxis = 0; 
}
function POS3(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 180;
  yAxis = 0;
  xAxis = 0; 
}
function POS4(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 95;
  yAxis = 0;
  xAxis = 0; 
}
function POS5(){  
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 73;
  yAxis = 0;
  xAxis = 0; 
}
function FullTour(){  
  POS1();
  if(resetLock == true){
    tourTrigger = true;
    startCameraAnimation();
    zAxis = 73;
    yAxis = 0;
    xAxis = 0; 
  }
}

