import Setup from "../Common/Setup.js";
import * as THREE from 'three'

import ExternalForce from "./FBOPasses/NavierTerms/ExternalForce.js";

export default class Simulation {
    constructor(props) {
        this.props = props

        this.fbos = {
            vel_0: null,
            vel_1: null,

            vel_viscous0: null,
            vel_viscous1: null,

            div: null,

            pressure_0: null,
            pressure_1: null,
        };

        this.options = {
            iterations_poisson: 32,
            iterations_viscous: 32,
            mouse_force: 174,
            resolution: 0.5,
            cursor_size: 20,
            viscous: 30,
            isBounce: false,
            dt: 0.005,
            isViscous: true,
            BFECC: true
        };

        this.fboSize = new THREE.Vector2();
        this.cellScale = new THREE.Vector2();
        this.boundarySpace = new THREE.Vector2();

        this.init()
    }

    init() {
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
    }

    createAllFBO() {
        const type = ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType;

        for(let key in this.fbos){
            this.fbos[key] = new THREE.WebGLRenderTarget(
                this.fboSize.x,
                this.fboSize.y,
                {
                    type: type
                }
            )
        }
    }

    createShaderPass() {
        this.externalForce = new ExternalForce(
            {
                cellScale: this.cellScale,
                cursor_size: this.options.cursor_size,
                dst: this.fbos.vel_1
            }
        )
    }

    calcSize(){
        const width = Math.round(this.options.resolution * Setup.width);
        const height = Math.round(this.options.resolution * Setup.height);

        const px_x = 1.0 / width;
        const px_y = 1.0 / height;

        this.cellScale.set(px_x, px_y);
        this.fboSize.set(width, height);
    }

    resize(){
        this.calcSize();

        for(let key in this.fbos){
            this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
        }
    }

    update() {

        this.externalForce.update({
            cursor_size: this.options.cursor_size,
            mouse_force: this.options.mouse_force,
            cellScale: this.cellScale
        });

        console.log(this.fbos.vel_1.texture.uuid)
    }
}