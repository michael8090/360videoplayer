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
        h *= Math.PI / 180;
        v *= Math.PI / 180;
        const tanH = Math.tan(h);
        const tanH2 = tanH * tanH;
        const tanV = Math.tan(v);
        const tanV2 = tanV * tanV;
        const x = 1 / Math.sqrt((1 + tanH2) * (1 + tanH2));
        const y = x * tanH;
        const z = tanV / Math.sqrt(1 + tanV2);
        return {x, y: -y, z};
    }
}
