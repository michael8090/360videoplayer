/**
 * Created by yong on 8/27/16.
 */
export default class Mesh extends THREE.Mesh {
    update() {
        throw new Error(`${this.constructor.name} should have an "update" method`);
    }
}
