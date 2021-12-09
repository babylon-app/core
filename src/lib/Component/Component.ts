import {AssetContainer, Engine, Scene, SceneLoader} from "@babylonjs/core";
import "@babylonjs/loaders/glTF/2.0/glTFLoader"
import {Patch, SerializablePatch} from "../Patch";
import {Query, Selector} from "../Query";
import {App} from "../App";
import {AppOptions} from "../App/App";

type DefaultMethods<V> =  { [key: string]: (this: V, ...args: any[]) => any };

export interface ComponentOptions {
    name : string;
    mounted? : () => void;
    loaded? : () => void;
    methods? : DefaultMethods<Component>;
    props? : { [key : string] : any };
    rootUrl? : string,
    sceneFileName? : string,
}


export class Component {
    #app : App;
    #settings : ComponentOptions | AppOptions;
    #assets : AssetContainer;
    constructor(componentOptions : ComponentOptions | AppOptions ) {
        this.#settings = componentOptions;
        App.addComponent(this);
    }

    get $name() : string {
        return this.#settings.name;
    }

    get $app() : App {
        return this.#app;
    }

    get $scene() : Scene {
        return this.#app.$scene;
    }

    get $canvas() : HTMLCanvasElement {
        return this.#app.$canvas;
    }

    get $engine() : Engine {
        return this.#app.$engine;
    }

    get $settings() : ComponentOptions | AppOptions {
        return this.#settings;
    }

    get $assets() : AssetContainer | null {
        return this.#assets;
    }

    protected async loadScene() {
        this.#assets = await SceneLoader.LoadAssetContainerAsync(this.#settings.rootUrl, this.#settings.sceneFileName, this.$scene);
        this.#assets.addAllToScene();
    }

    $query(selector : Selector) : any {
        let elements = this.$queryAll(selector);
        if(elements.length >= 1) {
            return elements[0];
        }
        else {
            return null;
        }
    }

    $queryAll(selector : Selector) : Array<any> {
       let query = new Query(selector);
       return query.applyTo(this.$scene);
    }

    async $patch(patch : SerializablePatch) : Promise<void> {
        let _patch = new Patch(patch);
        return _patch.applyToScene(this.$scene);
    }

    async $patchElement(element : any, patch : any) : Promise<void> {
        return Patch.applyToElement(element, patch);
    }

    async $patchElements(elements : Array<any>, patch : any) : Promise<void> {
        return Patch.applyToElement(elements, patch);
    }

    $loaded() {
        if(this.$settings.loaded) {
            this.$settings.loaded.call(this);
        }
    }
    async $mount(app : App) {
        this.#app = app;
        if(this.$settings.rootUrl && this.$settings.sceneFileName) {
            await this.loadScene()
        }
        if(this.$settings.props)  {
            Object.getOwnPropertyNames(this.$settings.props).forEach((prop : string) => {
                this[prop] = this.$settings.props[prop];
            })
        }
        if(this.$settings.methods) {
            Object.getOwnPropertyNames(this.$settings.methods).forEach((funcName : string) => {
                this[funcName] = this.$settings.methods[funcName];
            })
        }
        this.$loaded();
    }
}

