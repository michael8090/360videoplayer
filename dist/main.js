(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("setupPlayer", [], factory);
	else if(typeof exports === 'object')
		exports["setupPlayer"] = factory();
	else
		root["setupPlayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Mesh2 = __webpack_require__(/*! ./Mesh */ 1);
	
	var _Mesh3 = _interopRequireDefault(_Mesh2);
	
	var _math = __webpack_require__(/*! ./math */ 2);
	
	var _math2 = _interopRequireDefault(_math);
	
	var _player = __webpack_require__(/*! ./player */ 3);
	
	var _player2 = _interopRequireDefault(_player);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by yong on 8/27/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var textureLoader = new THREE.TextureLoader();
	
	var AROUND_GAP = 12;
	
	function getGuideStartVec(u, v) {
	    var p = _math2.default.uv2xyz(u, v);
	    return new THREE.Vector3(p.x, p.y, p.z).normalize().multiplyScalar(AROUND_GAP).setY(p.y);
	}
	
	var Arrow = function (_Mesh) {
	    _inherits(Arrow, _Mesh);
	
	    function Arrow() {
	        _classCallCheck(this, Arrow);
	
	        var currentMaterialIndex = 0;
	
	        var _this = _possibleConstructorReturn(this, (Arrow.__proto__ || Object.getPrototypeOf(Arrow)).call(this, new THREE.PlaneGeometry(1.4, 2), new THREE.MeshPhongMaterial({
	            map: Arrow.materials[currentMaterialIndex],
	            transparent: true,
	            side: THREE.DoubleSide
	        })
	        // new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ),
	        ));
	
	        _this.currentMaterialIndex = currentMaterialIndex;
	        _this.rotateX(Math.PI * 0.2);
	        return _this;
	    }
	
	    _createClass(Arrow, [{
	        key: 'update',
	        value: function update() {
	            if (this.lastDrawTime && Date.now() - this.lastDrawTime < 300) {
	                return;
	            }
	            this.lastDrawTime = Date.now();
	            this.currentMaterialIndex = (this.currentMaterialIndex + 1) % Arrow.materials.length;
	            this.material.map = Arrow.materials[this.currentMaterialIndex];
	            this.material.needUpdate = true;
	        }
	    }, {
	        key: 'onClick',
	        value: function onClick() {
	            alert('arrow clicked');
	        }
	    }]);
	
	    return Arrow;
	}(_Mesh3.default);
	
	Arrow.materials = [1, 2, 3].map(function (i) {
	    return textureLoader.load('images/arr' + i + '.png');
	});
	
	
	function onArrowPathClick() {
	    alert('arrow path is clicked');
	}
	var unitLength = 2;
	var unitMaterial = textureLoader.load('./images/path-arr.png');
	var unitMaterialLight = textureLoader.load('./images/path-arr-light.png');
	function createArrowPath(u, v) {
	    var sp = getGuideStartVec(u, v);
	    var ep = _math2.default.uv2xyz(u, v);
	    var spv = new THREE.Vector3(sp.x, sp.y, sp.z);
	    var epvu = new THREE.Vector3(ep.x, ep.y, ep.z);
	    var epv = epvu.multiplyScalar(spv.y / epvu.y);
	    var pathVec = epv.clone().sub(spv);
	    var unitCount = Math.ceil(pathVec.length() / unitLength);
	    var group = new THREE.Object3D();
	    var i = void 0;
	    for (i = 0; i < unitCount; i++) {
	        var _u = new THREE.Mesh(new THREE.PlaneGeometry(unitLength * 2, unitLength), new THREE.MeshPhongMaterial({
	            map: unitMaterial,
	            transparent: true,
	            side: THREE.DoubleSide
	        }));
	        var up = pathVec.clone().multiplyScalar(i / unitCount).add(sp);
	        _u.position.set(up.x, up.y, up.z);
	        _u.up.set(pathVec.x, pathVec.y, pathVec.z);
	        _u.onClick = onArrowPathClick;
	        group.add(_u);
	    }
	    group.currentHighLight = 0;
	    group.currentPercentage = 0;
	
	    group.setPercentage = function (p) {
	        group.currentPercentage = p;
	    };
	
	    group.update = function () {
	        if (this.lastDrawTime && Date.now() - this.lastDrawTime < 300) {
	            return;
	        }
	        var children = this.children;
	
	        var i = Math.floor(this.currentPercentage * children.length);
	        if (i === this.currentHighLight) {
	            return;
	        }
	        var last = children[this.currentHighLight];
	        last.material.map = unitMaterial;
	        last.material.needUpdate = true;
	
	        this.currentHighLight = i;
	        var current = children[i];
	        current.material.map = unitMaterialLight;
	        current.material.needUpdate = true;
	
	        this.lastDrawTime = Date.now();
	    };
	
	    // this one never gets called
	    group.onClick = onArrowPathClick;
	
	    return group;
	}
	
	var arrow = new Arrow();
	
	function showArrow(scene, u, v) {
	    var p = getGuideStartVec(u, v);
	    arrow.position.set(p.x, p.y, p.z);
	    arrow.up.set(p.x, 0, p.z);
	    if (!arrow.parent) {
	        scene.add(arrow);
	    }
	}
	
	function hideArrow(scene) {
	    if (arrow.parent) {
	        scene.remove(arrow);
	    }
	}
	
	var arrowPathName = 'arrow-path';
	function showPath(scene, u, v) {
	    var path = createArrowPath(u, v);
	    path.name = arrowPathName;
	
	    scene.add(path);
	}
	
	function setPathPercentage(scene, percentage) {
	    var path = scene.getObjectByName(arrowPathName);
	    if (path) {
	        path.setPercentage(percentage);
	    }
	}
	
	function hidePath(scene) {
	    var path = scene.getObjectByName(arrowPathName);
	    if (path) {
	        scene.remove(path);
	    }
	}
	
	module.exports = function setupPlayer(playerConfig) {
	    var player = new _player2.default(playerConfig);
	    var scene = player.scene;
	
	    showArrow(scene, 0.5, 0.75);
	    showPath(scene, 0.5, 0.75);
	
	    var p = 0;
	    document.body.addEventListener('mousemove', function () {
	        p += 0.1;
	
	        if (p > 1) {
	            p = 0;
	        }
	
	        setPathPercentage(scene, p);
	    });
	    return player;
	};

/***/ },
/* 1 */
/*!*********************!*\
  !*** ./src/Mesh.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Created by yong on 8/27/16.
	 */
	var Mesh = function (_THREE$Mesh) {
	    _inherits(Mesh, _THREE$Mesh);
	
	    function Mesh() {
	        _classCallCheck(this, Mesh);
	
	        return _possibleConstructorReturn(this, (Mesh.__proto__ || Object.getPrototypeOf(Mesh)).apply(this, arguments));
	    }
	
	    _createClass(Mesh, [{
	        key: "update",
	        value: function update() {
	            throw new Error(this.constructor.name + " should have an \"update\" method");
	        }
	    }]);
	
	    return Mesh;
	}(THREE.Mesh);
	
	exports.default = Mesh;

/***/ },
/* 2 */
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by yong on 8/26/16.
	 */
	exports.default = {
	    uv2xyz: function uv2xyz(u, v) {
	        var theta = Math.PI * u * 2.0;
	        var phi = v * Math.PI;
	        var x = -Math.cos(theta) * Math.sin(phi);
	        var z = -Math.sin(theta) * Math.sin(phi);
	        var y = Math.cos(phi);
	        // we just need to rotate x to 4pi/3
	        return { x: -z, y: y, z: x };
	    }
	};

