import { lazy } from "react";
import { Route } from "react-router-dom";


const Encadrant_list_page = lazy(() => import("../../pages/encadrant/Encadrant_list_page"));
const Encadrant_add_page = lazy(() => import("../../pages/encadrant/Encadrant_ad_page"));
const Encadrant_edit_page = lazy(() => import("../../pages/encadrant/Encadrant_edit_page"));
 
export const encadrant_routes_items = {
 
  encadrant: {
    path: "encadrant",
    name: "Liste des encadrants",
    component: Encadrant_list_page
  },
  add_encadrant: {
    path: "encadrant/add",
    name: "Nouveau encadrant",
    component: Encadrant_add_page
  },
  edit_encadrant: {
    path: "encadrant/edit/:ID_ENCA",
    name: "Modifiers encadrant",
    component: Encadrant_edit_page
  },
}
var  encadrant_routes = []
for (let key in encadrant_routes_items) {
  const route = encadrant_routes_items[key]
  encadrant_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default encadrant_routes