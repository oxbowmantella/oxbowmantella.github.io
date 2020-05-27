var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer ;
let obj;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//RayCast Components
var raycaster;
var mouse;
var objects = [];

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
var zAxis = 200;
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

//Position Picker
var PosPicker = 1;

init();
animate();


function init() {
  POS1();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

  //-------------------------------scene-------------------------------//

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xcccccc, 100, 1500 );

  var ambient = new THREE.AmbientLight( 0x101030 );
  scene.add( ambient );

  var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
  directionalLight1.position.set( 4, 0, 0 );
  scene.add( directionalLight1 );

  var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );
  directionalLight2.position.set( -4, 0, 0 );
  scene.add( directionalLight2 );

  /*var directionalLight3 = new THREE.DirectionalLight( 0xffffff );
  directionalLight3.position.set( 0, -1, 1 );
  scene.add( directionalLight3 );*/

  var material = new THREE.MeshStandardMaterial({metalness: 0.1, roughness: 0.5});

  //-------------------------------model 1-------------------------------//
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 1" );

  };

  var loader = new THREE.OBJLoader( manager );
  loader.load( 'Models/AstronautFloating.obj', function ( object ) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {

        child.material = material;

      }
    } );

    //object.position.y = -100;
    //object.position.x = - 200;
    //object.rotation.y = -67.5;
    //object.rotation.z = 20* Math.PI / 180;
    object.scale.x = 5;
    object.scale.y = 5;
    object.scale.z = 5;
    obj = object
    objects.push(obj);  //Push required for RayCasting Detect
    scene.add( obj );

  } );

  //-------------------------------Renderer-------------------------------//
  renderer = new THREE.WebGLRenderer({ antialias: true });
  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

  window.addEventListener( 'resize', onWindowResize, false );
  
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

function onDocumentMouseWheel( event ) {
  if(event.deltaY >= 0){
    MouseMovementCounter++;
  } if(event.deltaY <= 0){
    MouseMovementCounter--;
  }

  if(MouseMovementCounter < 0){MouseMovementCounter = 0;}
  if(MouseMovementCounter >= 60){MouseMovementCounter = 0; console.log("add to counter"); PosPicker++;}

  if(PosPicker == 1){
     if(MouseMovementCounter == 1){/*POS1(); console.log("1");*/}
  }else if(PosPicker == 2){
     if(MouseMovementCounter == 2){/*POS2(); console.log("POS2");*/}
  }
     if(MouseMovementCounter == 3){/*POS3(); console.log("POS3");*/}
     if(MouseMovementCounter == 4){/*POS4(); console.log("POS4");*/}
     if(MouseMovementCounter == 5){POS5(); console.log("POS5");}
  
  
  /*if(PosPicker == 1){POS1(); }
  if(PosPicker == 2){POS2(); }
  if(PosPicker == 3){POS3(); }
  if(PosPicker == 4){POS4(); }
  if(PosPicker == 5){POS5(); }*/
  
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function onMouseMove( event ) {
//-------------------------------RayCast Component-------------------------------//
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
// maps value from the range (a..b) to (c..d)
function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}

function render() {
  //console.log("rendering");
  //-----------------------CameraTraverse-----------------------//
  
    //if(tourTrigger == false){curCameraFrame = curCameraFrame + 1;}    
    console.log("CF:"+curCameraFrame + "| MMC:"+MouseMovementCounter + "| PP:" + PosPicker);

    curCameraFrame = MouseMovementCounter;
    //console.log("PosPicker:"+PosPicker);

    curCameraFrame = curCameraFrame + 1;
    
    if(curCameraFrame > maxCameraFrames) {
      xAxisCamera = xAxis;
      yAxisCamera = yAxis;
      zAxisCamera = zAxis;
      RotationXTraverse = RotateXVar;
      RotationYTraverse = RotateYVar;
      RotationZTraverse = RotateZVar;
    }
    else {
      xAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, xAxisCameraLast, xAxis);
      yAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, yAxisCameraLast, yAxis);
      zAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, zAxisCameraLast, zAxis);
      RotationXTraverse = mapRange(curCameraFrame, 0, maxCameraFrames,RotatationXLast, RotateXVar);
      RotationYTraverse = mapRange(curCameraFrame, 0, maxCameraFrames,RotatationYLast, RotateYVar);
      RotationZTraverse = mapRange(curCameraFrame, 0, maxCameraFrames,RotatationZLast, RotateZVar);
  }
  //console.log(curCameraFrame + ":xAxis");
  camera.position.z = zAxisCamera;
  camera.position.y = yAxisCamera;
  camera.position.x = xAxisCamera;

  obj.rotation.x = RotationXTraverse;
  obj.rotation.y = RotationYTraverse;
  obj.rotation.z = RotationZTraverse;
  
  //-------------------------------RayCasting-------------------------------//
  // update the picking ray with the camera and mouse position
  //raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  //var intersects = raycaster.intersectObjects( objects, true );

  //console.log(intersects.length);
  // for ( var i = 0; i < intersects.length; i++ ) {
  //   //console.log(intersects[i]);
  //   intersects[ i ].object.material.color.set( 0xff0000 );
  // }
  //-------------------------------Renderer-------------------------------//
  //Camera Movement
  camera.position.x += ( mouseX - camera.position.x ) * .005;
  camera.position.y += ( - mouseY - camera.position.y ) * .005;

  camera.lookAt( scene.position );
  //console.log(scene.position);
  //camera.lookAt(0, 55,0);

  renderer.render( scene, camera );
}

//Camera Move Positions
function startCameraAnimation() {
  //console.log("animation start");
  curCameraFrame = MouseMovementCounter;
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
  zAxis = 100;
  yAxis = 150;
  xAxis = 0; 
  RotateXVar = 0.2;
  RotateYVar = 0;
  RotateZVar = 0.3;
}
function POS2(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 100;
  yAxis = 80;
  xAxis = 0; 
  RotateXVar = 0.84;
  RotateYVar = 0;
  RotateZVar = 0.7;
}
function POS3(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 100;
  yAxis = 80;
  xAxis = 0; 
  RotateXVar = 0.4;
  RotateYVar = 0.78;
  RotateZVar = 0.35;
}
function POS4(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 90;
  yAxis = 80;
  xAxis = 0; 
  RotateXVar = 0.7;
  RotateYVar = 0;
  RotateZVar = 0.6;
}
function POS5(){  
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 70;
  xAxis = 0; 
  RotateXVar = 0.489;
  RotateYVar = 0.98;
  RotateZVar = 0.15;
}

function PositionCheck(Tx,Ty, Tz,Rx, Ry, Rz ){

}

//Checks for RayCasting
window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(render);