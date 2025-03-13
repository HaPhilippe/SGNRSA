// import { Link, Outlet } from "react-router-dom";
// import { Skeleton } from 'primereact/skeleton';
// import DashboardSkeletons from "../../components/skeletons/DashboardSkeletons";
// import HomeSkeletons from "../../components/skeletons/HomeSkeletons";
// import AsideSkeletons from "../../components/skeletons/AsideSkeletons";

// import React, { useState, useEffect, useRef } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Tag } from 'primereact/tag';
// import { CustomerService } from "../home/service/CustomerService";

// import { InputText } from 'primereact/inputtext';
// import { InputNumber } from 'primereact/inputnumber';
// import { Dropdown } from 'primereact/dropdown';
// import { ProductService } from '../home/service/ProductService';
// import fetchApi from "../../helpers/fetchApi";
// import { Toast } from "primereact/toast";
// import { Button } from "primereact/button";


// import { Panel } from 'primereact/panel';
// import { Avatar } from "primereact/avatar";
// import { Menu } from "primereact/menu";
// import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { setBreadCrumbItemsAction, setToastAction, } from "../../store/actions/appActions";
// import { rapport_routes_items } from "../../routes/rapport_stage/rapport_routes";
// import { Dialog } from 'primereact/dialog';
// import { useNavigate, useParams } from "react-router-dom";
// import { useForm } from "../../hooks/useForm";
// import { Card } from 'primereact/card';
// import 'primereact/resources/themes/saga-blue/theme.css'; // Thème de PrimeReact
// import 'primereact/resources/primereact.min.css'; // CSS de PrimeReact
// import 'primeicons/primeicons.css'; // Icônes de PrimeReact
// import moment from "moment";
// import './pdfStyles.css'; // Importez votre fichier CSS ici



// const initialForm = {
//     // NUMERO_COMMANDE_MP: "",
//     // QUANTITE: "",
//     // ID_CATEGORIES_PRODUITS: null,
//     // IMAGE: null,
//     // NOM_CATEGORIES_PRODUITS: ''


// };
// // location
// // export default function PdfViewer({  }) {
// //     const dispacth = useDispatch();
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const id = urlParams.get('id');
// //     const { ID_RAPPORT } = useParams();
// //     const [oneRapport, setOneRapport] = useState([]);
// //     // console.log(oneRapport);

// //     const [loadingRapport, setLoadingRapport] = useState(true);
// //     const [data, handleChange, setData, setValue] = useForm(initialForm);


// //     // Définir la locale française
// //     moment.updateLocale('fr', {
// //         relativeTime: {
// //             future: "dans %s",
// //             past: "il y a %s",
// //             s: "quelques secondes",
// //             ss: "%d secondes",
// //             m: "une minute",
// //             mm: "%d minutes",
// //             h: "une heure",
// //             hh: "%d heures",
// //             d: "un jour",
// //             dd: "%d jours",
// //             M: "un mois",
// //             MM: "%d mois",
// //             y: "un an",
// //             yy: "%d ans"
// //         }
// //     });

// //     //pdf
// //     const [showPdf, setShowPdf] = useState(false);

// //     // Assurez-vous que l'URL du PDF est correctement formatée
// //     const pdfUrl = oneRapport?.RAPPORT_PDF;

// //     const togglePdf = () => setShowPdf(prev => !prev);








// //     // 

// //     //    return console.log(ID_RAPPORT,'ID_RAPPORT');

// //     //Afficher le rapport récupéré par id
// //     const Findonerapport = useCallback(async () => {
// //         try {
// //             setLoadingRapport(true);
// //             const baseurl = id ? `/rapport_stage/rapport/find/${id}` : `/rapport_stage/rapport/find/${ID_RAPPORT}`;

// //             var url = await fetchApi(baseurl);
// //             const res = url
// //             const onerapport = res.result;
// //             setOneRapport(onerapport);

// //             //   setData({
// //             //     NUMERO_COMAND_CLIENT: cmde.NUMERO_COMAND_CLIENT,
// //             //     ID_CLIENT: { name: cmde.fournisseurs.NOM_ENTITE, code: cmde.fournisseurs.ID_CLIENT },
// //             //     DATE_INSERTION: new Date(cmde.DATE_INSERTION)
// //             //   });

// //         } catch (error) {
// //             console.log(error);
// //         } finally {
// //             setLoadingRapport(false);
// //         }
// //     }, [id, ID_RAPPORT]);

// //     useEffect(() => {
// //         Findonerapport()
// //     }, [id, ID_RAPPORT])









// //     return (
// //         <>
// //             <div className="px-1 py-1 main_content">
// //                 <div className="p-m-1">
// //                     <div class="row">
// //                         {/* <div class="col-sm-4">
// //                             <div className="card-container">
// //                                 <Card>
// //                                     <div className="flex align-items-center gap-2">

