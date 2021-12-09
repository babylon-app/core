import {Component } from "./Component";
import {ComponentOptions as componentOptions} from "./Component";
export type ComponentOptions = componentOptions;

export {Component} from './Component';

export function createComponent(componentOptions : ComponentOptions) {
    return new Component(componentOptions);
}