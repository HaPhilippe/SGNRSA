
import { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
const NotFound = lazy(() => import("../pages/home/NotFound"));
import SlimTopLoading from "../components/app/SlimTopLoading";
import administration_routes from "./admin/administration_routes";

import utilisateurswb_routes from "./rapport_stage/utilisateurswb_routes";
import Homepage from "../pages/utilisateurs/Homepage";
import rapport_routes from "./rapport_stage/rapport_routes";


export default function RoutesProvider() {
  return (
    <Suspense fallback={<SlimTopLoading />}>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        {administration_routes}
        {rapport_routes}
        {utilisateurswb_routes}
        <Route Component={NotFound} path="*" />
      </Routes>
    </Suspense>
  )
}