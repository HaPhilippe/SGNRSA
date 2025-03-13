
import { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
const NotFound = lazy(() => import("../pages/home/NotFound"));
import SlimTopLoading from "../components/app/SlimTopLoading";
import administration_routes from "./admin/administration_routes";
import rapport_stage_routes from "./rapport_stage/rapport_stage_routes";
import entreprise_routes from "./rapport_stage/entreprise_routes";
import etudiant_routes from "./rapport_stage/etudiant_routes";
import rapport_routes from "./rapport_stage/rapport_routes";
import encadrant_routes from "./rapport_stage/encadrant_routes";

export default function RoutesProvider() {
  return (
    <Suspense fallback={<SlimTopLoading />}>
      <Routes>
        <Route path="/" element={<RootPage/>}></Route>
        {administration_routes}
        {rapport_stage_routes}
        {entreprise_routes}
        {encadrant_routes}
        {etudiant_routes}
        {rapport_routes}
        

        
        <Route Component={NotFound} path="*" />
      </Routes>
    </Suspense>
  )
}