import { lazy } from "react";
import { Route } from "react-router-dom";



const Utilisateur_liste_page = lazy(() => import("../../pages/utilisateurs/Utilisateurwb_liste_page"));
const Utilisateur_add_page = lazy(() => import("../../pages/utilisateurs/Utilisateurwb_add_page"));
const Utilisateur_edit_page = lazy(() => import("../../pages/utilisateurs/Utilisateur_edit_page"));
const Profil_liste_page = lazy(() => import("../../pages/profil/Profil_liste_page"));
const Profil_add_page = lazy(() => import("../../pages/profil/Profil_add_page"));
const Profil_edit_page = lazy(() => import("../../pages/profil/Profil_edit_page"));
const Session_utilisateur_liste_page = lazy(() => import("../../pages/session/Session_utilisateur_liste_page"));


export const administration_routes_items = {
 
  Sessionutilisateurs: {
    path: "Sessionutilisateurs",
    name: "Sessions des utilisateurs",
    component: Session_utilisateur_liste_page
  },

  utilisateurs: {
    path: "utilisateurs",
    name: "Utilisateurs",
    component: Utilisateur_liste_page
  },
  new_utilisateurs: {
    path: "utilisateurs/new",
    name: "Nouveau utilisateur",
    component: Utilisateur_add_page
  },
  edit_utilisateurs: {
    path: "utilisateurs/edit/:ID_UTILISATEUR",
    name: "Modifier l'utilisateur",
    component: Utilisateur_edit_page
  },
  profil: {
    path: "profil",
    name: "Profil",
    component: Profil_liste_page
  },
  add_profil: {
    path: "profil/add",
    name: "Nouveau profil",
    component: Profil_add_page
  },
  edit_profil: {
    path: "profil/edit/:ID_PROFIL",
    name: "Editer le profil",
    component: Profil_edit_page
  }
}
var administration_routes = []
for (let key in administration_routes_items) {
  const route = administration_routes_items[key]
  administration_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default administration_routes