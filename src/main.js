/**
 * Created by yong on 8/27/16.
 */
import Mesh from './Mesh';
import math from './math';
import Player from './player';

const textureLoader = new THREE.TextureLoader();

// const AROUND_ANGLE = Math.PI * 0.5 * 0.35;
const ITEM_DISTANCE = 10;

const ITEM_ABS_GAP = 5;
function getGuideStartVec(p) {
    const R = ITEM_DISTANCE;
    const rv = (new THREE.Vector3(p.x, p.y, p.z)).multiplyScalar(R);
    const surfaceDistance = Math.sqrt(R * R - rv.y * rv.y);
    if (surfaceDistance === 0) {
        return (new THREE.Vector3(0, -1, 0)).multiplyScalar(ITEM_ABS_GAP);
    }
    const d = R * ITEM_ABS_GAP / surfaceDistance;
    return rv.normalize().multiplyScalar(d).setY(p.y * R);
}

class Arrow extends Mesh {
    static materials = [1, 2, 3].map(i => textureLoader.load(`images/arr${i}.png`));

    constructor() {
        const currentMaterialIndex = 0;
        super(
            new THREE.PlaneGeometry(1.4, 2),
            new THREE.MeshBasicMaterial({
                map: Arrow.materials[currentMaterialIndex],
                transparent: true,
                side: THREE.DoubleSide
            })
            // new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ),
        );
        this.rotateX(Math.PI * 0.5);
        this.currentMaterialIndex = currentMaterialIndex;
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

class HotPot extends Mesh {
    static material = textureLoader.load('images/good-anchor.png');

    constructor() {
        const size = 1;
        super(
            new THREE.PlaneGeometry(size, size / 6.179),
            new THREE.MeshBasicMaterial({
                map: HotPot.material,
                transparent: true,
                side: THREE.DoubleSide
            })
            // new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ),
        );
        this.rotateY(Math.PI);
    }

    update() {

    }

    onClick() {
        alert('hotpot clicked');
    }
}

const hotpot = new HotPot();

function showHotpot(scene, pv, onClick) {
    const p = getGuideStartVec(pv);
    hotpot.position.set(p.x, p.y, p.z);
    hotpot.up.set(p.x, 0, p.z);
    if (onClick) {
        hotpot.onClick = onClick;
    }
    if (!hotpot.parent) {
        scene.add(hotpot);
    }
}

function hotPotClickHandler() {
    var modal = document.getElementById('modal');
    modal.innerHTML = '<img id="sofa" src="images/sofa0.png" />';
    modal.style.display = 'block';
    var sofa = document.getElementById('sofa');
    timer = window.setInterval(function() {
                sofa.src = 'images/sofa' + ++curNum % 6 + '.png';
            }, 500);
}

function hideHotpot() {
    if (hotpot.parent) {
        hotpot.parent.remove(hotpot);
    }
}

const pathLength = 5;
const unitLength = 0.5;
const unitGap = unitLength * 0.5;
const unitTotalSize = unitLength + unitGap;
const unitMaterial = textureLoader.load('./images/path-arr.png');
const unitMaterialLight = textureLoader.load('./images/path-arr-light.png');
function createArrowPath() {
    function setPosition(units, pv) {
        const sp = getGuideStartVec(pv);
        const ep = pv;
        const spv = new THREE.Vector3(sp.x, sp.y, sp.z);
        const epvu = new THREE.Vector3(ep.x, ep.y, ep.z);
        const epv = epvu.multiplyScalar(ITEM_DISTANCE);
        const pathVec = epv.clone().sub(spv);

        units.forEach((u, i) => {
            const up = pathVec.clone().multiplyScalar(i / units.length).add(sp);
            u.up.set(pathVec.x, pathVec.y, pathVec.z);
            u.position.set(up.x, up.y, up.z);
        });
    }

    const unitCount = Math.ceil(pathLength / unitTotalSize);
    const group = new THREE.Object3D();
    let i;
    for (i = 0; i < unitCount; i++) {
        const u = new THREE.Mesh(
            new THREE.PlaneGeometry(unitLength * 2, unitLength),
            new THREE.MeshBasicMaterial({
                map: unitMaterial,
                transparent: true,
                side: THREE.DoubleSide
            })
        );
        u.rotateX(Math.PI * 0.5);
        group.add(u);
    }

    group.currentHighLight = -1;
    group.currentPercentage = 0;

    group.setPercentage = (p) => {
        group.currentPercentage = p;
    };

    group.setPosition = function (pv) {
        setPosition(group.children, pv);
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
        if (last) {
            last.material.map = unitMaterial;
            last.material.needUpdate = true;
        }

        this.currentHighLight = i;
        const current = children[i];
        current.material.map = unitMaterialLight;
        current.material.needUpdate = true;

        this.lastDrawTime = Date.now();
    };

    // this one never gets called
    // group.onClick = onArrowPathClick;

    return group;
}

let arrows = [];

function noop() {
}

function clearArrows() {
    arrows.forEach(a => a.parent && a.parent.remove(a));
}

function addArrow(scene, pv, startTime, onClick = noop) {
    const arrow = new Arrow();
    arrow.startTime = startTime;
    arrow.onClick = onClick;

    const p = getGuideStartVec(pv);
    arrow.position.set(p.x, p.y, p.z);
    arrow.up.set(p.x, 0, p.z);
    scene.add(arrow);
    arrows.push(arrow);
}


const path = createArrowPath();

function showPath(scene, pv, onClick) {
    path.setPosition(pv);
    if (onClick) {
        path.children.forEach(c => c.onClick = onClick);
    }
    if (!path.parent) {
        path.setPosition(pv);
        scene.add(path);
    }
}

function setPathPercentage(percentage) {
    path.setPercentage(percentage);
}

function hidePath() {
    if (path.parent) {
        path.parent.remove(path);
    }
}

function getData(onData = noop) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/video_meta');
    xhr.onload = () => {
        onData(JSON.parse(xhr.response));
    };
    xhr.send();
}

const FRAME_DURATION = 50;
//------------------------工具
function getCurrentFrameIndex(curTime) {
    return Math.floor(curTime / FRAME_DURATION);
}

function getPathPosition(path) {
    return math.hv2xyz(path.ath, path.atv);
}

function getPathPercentage(path, curTime) {
    if (curTime >= path.endtime || curTime <= path.starttime) {
        throw new Error('could not get path percentage');
    }
    var length = path.endtime - path.starttime;
    var curLength = curTime - path.starttime;
    return curLength / length;
}

function getCurrentPath(paths, currentTime) {
    var currentPath = null;
    paths.some(p => {
        if (p.starttime <= currentTime && p.endtime > currentTime) {
            currentPath = p;
            return true;
        }
    });
    return currentPath;
}

//-----------------------更新页面

// //箭头
function drawArrows(paths, player) {
    paths.forEach(function (p) {
        const pv = getPathPosition(p);
        addArrow(player.scene, pv, p.starttime, function () {
            onArrowClick.call(this, player);
        });
    });
}

let lastPath = null;

function onArrowClick(player) {
    const isJumpingToTime = player.getCurrentTime() < this.startTime;

    if (isJumpingToTime) {
        lastPath = null;
        player.setTime(this.startTime);
    }

    hideHotpot();
    clearArrows();
    player.play();
}
//路径
function updatePathPosition(frameMeta, player) {
    const {paths} = frameMeta;
    if (paths.length < 0) {
        throw new Error('could not find any path to draw');
    }

    const currentPath = getCurrentPath(paths, player.getCurrentTime());

    if (!currentPath) {
        throw new Error('could not find current path');
    }

    var pv = getPathPosition(currentPath);

    showPath(player.scene, pv, () => pauseAndShowArrows(frameMeta, player));
}

function pauseAndShowArrows(frameMeta, player) {
    var {scene} = player;
    player.pause();
    hidePath(scene);
    drawArrows(frameMeta.paths, player);

    var pv = math.hv2xyz(frameMeta.modlePos.ath, frameMeta.modlePos.atv);
    showHotpot(scene, pv, hotPotClickHandler);
}

function isPathBeginning(time, path) {
    const startTime = path.starttime;
    return time >= startTime && Math.abs(time - startTime) < FRAME_DURATION;
}

function isPathEnding(time, path) {
    const endTime = path.endtime;
    return time < endTime && Math.abs(time - startTime) < FRAME_DURATION;
}

function isSamePath(p1, p2) {
    return p1.starttime === p2.starttime && p1.endtime === p2.endtime;
}

function onRender(player, metaData) {
    if (!player.isPlaying()) {
        return;
    }

    var currentTime = player.getCurrentTime();
    var currentFrameIndex = getCurrentFrameIndex(currentTime);
    var frameMeta = metaData[currentFrameIndex];
    var paths = frameMeta.paths;

    const currentPath = getCurrentPath(paths, currentTime);

    if (!currentPath) {
        throw new Error('could not find current path');
    }

    if (lastPath && !isSamePath(currentPath, lastPath)) {
        pauseAndShowArrows(frameMeta, player);
        lastPath = null;
        return;
    }

    lastPath = currentPath;

    // update the items in the current scene
    setPathPercentage(getPathPercentage(currentPath, currentTime));
    updatePathPosition(frameMeta, player);
}

module.exports = function setupPlayer() {
    getData(metaData => {
        const player = new Player({
            containerId: 'player',
            enableSensorControl: false,
            isOnStereoMode: false,
            onRender: (e) => {
                onRender(player, metaData);
            }
        });

        player.loadVideo('/output.mp4');
        pauseAndShowArrows(metaData[getCurrentFrameIndex(player.getCurrentTime())], player);
    });
};
