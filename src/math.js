/**
 * Created by yong on 8/26/16.
 */
export  default {
    uv2xyz(u, v) {
        var theta = Math.PI * u * 2.0;
        var phi = v * Math.PI;
        var x = -Math.cos(theta) * Math.sin(phi);
        var z = -Math.sin(theta) * Math.sin(phi);
        var y = Math.cos(phi);
        // we just need to rotate x to 4pi/3
        // return {x: -z, y, z: x};
        return {x, y, z};
    },
    hv2xyz(h, v) {
        var PI = Math.PI;
        h = h * PI / 180;
        v = v * PI / 180;
        var tanH = Math.tan(h);
        var tanV = Math.tan(v);
        var _x = tanH;
        var _y = Math.sqrt(1 + tanH * tanH) * tanV;
        var tv = Math.sqrt(_x*_x + _y*_y + 1);
        var x = _x / tv;
        var y = _y / tv;
        var z = 1.0 / tv;
        return {x:x, y: -y, z:z};
    }
}
