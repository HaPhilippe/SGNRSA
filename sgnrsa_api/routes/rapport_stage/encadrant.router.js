const express = require('express')
const encadrantcontroller=require('../../controllers/rapport_stage/Encadrant/encadrant.controller')
const encadrant_routes = express.Router()
encadrant_routes.post("/create", encadrantcontroller.createencadrant);
encadrant_routes.get("/fetch", encadrantcontroller.findAll);
encadrant_routes.get("/find/:ID_ENCA", encadrantcontroller.findOneencadrant);
encadrant_routes.put("/update/:ID_ENCA", encadrantcontroller.updateencadrant);
encadrant_routes.post("/delete", encadrantcontroller.deleteItems);
module.exports = encadrant_routes;