const express = require('express')
const entreprisecontroller=require('../../controllers/rapport_stage/Entreprise/entreprise.controller')
const entreprise_routes = express.Router()
entreprise_routes.post("/create", entreprisecontroller.createEntreprise);
entreprise_routes.get("/fetch", entreprisecontroller.findAll);
entreprise_routes.get("/find/:ID_ENTREPR", entreprisecontroller.findOneEntreprise);
entreprise_routes.put("/update/:ID_ENTREPR", entreprisecontroller.updateEntreprise);
entreprise_routes.post("/delete", entreprisecontroller.deleteItems);
module.exports = entreprise_routes;