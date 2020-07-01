let SpaceMan;

//Camera Varibles
let sliderGroup = [];
let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let h = 20;
const frameMax = 360;
var zAxis = 945;
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
var MouseMovementCounter = 0;
let MouseScrollPos = 25;
let zAxisCameraLast = 945;
let yAxisCameraLast = 0;
let xAxisCameraLast = 0;
let curCameraFrame = 0;
let maxCameraFrames = 60;

//Rotation Varibles
var RotateXVar = 0;
var RotatationXLast = 0;
var RotationXTraverse = 0;

var RotateYVar = 0;
var RotatationYLast = 0;
var RotationYTraverse = 0;

var RotateZVar = 0;
var RotatationZLast = 0;
var RotationZTraverse = 0;
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
  SpaceMan = loadModel('models/SpaceMan.obj');
}

function setup () {
  createCanvas(windowWidth, windowHeight, WEBGL);
  c1 = color(100, 0, 125);
  c2 = color(0, 125, 255);
  pg = createGraphics(256,256);
  //create sliders
  function r() {
    return random(-700, 700);
  }
  //-----------------------Star System Intialiser-----------------------//
  stars = Array.apply(null, Array(1000)).map(() => [
    createVector(r(), r(), r()),
    int(random(starColorsHsb.length))
  ]);

}


function mouseWheel(event) {
  //print(event.delta);
  print(MouseMovementCounter);
  //move the square according to the vertical scroll amount
  if(event.delta >= 0){
    //print("Mouse Scrolled +");
    MouseMovementCounter++;
    //print(MouseMovementCounter);
  }
  if(event.delta <= 0){
    //print("Mouse Scrolled -");
    MouseMovementCounter--;
    //print(MouseMovementCounter);
  }
  if(MouseMovementCounter < 0){MouseMovementCounter = 0;}
  if(MouseMovementCounter == 1){POS1(); print("POS1");}
  if(MouseMovementCounter == 2){POS2(); print("POS2");}
  if(MouseMovementCounter == 3){POS3(); print("POS3");}
  if(MouseMovementCounter == 4){POS4(); print("POS4");}
  if(MouseMovementCounter == 5){POS5(); MouseMovementCounter = 0; print("POS5");}

  MouseScrollPos += event.delta;
  //uncomment to block page scrolling
  //return false;
}


function draw () {
  //print(map(10,5,3,6,4));
  //-----------------------CameraTraverse-----------------------//
  if(tourTrigger == false){curCameraFrame = curCameraFrame + 2;}    
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
      RotationXTraverse = RotateXVar;
      RotationYTraverse = RotateYVar;
      RotationZTraverse = RotateZVar;
    }
    else {
      xAxisCamera = map(curCameraFrame, 0, maxCameraFrames, xAxisCameraLast, xAxis);
      yAxisCamera = map(curCameraFrame, 0, maxCameraFrames, yAxisCameraLast, yAxis);
      zAxisCamera = map(curCameraFrame, 0, maxCameraFrames, zAxisCameraLast, zAxis);
      RotationXTraverse = map(curCameraFrame, 0, maxCameraFrames,RotatationXLast, RotateXVar);
      RotationYTraverse = map(curCameraFrame, 0, maxCameraFrames,RotatationYLast, RotateYVar);
      RotationZTraverse = map(curCameraFrame, 0, maxCameraFrames,RotatationZLast, RotateZVar);
    }
  //-----------------------scene setup-----------------------//
  angleMode(DEGREES);
  background(0,0,0,0);
  camera(xAxisCamera, yAxisCamera, zAxisCamera, xAxisCamera, yAxisCamera, 0, 0.0, 1.0, 0.0);
  
  //-----------------------Scene Lighting-----------------------//
  var locX = height / 2;
  var locY = width;

  ambientMaterial(250);
  directionalLight(255, 0, 255, 0.25, 0.25, 0);
  directionalLight(0, 150, 250, 0, 0, -10);
  pointLight(0, 0, 255, locX, locY, 250);
  specularMaterial(50, 900, 100);
  //-----------------------Scene Objects-------------------------//
  noStroke();
  //strokeWeight(0.1);                
  //stroke(255,255,255);  //white
  push();
  rotateX(RotationXTraverse);
  rotateY(RotationYTraverse);
  rotateZ(RotationZTraverse);
  scale(10);
  model(SpaceMan);
  pop();
  //-----------------------Star Objects-------------------------//
  rotateZ(frameCount / 10);
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
  RotatationXLast = RotateXVar;
  RotatationYLast = RotateYVar;
  RotatationZLast = RotateZVar;
}
function POS1(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = -50;
  xAxis = 0; 
  RotateXVar = 50;
  RotateYVar = 30;
  RotateZVar = 10;
}
function POS2(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = -25;
  xAxis = 0; 
  RotateXVar = 50;
  RotateYVar = 5;
  RotateZVar = 80;
}
function POS3(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = 50;
  xAxis = 0; 
  RotateXVar = 60;
  RotateYVar = 60;
  RotateZVar = 89;
}
function POS4(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = 0;
  xAxis = 80; 
  RotateXVar = -10;
  RotateYVar = 50;
  RotateZVar = 8;
}
function POS5(){  
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 800;
  yAxis = 45;
  xAxis = 20; 
  RotateXVar = -10;
  RotateYVar = 50;
  RotateZVar = 57;
}

// linearly maps value from the range (a..b) to (c..d)
function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}
