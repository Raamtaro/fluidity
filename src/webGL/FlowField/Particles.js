import * as THREE from 'three'
import Setup from '../Common/Setup.js'
import Mouse from '../Common/Mouse.js'

import CustomCamera from './ParticleSceneCamera.js'
import GpgpuComputation from './Gpgpu.js'

import particlesVertexShader from '../shaders/particles/particles/vertex.glsl'
import particlesFragmentShader from '../shaders/particles/particles/fragment.glsl'

class Particles {
    constructor(resources) {

        /** 
         * Create the scene 
         */
        
        this.createScene() //Gives us this.scene + this.camera (added to the scene)
        // console.log(this.scene)

        /**
         * Set the correct geoemetry - refer to sources.js, and input the desired `name` (type: string) into setupGeometries()
         */
        this.models = resources
        this.setupGeometries('twoMilliLotus') //Gives us this.geometry

        
        /**
         * Populate the UV and Size Arrays
         */
        this.gpgpu = new GpgpuComputation(this.geometry)
        this.size = this.gpgpu.size
        this.count = this.geometry.attributes.position.count
        this.particlesUvArray = new Float32Array(this.count * 2)
        this.sizesArray = new Float32Array(this.count)
        this.populateArrays()

        this.bufferGeometry = new THREE.BufferGeometry()

        this.uniforms = {
            uTime: new THREE.Uniform(0.0),
            uSize: new THREE.Uniform(0.005),
            uResolution: new THREE.Uniform(new THREE.Vector2(Setup.width * Setup.pixelRatio, Setup.height * Setup.pixelRatio)),
            uParticlesTexture: new THREE.Uniform(),
            uAlpha: new THREE.Uniform(0.0),
            uMouse: new THREE.Uniform(new THREE.Vector2(-10.0, 10.0))
        }

        // console.log(this.uniforms.uMouse)

        this.shaderMaterial = new THREE.ShaderMaterial(
            {
                vertexShader: particlesVertexShader,
                fragmentShader: particlesFragmentShader,

                uniforms: this.uniforms,
               
            }
        )        

        this.setupPoints()

        this.target = null;
        this.compileScene()

    }

    createScene() {
        this.scene = new THREE.Scene() //For now, this scene is for 
        this.camera = new CustomCamera()
        this.scene.add(this.camera.instance)
    }


    setupGeometries(name) {
        this.models[name].scene.traverse((child) => {
            if (child.isMesh) {
                this.geometry = child.geometry
                // console.log(this.geometry)
                return
            }
        })
    }

    populateArrays() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const i = (y * this.size + x)
                const i2 = i * 2

                //normalise 0 -> 1 
                const uvX = (x + 0.5) / this.size
                const uvY = (y + 0.5) / this.size

                this.particlesUvArray[i2 + 0] = uvX
                this.particlesUvArray[i2 + 1] = uvY

                //size
                this.sizesArray[i] = Math.random()
            }
        }
    }

    setupPoints() {
        this.bufferGeometry.setDrawRange(0, this.count)
        this.bufferGeometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(this.particlesUvArray, 2))
        this.bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizesArray, 1))
        

        this.points = new THREE.Points(this.bufferGeometry, this.shaderMaterial)
        this.points.scale.set(0.20, 0.20, 0.20)
        this.points.frustumCulled = false

        this.points.renderOrder = 0
        this.points.position.set(0, 0, 0)
        this.scene.add(this.points)
    }

    //Call these in the WebGL function

    compileScene() {
        // Set this.target
        const type = ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType;

        Setup.renderer.compile(this.scene, this.camera.instance)
        this.target = new THREE.WebGLRenderTarget(Setup.width, Setup.height, 
            {   
                type: type
            }
        )

        console.log(this.target)
    }

    targetResize() {
        this.target.setSize(Setup.width, Setup.height)
    }

    resize () {
        this.targetResize()
        this.camera.resize()
        this.shaderMaterial.uniforms.uResolution.value.set(Setup.width * Setup.pixelRatio, Setup.height * Setup.pixelRatio)
    }


    targetSwap() {
        Setup.renderer.setRenderTarget(this.target)
        Setup.renderer.render(this.scene, this.camera.instance)
        
    }

    render() { 
        Setup.renderer.setRenderTarget(null) //cleanup
        Setup.renderer.render(this.scene, this.camera.instance)


    }


    update () {
        this.gpgpu.update()
        this.shaderMaterial.uniforms.uParticlesTexture.value = this.gpgpu.instance.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture
        this.shaderMaterial.uniforms.uTime.value = Setup.uniformElapsed

        //uMouse coordinates
        this.shaderMaterial.uniforms.uMouse.value.x = Mouse.coords_trail.x
        this.shaderMaterial.uniforms.uMouse.value.y = Mouse.coords_trail.y


        //Rotations with Mouse coordinates
        this.points.rotation.x = -Mouse.coords_trail.y * 0.25 + Math.PI/16
        this.points.rotation.y = Mouse.coords_trail.x * 0.225

        //Slight Rotation with time
        this.points.rotation.x += 0.05 * Math.sin(this.points.rotation.y + Setup.uniformElapsed*0.4 )
        // this.targetSwap()
        // this.render() //uncommnt this if I'm going to render it directly
    }
}

export default Particles