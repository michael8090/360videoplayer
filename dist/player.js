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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _class, _temp, _initialiseProps;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global THREE */
	// var OrbitControls = require('three-orbit-controls')(THREE);
	var StereoEffect = __webpack_require__(/*! three-stereo-effect */ 1)(THREE);
	var fullscreen = __webpack_require__(/*! screenfull */ 2);
	
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
	        var _this = this;
	
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        var containerId = _ref.containerId;
	        var view = _ref.view;
	        var _ref$enableSensorCont = _ref.enableSensorControl;
	        var enableSensorControl = _ref$enableSensorCont === undefined ? false : _ref$enableSensorCont;
	        var _ref$isOnStereoMode = _ref.isOnStereoMode;
	        var isOnStereoMode = _ref$isOnStereoMode === undefined ? false : _ref$isOnStereoMode;
	        var _ref$isFullScreen = _ref.isFullScreen;
	        var isFullScreen = _ref$isFullScreen === undefined ? false : _ref$isFullScreen;
	
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
	        var camera = new THREE.PerspectiveCamera(view || 75, w / h, 1, 1000);
	        camera.position.x = 0.01;
	        camera.position.y = 0;
	        camera.position.z = 0.01;
	        this.camera = camera;
	
	        this.scene = new THREE.Scene();
	
	        var video = domFromString('\n            <video style="display: none;" preload="auto" id="video" webkit-playsinline crossOrigin="anonymous">\n                <source type="video/mp4">\n            </video>');
	        this.video = video;
	        document.body.appendChild(video);
	
	        var texture = new THREE.VideoTexture(video);
	        texture.minFilter = THREE.LinearFilter;
	        texture.magFilter = THREE.LinearFilter;
	        texture.format = THREE.RGBFormat;
	
	        var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), new THREE.MeshBasicMaterial({
	            map: texture
	        }));
	
	        sphere.scale.x = -1;
	        sphere.rotateY(Math.PI * 1.5);
	        this.scene.add(sphere);
	
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
	    }
	
	    _createClass(Player, [{
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
	}(), _initialiseProps = function _initialiseProps() {
	    var _this2 = this;
	
	    this.render = function () {
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
	        var container = _this2.container;
	        _this2.camera.aspect = container.offsetWidth / container.offsetHeight;
	        _this2.camera.updateProjectionMatrix();
	
	        _this2.renderer.setSize(container.offsetWidth, container.offsetHeight);
	    };
	
	    this.enableSensor = function () {
	        _this2.sensorControls.enableDeviceMove = false;
	    };
	
	    this.disableSensor = function () {
	        _this2.sensorControls.enableDeviceMove = true;
	    };
	
	    this.enableStereoMode = function () {
	        return _this2.isOnStereoMode = true;
	    };
	
	    this.disableStereoMode = function () {
	        return _this2.isOnStereoMode = false;
	    };
	}, _temp);

/***/ },
/* 1 */
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
/* 2 */
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
/******/ ]);
//# sourceMappingURL=player.js.map