import { lazy } from "react";
import { Route } from "react-router-dom";

const Rapports_liste_page = lazy(() => import("../../pages/rapport/Rapports_liste_page"));
const Rapport_add_page = lazy(() => import("../../pages/rapport/Rapport_ad_page"));
const PdfViewer = lazy(() => import("../../pages/rapport/PdfViewer"));
const PdfViewerRapport = lazy(() => import("../../pages/rapport/PdfViewerRapport"));
const Rapportdescription = lazy(() => import("../../pages/utilisateurs/Rapportwb_description_page"));
 
export const rapport_routes_items = {
 
  rapport: {
    path: "rapport",
    name: "Liste des rapports",
    component: Rapports_liste_page
  },
  rapportdesc: {
    path: "rapportdesc",
    name: "Description",
    component: Rapportdescription
  },
  add_rapport: {
    path: "rapport/add",
    name: "Nouveau rapport",
    component: Rapport_add_page
  },
  pdfviewer:{
    path:'pdfviewer/:ID_RAPPORT',
    name:'Lecture du pdf',
    component:PdfViewer
  },
  pdfviewerrapport:{
    path:'pdfviewer',
    name:'Lecture du rapport',
    component:PdfViewerRapport
  }
}
var rapport_routes = []
for (let key in rapport_routes_items) {
  const route = rapport_routes_items[key]
  rapport_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}

export default rapport_routes