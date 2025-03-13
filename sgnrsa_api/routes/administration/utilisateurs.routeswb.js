const express = require('express')
const utilisateurs_controllerwb=require('../../controllers/administration/utilisateurs/utilisateurs.controllerwb')
const utiliteurswb_routes = express.Router()
utiliteurswb_routes.post("/create", utilisateurs_controllerwb.createUserweb)
// utiliteurs_routes.get("/fetch", utilisateurs_controller.findAll)
utiliteurswb_routes.get("/find/:ID_UTILISATEURWB", utilisateurs_controllerwb.findOneUtilisateurwb)
// utiliteurs_routes.post("/detele_utilisateurs", utilisateurs_controller.deleteItems)
// utiliteurs_routes.put("/update/:ID_UTILISATEUR", utilisateurs_controller.updateUtil)
// utiliteurs_routes.get("/profile", utilisateurs_controller.profileliste)
// utiliteurs_routes.put("/change_statuts/:ID_UTILISATEUR", utilisateurs_controller.change_status)
 
module.exports = utiliteurswb_routes;