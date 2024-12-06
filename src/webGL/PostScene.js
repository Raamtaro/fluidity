import * as THREE from 'three'

import Particles from "./FlowField/Particles.js";
import Output from "./StableFluidSimulation/Output.js";

import VertexShader from './shaders/z_finalOutput/vertex.glsl'
import FragmentShader from './shaders/z_finalOutput/fragment.glsl'

import Setup from './Common/Setup.js';


export default class PostScene {
    constructor(resources) {
        this.resources = resources
        this.scene = new THREE.Scene()
        this.loader = new THREE.TextureLoader() //Just in case I want to test a texture

        this.particleScene = new Particles(this.resources.items)
        this.fluidOutput = new Output()

        this.cameraConfig()
        this.setupMaterial()
        this.setupQuad()

        
    }

    cameraConfig() {
        let frustumSize = 1
        let aspect = 1

        this.camera = new THREE.OrthographicCamera(
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

    resize() {
        this.particleScene.resize()
        this.fluidOutput.resize()
        this.material.uniforms.uResolution.value.set(Setup.width * Setup.pixelRatio, Setup.height * Setup.pixelRatio)
    }

    updateSims() {
        this.particleScene.update()
        this.fluidOutput.update()
    }

    targetSwap() {
        this.particleScene.targetSwap()
        this.fluidOutput.targetSwap()
    }

    updateUniforms() {
        this.quad.material.uniforms.uBaseTexture.value = this.particleScene.target.texture
        this.quad.material.uniforms.uFluidTexture.value = this.fluidOutput.target.texture
    }

    render() {
        Setup.renderer.setRenderTarget(null)
        Setup.renderer.render(this.scene, this.camera);
    }

    update() {
        this.updateSims()
        this.targetSwap()
        this.updateUniforms()
        this.render()
    }
}