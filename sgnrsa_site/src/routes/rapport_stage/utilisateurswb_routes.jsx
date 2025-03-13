import { lazy } from "react";
import { Route } from "react-router-dom";

const Utilisateurswb_list_page = lazy(() => import("../../pages/utilisateurs/Utilisateurwb_liste_page"));
const Utilisateur_edit_page = lazy(() => import("../../pages/utilisateurs/Utilisateur_edit_page"));
const Utilisateurswb_add_page = lazy(() => import("../../pages/utilisateurs/Utilisateurwb_add_page"));
const Homepage= lazy(() => import("../../pages/utilisateurs/Homepage"));
const Contact_page = lazy(() => import("../../pages/utilisateurs/Contactpage"));
const Aboutpage= lazy(() => import("../../pages/utilisateurs/Aboutpage"));
const Loginpage=lazy(()=>import("../../pages/welcome/LoginPage"));
const Utilisateurswb_descri_page = lazy(() => import("../../pages/utilisateurs/Rapportwb_description_page"));

export const utilisateurswb_routes_items = {

  utilisateurswb: {
    path: "utilisateurswb",
    name: "Liste des utilisateurs",
    component: Utilisateurswb_list_page
  },
  add_utilisateurswb: {
    path: "utilisateurswb/add",
    name: "+ un utilisateur",
    component: Utilisateurswb_add_page
  },
  utilisateurswb_edit: {
    path: "utilisateurswb/edit/:ID_UTILISATEURWB",
    name: "Modifier l'utilisateur",
    component: Utilisateur_edit_page
  },
  rapport:{
    path: "pdfviewer/:ID_RAPPORT",
    name: "Lire le rapport",
    component: Utilisateurswb_descri_page
  },
  home:{
    path: "welcome",
    name: "Bienvenu sur notre site",
    component: Homepage
  },
  contact:{
    path: "contact",
    name: "Contact",
    component: Contact_page
  }
  ,
  about:{
    path: "about",
    name: "A propos",
    component: Aboutpage
  },
  login: {
    path: "login",
    name: "Connexion",
    component: Loginpage
}

}
var utilisateurswb_routes = []
for (let key in utilisateurswb_routes_items) {
  const route = utilisateurswb_routes_items[key]
  utilisateurswb_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default utilisateurswb_routes