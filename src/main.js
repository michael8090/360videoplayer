/**
 * Created by yong on 8/27/16.
 */
import Mesh from './Mesh';
import math from './math';
import Player from './player';

const textureLoader = new THREE.TextureLoader();

const AROUND_GAP = 12;

function getGuideStartVec(u, v) {
    const p = math.uv2xyz(u, v);
    return (new THREE.Vector3(p.x, p.y, p.z))
        .normalize()
        .multiplyScalar(AROUND_GAP)
        .setY(p.y);
}

class Arrow extends Mesh {
    static materials = [1, 2, 3].map(i => textureLoader.load(`images/arr${i}.png`));

    constructor() {
        const currentMaterialIndex = 0;
        super(
            new THREE.PlaneGeometry(1.4, 2),
            new THREE.MeshPhongMaterial({
                map: Arrow.materials[currentMaterialIndex],
                transparent: true,
                side: THREE.DoubleSide
            })
            // new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ),
        );
        this.currentMaterialIndex = currentMaterialIndex;
        this.rotateX(Math.PI * 0.2);
    }

    update() {
        if (this.lastDrawTime && Date.now() - this.lastDrawTime < 300) {
            return;
        }
        this.lastDrawTime = Date.now();
        this.currentMaterialIndex = (this.currentMaterialIndex + 1) % Arrow.materials.length;
        this.material.map = Arrow.materials[this.currentMaterialIndex];
        this.material.needUpdate = true;
    }

    onClick() {
        alert('arrow clicked');
    }
}

function onArrowPathClick() {
    alert('arrow path is clicked');
}
const unitLength = 2;
const unitMaterial = textureLoader.load('./images/path-arr.png');
const unitMaterialLight = textureLoader.load('./images/path-arr-light.png');
function createArrowPath(u, v) {
    const sp = getGuideStartVec(u, v);
    const ep = math.uv2xyz(u, v);
    const spv = new THREE.Vector3(sp.x, sp.y, sp.z);
    const epvu = new THREE.Vector3(ep.x, ep.y, ep.z);
    const epv = epvu.multiplyScalar(spv.y / epvu.y);
    const pathVec = epv.clone().sub(spv);
    const unitCount = Math.ceil(pathVec.length() / unitLength);
    const group = new THREE.Object3D();
    let i;
    for (i = 0; i < unitCount; i++) {
        const u = new THREE.Mesh(
            new THREE.PlaneGeometry(unitLength * 2, unitLength),
            new THREE.MeshPhongMaterial({
                map: unitMaterial,
                transparent: true,
                side: THREE.DoubleSide
            })
        );
        const up = pathVec.clone().multiplyScalar(i / unitCount).add(sp);
        u.position.set(up.x, up.y, up.z);
        u.up.set(pathVec.x, pathVec.y, pathVec.z);
        u.onClick = onArrowPathClick;
        group.add(u);
    }
    group.currentHighLight = 0;
    group.currentPercentage = 0;

    group.setPercentage = (p) => {
        group.currentPercentage = p;
    };

    group.update = function () {
        if (this.lastDrawTime && Date.now() - this.lastDrawTime < 300) {
            return;
        }
        const {children} = this;
        const i = Math.floor(this.currentPercentage * children.length);
        if (i === this.currentHighLight) {
            return;
        }
        const last = children[this.currentHighLight];
        last.material.map = unitMaterial;
        last.material.needUpdate = true;

        this.currentHighLight = i;
        const current = children[i];
        current.material.map = unitMaterialLight;
        current.material.needUpdate = true;

        this.lastDrawTime = Date.now();
    };

    // this one never gets called
    group.onClick = onArrowPathClick;

    return group;
}

const arrow = new Arrow();

function showArrow(scene, u, v) {
    const p = getGuideStartVec(u, v);
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

const arrowPathName = 'arrow-path';
function showPath(scene, u, v) {
    const path = createArrowPath(u, v);
    path.name = arrowPathName;

    scene.add(path);
}

function setPathPercentage(scene, percentage) {
    const path = scene.getObjectByName(arrowPathName);
    if (path) {
        path.setPercentage(percentage);
    }
}

function hidePath(scene) {
    const path = scene.getObjectByName(arrowPathName);
    if (path) {
        scene.remove(path);
    }
}

module.exports = function setupPlayer(playerConfig) {
    const player = new Player(playerConfig);
    const {scene} = player;
    showArrow(scene, 0.5, 0.75);
    showPath(scene, 0.5, 0.75);

    let p = 0;
    document.body.addEventListener('mousemove', function () {
        p += 0.1;

        if (p > 1) {
            p = 0;
        }

        setPathPercentage(scene, p);
    });
    return player;
};
