const express = require('express')
const authwb_controller = require('../../controllers/administration/auth_utilisateur.controller')

const authRouterSite = express.Router()
authRouterSite.post('/loginuser', authwb_controller.loginuser)
authRouterSite.delete('/logout', authwb_controller.logout)
authRouterSite.post('/access_token', authwb_controller.getNewAccessToken)

module.exports = authRouterSite
