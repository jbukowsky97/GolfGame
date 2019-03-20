var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

player = new Player();
// player.neutralPosture();
player.golfPosture();
player.swinging = true;

scene.add( player.group );

camera.position.z = 5;

var animate = function () {
  requestAnimationFrame( animate );

  player.group.rotation.y -= 0.01;
  // player.group.rotation.y = 4.5;
  player.animate();

  renderer.render( scene, camera );
};

animate();