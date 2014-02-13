/**
 * Modified by vkvitnev / http://vladkvit.github.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyScaleShader = {

	uniforms: {

		"tDiffuseS": { type: "t", value: null },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuseS;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuseS, vUv );",
			"gl_FragColor = texel;",
			 "gl_FragColor.r = 1.0;",
			"if( mod( gl_FragCoord.x, 20.0 ) > 10.0 ) {",
			"	gl_FragColor.r = 0.0;",
			"}", 

		"}"


	].join("\n")

};
