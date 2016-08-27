/**
 * Created by yong on 8/27/16.
 */
import Mesh from './Mesh';
import math from './math';
import Player from './player';

const textureLoader = new THREE.TextureLoader();

// const AROUND_ANGLE = Math.PI * 0.5 * 0.35;
const ITEM_DISTANCE = 10;

// function getGuideStartVec(u, v, theta = AROUND_ANGLE, R = ITEM_DISTANCE) {
//     var dircVec = math.uv2xyz(u, v);
//     var _x = R * dircVec.x;
//     var _y = R * dircVec.y;
//     var _z = R * dircVec.z;
//
//     var _r = Math.sqrt(Math.pow(_x, 2) + Math.pow(_z, 2));
//     var r = Math.abs(_y / Math.tan(theta));
//
//     var x = (r / _r) * _x;
//     var z = (r / _r) * _z;
//     var y = _y;
//     return new THREE.Vector3(x, y, -z);
// }

const ITEM_ABS_GAP = 5;
function getGuideStartVec(u, v) {
    const R = ITEM_DISTANCE;
    const p = math.uv2xyz(u, v);
    const rv = (new THREE.Vector3(p.x, p.y, p.z)).multiplyScalar(R);
    const surfaceDistance = Math.sqrt(R * R - rv.y * rv.y);
    if (surfaceDistance === 0) {
        return (new THREE.Vector3(0, -1, 0)).multiplyScalar(ITEM_ABS_GAP);
    }
    const d = R * ITEM_ABS_GAP / surfaceDistance;
    return rv.normalize().multiplyScalar(d);
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

function showHotpot(scene, u, v, onClick) {
    const p = getGuideStartVec(u, v);
    hotpot.position.set(p.x, p.y, p.z);
    hotpot.up.set(p.x, 0, p.z);
    if (onClick) {
        hotpot.onClick = onClick;
    }
    if (!hotpot.parent) {
        scene.add(hotpot);
    }
}

function hideHotpot() {
    if (hotpot.parent) {
        hotpot.parent.remove(hotpot);
    }
}

function onArrowPathClick() {
    alert('arrow path is clicked');
}
const unitLength = 0.5;
const unitGap = unitLength;
const unitTotalSize = unitLength + unitGap;
const unitMaterial = textureLoader.load('./images/path-arr.png');
const unitMaterialLight = textureLoader.load('./images/path-arr-light.png');
function createArrowPath(u, v) {
    const sp = getGuideStartVec(u, v);
    const ep = math.uv2xyz(u, v);
    const spv = new THREE.Vector3(sp.x, sp.y, sp.z);
    const epvu = new THREE.Vector3(ep.x, ep.y, ep.z);
    const epv = epvu.multiplyScalar(ITEM_DISTANCE);
    const pathVec = epv.clone().sub(spv);
    const unitCount = Math.ceil(pathVec.length() / unitTotalSize);
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

let arrows = [];

function noop() {
}

function clearArrows(scene) {
    arrows.forEach(scene.remove);
}

function addArrow(scene, u, v, startTime, onClick = noop) {
    const arrow = new Arrow();
    arrow.startTime = startTime;
    arrow.onClick = onClick;

    const p = getGuideStartVec(u, v);
    arrow.position.set(p.x, p.y, p.z);
    arrow.up.set(p.x, 0, p.z);
    scene.add(arrow);
    arrows.push(arrow);
}


const arrowPathName = 'arrow-path';
function showPath(scene, u, v, onClick = noop) {
    const path = createArrowPath(u, v);
    path.name = arrowPathName;
    path.onClick = onClick

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

function getData(onData = noop) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/video_meta');
    xhr.onload = () => {
        onData(JSON.parse(xhr.response));
    };
    xhr.send();
}

const FRAME_DURATION = 125;
//------------------------工具
function getCurIndex(curTime) {
    var curIndex = Math.floor(curTime / FRAME_DURATION);
    return curIndex;
}

function pos2UV(atv, ath) {
    var v = (360.0 - ath) / 360.0;
    var u = (90.0 + atv) / 180.0;
    return {'v': v, 'u': u};
}

function getUVofPath(path) {
    return pos2UV(path.atv, path.ath);
}

//走到路径终点时返回整数1，否则返回(0, 1)浮点数


function getPathPerc(path, curTime) {
    curTime += 42500;
    if (curTime >= path.endtime || curTime <= path.starttime) {
        throw new Error('could not get path percentage');
    }
    if (path.endtime === curTime) {
        return 1;
    }
    var length = path.endtime - path.starttime;
    var curLength = curTime - path.starttime;
    return curLength / length;
}

//-----------------------更新页面
//锚点
function drawHotPot(pos) {
    var uv = pos2UV(pos);
    updateHotPot(uv.u, uv.v);
}
function hotPotClickHandler() {

}

// //箭头
function drawArrows(paths, player) {
    paths.forEach(p => {
        const uv = getUVofPath(p);
        addArrow(player.scene, uv.u, uv.v, p.starttime, () => arrowClickHandler(player));
    });
}
function arrowClickHandler(player) {
    player.setTime(this.starttime);
    player.play();
    clearArrows(player.scene);
}
//路径
function drawPath(paths, player) {
    if (paths.length > 0) {
        var uv = getUVofPath(paths[0]);
        showPath(player.scene, uv.u, uv.v, () => pathClickHandler(paths, player));
    }
}
function pathClickHandler(paths, player) {
    var {scene} = player;
    player.pause();
    hidePath(scene);
    drawArrows(paths, player);
}

const THRESHOLD = 0.0000001;
function floatEqual(x, y) {
    return (Math.abs(x - y) < THRESHOLD);
}

function isPathBeginning(time, path) {
    const startTime = path.starttime;
    return time >= startTime && Math.abs(time - startTime) < FRAME_DURATION;
}


//-----------------------每帧处理
function playerUpdateHandler(player, metaData) {
    if (!player.isPlaying()) {
        return;
    }

    var curTime = player.getCurrentTime() * 1000;
    var curIndex = getCurIndex(curTime);
    var meta = metaData[curIndex];
    var paths = meta.paths;
    const isBeginning = paths.some(p => isPathBeginning(curTime, p));
    if (isBeginning) {
        pathClickHandler(paths, player);
        return;
    }

    var {scene} = player;
    hidePath(scene);
    if (paths.length > 1) {
        throw new Error('only one path is allowed when the user is between two points');
    }
    var perc = getPathPerc(paths[0], curTime);
    drawPath(paths, player);
    setPathPercentage(scene, perc);

    var uv = pos2UV(meta.modlePos);
    showHotpot(scene, uv.u, uv.v, hotPotClickHandler);
}

module.exports = function setupPlayer() {
    getData(metaData => {
        const player = new Player({
            containerId: 'player',
            enableSensorControl: false,
            isOnStereoMode: false,
            onRender: (e) => {
                playerUpdateHandler(player, metaData);
            }
        });
        const {scene} = player;


        // addArrow(scene, 0.75, 0.75, 10000, (e) => alert('arrow clicked'));
        // showPath(scene, 0.75, 0.6, (e) => alert('path clicked'));
        // showHotpot(scene, 0.7, 0.6, (e) => alert('hotpot clicked'));

        // let p = 0;
        // document.body.addEventListener('mousemove', function () {
        //     p += 0.1;

        //     if (p > 1) {
        //         p = 0;
        //     }

        //     setPathPercentage(scene, p);
        // });

        player.loadVideo('/output.mp4');
        player.play();
    });
};
