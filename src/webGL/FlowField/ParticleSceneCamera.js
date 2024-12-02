import * as THREE from 'three'
import Setup from '../Common/Setup.js'


class CustomCamera {
    constructor() {
        this.instance = new THREE.PerspectiveCamera(35, Setup.aspect, .1, 1000)
        this.config()
    }

    config() {
        this.instance.position.set(0, 0, 6)
        this.instance.lookAt(0, 0, 0)
    }

    resize() {
        this.instance.aspect = Setup.aspect
        this.instance.updateProjectionMatrix()
    }
}

export default CustomCamera