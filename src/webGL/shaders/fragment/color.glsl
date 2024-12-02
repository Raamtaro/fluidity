precision highp float;
uniform sampler2D velocity;
uniform sampler2D uBaseTexture;
varying vec2 uv;


void main(){

    vec4 base = texture2D(uBaseTexture, uv);

    vec2 vel = texture2D(velocity, uv).xy;
    float len = length(vel);
    vel = vel * 0.5 + 0.5;
    
    vec3 color = vec3(vel.x, vel.y, 1.0);
    color = mix(base.rgb, color, len);

    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(base.rgb,  1.0); //Outputs a black screen
    gl_FragColor = vec4(base); //Outputs the scene, but the frames of the scene overlap as time goes on instead of moving from frame to frame.
}