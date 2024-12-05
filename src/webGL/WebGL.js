// import * as THREE from 'three'
import Setup from "./Common/Setup.js";
import Mouse from "./Common/Mouse.js";
import Particles from "./FlowField/Particles.js";
import Output from "./StableFluidSimulation/Output.js";
import PostScene from "./PostScene.js";


import Resources from "../utils/resources.js";
import sources from '../utils/data/sources.js'


export default class WebGL {
    constructor(props) {
        this.props = props

        Setup.init()
        Mouse.init()

        this.resources = new Resources(sources)
        this.resources.on('ready', this.startup.bind(this))

        window.addEventListener('resize', this.resize.bind(this))
    }


    init() {    
        //Initialize common properties and set up canvas

        this.props.$wrapper.prepend(Setup.renderer.domElement);

        /**
         * Particles and Output should be declared in PostScene
         * Comment after next commit, remove after the subsequent
         */
        //this.final = new PostScene()
        this.particles = new Particles(this.resources.items)
        this.output = new Output(this.resources.items)
    }

    render() {
        //Update WebGL innards
        Mouse.update()
        Setup.update()


        /**
         * These will be moved to the PostScene's update method
         * Comment after next commit, remove after the subsequent
         */
        //this.final.update()
        this.particles.update() 
        this.output.update()
        
    }

    resize() {
        Setup.resize()

        /**
         * These will be moved to the PostScene's resize method
         * Comment after next commit, remove after the subsequent
         */
        //this.final.resize()
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