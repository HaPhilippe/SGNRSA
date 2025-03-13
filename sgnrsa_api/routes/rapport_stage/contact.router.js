const express = require('express')
const contactcontroller=require('../../controllers/rapport_stage/Contact/contact.controller')
const contact_routes = express.Router()
contact_routes.post("/create", contactcontroller.createcontact);
contact_routes.get("/fetch", contactcontroller.findAll);
contact_routes.get("/find/:ID_CONTACT", contactcontroller.findOnecontact);
contact_routes.put("/update/:ID_CONTACT", contactcontroller.updatecontact);
contact_routes.post("/delete", contactcontroller.deleteItems);
module.exports = contact_routes;