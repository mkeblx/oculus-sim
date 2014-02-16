var container, stats;

var camera, controls, scene, renderer, composer;

var persistence = 'high', resolution = 'dk1';

var mesh, skymap;

var rtt_params;

var worldWidth = 100, worldDepth = 100,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2,
data = generateHeight( worldWidth, worldDepth );

var clock = new THREE.Clock();

var resolutions = [
	{name: 'dk1', w: 1280, h: 800},
	{name: 'fhd', w: 1920, h: 1080},
	{name: 'cv1', w: 2560, h: 1440},
	{name: 'cv2', w: 3840, h: 2160}
];

var vignettePass, hblurPass, vblurPass, renderPass, copyPass, screenPass;
var effectSave, effectBlend, renderTarget, renderTargetParameters;


var W = 1280, H = 800, Z = 1;
var _W = 1280, _H = 800, _Z = 1;

if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
	document.getElementById( 'container').innerHTML = "";

} else {
	init();
	animate();
}

function init() {
	container = document.getElementById('container');

	console.log(W, H, W/ H, window.innerWidth/ window.innerHeight);
	camera = new THREE.PerspectiveCamera(95, W / H, 1, 200000 );
	camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 700;

	controls = new THREE.FirstPersonControls( camera );

	setupUI();

	controls.movementSpeed = 1000;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;
	controls.freeze = false; //tmp

	scene = new THREE.Scene();

	scene.fog = new THREE.FogExp2( 0xbbbbbb, 0.00015 );

	var light = new THREE.Color( 0xffffff );
	var shadow = new THREE.Color( 0x505050 );

	var matrix = new THREE.Matrix4();

	// sides
	var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
	pxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	pxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

	var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
	nxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	nxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
	nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

	var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
	pyGeometry.faces[ 0 ].vertexColors.push( light, light, light );
	pyGeometry.faces[ 1 ].vertexColors.push( light, light, light );
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

	var py2Geometry = new THREE.PlaneGeometry( 100, 100 );
	py2Geometry.faces[ 0 ].vertexColors.push( light, light, light );
	py2Geometry.faces[ 1 ].vertexColors.push( light, light, light );
	py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

	var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
	pzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	pzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

	var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
	nzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	nzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
	nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 50 ) );


	var geometry = new THREE.Geometry();
	var dummy = new THREE.Mesh();

	for ( var z = 0; z < worldDepth; z ++ ) {

		for ( var x = 0; x < worldWidth; x ++ ) {

			var h = getY( x, z );

			dummy.position.x = x * 100 - worldHalfWidth * 100;
			dummy.position.y = h * 100;
			dummy.position.z = z * 100 - worldHalfDepth * 100;

			var px = getY( x + 1, z );
			var nx = getY( x - 1, z );
			var pz = getY( x, z + 1 );
			var nz = getY( x, z - 1 );

			var pxpz = getY( x + 1, z + 1 );
			var nxpz = getY( x - 1, z + 1 );
			var pxnz = getY( x + 1, z - 1 );
			var nxnz = getY( x - 1, z - 1 );

			var a = nx > h || nz > h || nxnz > h ? 0 : 1;
			var b = nx > h || pz > h || nxpz > h ? 0 : 1;
			var c = px > h || pz > h || pxpz > h ? 0 : 1;
			var d = px > h || nz > h || pxnz > h ? 0 : 1;

			if ( a + c > b + d ) {

				dummy.geometry = py2Geometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = b === 0 ? shadow : light;
				colors[ 1 ] = c === 0 ? shadow : light;
				colors[ 2 ] = a === 0 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 0 ] = c === 0 ? shadow : light;
				colors[ 1 ] = d === 0 ? shadow : light;
				colors[ 2 ] = a === 0 ? shadow : light;

			} else {

				dummy.geometry = pyGeometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = a === 0 ? shadow : light;
				colors[ 1 ] = b === 0 ? shadow : light;
				colors[ 2 ] = d === 0 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 0 ] = b === 0 ? shadow : light;
				colors[ 1 ] = c === 0 ? shadow : light;
				colors[ 2 ] = d === 0 ? shadow : light;

			}

			THREE.GeometryUtils.merge( geometry, dummy );

			if ( ( px != h && px != h + 1 ) || x == 0 ) {

				dummy.geometry = pxGeometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = pxpz > px && x > 0 ? shadow : light;
				colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

				THREE.GeometryUtils.merge( geometry, dummy );

			}

			if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

				dummy.geometry = nxGeometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
				colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

				THREE.GeometryUtils.merge( geometry, dummy );

			}

			if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

				dummy.geometry = pzGeometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
				colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

				THREE.GeometryUtils.merge( geometry, dummy );

			}

			if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

				dummy.geometry = nzGeometry;

				var colors = dummy.geometry.faces[ 0 ].vertexColors;
				colors[ 0 ] = pxnz > nz && z > 0 ? shadow : light;
				colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

				var colors = dummy.geometry.faces[ 1 ].vertexColors;
				colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

				THREE.GeometryUtils.merge( geometry, dummy );

			}
		}
	}

	var texture = THREE.ImageUtils.loadTexture( 'textures/minecraft/atlas.png' );
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, ambient: 0xbbbbbb, vertexColors: THREE.VertexColors } ) );
	scene.add( mesh );

	addSkybox();
	addText();

	var ambientLight = new THREE.AmbientLight( 0xcccccc );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
	directionalLight.position.set( 1, 1, 0.5 ).normalize();
	scene.add( directionalLight );


	renderer = new THREE.WebGLRenderer({ antialias: true });
	//renderer.autoClear = false;
	renderer.setClearColor( 0xbfd1e5, 1 );

	renderTargetParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: false };

	//Trying to add a second pass!
	//render the scene in the first pass.
	//then, set up a second scene that has a textured plane


	rtt_params = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat };
	scalerPass = new THREE.ScalingPass( new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rtt_params ) );

	//END second pass




	// Here is the effect for the Oculus Rift
	// worldScale 100 means that 100 Units == 1m
	//effect = new THREE.OculusRiftEffect( renderer, {worldScale: 100} );
	//effect.setSize( window.innerWidth, window.innerHeight );

	//postprocessing
	var specBuf =  new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rtt_params );
	renderPass = new THREE.RenderPass( scene, camera, specBuf );

	copyPass = new THREE.ShaderPass( THREE.CopyShader );

	filmPass = new THREE.ShaderPass( THREE.FilmShader );
	filmPass.uniforms["grayscale"].value = 0;
	filmPass.uniforms["time"].value = 0.0;
	filmPass.uniforms["nIntensity"].value = 0.5;
	filmPass.uniforms["sIntensity"].value = 0.5;
	filmPass.uniforms["sCount"].value = 1024*8;

	scalerPass.uniforms[ 'tDiffuseS' ].value = renderPass.specialBuf;

	screenPass = new THREE.ShaderPass( THREE.ScreendoorShader );

	setupComposer(false);

	container.innerHTML = "";

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// GUI
	window.addEventListener( 'resize', _.throttle(onWindowResize, 1000/3), false );
	document.addEventListener( 'keydown', keyPressed, false );

	$('#info').on('mouseover mouseout', function(e){
		controls.freeze = !controls.freeze;
	});

	guiVisible = true;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	setupComposer(true);

	//effect.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();
}

