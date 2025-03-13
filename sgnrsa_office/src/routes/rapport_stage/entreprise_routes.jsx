import { lazy } from "react";
import { Route } from "react-router-dom";


const Entreprise_list_page = lazy(() => import("../../pages/entreprise/Entreprise_list_page"));
const Entreprise_add_page = lazy(() => import("../../pages/entreprise/Entreprise_ad_page"));
const Entreprise_edit_page = lazy(() => import("../../pages/entreprise/Entreprise_edit_page"));

export const entreprise_routes_items = {
 
  entreprise: {
    path: "entreprise",
    name: "Liste des entreprises",
    component: Entreprise_list_page
  },
  add_entreprise: {
    path: "entreprise/add",
    name: "Nouvelle entreprise",
    component: Entreprise_add_page
  },
  edit_entreprise: {
    path: "entreprise/edit/:ID_ENTREPR",
    name: "Modifier entreprise",
    component: Entreprise_edit_page
  }
}

var entreprise_routes = []
for (let key in entreprise_routes_items) {
  const route = entreprise_routes_items[key]
  entreprise_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default entreprise_routes