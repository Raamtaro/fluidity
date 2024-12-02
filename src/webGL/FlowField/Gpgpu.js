import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import Setup from '../Common/Setup.js'
import Mouse from '../Common/Mouse.js'

import gpgpuShader from '../shaders/particles/gpgpu/particles.glsl'

class GpgpuComputation {
    constructor(baseGeometry) {

        this.baseGeometry = baseGeometry
        this.count = this.baseGeometry.attributes.position.count

        this.positionArray = this.baseGeometry.attributes.position.array
        this.size = Math.ceil(Math.sqrt(this.count))

        this.instance = new GPUComputationRenderer(this.size, this.size, Setup.renderer)

       this.baseParticlesTexture = this.instance.createTexture()
       this.populateBaseTexture()

       this.particlesVariable = this.instance.addVariable('uParticles', gpgpuShader, this.baseParticlesTexture)
       this.configParticlesVariable()

       this.instance.init()

    }

    populateBaseTexture() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3 
            const i4 = i * 4

            //Set Positions
            this.baseParticlesTexture.image.data[i4 + 0] = this.positionArray[i3 + 0]
            this.baseParticlesTexture.image.data[i4 + 1] = this.positionArray[i3 + 1]
            this.baseParticlesTexture.image.data[i4 + 2] = this.positionArray[i3 + 2]
            this.baseParticlesTexture.image.data[i4 + 3] = Math.random()
        }

        // console.log(this.baseParticlesTexture.image.data) //Debug log statement
    }


    configParticlesVariable() {
        this.instance.setVariableDependencies(this.particlesVariable, [this.particlesVariable])
        this.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uBase = new THREE.Uniform(this.baseParticlesTexture)
        this.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.404)
        this.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(1.35)
        this.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.672)
        this.particlesVariable.material.uniforms.uVelocity = new THREE.Uniform(0.0)
        this.particlesVariable.material.uniforms.uMouse = new THREE.Uniform(new THREE.Vector2(-10.0, 10.0))
    }

    

    update() {
        /**
         * Update the uniforms of the gpgpuShader
         */

        this.particlesVariable.material.uniforms.uTime.value = Setup.uniformElapsed
        this.particlesVariable.material.uniforms.uDeltaTime.value = Setup.uniformDelta

        this.particlesVariable.material.uniforms.uVelocity.value = Mouse.targetVelocity * 0.425
        Mouse.targetVelocity *=.9999

        this.instance.compute()

    }
}

export default GpgpuComputation