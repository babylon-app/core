# Modularizing the @BabylonJS applications

## Why

* __Don't let your code grow to a mammoth size__
    * When it becomes a medium sized project, you have the overhead of maintaining the project because your code starts bloating. How to apply a bandage to that bleeding code?
    * It is a nightmare to scroll that thousand line javascript file where a variable assignment is breaking five other places. The global variables play a magical role in confusing you.
    * The maintainability of the project becomes painful. It is very tough to debug the code at some point of time.
* __It is easier to achieve scalability with modular programming__
    * Good authors divide their books into chapters and sections; good programmers divide their programs into modules.
    * A well-designed module aims to lessen the dependencies on parts of the codebase as much as possible, so that it can grow and improve independently

## Getting started
You need to setup your environment to generate BabylonJS bundle, you can  
- follow the official documentation https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking. 
- or use [our boilerplate](https://github.com/babylon-app/template) with everything ready for you to start

### `createApp`
```javascript
/** app.js **/
import {createApp} from "@babylon-app/core";

createApp({
    name : 'app',
    rootUrl : 'https://models.babylonjs.com/CornellBox/'
    sceneFileName : 'cornellBox.glb',
    canvas : document.getElementById('render-canvas')
});
```
Will setup anything, download the glb file...but you will get the usual exception : 'No default camera'.
Let create the default camera in a component wrote in a dedicated js module file

### `createComponent`
```javascript
/** activeCamera.js **/
import {createComponent} from "@babylon-app/core";
import {ArcRotateCamera, Vector3} from "@babylonjs/core";

createComponent({
    name : 'activeCamera',
    mounted() {
         let camera = new ArcRotateCamera("arcRotateCamera", Math.PI / 2, 1.6, 7.6, new Vector3(0,1.5,0), this.$scene);
         camera.wheelPrecision = 150;
         camera.attachControl(this.$canvas, true);
    }
});
```
### `mounted()`
`mounted()` is a reserved function name, it will be called when the app is ready to render (but before the rendering loop start).

### `this.$scene`

`this.$scene` represent the current Babylon Scene. With component you don't have to think about if the scene is ready, if the app is launched etc. it is
just available anytime and you can call it securely.

### `this.$canvas`, `this.$engine`
Same principle for the HTMLCanvasElement (`this.$canvas`) used by the BabylonJS Engine (`this.$engine`)

### import component.js
We need to import this file in app.js to let the app known about this component

```javascript
/** app.js **/
import {createApp} from "@babylon-app/core";
import './environment.js';

createApp({
    name : 'app',
    rootUrl : 'https://models.babylonjs.com/CornellBox/'
    sceneFileName : 'cornellBox.glb',
    canvas : document.getElementById('render-canvas')
});
```
The cornell box rendered but its all black because we need to setup an environment, we'll make a component for it
```javascript
/** environment.js **/
import {createComponent} from "@babylon-app/core";
import { CubeTexture } from "@babylonjs/core";

createComponent({
    name : 'environment',
    mounted() {
         let hdrTexture = new CubeTexture(url, this.$scene);
         hdrTexture.gammaSpace = false;
         this.$scene.environmentTexture = hdrTexture;
    }
});
```

We want to tweak the environment intensity on material so we will declare a methods in the component 

### methods 

```javascript
/** environment.js **/
import {createComponent} from "@babylon-app/core";
import { CubeTexture } from "@babylonjs/core";

createComponent({
    name : 'environment',
    methods : {
        setIntensity(intensity) {
            this.$scene.materials.forEach(material => {
                material.environmentIntensity = intensity
            });
        }
    },
    mounted() {
         let hdrTexture = new CubeTexture(url, this.$scene);
         hdrTexture.gammaSpace = false;
         this.$scene.environmentTexture = hdrTexture;
    }
});
```

### `$app.$getComponent`
Open your browser console :
> $app.$getComponent('environment').setIntensity(0.4)

`$app` is the only global object created by @babylon-core so you can use it to plug your HTML events.

### `props`
```javascript
/** light.js **/
import {createComponent} from "@babylon-app/core";
import { CubeTexture } from "@babylonjs/core";

createComponent({
    name : 'light',
    props : {
         light : new DirectionalLight('dirLight', new Vector3(0,-1,0), this.$scene)
    },
    methods : {
        on() {
            this.light.intensity = 1;
        },
        off() {
            this.light.intensity = 0;
        }
    }
});
```

`props` is a reserved keyword to specify the component properties. Props are available everywhere
in the component.

Don't forget to update __app.js__
```javascript
/** app.js **/
import {createApp} from "@babylon-app/core";

import './activeCamera.js'
import './light.js';
import './environment.js';
import './shaderBall.js';

createApp({
   
});
```

Maybe you want to interact with the environment while your are tweaking the light so you could do :

### `this.$app.$getComponent`
```javascript
/** light.js **/ 
import {createComponent} from "@babylon-app/core";
import { CubeTexture } from "@babylonjs/core";
 
createComponent({
     name : 'light',
     props : {
         light : new DirectionalLight('dirLight', new Vector3(0,-1,0), this.$scene)
     },
     methods : {
         on() {
             this.setIntensity(1);
         },
         off() {
             this.setIntensity(0);
         },
         setIntensity(intensity) {
            this.light.intensity = intensity;
            this.$app.$getComponent('environment').setIntensity(1 - intensity);
         },
     }
});
 ```
Component can interact each other.

### `this.$assets`
Import GLTF to the scene with a component :
 
```javascript
/** shaderBall.js **/
import { createComponent} from "@babylon-app/core";

createComponent({
    name : 'shaderBall',
    rootUrl : 'https://models.babylonjs.com/',
    sceneFileName : 'shaderBall.glb',
    mounted() {
        console.log("assets downloaded in a BabylonJS AssetContainer : ", this.$assets);
    }
});
 ```

## Query and Patch the scene graph
### `this.$queryAll`
Available in App and Components :

```javascript
let meshes = this.$queryAll( { type : 'Mesh' } ) // return all meshes
let filteredMaterials = this.$queryAll( { type : 'Material', name : 'material*'})
 ```

In the console 

> $app.$queryAll({ type : 'Mesh'});

### `this.$patch`
```javascript
this.$patch({
    selector : {
        type : 'Mesh',
        name : 'mesh.*.000'
    },
    patch : {
        isVisible : true
    }
})
 ```
Patch can be stored in a JSON file and imported :

__scene.json__
```json
{
    "selector" : {
        "type" : "Mesh",
        "name" : "mesh.*.000"
    },
    "patch" : {
        "isVisible" : true
    }
}
 ```

```javascript
/** example.js **/
import { createComponent} from "@babylon-app/core";
import patchScene from '../patches/scene.json';
createComponent({
    name : 'example',
    mounted() {
       this.$patch(patchScene);
    }
});
 ```