/***/ },
/* 3 */
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global THREE */
	// var OrbitControls = require('three-orbit-controls')(THREE);
	var StereoEffect = __webpack_require__(/*! three-stereo-effect */ 4)(THREE);
	var fullscreen = __webpack_require__(/*! screenfull */ 5);
	
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
	
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	
	/**
	 * The core player of the project, it has the following main tasks:
	 *     1. load a video and apply the stream video output as a texture to a sphere
	 *     2. provide the main controls of as a player(play, pause, setTime, etc.)
	 *     3. has vr and stereo mode, with device sensor control enabled
	 *     4. call the `update` method (if any) of the items inside the scene on every loop
	 *     5. call onClick if hit test is passed
	 */
	
	var Player = function () {
	    function Player() {
	        var _this = this;
	
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        var containerId = _ref.containerId;
	        var _ref$enableSensorCont = _ref.enableSensorControl;
	        var enableSensorControl = _ref$enableSensorCont === undefined ? false : _ref$enableSensorCont;
	        var _ref$isOnStereoMode = _ref.isOnStereoMode;
	        var isOnStereoMode = _ref$isOnStereoMode === undefined ? false : _ref$isOnStereoMode;
	
	        _classCallCheck(this, Player);
	
	        _initialiseProps.call(this);
	
	        this.isOnStereoMode = isOnStereoMode;
	        var container = document.getElementById(containerId);
	        if (!container) {
	            throw new Error('container is not found: ' + containerId);
	        }
	
	        this.container = container;
	
	        var w = container.offsetWidth;
	        var h = container.offsetHeight;
	        var camera = new THREE.PerspectiveCamera(75, w / h, 0.01, 1000);
	        camera.position.x = 0;
	        camera.position.y = 0;
	        camera.position.z = 0;
	        camera.lookAt(new THREE.Vector3(0, 0, 1));
	
	        this.camera = camera;
	
	        this.scene = new THREE.Scene();
	
	        this.createSphere();
	
	        var renderer = isWebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
	        renderer.setSize(container.offsetWidth, container.offsetHeight);
	        this.renderer = renderer;
	
	        var stereoEffect = new StereoEffect(renderer);
	        stereoEffect.eyeSeparation = 1;
	        stereoEffect.setSize(w, h);
	        this.stereoEffect = stereoEffect;
	
	        this.sensorControls = new DeviceOrientationController(camera, renderer.domElement);
	        this.sensorControls.connect();
	
	        if (enableSensorControl) {
	            this.enableSensor();
	        } else {
	            this.disableSensor();
	        }
	
	        container.appendChild(renderer.domElement);
	
	        this.animate();
	
	        this.video.addEventListener('ended', function () {
	            return _this.setTime(0);
	        });
	        window.addEventListener('resize', this.onResize);
	        window.addEventListener('click', this.onClick);
	    }
	
	    _createClass(Player, [{
	        key: 'createSphere',
	        value: function createSphere() {
	            var video = domFromString('\n            <video style="display: none;" loop preload="auto" id="video" webkit-playsinline crossOrigin="anonymous">\n                <source type="video/mp4">\n            </video>\n        ');
	            this.video = video;
	            document.body.appendChild(video);
	
	            var texture = new THREE.VideoTexture(video);
	            texture.minFilter = THREE.LinearFilter;
	            texture.magFilter = THREE.LinearFilter;
	            texture.format = THREE.RGBFormat;
	
	            var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 80, 80), new THREE.MeshBasicMaterial({
	                map: texture,
	                // map: (new THREE.TextureLoader()).load('./p.jpg'),
	                side: THREE.BackSide
	            }));
	
	            sphere.rotateY(-Math.PI * 0.5);
	
	            this.scene.add(sphere);
	        }
	    }, {
	        key: 'enterFullScreen',
	
	
	        // we need to call inside an user action handler
	        value: function enterFullScreen() {
	            if (fullscreen.enabled) {
	                fullscreen.request();
	            }
	        }
	    }, {
	        key: 'loadVideo',
	        value: function loadVideo() {
	            var videoUrl = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	            this.video.firstElementChild.setAttribute('src', videoUrl);
	        }
	    }, {
	        key: 'getDuration',
	        value: function getDuration() {
	            return this.video.duration;
	        }
	    }, {
	        key: 'setTime',
	        value: function setTime(time) {
	            this.video.currentTime = time;
	        }
	    }, {
	        key: 'play',
	        value: function play() {
	            this.video.play();
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            this.video.pause();
	        }
	    }]);
	
	    return Player;
	}();
	
	var _initialiseProps = function _initialiseProps() {
	    var _this2 = this;
	
	    this.render = function () {
	        _this2.scene.traverse(function (item) {
	            if (typeof item.update === 'function') {
	                item.update();
	            }
	        });
	        _this2.sensorControls.update();
	        if (_this2.isOnStereoMode) {
	            _this2.stereoEffect.render(_this2.scene, _this2.camera);
	        } else {
	            _this2.renderer.render(_this2.scene, _this2.camera);
	        }
	    };
	
	    this.animate = function () {
	        _this2.render();
	        requestAnimationFrame(_this2.animate);
	    };
	
	    this.onResize = function () {
	        var _container = _this2.container;
	        var w = _container.offsetWidth;
	        var h = _container.offsetHeight;
	
	        _this2.camera.aspect = w / h;
	        _this2.camera.updateProjectionMatrix();
	
	        _this2.renderer.setSize(w, h);
	        _this2.stereoEffect.setSize(w, h);
	    };
	
	    this.onClick = function (e) {
	        var _container2 = _this2.container;
	        var w = _container2.offsetWidth;
	        var h = _container2.offsetHeight;
	        var renderer = _this2.renderer;
	        var camera = _this2.camera;
	
	
	        mouse.x = event.clientX / renderer.domElement.width * 2 - 1;
	        mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
	
	        raycaster.setFromCamera(mouse, camera);
	
	        var intersects = raycaster.intersectObjects(_this2.scene.children, true);
	        intersects.some(function (i) {
	            var obj = i.object;
	            if (typeof obj.onClick === 'function') {
	                obj.onClick(e);
	                return true;
	            }
	        });
	    };
	
	    this.enableSensor = function () {
	        _this2.sensorControls.enableDeviceMove = true;
	    };
	
	    this.disableSensor = function () {
	        _this2.sensorControls.enableDeviceMove = false;
	    };
	
	    this.enableStereoMode = function () {
	        return _this2.isOnStereoMode = true;
	    };
	
	    this.disableStereoMode = function () {
	        return _this2.isOnStereoMode = false;
	    };
	};
	
	exports.default = Player;
	;

