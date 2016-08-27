/**
 * Created by yong on 8/26/16.
 */
export  default {
    uv2xyz(u, v){
        var theta = Math.PI * u * 2.0;
        var phi = v * Math.PI;
        var x = -Math.cos(theta) * Math.sin(phi);
        var z = -Math.sin(theta) * Math.sin(phi);
        var y = Math.cos(phi);
        // we just need to rotate x to 4pi/3
        // return {x: -z, y, z: x};
        return {x, y, z};
    }
}
