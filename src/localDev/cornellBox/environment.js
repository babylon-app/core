import { createComponent } from "../../lib/";
import { CubeTexture } from "@babylonjs/core";

createComponent({
    name : 'environment',
    methods : {
        setEnvironmentTexture(url) {
            let hdrTexture = new CubeTexture(url, this.$scene);
            hdrTexture.gammaSpace = false;
            this.$scene.environmentTexture = hdrTexture;
        },
        setEnvironmentIntensity(intensity) {
            this.$patchElements(this.$scene.materials, {
                environmentIntensity : intensity
            });
        }
    },
    mounted() {
        this.setEnvironmentTexture("https://www.babylonjs-playground.com/textures/Studio_Softbox_2Umbrellas_cube_specular.env");
        this.setEnvironmentIntensity(0.4);
    }
});