function keyPressed (event) {
	var code = event.keyCode;

	if (code === 72) { // H
		guiVisible = !guiVisible;
		document.getElementById('info').style.display = guiVisible ? "block" : "none";
		stats.domElement.style.display = guiVisible ? "block" : "none";
	} else if (code == 62) { // G
		controls.freeze = !controls.freeze;
	} else if (code == 80) { // P 
		$('#toggle-persistence').click();
	} else if (code >= 49 && code <= 52) { // 1-4
		var i = code - 49;
		var res = resolutions[i];
		$('#resolution-select').find("[data-id='"+res.name+"']").click();
	} else if (code == 75) { // K
		skymap.visible = !skymap.visible;
	}
}

function addText() {

	var canvas	= document.createElement( 'canvas' );
	var s = 2;
	canvas.width	= 300*s;
	canvas.height	= 200*s;
	var context	= canvas.getContext( '2d' );
	context.fillStyle = "white";
	context.fillRect(0,0,canvas.width, canvas.height);
	context.lineWidth = 10*s;
	context.strokeStyle = '#000';
	context.strokeRect( 0, 0, canvas.width, canvas.height );
	context.font	= "bold "+60*s+"px Verdana";
	context.fillStyle = '#000';
	context.fillText('oculus', 40*s, s*90);
	context.font	= "bold "+28*s+"px Verdana";
	context.fillStyle = '#000';
	context.fillText('rift simulator', s*45, s*125);
	context.font	= "bold "+6*s+"px Verdana";
	context.fillStyle = '#000';
	context.fillText('“The future is already here— it\'s just not evenly distributed”', 50*s, 145*s);	
	var texture = new THREE.Texture( canvas );
	texture.needsUpdate	= true;
	texture.anisotropy	= 16;

	var geometry	= new THREE.PlaneGeometry(1,canvas.height/canvas.width);
	var material	= new THREE.MeshBasicMaterial();
	material.map	= texture;
	material.side	= THREE.DoubleSide;

	var mesh	= new THREE.Mesh(geometry, material);
	scene.add(mesh);

	mesh.scale.set(500, 500, 500);

	mesh.position.x = 1000;
	mesh.position.y = camera.position.y;
	mesh.position.z = camera.position.z;
	mesh.rotation.y = -Math.PI/2;
}

function addSkybox() {
	var path = "textures/cube/skybox/";
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];

	var textureCube = THREEx.createTextureCube(urls);
	skymap = THREEx.createSkymap({
		textureCube: textureCube,
		cubeW: 100000,
		cubeH: 100000,
		cubeD: 100000
		});
	scene.add( skymap );
}

