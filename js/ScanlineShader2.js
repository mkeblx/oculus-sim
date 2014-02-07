/**
 * Scanline shader
 */

THREE.ScanlineShader = {

	uniforms: {

		"u_scanlines":  { type: "i", value: 1 },
		"u_resolution": { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"u_brightness": { type: "f", value: 0.8 }
	},

	vertexShader: [

		"uniform vec2 u_resolution;",

		"attribute vec2 a_position;",

		"void main() {",

			"gl_Position = vec4 (a_position, 0, 1);",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform bool u_scanlines;",
		"uniform vec2 u_resolution;",
		
		"uniform float u_brightness;",

		"void main( void ) {",

			"vec2 position = ( gl_FragCoord.xy / u_resolution.x );",
												
			"vec3 col = vec3(0,0,0) * 0.0001 * u_brightness;",
			
			"if ( u_scanlines ) {",
				"col -= mod( gl_FragCoord.y, 2.0 ) < 1.0 ? 0.5 : 0.0;",
			"}",
			
			"gl_FragColor = vec4( col, 1.0 );",

	"}"

	].join("\n")

};

