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
			"vec4 color;",
			"vec3 col;",

			"if( enable ) {",
				"vec2 mod_vUv = vUv;",
				"float scaler = gl_FragCoord.x / vUv.x;",
				"mod_vUv.x -= mod( gl_FragCoord.x, resolution ) * 0.001;",
				"mod_vUv.y -= mod( gl_FragCoord.y, resolution ) * 0.001;",

				"color = texture2D( tDiffuse, mod_vUv );",

				//"vec2 sc = vec2( sin( vUv.y * resolution ), cos( vUv.y * resolution ) );",

				"col = vec3(color);",


				"col -= mod( gl_FragCoord.x, resolution ) < 1.0 ? opacity : 0.0;",
				"col -= mod( gl_FragCoord.y, resolution ) < 1.0 ? opacity : 0.0;",
			"}",

			"else {",
				"color = texture2D( tDiffuse, vUv );",
				"vec3 col = vec3(color);",

			"}",
			
			"gl_FragColor = vec4( col, 1 );",
		"}"

	].join("\n")

};
