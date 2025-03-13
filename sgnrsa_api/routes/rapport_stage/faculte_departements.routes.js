const express = require('express')
const faculte_departementscontroller=require('../../controllers/rapport_stage/faculte/faculte_departements.controller')
const faculte_departements_routes = express.Router()
faculte_departements_routes.post("/create", faculte_departementscontroller.createFaculte_departements)
faculte_departements_routes.get("/fetch", faculte_departementscontroller.findAll),
faculte_departements_routes.get("/finddep/:ID_DEPARTEMENT", faculte_departementscontroller.findOneDeparement),
faculte_departements_routes.get("/findfac/:ID_FAC", faculte_departementscontroller.findOneFaculte),
faculte_departements_routes.put("/updatedep/:ID_DEPARTEMENT", faculte_departementscontroller.updateDepartement);
faculte_departements_routes.put("/updatefac/:ID_FAC", faculte_departementscontroller.updateFaculte);
faculte_departements_routes.post("/delete", faculte_departementscontroller.deleteItems);

module.exports = faculte_departements_routes;