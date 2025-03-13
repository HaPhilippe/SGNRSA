
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'primeicons/primeicons.css'; // Import PrimeIcons
// import './jumbotron.css'; // Assurez-vous que jumbotron.css est dans le bon répertoire
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import 'primeicons/primeicons.css'; // PrimeIcons CSS
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import moment from 'moment';
import { useCallback } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadCrumbItemsAction } from '../../store/actions/appActions';
import { rapport_routes_items } from '../../routes/rapport_stage/rapport_routes';
// import './YourStyles.css'; // Si tu as des styles personnalisés

import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { SplitButton } from 'primereact/splitbutton';
import Header from '../../components/app/Header';
import imag from '../../../public/images/user.png';
import fetchApi from '../../helpers/fetchApi';
import { userSelector } from '../../store/selectors/userSelector';
import { Panel } from 'primereact/panel';
import { Menu } from 'primereact/menu';


const Homepage = () => {
    const dispacth = useDispatch()
    const [date, setDate] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);
    const user = useSelector(userSelector)
    console.log(user, 'connecté');


    const navigate = useNavigate();

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

    const fetchRapport = useCallback(async () => {
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
        fetchRapport();
    }, [lazyState])

    // const fetchFaculte_departement = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const baseurl = `/rapport_stage/rapport/fetch?`;
    //         let url = baseurl;

    //         for (let key in lazyState) {
    //             const value = lazyState[key];
    //             if (value) {
    //                 if (typeof value === "object") {
    //                     url += `${key}=${JSON.stringify(value)}&`;
    //                 } else {
    //                     url += `${key}=${value}&`;
    //                 }
    //             }
    //         }

    //         const res = await fetchApi(url);
    //         setRapport(res.result.data);
    //         setTotalRecords(res.result.totalRecords);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [lazyState]);


    useEffect(() => {
        dispacth(setBreadCrumbItemsAction([rapport_routes_items.rapport]));
        return () => {
            dispacth(setBreadCrumbItemsAction([]));
        };
    }, []);





    const openPdf = (url) => {
        setPdfUrl(url);
        setDisplayModal(true);
    };

    const closePdf = () => {
        setDisplayModal(false);
        setPdfUrl(null);
    };


    const tab1HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image={imag} shape="circle" />
                <span className="font-bold white-space-nowrap">Amy Elsner</span>
            </div>
        );
    };

    const tab2HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Onyama Limba</span>
            </div>
        )
    };

    const tab3HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Ioni Bowcher</span>
                <Badge value="2" />
            </div>
        )
    };


    return (
        <>
            {/* <Header /> */}

            <div className="px-1 py-1 main_content">

                <div className="p-m-1" style={{ marginBottom: '5vh' }}>
                    <Card title="" className="" style={{ backgroundColor: '#2C3E50', color: 'white' }}>

                        <main id="content" role="main" className="flex-grow-1">
                            {/* <header className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light"> */}
                            <header className="d-flex flex-column flex-md-row align-items-md-center p-5" style={{ backgroundColor: '#2C3E50' }}>
                                <div className="pt-md-3 pb-md-4">
                                    <h1 className="bd-title mt-0">Introduction .</h1>
                                    <p className="bd-lead">
                                        Dans le cadre de notre formation en vue de l’obtention d’un Diplôme de Baccalauréat en Informatique,

                                        nous avons eu l'opportunité de réaliser un stage aux enceintes de l’ULT.
                                        Ce stage est un élément essentiel de notre cursus, nous permettant d'appliquer les connaissances théoriques acquises en classe et d'acquérir de nouvelles compétences pratiques. Cependant, la gestion des rapports de stage peut s'avérer fastidieuse, tant pour les étudiants que pour les responsables pédagogiques. Les étapes de rédaction, de révision, de transmission et d’archivage des rapports de stage à l’ULT comme ailleurs peuvent être chronophages et sujettes à des erreurs. C'est dans ce contexte que s'inscrit notre projet de mettre en place un système de gestion digitalisé des rapports de stage accademique(sgdrsa).
                                    </p>


                                    <p className='bd-lead mt-2'>
                                        Si vous n'avez pas un compte, cliquez le bouton ci-dessous pour pouvoir savoir plus.
                                    </p>
                                    <Button
                                        label="Créer un compte"
                                        icon=""
                                        className="btn-lg btn-bd-primary"
                                        // onClick={() => window.open('/utilisateurswb/add', '_blank')}
                                        onClick={() => navigate('/utilisateurswb/add')}
                                    />
                                </div>
                            </header>

                            <div className="bd-content p-5">
                                <h2 id="custom-components">Découvrir beacoup de plus en profondeur le contenu de cette page.</h2>
                                <p>


                                </p>


                                {/* Vous pouvez inclure votre composant Grid ou d'autres contenus ici */}
                            </div>
                            <>
                                <div className="content">

                                    <div className="col-sm mt-5">
                                        {loading ? (
                                            <p>Loading...</p>
                                        ) : (
                                            <div className="row">
                                                {currentItems.map((item, index, options) => (
                                                    <div key={index} className="col-md-4">

                                                        <div className="rapport-item">
                                                        

                                                            <>

                                                                <div className="card mb-2">
                                                                    <TabView>
                                                                        <TabPanel headerTemplate={
                                                                            <span className="font-bold">Faculté:{item?.etudiant?.departement?.faculte?.NOM}</span>

                                                                            // tab3HeaderTemplate
                                                                        } headerClassName="flex align-items-center">

                                                                            <Panel
                                                                                headerTemplate={(options) => {
                                                                                    const className = `${options.className} justify-content-space-between`;
                                                                                    return (
                                                                                        <div className={className}>

                                                                                            <div className="flex align-items-center gap-2">
                                                                                                {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" /> */}
                                                                                                <Avatar image={item.etudiant?.PROFIL} size="large" shape="circle" />


                                                                                                <span className="font-bold">{item.etudiant?.PRENOM} {item.etudiant?.NOM}</span>
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
                                                                                                        height: '52vh', // Ajustement automatique de la hauteur
                                                                                                        maxHeight: '100%', // Hauteur maximale
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


                                                                                                <Link
                                                                                                    id={`Nocmnde-${item.ID_RAPPORT}`}
                                                                                                    className="text-decoration-none d-flex round-indicator btn btn-download"
                                                                                                    style={{ color: '#399af2' }}
                                                                                                    to={`/pdfviewer/${item.ID_RAPPORT}`}
                                                                                                    // to={`/rapportdesc`}
                                                                                                    
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

                                                                        </TabPanel>

                                                                    </TabView>
                                                                </div>

                                                            </>
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
                        </main>



                        {/* <p className="lead">
                            This is a simple hero unit, a simple card-style component for calling extra attention to featured content or information.
                        </p>
                        <hr />
                        <p>
                            It uses utility classes for typography and spacing to space content out within the larger container.
                        </p> */}
                        {/* <>

                            <div className="card">
                                <TabView>
                                    <TabPanel header="Header I" headerTemplate={tab1HeaderTemplate}>
                                        <p className="m-0">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </p>
                                    </TabPanel>
                                    <TabPanel headerTemplate={tab2HeaderTemplate} headerClassName="flex align-items-center">
                                        <p className="m-0">
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
                                            ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                                        </p>
                                    </TabPanel>
                                    <TabPanel headerTemplate={tab3HeaderTemplate} headerClassName="flex align-items-center">
                                        <p className="m-0">
                                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                        </p>
                                    </TabPanel>
                                </TabView>
                            </div>

                        </> */}





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
                
            </div >



            <Outlet />




        </>
    )
}

export default Homepage;