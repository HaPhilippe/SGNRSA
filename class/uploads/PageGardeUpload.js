const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS");
const Upload = require("../Upload");
const path = require('path')

class PageGardeUpload extends Upload {
    constructor() {
        super()
        this.destinationPath = path.resolve('./') + path.sep + 'public' + IMAGES_DESTINATIONS.pagegarde
    }
}
module.exports = PageGardeUpload