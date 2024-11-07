const express = require('express')
const faculte_departements_routes = require('./faculte_departements.routes');
const entreprise_routes = require('./entreprise');
const encadrant_routes = require('./encadrant.router');
const etudiant_routes = require('./etudiant.router');
const rapport_routes = require('./rapport.router');
const contact_routes = require('./contact.router');

const rapport_stageRouter = express.Router()
rapport_stageRouter.use('/faculte_depar', faculte_departements_routes);
rapport_stageRouter.use('/entreprise', entreprise_routes);
rapport_stageRouter.use('/encadrant', encadrant_routes);
rapport_stageRouter.use('/etudiant', etudiant_routes);
rapport_stageRouter.use('/rapport', rapport_routes);
rapport_stageRouter.use('/createcompte', rapport_routes);
rapport_stageRouter.use('/contact', contact_routes);

module.exports = rapport_stageRouter