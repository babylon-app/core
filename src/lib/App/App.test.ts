import {createApp} from "./index";
import {expect} from "@jest/globals";
import {NullEngine} from "@babylonjs/core/Engines/nullEngine.js";
import {FreeCamera, HemisphericLight, Mesh, MeshBuilder, Vector3} from "@babylonjs/core";

test('NullEngine App', async() => {
    const engine = new NullEngine();
    await createApp({
        name : 'app',
        engine : engine,
        mounted() {
            this.$scene.activeCamera =  new FreeCamera("camera1", new Vector3(0, 5, -10),  this.$scene);
            expect(this.$app).toBeDefined();
            expect(this.$scene).toBeDefined();
        }
    });
    expect(window['$app']).toBeDefined();
    expect(window['$app']['$scene']).toBeDefined();
});

/**
test('Simple Scene App', () => {
   const engine = new NullEngine();
   let app = createApp({
       name : 'simple',
       engine : engine,
       mounted() {
           new HemisphericLight("light", new Vector3(0, 1, 0), this.$scene);
           new FreeCamera("camera1", new Vector3(0, 5, -10),  this.$scene);
       }
   });
    expect(window['$simple']).toBeDefined();
    expect(window['$simple']['$scene']).toBeDefined();
   expect(app.$scene.lights.length).toEqual(1);
   expect(app.$scene.cameras.length).toEqual(1);
});

test('GLTF app',  (done) => {
    const engine = new NullEngine();
    let app = createApp({
        name : 'app',
        engine : engine,
        rootUrl : 'https://models.babylonjs.com/CornellBox/',
        sceneFileName : 'cornellBox.glb',
        mounted() {
            this.$scene.activeCamera =  new FreeCamera("camera1", new Vector3(0, 5, -10),  this.$scene);
            expect(this.$scene.meshes.length).toEqual(8);
            done();
        }
    });
});
**/


