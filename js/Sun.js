// import * as THREE from '../build/three.module.js';
// import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
// import { FilmPass } from '../jsm/postprocessing/FilmPass.js';
// import { BloomPass } from '../jsm/postprocessing/BloomPass.js';

var sphere;
var container;
var camera, scene, renderer, composer, clock;
var uniforms, mesh;

var vShader, fShader;
var loader = new THREE.FileLoader();

init();
animate();
function init() {
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 4;
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    var textureLoader = new THREE.TextureLoader();
    uniforms = {
        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
        "texture1": { value: textureLoader.load( './textures/lava/cloud.png' ) },
        "texture2": { value: textureLoader.load( './textures/lava/lavatile.jpg' ) }
    };
    uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
    var size = 0.85;

    loader.load('./Shaders/sun.frag',function ( data ) {fShader =  data;},);
    loader.load('./Shaders/sun.vert',function ( data ) {vShader =  data;},);

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        //vertexShader: document.getElementById( 'vertexShader' ).textContent,
        //fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        vertexShader: vShader,
        fragmentShader: fShader
    } );
    //mesh = new THREE.Mesh( new THREE.TorusBufferGeometry( size, 0.3, 30, 30 ), material );
    //mesh = new THREE.SphereBufferGeometry( 100, 32, 32, material );
    //mesh = new THREE.Mesh( mesh, material );
    
    //mesh.rotation.x = 0.3;
    //scene.add( mesh );
    

    mesh = new THREE.Mesh( new THREE.SphereBufferGeometry( size, 50, 25 ),material );
    //material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    //sphere = new THREE.Mesh( geometry, material );
    //scene.add( sphere );
    mesh.rotation.z = 0.3;
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    renderer.autoClear = false;
    //
    var renderModel = new RenderPass( scene, camera );
    var effectBloom = new BloomPass( 1.25 );
    var effectFilm = new FilmPass( 0.35, 0.95, 2048, false );
    composer = new EffectComposer( renderer );
    composer.addPass( renderModel );
    composer.addPass( effectBloom );
    composer.addPass( effectFilm );
    //
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    var delta = 5 * clock.getDelta();
    uniforms[ "time" ].value += 0.2 * delta;
    mesh.rotation.y += 0.0125 * delta;
    //mesh.rotation.x += 0.05 * delta;
    renderer.clear();
    composer.render( 0.01 );
}