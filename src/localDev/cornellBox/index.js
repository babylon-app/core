import { createApp } from "../../lib/";
import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import './camera';
import "./environment";


createApp({
    name : 'cornellBox',
    canvas : document.getElementById('render-canvas'),
    rootUrl : 'https://models.babylonjs.com/CornellBox/',
    sceneFileName : 'cornellBox.glb',
});