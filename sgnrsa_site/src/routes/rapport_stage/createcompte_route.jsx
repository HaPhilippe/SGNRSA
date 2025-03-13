import { lazy } from "react";
import { Route } from "react-router-dom";


const Createlogin = lazy(() => import("../../pages/welcome/Createlogin"));
 

export const createcompte_route_items = {
 
  createlogin: {
    path: "createlogin",
    name: "Creer un compte",
    component: Createlogin
  }
}
var createcompte_route = []
for (let key in createcompte_route_items) {
  const route = createcompte_route_items[key]
  createcompte_route.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default createcompte_route