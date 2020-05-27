var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer, composer, object;

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

var VisorRotate = 0;
var VisorRotateLast = 0;
var VisorTraverse = 0;

//SceneManagement Componenets
var SceneManager = 1;
var SceneChanger = false;
let timer = 2;

var hoomer;

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
  directionalLight3.position.set( 0, -2, 2 );
  scene.add( directionalLight3 );*/

  var material = new THREE.MeshStandardMaterial({metalness: 0.1, roughness: 0.5});

  //-------------------------------model 1-------------------------------//
  var SpirteTexture = new THREE.TextureLoader().load("textures/test3.png");
  hoomer = new TextureAnimator (SpirteTexture, 5, 5, 25, 55);
  var hoomerMaterial = new THREE.MeshStandardMaterial({map: SpirteTexture, metalness: 0.1, roughness: 0.5});

  object = new THREE.SphereGeometry( 10, 32, 32 );
  cube = new THREE.Mesh(object, hoomerMaterial);
  scene.add( cube );
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

function update()
{
  var delta = clock.getDelta(); 

  hoomer.update(1000 * delta);
  
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
  if(SceneManager == 1){
    if(MouseMovementCounter < 0){MouseMovementCounter = 0;}
    if(MouseMovementCounter == 1){POS1(); }
    if(MouseMovementCounter == 2){POS2(); }
    if(MouseMovementCounter == 3){POS3(); }
    if(MouseMovementCounter == 4){POS4(); }
    if(MouseMovementCounter == 5){POS5(); }
  }
  console.log(MouseMovementCounter);
}

function animate() {
  requestAnimationFrame( animate );
  render();
  update();
}

function onMouseMove( event ) {
//-------------------------------RayCastComponent-------------------------------//
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
      xAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, xAxisCameraLast, xAxis);
      yAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, yAxisCameraLast, yAxis);
      zAxisCamera = mapRange(curCameraFrame, 0, maxCameraFrames, zAxisCameraLast, zAxis);
      VisorTraverse = mapRange(curCameraFrame, 0, maxCameraFrames,VisorRotateLast, VisorRotate);
  }
  //console.log(camera);
  camera.position.z = zAxisCamera;
  camera.position.y = yAxisCamera;
  camera.position.x = xAxisCamera;


  //-------------------------------RayCasting-------------------------------//
  if(SceneManager == 2){ //only run raycasting if Scene 2 is active
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( objects, true );

    //console.log(intersects.length);
    for ( var i = 0; i < intersects.length; i++ ) {
      //console.log(intersects[i]);
      intersects[ i ].object.material.color.set( 0xff0000 );

    }
  }
  //-------------------------------Renderer-------------------------------//
  //Camera Movement
  //camera.position.x += ( mouseX - camera.position.x ) * .05;
  //camera.position.y += ( - mouseY - camera.position.y ) * .05;

  //camera.lookAt( scene.position );
  //console.log(scene.position);
  camera.lookAt(0, 0,0);

  renderer.render( scene, camera );
  //composer.render();
}

//Camera Move Positions
function startCameraAnimation() {
  //console.log("animation start");
  curCameraFrame = 0;
  xAxisCameraLast = xAxis;
  yAxisCameraLast = yAxis;
  zAxisCameraLast = zAxis;
  VisorRotateLast = VisorRotate;
}
function POS1(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 50;
  xAxis = 0; 
  VisorRotate = 0.872665; //use radians for rotation value
}
function POS2(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 50;
  xAxis = 0; 
  VisorRotate = 0.872665;
}
function POS3(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 50;
  xAxis = 0; 
  VisorRotate = 0.872665;
}
function POS4(){ 
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 50;
  xAxis = 0; 
  VisorRotate = -0.174533;
}
function POS5(){  
  SceneChanger = false;
  tourTrigger = false;
  startCameraAnimation();
  zAxis = 20;
  yAxis = 50;
  xAxis = 0; 
  VisorRotate = -0.174533;
  SceneChanger = true;
}
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) { 
  // note: texture passed by reference, will be updated by the update function.
    
  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;
    
  this.update = function( milliSec )
  {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration)
    {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
} 
//Checks for RayCasting
window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(render);