/***/ },
/* 4 */
/*!************************************************!*\
  !*** ./~/.1.0.14@three-stereo-effect/index.js ***!
  \************************************************/
/***/ function(module, exports) {

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @authod mrdoob / http://mrdoob.com/
	 * @authod arodic / http://aleksandarrodic.com/
	 * @authod fonserbc / http://fonserbc.github.io/
	 * @authod samsy / http://samsy.ninja/
	 *
	 * Off-axis stereoscopic effect based on http://paulbourke.net/stereographics/stereorender/
	 */
	
	
	module.exports = function(THREE, renderer) {
	
		function StereoEffect(renderer){
	
	
			var scope = this;
	
			this.eyeSeparation = 3;
			this.focalLength = 15; 	// Distance to the non-parallax or projection plane
	
			Object.defineProperties( this, {
				separation: {
					get: function () {
	
						return scope.eyeSeparation;
	
					},
					set: function ( value ) {
	
						console.warn( 'THREE.StereoEffect: .separation is now .eyeSeparation.' );
						scope.eyeSeparation = value;
	
					}
				},
				targetDistance: {
					get: function () {
	
						return scope.focalLength;
	
					},
					set: function ( value ) {
	
						console.warn( 'THREE.StereoEffect: .targetDistance is now .focalLength.' );
						scope.focalLength = value;
	
					}
				}
			} );
	
			// internals
	
			var _width, _height;
	
			var _position = new THREE.Vector3();
			var _quaternion = new THREE.Quaternion();
			var _scale = new THREE.Vector3();
	
			var _cameraL = new THREE.PerspectiveCamera();
			var _cameraR = new THREE.PerspectiveCamera();
	
			var _fov;
			var _outer, _inner, _top, _bottom;
			var _ndfl, _halfFocalWidth, _halfFocalHeight;
			var _innerFactor, _outerFactor;
	
			// initialization
	
			renderer.autoClear = false;
	
			this.setSize = function ( width, height ) {
	
				_width = width / 2;
				_height = height;
	
				renderer.setSize( width, height );
	
			};
	
			this.render = function ( scene, camera ) {
	
				scene.updateMatrixWorld();
	
				if ( camera.parent === null ) camera.updateMatrixWorld();
	
				camera.matrixWorld.decompose( _position, _quaternion, _scale );
	
				// Effective fov of the camera
	
				_fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( camera.fov ) * 0.5 ) / camera.zoom ) );
	
				_ndfl = camera.near / this.focalLength;
				_halfFocalHeight = Math.tan( THREE.Math.degToRad( _fov ) * 0.5 ) * this.focalLength;
				_halfFocalWidth = _halfFocalHeight * 0.5 * camera.aspect;
	
				_top = _halfFocalHeight * _ndfl;
				_bottom = - _top;
				_innerFactor = ( _halfFocalWidth + this.eyeSeparation / 2.0 ) / ( _halfFocalWidth * 2.0 );
				_outerFactor = 1.0 - _innerFactor;
	
				_outer = _halfFocalWidth * 2.0 * _ndfl * _outerFactor;
				_inner = _halfFocalWidth * 2.0 * _ndfl * _innerFactor;
	
				// left
	
				_cameraL.projectionMatrix.makeFrustum(
					- _outer,
					_inner,
					_bottom,
					_top,
					camera.near,
					camera.far
				);
	
				_cameraL.position.copy( _position );
				_cameraL.quaternion.copy( _quaternion );
				_cameraL.translateX( - this.eyeSeparation / 2.0 );
	
				// right
	
				_cameraR.projectionMatrix.makeFrustum(
					- _inner,
					_outer,
					_bottom,
					_top,
					camera.near,
					camera.far
				);
	
				_cameraR.position.copy( _position );
				_cameraR.quaternion.copy( _quaternion );
				_cameraR.translateX( this.eyeSeparation / 2.0 );
	
				//
	
				renderer.clear();
				renderer.setScissorTest( true );
	
				renderer.setScissor( 0, 0, _width, _height );
				renderer.setViewport( 0, 0, _width, _height );
				renderer.render( scene, _cameraL );
	
				renderer.setScissor( _width, 0, _width, _height );
				renderer.setViewport( _width, 0, _width, _height );
				renderer.render( scene, _cameraR );
	
				renderer.setScissorTest( false );
	
			};
	
		}
	
	
			StereoEffect.prototype = Object.create( THREE.EventDispatcher.prototype );
			StereoEffect.prototype.constructor = StereoEffect;
			return StereoEffect;
	};
	


