/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _class, _temp, _initialiseProps;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global THREE */
	// var OrbitControls = require('three-orbit-controls')(THREE);
	
	function domFromString(htmlString) {
	    var parent = document.createElement('div');
	    parent.innerHTML = htmlString;
	    return parent.firstElementChild;
	}
	
	var isWebGLSupported = function () {
	    try {
	        var canvas = document.createElement('canvas');
	        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
	    } catch (e) {
	        return false;
	    }
	}();
	
	window.Player = module.exports = (_temp = _class = function () {
	    function Player() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        var containerId = _ref.containerId;
	        var view = _ref.view;
	        var _ref$enableSensorCont = _ref.enableSensorControl;
	        var enableSensorControl = _ref$enableSensorCont === undefined ? false : _ref$enableSensorCont;
	
	        _classCallCheck(this, Player);
	
	        _initialiseProps.call(this);
	
	        var container = document.getElementById(containerId);
	        if (!container) {
	            throw new Error('container is not found: ' + containerId);
	        }
	
	        this.container = container;
	
	        var w = container.offsetWidth;
	        var h = container.offsetHeight;
	        var camera = new THREE.PerspectiveCamera(view || 75, w / h, 1, 1000);
	        camera.position.x = 0.01;
	        camera.position.y = 0;
	        camera.position.z = 0.01;
	        this.camera = camera;
	
	        // const controls = new OrbitControls(camera);
	        // controls.enablePan = true;
	        // controls.enableZoom = true;
	        // controls.zoomSpeed = 10;
	        // controls.minDistance = -50;
	        // controls.maxDistance = 50;
	        // controls.autoRotate = false;
	        // this.orbitControls = controls;
	        // controls.autoRotateSpeed = speed || 0.5;
	        // controls.addEventListener('change', this.render);
	
	        this.scene = new THREE.Scene();
	
	        var video = domFromString('\n            <video style="display: none;" autoplay preload="auto" id="video" loop="true" webkit-playsinline crossOrigin="anonymous">\n                <source type="video/mp4">\n            </video>');
	        this.video = video;
	        document.body.appendChild(video);
	
	        var texture = new THREE.VideoTexture(video);
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;
	        texture.format = THREE.RGBFormat;
	
	        // var texture = THREE.ImageUtils.loadTexture(image);
	        // texture.minFilter = THREE.LinearFilter;
	
	        var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), new THREE.MeshBasicMaterial({
	            map: texture
	        }));
	
	        sphere.scale.x = -1;
	        sphere.rotateY(Math.PI * 1.5);
	        this.scene.add(sphere);
	
	        var renderer = isWebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
	        renderer.setSize(container.offsetWidth, container.offsetHeight);
	        this.renderer = renderer;
	
	        this.sensorControls = new DeviceOrientationController(camera, renderer.domElement);
	        this.sensorControls.connect();
	        this.enableSensor();
	
	        container.appendChild(renderer.domElement);
	
	        this.animate();
	
	        window.addEventListener('resize', this.onResize);
	    }
	
	    _createClass(Player, [{
	        key: 'loadVideo',
	        value: function loadVideo() {
	            var videoUrl = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	            this.video.firstElementChild.setAttribute('src', videoUrl);
	        }
	    }]);
	
	    return Player;
	}(), _initialiseProps = function _initialiseProps() {
	    var _this = this;
	
	    this.render = function () {
	        _this.sensorControls.update();
	        _this.renderer.render(_this.scene, _this.camera);
	    };
	
	    this.animate = function () {
	        _this.render();
	        requestAnimationFrame(_this.animate);
	    };
	
	    this.onResize = function () {
	        var container = _this.container;
	        _this.camera.aspect = container.offsetWidth / container.offsetHeight;
	        _this.camera.updateProjectionMatrix();
	
	        _this.renderer.setSize(container.offsetWidth, container.offsetHeight);
	    };
	
	    this.enableSensor = function () {
	        _this.sensorControls.enableManualDrag = false;
	    };
	
	    this.disableSensor = function () {
	        _this.sensorControls.enableManualDrag = true;
	    };
	}, _temp);

/***/ }
/******/ ]);
//# sourceMappingURL=player.js.map