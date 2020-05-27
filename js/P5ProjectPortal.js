//Object Components
let SpaceManBody;
let SpaceManVisor;
let SunTX;
let theta = 0;
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

//Visor Varibles
var VisorRotate = 0;
var VisorRotateLast = 0;
var VisorTraverse = 0;

//SceneManagement Componenets
var SceneManager = 1;
var SceneChanger = false;
let timer = 2;

function preload() {
	SpaceManBody = loadModel('models/SpaceManBody.obj');
	SpaceManVisor = loadModel('models/SpaceManVisor.obj');
}

function setup () {
	POS1();
	SunTX = loadImage("textures/SunTexture.jpeg");
	createCanvas(windowWidth, windowHeight, WEBGL);
	perspective(PI / 3.0, width / height, 0.1, 500);
	c1 = color(100, 0, 125);
	c2 = color(0, 125, 255);
	pg = createGraphics(256,256);
 
}

function draw () {
	//-----------------------SceneSetup-----------------------//
	angleMode(DEGREES);
	background(0,0,0,0);
	camera(xAxisCamera, yAxisCamera, zAxisCamera, xAxisCamera, yAxisCamera, 0, 0.0, 1.0, 0.0);
	
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
	    VisorTraverse = VisorRotate;
	  }
	  else {
	    xAxisCamera = map(curCameraFrame, 0, maxCameraFrames, xAxisCameraLast, xAxis);
	    yAxisCamera = map(curCameraFrame, 0, maxCameraFrames, yAxisCameraLast, yAxis);
	    zAxisCamera = map(curCameraFrame, 0, maxCameraFrames, zAxisCameraLast, zAxis);
	    VisorTraverse = map(curCameraFrame, 0, maxCameraFrames,VisorRotateLast, VisorRotate);
	  }
	//-----------------------SceneManager-----------------------//
	//print("zAxis:" + zAxis);
	//print("zAxisCamera:" + zAxisCamera);
	//print("zAxisCameraLast:" + zAxisCameraLast);
	//print("curCameraFrame:" + curCameraFrame);
	//print(timer);
	//print(SceneManager);

 	//Scene 1 Default
	if(SceneManager == 1){Scene1();}
	//Scene 2 Timer Transistion
	if(SceneChanger == true){	 
	  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
	    timer --;
	  }
	  if (timer == 0) {
	    SceneManager = 2;
	  }
	}
	//Scene 2 ProjectDisplay
	if(SceneManager == 2){Scene2();}
}

function Scene1(){
	//-----------------------Scene Lighting-----------------------//
	var locX = height / 2;
	var locY = width;
	//Turn Lights and Materials off when shader is running
	//ambientMaterial(250);
	directionalLight(255, 0, 255, 0.25, 0.25, 0);
	directionalLight(0, 150, 250, 0, 0, -10);
	//pointLight(0, 0, 255, locX, locY, 250);
	//specularMaterial(50, 900, 100);
	//-----------------------Models-----------------------//
	noStroke();               
	rotate(180);
	scale(20);
	push();
	translate(0, -17, 40);
	model(SpaceManBody);
	pop();
	push();
	translate(0,-0.1,40);
	rotateX(VisorTraverse);
	model(SpaceManVisor);
	pop();
}
function Scene2(){
	//-----------------------Scene Lighting-----------------------//
	var locX = height / 2;
	var locY = width;
	//Turn Lights and Materials off when shader is running
	//ambientMaterial(250);
	directionalLight(255, 0, 255, 0.25, 0.25, 0);
	directionalLight(0, 150, 250, 0, 0, -10);
	//pointLight(0, 0, 255, locX, locY, 250);
	//specularMaterial(50, 900, 100);
	//-----------------------Models-----------------------//
	push();
	translate(0, 0, 700);
	texture(SunTX);
	rotateY(theta * 0.1);
	sphere(45);
	pop();
	theta += 0.5;
}
function mouseWheel(event) {
  //print(event.delta);
  //print(MouseMovementCounter);
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
  if(SceneManager == 1){
	  if(MouseMovementCounter == 1){POS1(); print("POS1");}
	  if(MouseMovementCounter == 2){POS2(); print("POS2");}
	  if(MouseMovementCounter == 3){POS3(); print("POS3");}
	  if(MouseMovementCounter == 4){POS4(); print("POS4");}
	  if(MouseMovementCounter == 5){POS5(); MouseMovementCounter = 0; print("POS5");}
  }

  MouseScrollPos += event.delta;
  //uncomment to block page scrolling
  //return false;
}
function startCameraAnimation() {
  curCameraFrame = 0;
  xAxisCameraLast = xAxis;
  yAxisCameraLast = yAxis;
  zAxisCameraLast = zAxis;
  VisorRotateLast = VisorRotate;
}
function POS1(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = -50;
  xAxis = 0; 
  VisorRotate = 50;
}
function POS2(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = -25;
  xAxis = 0; 
  VisorRotate = 50;
}
function POS3(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = 0;
  xAxis = 0; 
  VisorRotate = 50;
}
function POS4(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 945;
  yAxis = 0;
  xAxis = 0; 
  VisorRotate = -10;
}
function POS5(){  
  SceneChanger = false;
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 800;
  yAxis = 0;
  xAxis = 0; 
  VisorRotate = -10;
  SceneChanger = true;
}
