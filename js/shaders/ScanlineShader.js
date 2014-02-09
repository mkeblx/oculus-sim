/**
 * Scanline shader
 */

THREE.ScanlineShader = {

	uniforms: {
		"tDiffuse":   { type: "t", value: null },
		"scanlines":  { type: "i", value: 1 },
		"resolution": { type: "v2", value: new THREE.Vector2( 512, 512 ) }
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
		"uniform bool scanlines;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main( void ) {",			
			"vec4 color = texture2D( tDiffuse, vUv );",

			"vec3 col = vec3(color);",
			
			"if ( scanlines ) {",
				"col -= mod( gl_FragCoord.y, 2.0 ) < 1.0 ? 0.5 : 0.0;",
			"}",
			
			"gl_FragColor = vec4( col, 0.1 );",
		"}"

	].join("\n")

};
