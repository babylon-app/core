Ideas :

$parent : parent component
$children : child component

$animate(element, patch);

async $getImage(url);
async $getJSON(url);
async $getAssets(url);

$showLoadingScreen();
$hideLoadingScreen();

$onMeshPicked(mesh, handler);
$offMeshPicked(mesh, handler);
$onceMeshPicked(mesh, handler);

-- DEV HELPER --

OU PLUTOT DANS UN COMPOSANT ?

$showGizmo(meshes?)
$hideGizmo(meshes?)

$showNormals(meshes?)
$hideNormals(meshes?)

$showWireframe()
$hideWireframe()

--

-- BUILDIN EVENTS --

$app.$on('$pointer-down', () => {

});

$app.$on('$mesh-pick'; (mesh) => {

))

this.$on('$mesh-pick:mesh.000', (mesh) => {

)

$on('$picked', (mesh, pickInfo) => {
    
});

$on('$mount', (component) => {

));

$on('$mounted', (component) => {

));

$on('$load-start', )
$on('$load-progress', )
$on('$load-end')
$on('$loaded')