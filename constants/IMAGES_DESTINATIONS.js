const path = require('path')

const IMAGES_DESTINATIONS = {
    utilisateurs: path.sep + 'uploads' + path.sep + 'images' + path.sep + 'utilisateurs',
    etudiant: path.sep + 'uploads' + path.sep + 'images' + path.sep + 'etudiant',
    entreprises: path.sep + 'uploads' + path.sep + 'images' + path.sep + 'entreprises',
    rapport: path.sep + 'uploads' + path.sep + 'pdf' + path.sep + 'rapport',
    attestationpdf: path.sep + 'uploads' + path.sep + 'pdf' + path.sep + 'attestationpdf',
    pagegarde: path.sep + 'uploads' + path.sep + 'images' + path.sep + 'pagegarde',
    fichecotastionpdf: path.sep + 'uploads' + path.sep + 'pdf' + path.sep + 'fichecotastionppdf'
}

module.exports = IMAGES_DESTINATIONS