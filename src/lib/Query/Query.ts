import { Scene } from "@babylonjs/core";
import { Material } from "@babylonjs/core/Materials/material";
import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";

export interface Selector {
    type : string,
    name? : string
}

export class Query {
    constructor(public selector : Selector) {

    }

    applyTo(scene : Scene) : Array<any> {
        let elements = [];
        switch(this.selector.type) {
            case 'Mesh' :
                elements = scene.meshes;
                break;
            case 'Light':
                elements = scene.lights;
                break;
            case 'Material':
                elements = scene.materials;
                break;
            case 'MultiMaterial':
                elements = scene.materials.filter((material : Material) => {
                    return material instanceof MultiMaterial;
                });
                break;
            case 'Camera':
                elements = scene.cameras;
                break;
            case 'TransformNode':
                elements = scene.transformNodes;
                break;
            case 'Texture':
                elements = scene.textures;
                break;
            case 'Scene':
                elements = [scene];
                break;
            default:
                throw new Error('unknown type selector ' + this.selector.type);
        }
        if(this.selector.name) {
            let exp = this.selector.name.replace(/\*/g, '.*');
            let regExp = new RegExp('^' + exp + '$');
            return elements.filter(element => {
                return element.name && regExp.test(element.name);
            });
        }
        else {
            return elements;
        }
    }
}