/* global THREE */
// var OrbitControls = require('three-orbit-controls')(THREE);
var StereoEffect = require('three-stereo-effect')(THREE);
var fullscreen = require('screenfull');

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * The core player of the project, it has the following main tasks:
 *     1. load a video and apply the stream video output as a texture to a sphere
 *     2. provide the main controls of as a player(play, pause, setTime, etc.)
 *     3. has vr and stereo mode, with device sensor control enabled
 *     4. call the `update` method (if any) of the items inside the scene on every loop
 *     5. call onClick if hit test is passed
 */

export default class Player {
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
        window.addEventListener('click', this.onClick);
    }

    render = () => {
        this.scene.traverse(item => {
            if (typeof item.update === 'function') {
                item.update();
            }
        });
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
                // map: (new THREE.TextureLoader()).load('./p.jpg'),
                side: THREE.BackSide
            })
        );

        sphere.rotateY(-Math.PI * 0.5);

        this.scene.add(sphere);
    }

    onResize = () => {
        const {container: {offsetWidth: w, offsetHeight: h}} = this;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
        this.stereoEffect.setSize(w, h);
    };

    onClick = (e) => {
        const {container: {offsetWidth: w, offsetHeight: h}, renderer, camera} = this;

        mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
        mouse.y = -( event.clientY / renderer.domElement.height ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        intersects.some(i => {
            const obj = i.object;
            if (typeof obj.onClick === 'function') {
                obj.onClick(e);
                return true;
            }
        });
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