function generateHeight( width, height ) {

	var data = [], perlin = new ImprovedNoise(),
	size = width * height, quality = 2, z = Math.random() * 100;

	for ( var j = 0; j < 4; j ++ ) {
		if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;

		for ( var i = 0; i < size; i ++ ) {
			var x = i % width, y = ( i / width ) | 0;
			data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
		}

		quality *= 4;
	}

	return data;
}

function getY( x, z ) {
	return ( data[ x + z * worldWidth ] * 0.2 ) | 0;
}

function setupComposer(reset) {
	
	switch (resolution) {
		case 'dk1':
			W = _W*0.5, H = _H*0.5;
			Z = 1/0.5;
			break;
		case 'fhd':
			W = _W*0.67, H = _H*0.67;
			Z = 1/0.67;
			break;
		case 'cv1':
			W = _W*0.9, H = _H*0.9;
			Z = 1/0.9;
			break;
		case 'cv2':
			W = _W*1.35, H = _H*1.35;
			Z = 1/1.35;
			break;
	}

	//this is the display window resolution
	renderer.setSize( window.innerWidth, window.innerHeight );

	var specBuf =  new THREE.WebGLRenderTarget( W, H, rtt_params );
	renderPass = new THREE.RenderPass( scene, camera, specBuf );
	scalerPass.uniforms[ 'tDiffuseS' ].value = renderPass.specialBuf;

	
	//changing resolution here changes the output resolution, which is upscaled to the resolution above
	renderTarget = new THREE.WebGLRenderTarget( W, H, renderTargetParameters  ); 

	
	var new_rtt_params = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBFormat,
		stencilBuffer: false };

	//changing resolution here changes the FIR motion blur resolution only.
	effectSave = new THREE.SavePass(
		new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters ) );
	//new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, new_rtt_params );

	effectBlend = new THREE.ShaderPass( THREE.BlendShader, "tDiffuse1" );
	effectBlend.uniforms[ 'tDiffuse2' ].value = effectSave.renderTarget;
	effectBlend.uniforms[ 'mixRatio' ].value = 0.65;

	scalerPass.uniforms[ 'tDiffuseS' ].value = renderPass.specialBuf;

	composer = new THREE.EffectComposer( renderer, renderTarget );

	composer.addPass( renderPass );

	composer.addPass(scalerPass);

	//screen door
	filmPass.uniforms["nIntensity"].value = 0.5;
	filmPass.uniforms["sIntensity"].value = 0.2;	
	screenPass.uniforms["enable"].value = 1;
	if (resolution == 'dk1') {
		filmPass.uniforms["sCount"].value = 600;
		screenPass.uniforms["resolution"].value = 2;
		screenPass.uniforms["opacity"].value = 0.05;
		effectBlend.uniforms[ 'mixRatio' ].value = 0.65;
	} else if (resolution == 'fhd') {
		filmPass.uniforms["sCount"].value = 900;
		screenPass.uniforms["resolution"].value = 1.5;
		screenPass.uniforms["opacity"].value = 0.02;
		//effectBlend.uniforms[ 'mixRatio' ].value = 0.4;		
	} else if (resolution == 'cv1') {
		filmPass.uniforms["sCount"].value = 1200;
		screenPass.uniforms["resolution"].value = 1.0/(0.9);
		screenPass.uniforms["opacity"].value = 0.0;
		//effectBlend.uniforms[ 'mixRatio' ].value = 0.0;
	} else { // cv2 - 4k
		filmPass.uniforms["sCount"].value = 2400;		
		filmPass.uniforms["nIntensity"].value = 0.0;
		filmPass.uniforms["sIntensity"].value = 0.0;		
		screenPass.uniforms["resolution"].value = 1.0;
		screenPass.uniforms["opacity"].value = 0.06;
		screenPass.uniforms["enable"].value = 0;
		//effectBlend.uniforms[ 'mixRatio' ].value = 0.0;
	}

	if (persistence == 'high') {
		composer.addPass( effectBlend );
		composer.addPass( effectSave );
	}

	composer.addPass( filmPass );
	composer.addPass( screenPass );
	


	composer.addPass( copyPass );
	copyPass.renderToScreen = true;
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	controls.update( clock.getDelta() );
	composer.render();

	//effect.render( scene, camera );
}

function setupUI(){

	$('#resolution-select > div').on('click', function(ev){
		var $this = $(this);

		$this.parent().find('div').removeClass('selected');
		$this.addClass('selected');

		var r = $this.data('id');

		setResolution(r);
	});

	$('#toggle-persistence').on('click', function(ev){
		var $this = $(this);

		var val = $this.data('value');

		$this.toggleClass('selected');

		$this.data('value', (val == 'low')?'high':'low');

		setPersistence(val);

	});

	$('#toggle-drift').on('click', function(ev){
		var $this = $(this);
		$this.toggleClass('selected');

		setDrift(1);
	});

}

function setResolution(res) {
	console.log('set res: ' + res);

	resolution = res;
	setupComposer(true);
}

function setPersistence(level) {
	persistence = level;
	setupComposer(true);
}

function setDrift(drift) {
	camera.drift = drift;
}
