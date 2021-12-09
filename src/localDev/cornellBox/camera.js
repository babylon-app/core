import {createComponent} from "../../lib/Component";
import {ArcRotateCamera, Vector3} from "@babylonjs/core";

createComponent({
    name : 'cameras',
    mounted() {
        let camera = new ArcRotateCamera("camera", Math.PI / 2, 1.6, 7.6, new Vector3(0,1.5,0), this.$scene);
        camera.wheelPrecision = 150;
        camera.attachControl(this.$canvas, true);
    }
});