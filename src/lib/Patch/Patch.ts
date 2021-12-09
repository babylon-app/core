import { Query, Selector } from "../Query";
import { Scene } from "@babylonjs/core";

const is = {
    Function(functionToCheck : any) : boolean {
        let getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },
    Primitive(x : any) : boolean {
        return x !== Object(x);
    },
    Promise(x : any) : boolean {
        return x && typeof x["then"] == 'function';
    },
    PlainObject(n : any) : boolean {
        // Basic check for Type object that's not null
        if (typeof n == 'object' && n !== null) {
            // If Object.getPrototypeOf supported, use it
            if (typeof Object.getPrototypeOf == 'function') {
                var proto = Object.getPrototypeOf(n);
                return proto === Object.prototype || proto === null;
            }
            // Otherwise, use internal class
            // This should be reliable as if getPrototypeOf not supported, is pre-ES5
            return Object.prototype.toString.call(n) == '[object Object]';
        }
        // Not an object
        return false;
    }
};

async function recursive(elements : Array<any>, func : Function) {
    let index = 0;
    async function recurse() {
        if (index === elements.length) {
            return Promise.resolve();
        }
        else {
            let item = elements[index++];
            try {
                let res = func(item);
                if (is.Promise(res)) {
                    return res.then(async () => {
                        return await recurse();
                    });
                }
                else {
                    return await recurse();
                }
            }
            catch (ex) {
                return await recurse();
            }
        }
    }
    return await recurse();
}

export interface SerializablePatch {
    selector : Selector,
    patch : any
}



export class Patch {
    #query : Query;
    #patch : any;
    constructor(patch : SerializablePatch) {
        this.#query = new Query(patch.selector);
        this.#patch = patch.patch;
    }

    applyToScene(scene : Scene) {
        let elements = this.#query.applyTo(scene);
        return Patch.applyToElements(elements, this.#patch);
    }

    static async applyToElements(elements : Array<any>, source : any) : Promise<void> {
        return await recursive(elements, async (element) => {
            return await Patch.applyToElement(element, source);
        })
    }

    static async applyToElement(element : any, source : any) : Promise<void> {
        let properties = Object.getOwnPropertyNames(source);
        return await recursive(properties, async (property) => {
           return await Patch.applyToProperty(element, source, property);
        });
    }

    static async applyToProperty(element : any, source : any, property : string) : Promise<void> {
        if(is.Primitive(source[property]) || (is.Function(source[property])) && is.Function(element[property])) {
            element[property] = source[property];
            return Promise.resolve();
        }

        if(is.PlainObject(source[property])) {
            return Patch.applyToElement(element[property], source[property]);
        }

        if(is.Function(source[property])) {
            let res = source[property].apply(element);
            if(is.Promise(res)) {
                res.then(value => {
                    if(value) {
                        element[property] = value;
                    }
                });
                return res;
            }
            else {
                element[property] = res;
                return Promise.resolve();
            }
        }
    }
}