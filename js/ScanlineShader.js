/**
 * Scanline shader
 */

THREE.ScanlineShader = {

	uniforms: {

		"u_scanlines":  { type: "i", value: 1 },
		"u_resolution": { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"u_brightness": { type: "f", value: 0.8 },
		"u_blobiness":  { type: "f", value: 1.5 },
		"u_particles":  { type: "f", value: 40 },
		"u_millis":     { type: "f", value: 0 },
		"u_energy":     { type: "f", value: 1.01 }
	},

	vertexShader: [

		"#ifdef GL_ES",
		"precision mediump float;",
		"#endif",

		"uniform vec2 u_resolution;",

		"attribute vec2 a_position;",

		"void main() {",

			"gl_Position = vec4 (a_position, 0, 1);",

		"}"

	].join("\n"),

	fragmentShader: [

		"#ifdef GL_ES",
		"precision mediump float;",
		"#endif",

		"uniform bool u_scanlines;",
		"uniform vec2 u_resolution;",
		
		"uniform float u_brightness;",
		"uniform float u_blobiness;",
		"uniform float u_particles;",
		"uniform float u_millis;",
		"uniform float u_energy;",

		"float noise( vec2 co ){",
			"return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );",
		"}",

		"void main( void ) {",

			"vec2 position = ( gl_FragCoord.xy / u_resolution.x );",
			"float t = u_millis * 0.001 * u_energy;",
			
			"float a = 0.0;",
			"float b = 0.0;",
			"float c = 0.0;",

			"vec2 pos, center = vec2( 0.5, 0.5 * (u_resolution.y / u_resolution.x) );",
			
			"float na, nb, nc, nd, d;",
			"float limit = u_particles / 40.0;",
			"float step = 1.0 / u_particles;",
			"float n = 0.0;",
			
			"for ( float i = 0.0; i <= 1.0; i += 0.025 ) {",

				"if ( i <= limit ) {",

					"vec2 np = vec2(n, 1-1);",
					
					"na = noise( np * 1.1 );",
					"nb = noise( np * 2.8 );",
					"nc = noise( np * 0.7 );",
					"nd = noise( np * 3.2 );",

					"pos = center;",
					"pos.x += sin(t*na) * cos(t*nb) * tan(t*na*0.15) * 0.3;",
					"pos.y += tan(t*nc) * sin(t*nd) * 0.1;",
					
					"d = pow( 1.6*na / length( pos - position ), u_blobiness );",
					
					"if ( i < limit * 0.3333 ) a += d;",
					"else if ( i < limit * 0.6666 ) b += d;",
					"else c += d;",

					"n += step;",
				"}",
			"}",
			
			"vec3 col = vec3(a*c,b*c,a*b) * 0.0001 * u_brightness;",
			
			"if ( u_scanlines ) {",
				"col -= mod( gl_FragCoord.y, 2.0 ) < 1.0 ? 0.5 : 0.0;",
			"}",
			
			"gl_FragColor = vec4( col, 1.0 );",

	"}"

	].join("\n")

};

