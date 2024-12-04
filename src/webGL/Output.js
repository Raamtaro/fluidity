import Setup from "./Common/Setup.js";
import * as THREE from "three";

import Simulation from "./StableFluidSimulation/Simulation.js";
import Particles from "./FlowField/Particles.js";


import face_vert from './shaders/vertex/face.glsl'
import color_frag from './shaders/fragment/color.glsl'



export default class Output{
    constructor(resources){
        this.resources = resources
        this.init()
    }

    init() {
        this.simulation = new Simulation()
        this.scene = new THREE.Scene()
        this.camera = new THREE.Camera()

        // this.particles = new Particles(this.resources)


        this.output = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.RawShaderMaterial(
                {
                    vertexShader: face_vert,
                    fragmentShader: color_frag,
                    uniforms: {
                        velocity: {
                            value: this.simulation.fbos.vel_0.texture
                        },
                        boundarySpace: {
                            value: new THREE.Vector2()
                        },
                        uBaseTexture: new THREE.Uniform(null)
                    },
                    blending: THREE.NoBlending
                }
            )
        )


        console.log(this.output)

        // this.scene.add(this.output);
        // this.output.visible = false

        this.debugQuad = new THREE.Mesh(
            new THREE.PlaneGeometry(.5, .5),
            new THREE.MeshBasicMaterial({ map: this.simulation.fbos.vel_0.texture })
          );
        this.debugQuad.position.set(-0.75, 0.75, 0); 

        // this.debugQuad.visible = false
        // this.scene.add(this.debugQuad);

    }

    
    resize() {
        this.simulation.resize()
        
    }

    render() {
        Setup.renderer.setRenderTarget(null);
        Setup.renderer.render(this.scene, this.camera)
    }

    update() {
        
        this.simulation.update()
        this.render();
    }
}