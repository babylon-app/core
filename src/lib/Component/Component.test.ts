
import {expect} from "@jest/globals";
import {NullEngine} from "@babylonjs/core/Engines/nullEngine.js";
import {createApp, App} from "../App";
import {createComponent} from "./index";
import {FreeCamera, Vector3} from "@babylonjs/core";

test('simple Component',  async() => {
    let component = await createComponent({
        name : 'cameraX',
        mounted() {
            this.$scene.activeCamera =  new FreeCamera("camera1", new Vector3(0, 5, -10),  this.$scene);
        }
    });

    let app = createApp({
        name : 'app',
        engine : new NullEngine(),
        mounted() {
            expect(this.$getComponent('cameraX')).toEqual(component);
            expect(this.$scene.activeCamera.name).toEqual("camera1");
        }
    });

});

test('props & methods', (done) => {
    let component = createComponent({
        name : 'cameraY',
        props : {
          activeCamera : "camera1"
        },
        methods : {
            setActiveCamera(name) {
              this.$scene.activeCamera = this.$query({
                  type : 'Camera',
                  name : name
              });
              // @ts-ignore
              this.activeCamera = name;
            },
            hello() {
                // @ts-ignore
                return this.setActiveCamera("camera2");
            }
        },
        mounted() {
            this.$scene.activeCamera =  new FreeCamera("camera1", new Vector3(0, 5, -10),  this.$scene);
            new FreeCamera("camera2", new Vector3(0, 5, -10),  this.$scene)
            this.setActiveCamera("camera1");
            expect(this.$app.$getComponent('component1')).toBeDefined();
        }
    });

    createComponent({
        name : 'component1'
    });

    let app = createApp({
        name : 'app',
        engine : new NullEngine(),
        mounted() {
            this.$getComponent('cameraY').setActiveCamera("camera2");
            expect(this.$scene.activeCamera.name).toEqual("camera2");
            done();
        }
    });
});