// //                                         <Avatar image={oneRapport?.etudiant?.PROFIL} size="large" shape="circle" />

// //                                     </div>
// //                                     <h5 className="p-card-title"> <span className="font-bold">{oneRapport?.etudiant?.PRENOM} {oneRapport?.etudiant?.NOM}</span></h5>


// //                                     {/* <p className="p-card-text">

// //                                         {oneRapport?.etudiant?.GENRE == 1 ?

// //                                             <span>Etudiant travaillé</span> :
// //                                             'Etudiante travaillée'} sur le sujet ''{oneRapport?.SUJET}''<br />
// //                                         En date du {moment(oneRapport.DATE_DEBUT).format("DD/MM/YYYY")} jusqu'au {moment(oneRapport.DATE_FIN).format("DD/MM/YYYY")} <br />
// //                                         Au sein de {oneRapport?.entreprise?.NOM_ENTREPR} dans le secteur {oneRapport?.entreprise?.SECTEUR}<br />
// //                                         localisée à {oneRapport?.entreprise?.ADRESSE_ENTREPR}.<br />
// //                                         {oneRapport?.etudiant?.GENRE == 1 ?

// //                                             <span>Il a été encadré par le tuteur {oneRapport?.entreprise?.NOM_TUT} {oneRapport?.entreprise?.PRENOM_TUT} dans cette entreprise.</span>
// //                                             : <span>Elle a été encadrée par le tuteur {oneRapport?.entreprise?.NOM_TUT} {oneRapport?.entreprise?.PRENOM_TUT} dans cette entreprise.</span>}


// //                                         <span> Son rapport est déposé dans le bibliothèque de l'Univeristé du Lac Tanganyika au {moment(oneRapport.DATE_INSERTION).format("DD/MM/YYYY")}

// //                                             , {oneRapport?.DATE_INSERTION ? ` ${moment(oneRapport.DATE_INSERTION).fromNow()}` : 'aucune date disponible'}

// //                                             .</span><br /><br />

// //                                         <span> Sur une note de {oneRapport?.NOTE_EVALUATION} pts.
// //                                             {oneRapport?.etudiant?.GENRE == 1 ?
// //                                                 <span>En revenche,il a bien réussi</span>
// //                                                 :
// //                                                 <span>En revenche,elle a bien réussié</span>
// //                                             }

// //                                         </span>

// //                                     </p> */}
// //                         <p className="p-card-text">
// //                             {oneRapport?.etudiant?.GENRE === 1 ? (
// //                                 <span>Étudiant travaillé</span>
// //                             ) : (
// //                                 <span>Étudiante travaillée</span>
// //                             )} sur le sujet &quot;{oneRapport?.SUJET}&quot;<br />
// //                             En date du {moment(oneRapport.DATE_DEBUT).format("DD/MM/YYYY")} jusqu'au {moment(oneRapport.DATE_FIN).format("DD/MM/YYYY")} <br />
// //                             Au sein de {oneRapport?.entreprise?.NOM_ENTREPR} dans le secteur {oneRapport?.entreprise?.SECTEUR}<br />
// //                             Localisée à {oneRapport?.entreprise?.ADRESSE_ENTREPR}.<br />
// //                             {oneRapport?.etudiant?.GENRE === 1 ? (
// //                                 <span>Il a été encadré par le tuteur {oneRapport?.entreprise?.NOM_TUT} {oneRapport?.entreprise?.PRENOM_TUT} dans cette entreprise.</span>
// //                             ) : (
// //                                 <span>Elle a été encadrée par le tuteur {oneRapport?.entreprise?.NOM_TUT} {oneRapport?.entreprise?.PRENOM_TUT} dans cette entreprise.</span>
// //                             )}

// //                             <span> Son rapport est déposé dans la bibliothèque de l'Université du Lac Tanganyika au {moment(oneRapport.DATE_INSERTION).format("DD/MM/YYYY")}
// //                                 , {oneRapport?.DATE_INSERTION ? ` ${moment(oneRapport.DATE_INSERTION).fromNow()}` : 'aucune date disponible'}
// //                                 .
// //                             </span><br /><br />

// //                             <span> Sur une note de {oneRapport?.NOTE_EVALUATION} pts.
// //                                 {oneRapport?.etudiant?.GENRE === 1 ? (
// //                                     <span> En revanche, il a bien réussi.</span>
// //                                 ) : (
// //                                     <span> En revanche, elle a bien réussi.</span>
// //                                 )}
// //                             </span>
// //                         </p>

