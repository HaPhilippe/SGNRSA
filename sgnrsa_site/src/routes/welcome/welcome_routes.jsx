
// export default welcome_routes

import { lazy } from "react";
import { Route } from "react-router-dom";
const LoginPage = lazy(() => import("../../pages/welcome/LoginPage"));

export const login_routes_items = {
   
    login: {
        path: "login",
        name: "Connexion",
        component: LoginPage
    },
  
    
}
var login_routes = []
for (let key in login_routes_items) {
    const route = login_routes_items[key]
    login_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default login_routes