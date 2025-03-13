const express = require('express')
const faculte_departementscontroller=require('../../controllers/rapport_stage/faculte/faculte_departements.controller')
const faculte_departements_routes = express.Router()
faculte_departements_routes.post("/create", faculte_departementscontroller.createFaculte_departements)
faculte_departements_routes.get("/fetch", faculte_departementscontroller.findAll)


module.exports = faculte_departements_routes;