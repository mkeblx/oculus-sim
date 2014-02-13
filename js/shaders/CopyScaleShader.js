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

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = texel;",
			/* "gl_FragColor.r = 1.0;",
			"if( gl_FragCoord.x > 100.0 ) {",
			"	gl_FragColor.r = 0.0;",
			"}", */

		"}"


	].join("\n")

};
