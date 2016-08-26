/* global THREE */
var OrbitControls = require('three-orbit-controls')(THREE);

function domFromString(htmlString) {
    const parent = document.createElement('div');
    parent.innerHTML = htmlString;
    return parent.firstElementChild;
}

const isWebGLSupported =  (function (){
    try {
        var canvas = document.createElement( 'canvas' );
        return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
        return false;
    }
})();


window.Player = module.exports = class Player {
    constructor({containerId, view, speed} = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`container is not found: ${containerId}`);
        }

        this.container = container;

        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const camera = new THREE.PerspectiveCamera(view || 75, w / h, 1, 1000);
        camera.position.x = 0.01;
        camera.position.y = 0;
        camera.position.z = 10;
        this.camera = camera;

        const controls = new OrbitControls(camera);
        // controls.enablePan = true;
        // controls.enableZoom = true;
        controls.minDistance = -50;
        controls.maxDistance = 50;
        // controls.autoRotate = true;
        // controls.autoRotateSpeed = speed || 0.5;
        controls.addEventListener('change', this.render);

        this.scene = new THREE.Scene();

        const video = domFromString(`
            <video style="display: none;" autoplay preload="auto" id="video" loop="true" webkit-playsinline crossOrigin="anonymous">
                <source type="video/mp4">
            </video>`
        );
        this.video = video;
        document.body.appendChild(video);

        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        // var texture = THREE.ImageUtils.loadTexture(image);
        // texture.minFilter = THREE.LinearFilter;

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );

        sphere.scale.x = -1;
        this.scene.add(sphere);

        const renderer = isWebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer = renderer;

        container.appendChild(renderer.domElement);

        this.animate();

        window.addEventListener('resize', this.onResize);
    }

    render = () => {
        this.renderer.render(this.scene, this.camera);
    };

    animate = () => {
        this.render();
        requestAnimationFrame(this.animate);
    };

    loadVideo(videoUrl = '') {
        this.video.firstElementChild.setAttribute('src', videoUrl);
    };

    onResize = () => {
        const container = this.container;
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
};
