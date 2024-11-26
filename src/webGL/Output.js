import Setup from "./Common/Setup.js";
import * as THREE from "three";

import Simulation from "./StableFluidSimulation/SImulation.js";


import face_vert from './shaders/vertex/face.glsl'
import color_frag from './shaders/fragment/color.glsl'



export default class Output{
    constructor(){
        this.init()
    }

    init() {
        this.simulation = new Simulation()

        this.scene = new THREE.Scene()
        this.camera = new THREE.Camera()

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
                        }
                    }
                }
            )
        )

        this.scene.add(this.output);

        this.debugQuad = new THREE.Mesh(
            new THREE.PlaneGeometry(.5, .5),
            new THREE.MeshBasicMaterial({ map: this.simulation.fbos.vel_1.texture })
          );
        this.debugQuad.position.set(-0.75, 0.75, 0); 

        // this.debugQuad.visible = false
        this.scene.add(this.debugQuad);
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