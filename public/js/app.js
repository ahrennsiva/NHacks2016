var handTracking = 0;
var handNegative = 0;
var dataEle = document.getElementById("data");
var statusEle = document.getElementById("status");

var changeLanguage = false;
var showPinchStrength = true;
var showGrabStrength = true;


var paused = false;

window.addEventListener("blur", function(e){
    paused = true;
    statusEle.innerHTML = "";
});

window.addEventListener("focus", function(e){
    paused = false;

    statusEle.innerHTML = "";
});

var controllerOptions = {enableGestures:true};
Leap.loop(controllerOptions, function(frame){
      if(!paused){
        translationSetup(frame);         
    }

}).on("handFound", function(frame){
    handTracking++;
    console.log(handTracking);
    paused = false;
    statusEle.innerHTML = ""; 

}).on("handLost", function(frame){
    handNegative++;
    console.log(handNegative);
    paused = true;

    displayToTranslationBox("No hands shown!");

    statusEle.innerHTML = "";

}).use('riggedHand', {
    helper: false,
    dotsMode: false,
    opacity:1,
    offset: new THREE.Vector3(0,0,0),
    scale: 0.5,
    positionScale: 0.4,

    boneLabels: function(boneMesh, leapHand) {
        if(!showGrabStrength){
            if (boneMesh.name.indexOf('Finger_') === 0) {
                return leapHand.grabStrength;
            }
        }
    },
    boneColors: function(boneMesh, leapHand) {
      if ((boneMesh.name.indexOf('Finger_') === 0)) {
        return {
            hue: 0.66,
            saturation: leapHand.grabStrength,
            lightness: 0.3
        };
      }
    },
    checkWebGL: true
}).use('playback', {
    recording: 'js/demo.json.lz',
    requiredProtocolVersion: 6,
    pauseOnHand: true
});


var scene    = Leap.loopController.plugins.riggedHand.scene;
var camera   = Leap.loopController.plugins.riggedHand.camera;
var renderer = Leap.loopController.plugins.riggedHand.renderer;

var plane = newPlane();

function newPlane(){
    return new THREE.Mesh(
        new THREE.PlaneGeometry(80,80),
            new THREE.MeshPhongMaterial({wireframe: false})
    );
}


plane.scale.set(2,2,2);
plane.position.set(0,200,-100);

camera.lookAt( plane.position );

var axisHelper = new THREE.AxisHelper( 100 );
scene.add( axisHelper );


var controls = new THREE.OrbitControls( camera, renderer.domElement );

function toggleNumbers(){
    if(changeLanguage)
        document.getElementById("changeLanguage").innerHTML = "Enable French";

    else
        document.getElementById("changeLanguage").innerHTML = "Disable French";   
    
    changeLanguage = !changeLanguage

;
}
