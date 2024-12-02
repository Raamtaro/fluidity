import * as THREE from 'three'

class Setup {
    constructor() {
        this.width = null
        this.height = null
        this.aspect = this.width / this.height;

        this.fboWidth = null;
        this.fboHeight = null;



        //Time
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16


    }

    init() {
        this.pixelRatio = window.devicePixelRatio

        this.resize()

        this.renderer = new THREE.WebGLRenderer(
            {
                antialias: true,
                alpha: true
            }
        )

        

        this.renderer.autoClear = false;

        this.renderer.setSize(this.width, this.height)

        this.renderer.setClearColor(0x000000)
        this.renderer.setPixelRatio(this.pixelRatio)

        // I think that I probably shouldn't need this
        // this.clock = new THREE.Clock()
        // this.clock.start();
    }

    resize(){
        this.width = window.innerWidth; // document.body.clientWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;

        if(this.renderer) this.renderer.setSize(this.width, this.height);

        // console.log(this.renderer)
    }

    update(){
        const currentTime = Date.now()

        this.delta = currentTime - this.current 
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.uniformElapsed = this.elapsed/1000 //Second conversion
        this.uniformDelta = this.delta/1000 //Second conversion
    }
    
}

export default new Setup()