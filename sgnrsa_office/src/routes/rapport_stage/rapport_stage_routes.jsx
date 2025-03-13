import { lazy } from "react";
import { Route } from "react-router-dom";


const Faculte_departements_list_page = lazy(() => import("../../pages/faculte_departements/Faculte_departements_list_page"));
const Faculte_departements_add_page = lazy(() => import("../../pages/faculte_departements/Faculte_departements_ad_page"));
const Departements_edit_page = lazy(() => import("../../pages/faculte_departements/Departement_edit_page"));
const Faculte_edit_page = lazy(() => import("../../pages/faculte_departements/Faculte_edit_page"));

export const rapport_stage_routes_items = {
 
  facultedep: {
    path: "facultedep",
    name: "Liste facultes",
    component: Faculte_departements_list_page
  },
  add_facultedep: {
    path: "facultedepartement/add",
    name: "Nouvelle faculte",
    component: Faculte_departements_add_page
  },
  edit_departement: {
    path: "departements/edit/:ID_DEPARTEMENT",
    name: "Modifier le deprtement",
    component: Departements_edit_page
  },
  edit_faculte: {
    path: "faculte/edit/:ID_FAC",
    name: "Modifier la faculte",
    component: Faculte_edit_page
  },
}
var rapport_stage_routes = []
for (let key in rapport_stage_routes_items) {
  const route = rapport_stage_routes_items[key]
  rapport_stage_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default rapport_stage_routes