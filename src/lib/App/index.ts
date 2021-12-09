import {App, AppOptions} from "./App";

export {App} from './App';

export function createApp(appOptions : AppOptions) {
    return new App(appOptions);
}