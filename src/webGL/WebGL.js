// import * as THREE from 'three'
import Setup from "./Common/Setup.js";
import Mouse from "./Common/Mouse.js";
import Particles from "./FlowField/Particles.js";
import Output from "./Output.js";


import Resources from "../utils/resources.js";
import sources from '../utils/data/sources.js'


export default class WebGL {
    constructor(props) {
        this.props = props

        Setup.init()
        Mouse.init()

        // this.init()
        // this.loop()


        //init() and loop() have been added to the startup function
        //These should only fire after the resources have loaded
        this.resources = new Resources(sources)
        this.resources.on('ready', this.startup.bind(this))

        window.addEventListener('resize', this.resize.bind(this))
    }


    init() {    
        //Initialize common properties and set up canvas

        this.props.$wrapper.prepend(Setup.renderer.domElement);
        this.particles = new Particles(this.resources.items)



        this.output = new Output(this.resources.items)
    }

    render() {
        //Update WebGL innards
        Mouse.update()
        Setup.update()
        this.particles.update() //This is a debug statement to see if the particle scene works
        this.output.update()
        // console.log('rendering')
    }

    resize() {
        Setup.resize()
        this.particles.resize()
        this.output.resize()

    }

    loop() {
        this.render()
        requestAnimationFrame(this.loop.bind(this))
    }

    startup() {
        this.init()
        this.loop()
    }
}