const express = require('express')
const etudiantcontroller=require('../../controllers/rapport_stage/Etudiant/etudiant.controller')
const etudiant_routes = express.Router()
etudiant_routes.post("/create", etudiantcontroller.createetudiant);
etudiant_routes.get("/fetch", etudiantcontroller.findAll);
etudiant_routes.get("/find/:ID_ETUD", etudiantcontroller.findOneetudiant);
etudiant_routes.put("/update/:ID_ETUD", etudiantcontroller.updateetudiant);
etudiant_routes.post("/delete", etudiantcontroller.deleteItems);
module.exports = etudiant_routes;