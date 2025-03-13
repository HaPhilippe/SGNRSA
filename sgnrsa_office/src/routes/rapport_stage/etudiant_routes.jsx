import { lazy } from "react";
import { Route } from "react-router-dom";


const Etudiant_list_page = lazy(() => import("../../pages/etudiant/Etudiant_list_page"));
const Etudiant_add_page = lazy(() => import("../../pages/etudiant/Etudiant_ad_page"));
const Etudiant_edit_page = lazy(() => import("../../pages/etudiant/Etudiant_edit_page"));
 

export const etudiant_routes_items = {
 
  etudiant: {
    path: "etudiant",
    name: "Liste des etudiants",
    component: Etudiant_list_page
  },
  add_etudiant: {
    path: "etudiant/add",
    name: "Nouveau etudiant",
    component: Etudiant_add_page
  },
  edit_etudiant: {
    path: "etudiant/edit/:ID_ETUD",
    name: "Modifier etudiant",
    component: Etudiant_edit_page
  },
}
var etudiant_routes = []
for (let key in etudiant_routes_items) {
  const route = etudiant_routes_items[key]
  etudiant_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default etudiant_routes