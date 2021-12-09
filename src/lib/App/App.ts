import { Engine }  from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core";
import { Component, ComponentOptions } from "../Component";

export interface AppOptions extends ComponentOptions {
    canvas? : HTMLCanvasElement,
    engine? : Engine,
    name : string | 'app'
}

export class App extends Component {
    #engine: Engine;
    #canvas: HTMLCanvasElement;
    #scene : Scene;
    #components : Array<Component> = [];
    private static components : Array<Component> = [];
    private static instance : App;
    static async addComponent(component : Component) {
        App.components.forEach(_component => {
            if(_component.$name === component.$name) {
                throw new Error('Component name must be unique : ' + component.$name + ' declared more than once');
            }
        });
        App.components.push(component);
    }
    constructor(appOptions: AppOptions) {
        super(appOptions);
        App.components = App.components.filter(component => {
            return component != this;
        });
        if(appOptions.name) {
            window['$'+ appOptions.name] = this;
        }
        else {
            window['$app'] = this;
        }
        if(appOptions.engine) {
            this.#engine = appOptions.engine;
            this.#scene = new Scene(this.#engine);
            this.$mount(this);
        }
        else {
            if(appOptions.canvas) {
                this.#canvas = appOptions.canvas;
                this.#engine = new Engine(this.#canvas);
                this.#scene = new Scene(this.#engine);
                this.$mount(this);
            }
            else {
                throw new Error('No engine or canvas associated to the app');
            }
        }
    }

    $getComponent(componentName : string) : Component | undefined {
        let filter = this.#components.filter(component => {
            return component.$name === componentName
        });
        if(filter.length === 1) {
            return filter[0];
        }
        else {
            return undefined;
        }
    }

    async $addComponent(component : Component) {
        this.#components.push(component);
        await component.$mount(this);
    }

    get $components() : Array<Component> {
        return this.#components;
    }

    get $scene() : Scene {
        return this.#scene;
    }

    get $engine() : Engine {
        return this.#engine;
    }

    get $canvas() : HTMLCanvasElement {
        return this.#canvas;
    }

    $resize() {
        this.$engine.resize();
    }

    $loaded() {
        // super.$loaded();
        // this.$runRenderLoop();
    }

    #render() {
        this.#scene.render();
    }
    public $runRenderLoop() {
        this.$engine.runRenderLoop(() => {
            this.$scene.render();
        });
    }

    public $stopRenderLoop() {
        this.$engine.stopRenderLoop(this.#render);
    }

    async $mount(app : App) {
        window.addEventListener('resize', () => {
            this.$resize();
        });
        await super.$mount(app);
        for(const component of App.components) {
            await this.$addComponent(component);
        }

        for(const component of App.components) {
            if(component.$settings.mounted) {
                component.$settings.mounted.call(component, app);
            }
        }

        if(this.$settings.mounted) {
            this.$settings.mounted.call(this, this);
        }

        this.$runRenderLoop();
    }
}

