import { Link, Outlet } from "react-router-dom";
import { Skeleton } from 'primereact/skeleton';
import DashboardSkeletons from "../../components/skeletons/DashboardSkeletons";
import HomeSkeletons from "../../components/skeletons/HomeSkeletons";
import AsideSkeletons from "../../components/skeletons/AsideSkeletons";

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { CustomerService } from "./service/CustomerService";

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from './service/ProductService';
import fetchApi from "../../helpers/fetchApi";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import { Panel } from 'primereact/panel';
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useCallback } from "react";
import { setBreadCrumbItemsAction, setToastAction, } from "../../store/actions/appActions";
import { rapport_routes_items } from "../../routes/rapport_stage/rapport_routes";
import { Dialog } from 'primereact/dialog';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";

export default function RootPage() {
    const user = useSelector(userSelector)
    const dispacth = useDispatch()
    const [date, setDate] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);
    // // Définir la locale sur le français
    // moment.lang('fr'); // Utilisez cette méthode si 'locale' ne fonctionne pas

    // Définir la locale française
    moment.updateLocale('fr', {
        relativeTime: {
            future: "dans %s",
            past: "il y a %s",
            s: "quelques secondes",
            ss: "%d secondes",
            m: "une minute",
            mm: "%d minutes",
            h: "une heure",
            hh: "%d heures",
            d: "un jour",
            dd: "%d jours",
            M: "un mois",
            MM: "%d mois",
            y: "un an",
            yy: "%d ans"
        }
    });





    const [rapport, setRapport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);


    // console.log(rapport);


    const configMenu = useRef(null);
    const items = [
        {
            label: 'Refresh',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Search',
            icon: 'pi pi-search'
        },
        {
            separator: true
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        }
    ];

    const headerTemplate = (options) => {
        const className = `${options.className} justify-content-space-between`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" />
                    <span className="font-bold">Philippe Hatangimana</span>
                </div>
                <div>
                    <Menu model={items} popup ref={configMenu} id="config_menu" />

                    {options.togglerElement}
                </div>
            </div>
        );
    };

    const footerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <Button icon="pi pi-user" rounded text>More</Button>
                    {/* <Button icon="pi pi-bookmark" severity="secondary" rounded text></Button> */}
                </div>
                <span className="p-text-secondary">Updated 2 hours ago</span>
            </div>
        );
    };



    // /rapport_stage/faculte_depar/fetch?

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        search: "",
        filters: {
            name: { value: "", matchMode: "contains" },
            "country.name": { value: "", matchMode: "contains" },
            company: { value: "", matchMode: "contains" },
            "representative.name": { value: "", matchMode: "contains" },
        },
    });



    const handleVisibility = (e) => {
        setIsVisible(!isVisible);
    };
    const onPage = (event) => {
        setlazyState(event);
    };

    const onSort = (event) => {
        setlazyState(event);
    };

    const onFilter = (event) => {
        event["first"] = 0;
        setlazyState(event);
    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedItems(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event) => {
        const selectAll = event.checked;

        if (selectAll) {
            setSelectAll(true);
            setSelectedItems(stockmp);
        } else {
            setSelectAll(false);
            setSelectedItems([]);
        }
    };

    //_______________Début__de la__Gestion de la pagination________________
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = rapport.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(rapport.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //_______________Fin__de la__Gestion de la pagination________________

    const fetchFaculte_departement = useCallback(async () => {
        try {
            setLoading(true);
            const baseurl = `/rapport_stage/rapport/fetch?`;
            let url = baseurl;

            for (let key in lazyState) {
                const value = lazyState[key];
                if (value) {
                    if (typeof value === "object") {
                        url += `${key}=${JSON.stringify(value)}&`;
                    } else {
                        url += `${key}=${value}&`;
                    }
                }
            }

            const res = await fetchApi(url);
            setRapport(res.result.data);
            setTotalRecords(res.result.totalRecords);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [lazyState]);


    useEffect(() => {
        dispacth(setBreadCrumbItemsAction([rapport_routes_items.rapport]));
        return () => {
            dispacth(setBreadCrumbItemsAction([]));
        };
    }, []);

    useEffect(() => {
        fetchFaculte_departement();
    }, [lazyState]);



    const openPdf = (url) => {
        setPdfUrl(url);
        setDisplayModal(true);
    };

    const closePdf = () => {
        setDisplayModal(false);
        setPdfUrl(null);
    };

    // const openPdf = (url) => {
    //     history.push({
    //         pathname: '/pdfviewer',
    //         state: { pdfUrl: url }
    //     });
    // };




    return (
        <>
            <div className="px-1 py-1 main_content">

<div className="p-m-1" style={{marginBottom:'50vh'}}>
    <Card title="Hello, world!" className="">
        <p className="lead">
            This is a simple hero unit, a simple card-style component for calling extra attention to featured content or information.
        </p>
        <hr />
        <p>
            It uses utility classes for typography and spacing to space content out within the larger container.
        </p>
        
        {
            user.ID_PROFIL == 1 || user.ID_PROFIL == 8 ?

                <>
                    <div className="content">
                        {
                            console.log(user)

                        }
                        <div className="col-sm mt-5">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="row">
                                    {currentItems.map((item, index) => (
                                        <div key={index} className="col-md-4">
                                          
                                            <div className="rapport-item">

                                                <Panel
                                                    headerTemplate={(options) => {
                                                        const className = `${options.className} justify-content-space-between`;
                                                        return (
                                                            <div className={className}>

                                                                <div className="flex align-items-center gap-2">
                                                                    {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" /> */}
                                                                    <Avatar image={item.etudiant.PROFIL} size="large" shape="circle" />


                                                                    <span className="font-bold">{item.etudiant.PRENOM} {item.etudiant.NOM}</span>
                                                                </div>
                                                                <div>
                                                                    <Menu model={items} popup ref={configMenu} id="config_menu" />
                                                                    {options.togglerElement}
                                                                </div>
                                                            </div>
                                                        );
                                                    }}
                                                    footerTemplate={item.RAPPORT_PDF && (

                                              

                                                        <div>
                                                            <p>
                                                                {item?.DATE_INSERTION ? ` ${moment(item.DATE_INSERTION).fromNow()}` : 'aucune date disponible'}
                                                            </p>
                                                        </div>


                                                    )}
                                                    toggleable
                                                >

                                                    <div className="row">
                                                        <div className="col-sm-6">

                                                            <div className="card-container" style={{ width: '100%', margin: '1px' }}>
                                                                <Card>

                                                                    <img
                                                                        src={item.PAGE_GARDE}
                                                                        alt="Description de l'image"
                                                                        style={{
                                                                            width: '100%',
                                                                            height: 'auto', // Ajustement automatique de la hauteur
                                                                            maxHeight: 'auto', // Hauteur maximale
                                                                            objectFit: 'contain', // Ajustement de l'image sans la tronquer
                                                                        }}
                                                                    />
                                                                </Card>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-sm-6">
                                                            <div className="card-container" style={{ width: '100%' }}>

                                                                <Card>
                                                                    <div className="row">
                                                                        <span>Thème:<h6>{item?.SUJET}</h6>
                                                                            <hr />
                                                                        </span>
                                                                    </div>

                                                                    <div className="p-0"> {/* Ajout de padding */}
                                                                        <div className="row">
                                                                            <span>Date de début:{moment(item.DATE_INSERTION).format("DD/MM/YYYY")}</span>
                                                                        </div>

                                                                        <div className="row">

                                                                            <span>Date de fin:{moment(item.DATE_INSERTION).format("DD/MM/YYYY")}</span>



                                                                        </div>
                                                                        <div className="row">
                                                                            <span>Date de dépot:{moment(item.DATE_INSERTION).format("DD/MM/YYYY")}</span>
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            </div>

                                                            <div className='mt-3 shadow-2 p-2'>

                                                                Decouvrir en plus

                                                                <div className="button-group mb-5">
                                                                    {/* <button onClick={() => openPdf(item.RAPPORT_PDF)} className="btn btn-view">
                                                            Voir le PDF
                                                        </button> */}

                                                                    <Link
                                                                        id={`Nocmnde-${item.ID_RAPPORT}`}
                                                                        className="text-decoration-none d-flex round-indicator btn btn-download"
                                                                        style={{ color: '#399af2' }}
                                                                        // to={`/pdfviewer/${item?.ID_RAPPORT}`}
                                                                        to={`/pdfviewer`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                        }}
                                                                        data-pr-position="bottom"
                                                                    >
                                                                        <span className="pdfref" >{item.REF_RAP}</span>
                                                                    </Link>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                
                                                </Panel>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <hr />
                            <div className="pagination mt-5">
                                <p>Nous avons : {totalRecords} rapports déposés</p>
                                <button onClick={handlePrevPage} disabled={currentPage === 1}>Précédent</button>
                                <span>Page {currentPage} sur {totalPages}</span>
                                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivant</button>
                            </div>
                        </div>


                        <Dialog
                            header={` Lecture du PDF`}

                            visible={displayModal}
                            onHide={closePdf}
                            modal
                            style={{ width: '60vw', height: '750px' }}
                            className="custom-dialog" // Ajouter la classe pour le style
                        >
                            {pdfUrl && (
                                <iframe
                                    src={pdfUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                    title="PDF Viewer"
                                />
                            )}
                        </Dialog>

                        {/* CSS intégré */}
                        <style jsx>{`
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.custom-dialog .p-dialog-content {
    background-color: #2C3E50; /* Couleur de fond personnalisée */
    padding: 20px; /* Rembourrage pour le contenu */
}
.custom-dialog .p-dialog-header {
    background-color: #2C3E50; /* Couleur de fond de l'en-tête */
    color: white; /* Couleur du texte de l'en-tête */
}
`}</style>
                    </div>
                </>
                :


                <>

                    <div className="p-mt-2">
                        {/* <Button
                            label="Créer un compte"
                            className="p-button-primary"
                            onClick={() => navigate('/utilisateurswb/add')}
                        /> */}
                        <a href="/utilisateurswb/add" className="text-right block mt-2">
                            Créer un compte
                        </a>
                    </div>


                    {
                        console.log(user)

                    }
                </>


        }









        {/* CSS intégré */}
        <style jsx>{`
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
`}</style>
        {/* </div>  */}



        {/* CSS intégré */}
        {/* background-color: #007bff;  */}
        <style jsx>{`
.button-group {
display: flex;
gap: 10px; /* Espacement entre les boutons */
margin-top: 10px; /* Espacement au-dessus des boutons */
}

.btn {
padding: 4px 8px; /* Rembourrage pour les boutons */
border: none; /* Retire la bordure */
border-radius: 5px; /* Coins arrondis */
cursor: pointer; /* Curseur en main */
text-decoration: none; /* Supprime le soulignement */
color: white; /* Couleur du texte */
background-color: #E67E22; 
transition: background-color 0.3s; /* Effet de transition */
}
.pdfref{
color: white;
}

.btn:hover {
background-color: #2C3E50; /* Couleur de fond au survol */
color: white;
}
`}</style>



    </Card>



</div >
<footer style={{ backgroundColor: '#2C3E50', color: '#e9ecef' }} className="p-d-flex p-flex-wrap p-ai-center p-py-3 p-my-4 p-border-top ">
    <div className="p-col-12 p-md-4 p-d-flex p-ai-center">
        <a href="/" className="p-mb-3 p-mr-2 p-mb-md-0 p-text-body-secondary p-text-decoration-none">
            <svg className="bi" width="30" height="24">
                <use xlinkHref="#bootstrap"></use>
            </svg>
        </a>
        <span className="p-mb-3 p-mb-md-0 p-text-body-secondary">© 2024 Philip, Norbert et Cardin à Ult</span>
    </div>

    <ul className="p-col-12 p-md-4 p-justify-end p-list-unstyled p-d-flex">
        <li className="p-mx-3">
            <a className="p-text-body-secondary" href="#">
                <svg className="bi" width="24" height="24">
                    <use xlinkHref="#twitter"></use>
                </svg>
            </a>
        </li>
        <li className="p-mx-3">
            <a className="p-text-body-secondary" href="#">
                <svg className="bi" width="24" height="24">
                    <use xlinkHref="#instagram"></use>
                </svg>
            </a>
        </li>
        <li className="p-mx-3">
            <a className="p-text-body-secondary" href="#">
                <svg className="bi" width="24" height="24">
                    <use xlinkHref="#facebook"></use>
                </svg>
            </a>
        </li>
    </ul>
</footer>

</div >
            <Outlet />
        </>


    )
}