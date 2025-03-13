const express = require('express')
const rapportcontroller=require('../../controllers/rapport_stage/Rapport/rapport.controller')
const rapport_routes = express.Router()
rapport_routes.post("/create", rapportcontroller.createrapport);
rapport_routes.get("/fetch", rapportcontroller.findAll);
rapport_routes.get("/find/:ID_RAPPORT", rapportcontroller.findOnerapport);
rapport_routes.put("/update/:ID_RAPPORT", rapportcontroller.updaterapport);
rapport_routes.post("/delete", rapportcontroller.deleteItems);
module.exports = rapport_routes;