import { createComponent } from "../../lib/";
import {
    Vector3,
    Texture,
    ShadowGenerator,
    DirectionalLight
} from "@babylonjs/core";

createComponent({
    name : 'lightning',
    props : {
        shadowGenerator : null
    },
    methods : {
        assignLightmap(mesh, textureURL) {
            mesh.material.lightmapTexture = new Texture(
                textureURL,
                this.$scene,
                false,
                false);
            mesh.material.lightmapTexture.coordinatesIndex = 1;
            mesh.material.useLightmapAsShadowmap = true;
            mesh.getChildren().forEach(child => {
                child.material.lightmapTexture = mesh.lightmapTexture;
                child.material.useLightmapAsShadowmap = true;
            });
        },
        addShadowCaster(mesh) {
            mesh.receiveShadows = true;
            this.shadowGenerator.addShadowCaster(mesh);
        }
    },
    mounted() {
        this.$patchElement(this.$scene.getMaterialByID('suzanne.000'), {
            metallic : 0.64,
            roughness : 0.63
        });

        ["bloc.000", "suzanne.000"].forEach(meshName => {
            let mesh = this.$scene.getMeshByID(meshName);
            this.assignLightmap(mesh, "https://models.babylonjs.com/CornellBox/" + mesh.name + ".lightmap.jpg");
        });

        const light = new DirectionalLight('dirLight', new Vector3(0,-1,0), this.$scene);
        this.shadowGenerator = new ShadowGenerator(128, light);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
        this.$scene.meshes.forEach(mesh => {
            this.addShadowCaster(mesh);
        });
    }
});