/***/ },
/* 5 */
/*!************************************************!*\
  !*** ./~/.3.0.2@screenfull/dist/screenfull.js ***!
  \************************************************/
/***/ function(module, exports) {

	/*!
	* screenfull
	* v3.0.0 - 2015-11-24
	* (c) Sindre Sorhus; MIT License
	*/
	(function () {
		'use strict';
	
		var isCommonjs = typeof module !== 'undefined' && module.exports;
		var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
	
		var fn = (function () {
			var val;
			var valLength;
	
			var fnMap = [
				[
					'requestFullscreen',
					'exitFullscreen',
					'fullscreenElement',
					'fullscreenEnabled',
					'fullscreenchange',
					'fullscreenerror'
				],
				// new WebKit
				[
					'webkitRequestFullscreen',
					'webkitExitFullscreen',
					'webkitFullscreenElement',
					'webkitFullscreenEnabled',
					'webkitfullscreenchange',
					'webkitfullscreenerror'
	
				],
				// old WebKit (Safari 5.1)
				[
					'webkitRequestFullScreen',
					'webkitCancelFullScreen',
					'webkitCurrentFullScreenElement',
					'webkitCancelFullScreen',
					'webkitfullscreenchange',
					'webkitfullscreenerror'
	
				],
				[
					'mozRequestFullScreen',
					'mozCancelFullScreen',
					'mozFullScreenElement',
					'mozFullScreenEnabled',
					'mozfullscreenchange',
					'mozfullscreenerror'
				],
				[
					'msRequestFullscreen',
					'msExitFullscreen',
					'msFullscreenElement',
					'msFullscreenEnabled',
					'MSFullscreenChange',
					'MSFullscreenError'
				]
			];
	
			var i = 0;
			var l = fnMap.length;
			var ret = {};
	
			for (; i < l; i++) {
				val = fnMap[i];
				if (val && val[1] in document) {
					for (i = 0, valLength = val.length; i < valLength; i++) {
						ret[fnMap[0][i]] = val[i];
					}
					return ret;
				}
			}
	
			return false;
		})();
	
		var screenfull = {
			request: function (elem) {
				var request = fn.requestFullscreen;
	
				elem = elem || document.documentElement;
	
				// Work around Safari 5.1 bug: reports support for
				// keyboard in fullscreen even though it doesn't.
				// Browser sniffing, since the alternative with
				// setTimeout is even worse.
				if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
					elem[request]();
				} else {
					elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
				}
			},
			exit: function () {
				document[fn.exitFullscreen]();
			},
			toggle: function (elem) {
				if (this.isFullscreen) {
					this.exit();
				} else {
					this.request(elem);
				}
			},
			raw: fn
		};
	
		if (!fn) {
			if (isCommonjs) {
				module.exports = false;
			} else {
				window.screenfull = false;
			}
	
			return;
		}
	
		Object.defineProperties(screenfull, {
			isFullscreen: {
				get: function () {
					return Boolean(document[fn.fullscreenElement]);
				}
			},
			element: {
				enumerable: true,
				get: function () {
					return document[fn.fullscreenElement];
				}
			},
			enabled: {
				enumerable: true,
				get: function () {
					// Coerce to boolean in case of old WebKit
					return Boolean(document[fn.fullscreenEnabled]);
				}
			}
		});
	
		if (isCommonjs) {
			module.exports = screenfull;
		} else {
			window.screenfull = screenfull;
		}
	})();


/***/ }
/******/ ])
});
;
//# sourceMappingURL=main.js.map