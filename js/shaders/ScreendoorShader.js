/**
 * 'Screen door' effect shader
 */

THREE.ScreendoorShader = {

	uniforms: {
		"tDiffuse":   { type: "t", value: null },
		"enable":  { type: "i", value: 1 },
		"resolution": { type: "f", value: 2 },
		"opacity":    { type: "f", value: 0.3 }
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
		"uniform bool enable;",
		"uniform float opacity;",
		"uniform float resolution;",

		"varying vec2 vUv;",

		"void main( void ) {",
			"vec4 color = texture2D( tDiffuse, vUv );",

			"vec2 sc = vec2( sin( vUv.y * resolution ), cos( vUv.y * resolution ) );",

			"vec3 col = vec3(color);",
			
			"if ( enable ) {",
				"col -= mod( gl_FragCoord.x, resolution ) < 1.0 ? opacity : 0.0;",
				"col -= mod( gl_FragCoord.y, resolution ) < 1.0 ? opacity : 0.0;",
			"}",
			
			"gl_FragColor = vec4( col, 1 );",
		"}"

	].join("\n")

};
