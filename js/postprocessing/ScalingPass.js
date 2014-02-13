/**
 * modified by vkvitnev http://vladkvit.github.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ScalingPass = function ( renderTarget ) {

	if ( THREE.CopyScaleShader === undefined )
		console.error( "THREE.ScalingPass relies on THREE.CopyScaleShader" );

	//Setting up scene
	sceneRTT = new THREE.Scene();

	var lightRTT = new THREE.DirectionalLight( 0xffffff );
	lightRTT.position.set( 0, 0, 1 ).normalize();
	sceneRTT.add( lightRTT );

	lightRTT = new THREE.DirectionalLight( 0xffaaaa, 1.5 );
	lightRTT.position.set( 0, 0, -1 ).normalize();
	sceneRTT.add( lightRTT );

	

	cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	cameraRTT.position.z = 100;

	//var csshader = new THREE.ShaderPass( THREE.CopyScaleShader, "tDiffuseS" );
	//this.uniforms = THREE.UniformsUtils.clone( csshader.uniforms );

	/*var materialScreen = new THREE.ShaderMaterial( {
		uniforms: this.uniforms,
		vertexShader: csshader.material.vertexShader,
		fragmentShader: csshader.material.fragmentShader,

		depthWrite: false

	} );*/

	var planeRTT = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );



	//END setting up scene



	this.textureID = "tDiffuseS";

	this.scene = sceneRTT;
	this.camera = cameraRTT;
	

	var shader = new THREE.ShaderPass( THREE.CopyScaleShader, "tDiffuseS" );

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = shader.material;

	quad = new THREE.Mesh( planeRTT, this.material );
	quad.position.z = -100;
	sceneRTT.add( quad );

	this.quad = quad;

	this.renderTarget = renderTarget;

	if ( this.renderTarget === undefined ) {

		alert("error scaling pass");

	}

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false; //TODO: true?
	
	this.renderToScreen = false;
};

THREE.ScalingPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;
		

		//renderer.render( this.scene, this.camera, this.renderTarget, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

	}

};
