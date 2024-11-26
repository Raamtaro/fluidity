import ShaderPass from "../ShaderPass.js";

import pressure_frag from '../../../shaders/fragment/pressure.glsl'
import face_vert from '../../../shaders/vertex/face.glsl'

export default class Pressure extends ShaderPass{
    constructor(simProps){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: pressure_frag,
                uniforms: {
                    boundarySpace: {
                        value: simProps.boundarySpace
                    },
                    pressure: {
                        value: simProps.src_p.texture
                    },
                    velocity: {
                        value: simProps.src_v.texture
                    },
                    px: {
                        value: simProps.cellScale
                    },
                    dt: {
                        value: simProps.dt
                    }
                }
            },
            output: simProps.dst
        });

        this.init();
    }

    update({vel, pressure}){
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
        super.update();
    }
    
}