var camera, scene, renderer, composer;
var effectSobel;
var params = {
	enable: true
};
init();
animate();
function init() {
	//
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.z = 600;
	//camera.position.set( 0, 10, 25 );
	camera.lookAt( scene.position );
	//
	// var geometry = new THREE.TorusKnotBufferGeometry( 8, 3, 256, 32, 2, 3 );
	// var material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
	// var mesh = new THREE.Mesh( geometry, material );
	// scene.add( mesh );
	//
	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );
	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );
	scene.add( camera );
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass( renderPass );
	// color to grayscale conversion
	var effectGrayScale = new THREE.ShaderPass( THREE.LuminosityShader );
	composer.addPass( effectGrayScale );
	// you might want to use a gaussian blur filter before
	// the next pass to improve the result of the Sobel operator
	// Sobel operator
	effectSobel = new THREE.ShaderPass( THREE.SobelOperatorShader );
	effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
	effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
	composer.addPass( effectSobel );
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
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
	    scene.add( object );

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
	    scene.add( object2 );

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
	    scene.add( object3 );

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
	    scene.add( object4 );

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
	    scene.add( object5 );

	  } );

	
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );
	effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
	effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
}
function animate() {
	requestAnimationFrame( animate );
	if ( params.enable === true ) {
		composer.render();
	} else {
		renderer.render( scene, camera );
	}
}