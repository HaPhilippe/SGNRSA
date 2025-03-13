import { Suspense, lazy } from "react";
import {
          Route,
          Routes
} from "react-router-dom";
import welcome_routes from "./welcome/welcome_routes";
import LoginPage from "../pages/welcome/LoginPage";

const NotFound = lazy(()=>import("../pages/home/NotFound"));
import SlimTopLoading from "../components/app/SlimTopLoading";
import utilisateurswb_routes from "./rapport_stage/utilisateurswb_routes";
import Homepage from "../pages/utilisateurs/Homepage";
import login_routes from "./welcome/welcome_routes";



export default function WelcomeRoutesProvider () {
          return (
                    <Suspense fallback={<SlimTopLoading />}>
                              <Routes>

                                        <Route path="/" element={<Homepage />} />||
                                        {/* <Route path="/log" element={<LoginPage2/>} /> */}
                                        {/* {welcome_routes} */}
                                        {utilisateurswb_routes}
                                        {/* {login_routes} */}
                                       
                                        <Route Component={NotFound} path="*" />
                              </Routes>
                    </Suspense>
          )
}