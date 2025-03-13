const express = require('express')
const utilisateurs_routes = require('./utilisateurs.routes')
const profile_routes = require('./profiles.routes')
const authRouter = require('./authRouter')
const sessionsutilisaturs_routes = require('./sessionsutilisateurs.routes')
const utiliteurswb_routes = require('./utilisateurs.routeswb')
const authRouterSite = require('./authRouterSite')

const administrationRouter = express.Router()

administrationRouter.use('/utilisateurs', utilisateurs_routes)
administrationRouter.use('/profile', profile_routes)
administrationRouter.use('/auth', authRouter)
administrationRouter.use('/authsite', authRouterSite)
administrationRouter.use('/sessionsusers', sessionsutilisaturs_routes)
administrationRouter.use('/utilisateursweb', utiliteurswb_routes)

module.exports = administrationRouter