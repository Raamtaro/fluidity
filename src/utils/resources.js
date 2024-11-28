import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'

import EventEmitter from './eventEmitter.js'

class Resources extends EventEmitter {
    constructor(sources) {
        this.sources = sources

        this.items = {}

        this.toLoad = this.sources.length
        this.loaded = 0


    }

    setLoaders () {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('/draco/')

        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
        
        this.loaders.textureLoader = new THREE.TextureLoader()

        
    }

    async startLoading () {
        const loadPromises = this.sources.map((source) => this.loadResource(source))

        await Promise.all(loadPromises)

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
    
    async loadResource (source) {
        let loader;
        let file;

        // console.log('Intialising loader...')

        switch(source.type) {
            case 'gltfModel':
                loader = this.loaders.gltfLoader
                break

            case 'texture':
                loader = this.loaders.textureLoader
                break
            
            default:
                console.warn(`unknown resource type: ${sources.type}`)
        }

        console.log(`loading resource ${source.name}`)

        try {
            file = await loader.loadAsync(source.path)
            this.sourceLoaded(source, file)
        } catch (error) {
            console.error(`Error loading ${source.name}:`, error)
        }  finally {
            // console.log('done')
        }
    }

    sourceLoaded (source, file) {
        this.items[source.name] = file
        this.loaded++
        // console.log(file)
    }
}

export default Resources