// //                         {/* </Card> */}
// //                         {/* </div>
// //                         </div> */}
// //                         <div class="col-sm-12">
// //                             <div className="card-container" style={{ width: '100%' }}>

// //                                 {/* <Card title="Lecture du PDF" className="mb-60 p-s">
// //                                     <p className="p-card-text" onClick={togglePdf}>
// //                                         {pdfUrl ? 'Lire le rapport' : 'Aucun PDF disponible'}
// //                                     </p>
// //                                     {showPdf && pdfUrl && (
// //                                         <div className="pdf-container" style={{ marginTop: '10px', border: '2px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9',width:"1500px" }}>
// //                                             <iframe
// //                                                 src={pdfUrl}
// //                                                 width="100%"
// //                                                 height="1000px" // Ajustez la hauteur selon vos besoins
// //                                                 style={{ border: 'none' }}
// //                                                 title="PDF Viewer"
// //                                             />
// //                                         </div>
// //                                     )}
// //                                 </Card> */}


// //                                 <Card title="Lecture du PDF" className="mb-60 p-s cart">
// //                                     <p className="p-card-text" onClick={togglePdf} style={{ cursor: 'pointer', color: '#007BFF' }}>
// //                                         {pdfUrl ? <span>Cliquez ici pour lire </span>: 'Aucun PDF disponible'}
// //                                     </p>
// //                                     {showPdf && pdfUrl && (
// //                                         <div className="pdf-container" style={{ marginTop: '10px', border: '2px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
// //                                             <iframe
// //                                                 src={pdfUrl}
// //                                                 width="100%"
// //                                                 height="1200px" // Ajustez la hauteur selon vos besoins
// //                                                 style={{ border: 'none', borderRadius: '8px'}}
// //                                                 title="PDF Viewer"
// //                                             />
// //                                             <Button
// //                                                 label="Télécharger le PDF"
// //                                                 icon="pi pi-download"
// //                                                 onClick={() => window.open(pdfUrl, '_blank')}
// //                                                 style={{ marginTop: '15px' }}
// //                                             />
// //                                         </div>
// //                                     )}
// //                                 </Card>

// //                             </div>
// //                         </div>
// //                     </div>


// //                 </div >
// //                 <footer style={{ backgroundColor: '#2C3E50', color: '#e9ecef' }} className="p-d-flex p-flex-wrap p-ai-center p-py-3 p-my-4 p-border-top ">
// //                     <div className="p-col-12 p-md-4 p-d-flex p-ai-center">
// //                         <a href="/" className="p-mb-3 p-mr-2 p-mb-md-0 p-text-body-secondary p-text-decoration-none">
// //                             <svg className="bi" width="30" height="24">
// //                                 <use xlinkHref="#bootstrap"></use>
// //                             </svg>
// //                         </a>
// //                         <span className="p-mb-3 p-mb-md-0 p-text-body-secondary">© 2024 Philip, Norbert et Cardin à Ult</span>
// //                     </div>

// //                     <ul className="p-col-12 p-md-4 p-justify-end p-list-unstyled p-d-flex">
// //                         <li className="p-mx-3">
// //                             <a className="p-text-body-secondary" href="#">
// //                                 <svg className="bi" width="24" height="24">
// //                                     <use xlinkHref="#twitter"></use>
// //                                 </svg>
// //                             </a>
// //                         </li>
// //                         <li className="p-mx-3">
// //                             <a className="p-text-body-secondary" href="#">
// //                                 <svg className="bi" width="24" height="24">
// //                                     <use xlinkHref="#instagram"></use>
// //                                 </svg>
// //                             </a>
// //                         </li>
// //                         <li className="p-mx-3">
// //                             <a className="p-text-body-secondary" href="#">
// //                                 <svg className="bi" width="24" height="24">
// //                                     <use xlinkHref="#facebook"></use>
// //                                 </svg>
// //                             </a>
// //                         </li>
// //                     </ul>
// //                 </footer>

// //             </div >
// //             <Outlet />
// //         </>


// //     )
// // }

// const PdfViewer = ({ location }) => {
//     const { pdfUrl } = location.state || {}; // Récupérer l'URL du PDF depuis l'état
//     if (!pdfUrl) {
//         return <p>PDF non trouvé.</p>;
//     }
//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>Lecture du PDF</h2>
//             <iframe
//                 src={pdfUrl}
//                 width="100%"
//                 height="80vh"
//                 style={{ border: 'none' }}
//                 title="PDF Viewer"
//             />
//         </div>
//     )
// }

//  export default PdfViewer

// // import React from 'react'

// // export const PdfViewer = () => {
// //   return (
// //     <div>PdfViewer</div>
// //   )
// // }
import React from 'react'

const PdfViewer = () => {
  return (
    <div>PdfViewer</div>
  )
}

export default PdfViewer