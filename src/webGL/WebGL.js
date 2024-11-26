// import * as THREE from 'three'
import Setup from "./Common/Setup.js";
import Mouse from "./Common/Mouse.js";
import Output from "./Output.js";

export default class WebGL {
    constructor(props) {
        this.props = props

        Setup.init()
        Mouse.init()

        this.init()
        this.loop()

        window.addEventListener('resize', this.resize.bind(this))
    }

    init() {    
        //Initialize common properties and set up canvas

        this.props.$wrapper.prepend(Setup.renderer.domElement);
        this.output = new Output()
    }

    render() {
        //Update WebGL innards
        Mouse.update()
        Setup.update()
        this.output.update()
        // console.log('rendering')
    }

    resize() {
        Setup.resize()
        this.output.resize()

    }

    loop() {
        this.render()
        requestAnimationFrame(this.loop.bind(this))
    }


}