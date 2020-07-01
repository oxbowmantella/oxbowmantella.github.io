var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//RayCast Components
var raycaster;
var mouse;
var objects = [];

init();
animate();


function init() {

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 600;

  //-------------------------------scene-------------------------------//

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x101030 );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 );
  scene.add( directionalLight );

  //-------------------------------model 1-------------------------------//
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 1" );

  };

  var loader = new THREE.OBJLoader( manager );
  loader.load( 'Models/LogoBevel.obj', function ( object ) {

    object.traverse( function ( child ) {

    } );

    object.position.y = - 100;
    object.position.x = - 200;
    //object.rotation.x = 20* Math.PI / 180;
    //object.rotation.z = 20* Math.PI / 180;
    object.scale.x = 10;
    object.scale.y = 10;
    object.scale.z = 10;
    obj = object
    objects.push(obj);  //Push required for RayCasting Detect
    scene.add( obj );

  } );

  //-------------------------------model 2-------------------------------//
  var manager2 = new THREE.LoadingManager();
  manager2.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 2" );

  };

  var loader2 = new THREE.OBJLoader( manager2 );
  loader2.load( 'Models/Logo.obj', function ( object2 ) {

    object2.traverse( function ( child ) {

    } );

    object2.position.y = 0;
    object2.position.x = - 200;
    //object.rotation.x = 20* Math.PI / 180;
    //object.rotation.z = 20* Math.PI / 180;
    object2.scale.x = 10;
    object2.scale.y = 10;
    object2.scale.z = 10;
    obj2 = object2;
    objects.push(obj2); //Push required for RayCasting Detect
    scene.add( obj2 );

  } );

  //-------------------------------model 3-------------------------------//
  var manager3 = new THREE.LoadingManager();
  manager3.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 2" );

  };

  var loader3 = new THREE.OBJLoader( manager3 );
  loader3.load( 'Models/SpaceMan.obj', function ( object3 ) {

    object3.traverse( function ( child ) {

    } );

    object3.position.y = -200;
    object3.position.x = 0;
    //object.rotation.x = 20* Math.PI / 180;
    //object.rotation.z = 20* Math.PI / 180;
    object3.scale.x = 5;
    object3.scale.y = -5;
    object3.scale.z = 5;
    obj3 = object3;
    objects.push(obj3); //Push required for RayCasting Detect
    scene.add( obj3 );

  } );

  //-------------------------------model 4-------------------------------//
  var manager4 = new THREE.LoadingManager();
  manager4.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 2" );

  };

  var loader4 = new THREE.OBJLoader( manager4 );
  loader4.load( 'Models/SpaceManBody.obj', function ( object4 ) {

    object4.traverse( function ( child ) {

    } );

    object4.position.y = -100;
    object4.position.x = 150;
    //object.rotation.x = 20* Math.PI / 180;
    //object.rotation.z = 20* Math.PI / 180;
    object4.scale.x = 10;
    object4.scale.y = 10;
    object4.scale.z = 10;
    obj4 = object4;
    objects.push(obj4); //Push required for RayCasting Detect
    scene.add( obj4 );

  } );

  //-------------------------------model 5-------------------------------//
  var manager5 = new THREE.LoadingManager();
  manager5.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total);
    //console.log( "Model 2" );

  };

  var loader5 = new THREE.OBJLoader( manager5 );
  loader5.load( 'Models/PrismBall.obj', function ( object5 ) {

    object5.traverse( function ( child ) {

    } );

    object5.position.y = 0;
    object5.position.x = 250;
    //object.rotation.x = 20* Math.PI / 180;
    //object.rotation.z = 20* Math.PI / 180;
    object5.scale.x = 5;
    object5.scale.y = 5;
    object5.scale.z = 5;
    obj5 = object5;
    objects.push(obj5); //Push required for RayCasting Detect
    scene.add( obj5 );

  } );
  //-------------------------------Renderer-------------------------------//
  renderer = new THREE.WebGLRenderer();
  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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
function render() {
  //obj.rotation.x += (0.2*(Math.PI / 180));
  //obj.rotation.x %=360;

  //-------------------------------RayCasting-------------------------------//
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( objects, true );

  //console.log(intersects.length);
  for ( var i = 0; i < intersects.length; i++ ) {
    console.log(intersects[i]);
    intersects[ i ].object.material.color.set( 0xff0000 );

  }
  //-------------------------------Renderer-------------------------------//
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );
}

//Checks for RayCasting
window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(render);