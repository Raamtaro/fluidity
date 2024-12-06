uniform vec2 uResolution;
uniform sampler2D uBaseTexture;
uniform sampler2D uFluidTexture;

varying vec2 vUv;

void main() {
    vec2 newUv = vUv;
    vec4 baseScene = texture2D(uFluidTexture, newUv); //This works fine for some reason
    // vec4 baseScene = texture2D(uBaseTexture, newUv);
    
    gl_FragColor = vec4(baseScene.rgba);
}