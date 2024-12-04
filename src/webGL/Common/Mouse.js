import * as THREE from "three"
import Setup from "./Setup.js"

class Mouse {
    constructor(){
        this.mouseMoved = false;
        this.coords = new THREE.Vector2()
        this.coords_old = new THREE.Vector2()
        this.coords_trail = new THREE.Vector2()
        this.diff = new THREE.Vector2();
        this.timer = null;

        this.velocity = 0
        this.targetVelocity = 0
        this.ease = 0.0125

        // this.count = 0;
    }

    init(){
        document.body.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
        document.body.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );
        document.body.addEventListener( 'touchmove', this.onDocumentTouchMove.bind(this), false );
    }

    setCoords( x, y ) {

        //Goes with approaches #2 and/or #3

        // if(this.timer) clearTimeout(this.timer);
        // this.coords.set( ( x / Setup.width ) * 2 - 1, - ( y / Setup.height ) * 2 + 1 );
        // this.mouseMoved = true;
        // this.timer = setTimeout(() => {
        //     this.mouseMoved = false;
        // }, 100);
        
        // console.log('Current', this.coords.y)

        this.coords.x = (x / Setup.width) * 2 - 1;
        this.coords.y = -(y / Setup.height) * 2 + 1;

    }

    onDocumentMouseMove( event ) {
        this.setCoords( event.clientX, event.clientY );
    }

    onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {
            // event.preventDefault();
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }
    onDocumentTouchMove( event ) {
        if ( event.touches.length === 1 ) {
            // event.preventDefault();
            
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    update(){

        //Velocity is functioning nominally.
        this.velocity = Math.sqrt( (this.coords_old.x - this.coords.x)**2 + (this.coords_old.y - this.coords.y)**2)
        this.targetVelocity -= this.ease * (this.targetVelocity - this.velocity)


        //Approach #1

        // this.coords_trail.x -= this.ease * (this.coords_trail.x - this.coords.x)
        // this.coords_trail.y -= this.ease * (this.coords_trail.y - this.coords.y)

        // this.diff.subVectors(this.coords, this.coords_old);

        // this.coords_old.x = this.coords.x
        // this.coords_old.y = this.coords.y


        //Approach #2
        this.coords_trail.lerp(this.coords, this.ease)
        this.diff.subVectors(this.coords, this.coords_old)
        this.coords_old.copy(this.coords);

        // console.log('Trail', this.coords_trail.y)


        //Approach #3
        // if (this.mouseMoved) {
        //     this.velocity = Math.sqrt(
        //         (this.coords_old.x - this.coords.x) ** 2 +
        //         (this.coords_old.y - this.coords.y) ** 2
        //     );
        //     this.targetVelocity -= this.ease * (this.targetVelocity - this.velocity);
    
        //     this.coords_trail.lerp(this.coords, this.ease);
    
        //     this.diff.subVectors(this.coords, this.coords_old);
        //     this.coords_old.copy(this.coords);
        // } else {
        //     this.coords_trail.lerp(this.coords, this.ease);
        // }

        // if(this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
    }
}

export default new Mouse()