/* global THREE */
// var OrbitControls = require('three-orbit-controls')(THREE);
var StereoEffect = require('three-stereo-effect')(THREE);
var fullscreen = require('screenfull');
import math from './math';

function domFromString(htmlString) {
    const parent = document.createElement('div');
    parent.innerHTML = htmlString;
    return parent.firstElementChild;
}

const isWebGLSupported = (function () {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
})();


window.Player = module.exports = class Player {
    constructor({containerId, enableSensorControl = false, isOnStereoMode = false} = {}) {
        this.isOnStereoMode = isOnStereoMode;
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`container is not found: ${containerId}`);
        }

        this.container = container;

        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const camera = new THREE.PerspectiveCamera(75, w / h, 0.01, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;
        camera.lookAt(new THREE.Vector3(0, 0, 1));

        this.camera = camera;

        this.scene = new THREE.Scene();

        this.createSphere();
        this.createArrow();

        const renderer = isWebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer = renderer;

        const stereoEffect = new StereoEffect(renderer);
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

        this.video.addEventListener('ended', () => this.setTime(0));
        window.addEventListener('resize', this.onResize);
    }

    render = () => {
        this.updateArrow();
        this.sensorControls.update();
        if (this.isOnStereoMode) {
            this.stereoEffect.render(this.scene, this.camera);
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    };

    animate = () => {
        this.render();
        requestAnimationFrame(this.animate);
    };

    createSphere() {
        const video = domFromString(`
            <video style="display: none;" loop preload="auto" id="video" webkit-playsinline crossOrigin="anonymous">
                <source type="video/mp4">
            </video>
        `);
        this.video = video;
        document.body.appendChild(video);

        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 80, 80),
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide
            })
        );

        sphere.rotateY(-Math.PI * 0.5);

        this.scene.add(sphere);
    }

    createArrow() {
        const loader = new THREE.TextureLoader();
        this.arrowMaterials = [1, 2, 3].map(i => loader.load(`images/arr${i}.png`));
        this.currentArrowIndex = 0;
        this.arrow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 2),
            new THREE.MeshPhongMaterial({
                map: this.arrowMaterials[this.currentArrowIndex],
                transparent: true,
                side: THREE.DoubleSide
            })
            // new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ),

        );
        // this.arrow.position.x = 0;
        // this.arrow.position.y = -3;
        // this.arrow.position.z = 10;
        // this.arrow.rotateY(-Math.PI * 0.5);
        const p = math.uv2xyz(0.5, 0.5, 10);
        this.arrow.position.x = p.x;
        this.arrow.position.y = p.y;
        this.arrow.position.z = p.z;
        this.arrow.rotateX(-Math.PI * 0.2);
        this.scene.add(this.arrow);
        this.lastDrawTime = Date.now();
    }

    updateArrow() {
        if (Date.now() - this.lastDrawTime < 300) {
            return;
        }
        this.lastDrawTime = Date.now();
        this.currentArrowIndex = (this.currentArrowIndex + 1) % this.arrowMaterials.length;
        this.arrow.material.map = this.arrowMaterials[this.currentArrowIndex];
        this.arrow.material.needUpdate = true;
    }

    onResize = () => {
        const {container: {offsetWidth: w, offsetHeight: h}} = this;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
        this.stereoEffect.setSize(w, h);
    };

    enableSensor = () => {
        this.sensorControls.enableDeviceMove = true;
    };

    disableSensor = () => {
        this.sensorControls.enableDeviceMove = false;
    };

    enableStereoMode = () => this.isOnStereoMode = true;

    disableStereoMode = () => this.isOnStereoMode = false;

    // we need to call inside an user action handler
    enterFullScreen() {
        if (fullscreen.enabled) {
            fullscreen.request();
        }
    }

    loadVideo(videoUrl = '') {
        this.video.firstElementChild.setAttribute('src', videoUrl);
    };

    getDuration() {
        return this.video.duration;
    }

    setTime(time) {
        this.video.currentTime = time;
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }
};
