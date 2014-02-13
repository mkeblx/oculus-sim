/**
 * modified by vkvitnev http://vladkvit.github.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ScalingPass = function ( renderTarget ) {

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.ScalingPass relies on THREE.CopyShader" );

	var shader = THREE.CopyShader;

	this.textureID = "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.renderTarget = renderTarget;

	if ( this.renderTarget === undefined ) {

		alert("error scaling pass");

	}

	this.enabled = true;
	this.needsSwap = false;
	this.clear = false;

};

THREE.ScalingPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		THREE.EffectComposer.quad.material = this.material;

		renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, this.renderTarget, this.clear );

	}

};
