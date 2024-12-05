import * as THREE from 'three'

import Particles from "./FlowField/Particles.js";
import Output from "./StableFluidSimulation/Output.js";

import Setup from './Common/Setup.js';


export default class PostScene {
    constructor() {
        this.scene = new THREE.Scene()
        this.loader = new THREE.TextureLoader() //Just in case I want to test a texture

        this.cameraConfig()
        this.setupMaterial()
        this.setupQuad()

        
    }

    cameraConfig() {
        let frustumSize = 1
        let aspect = 1

        this.camera.instance = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        )
    }

    setupMaterial() {
        this.uniforms = {
            // uParticleSceneTexture: new THREE.Uniform(this.loader.load(polarBearTexture)), //Hello world
            uBaseTexture: new THREE.Uniform(null),
            uFluidTexture: new THREE.Uniform(null),
            uResolution: new THREE.Uniform(new THREE.Vector2(Setup.width * Setup.pixelRatio, Setup.height * Setup.pixelRatio)),
        }

        this.material = new THREE.ShaderMaterial(
            {
                uniforms: this.uniforms,
                vertexShader: VertexShader,
                fragmentShader: FragmentShader,
                defines: {
                    PI: Math.PI,
                    PR: window.devicePixelRatio.toFixed(1),
                }
            }
        )
    }

    setupQuad() {
        this.quad = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            this.material
        )

        this.scene.add(this.quad)
    }
}