import "../../styles/app1/header.css"
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import moment from 'moment'

import { Badge } from 'primereact/badge';
import BreadCrumb from "./BreadCrumb";
import { useRef, useState, useEffect } from "react";
import { SlideMenu } from 'primereact/slidemenu';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { setUserAction } from "../../store/actions/userActions";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "../../styles/app/header.css"

import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from "primereact/sidebar";

import removeUserDataAndCaches from "../../utils/removeUserDataAndCaches";
moment.updateLocale('fr', {
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Séptembre', 'Octoble', 'Novembre', 'Décembre']
})


const AppDateTime = () => {
    const [time, setTime] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="text-light date-time">
            {moment(time).format("dddd DD MMM YYYY HH:mm:ss")}
        </div>
    )
}




export default function Header() {
    const content=[]
    const menu = useRef(null);
    const user = useSelector(userSelector)
    const dispacth = useDispatch()
    const navigate = useNavigate()
    const [asideVisible, setAsideVisible] = useState(false);

    const handleAccept = async () => {
        removeUserDataAndCaches(user.ID_UTILISATEUR, user.REFRESH_TOKEN)
        dispacth(setUserAction(null))
        localStorage.setItem('user', null)
        navigate('/login')
    }
    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmDialog({
            //   headerStyle: { backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' },
            headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
            headerClassName: "text-black",
            header: "Deconnexion",
            style: { width: '30vw' },
            message: (
                <div className="d-flex flex-column align-items-center">
                    <>
                        <div className="font-bold text-center my-2">
                        </div>
                        <div className="text-center">
                            Voulez -vous vraiment se deconnecter?
                        </div>
                    </>
                </div>
            ),
            acceptClassName: "p-button-danger",
            acceptLabel: "Oui",
            rejectLabel: "Non",
            accept: handleAccept,
        });
    };
    const items1 = [

        {
            template: () => {
                return (
                    <>
                        <div className="d-flex align-items-center w-100 px-2">
                            <div className="avatar">
                                <img src={user.IMAGE || Image} alt="" className="" />
                            </div>
                            <div className="usernames ml-2">
                                <div className="font-bold white-space-nowrap">{user.NOM} {user.PRENOM}</div>
                                <div className="texte-muted text-sm white-space-nowrap">{user.EMAIL}</div>
                            </div>
                        </div>
                        <hr className="mb-0 mt-2" />
                    </>
                )
            }
        },



        {
            template: (deleteItem, options) => {
                return (
                    <>
                        <Link to={`/notifications`} className="p-menuitem-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                            </svg>
                            <span className="p-menuitem-text">Notifications</span>
                        </Link>
                        <hr className="mb-0 mt-2" />
                    </>
                )
            }
        },



        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`/user/profile`} className="p-menuitem-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                        </svg>
                        <span className="p-menuitem-text">Modifier le profil</span>
                    </Link>
                )
            }
        },
        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`/auth/password`} className="p-menuitem-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                        </svg>
                        <span className="p-menuitem-text">Changer le mot de passe</span>
                    </Link>
                )
            }
        },

        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`#`} className="p-menuitem-link" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg>
                        <span className="p-menuitem-text">Se déconnecter</span>
                    </Link>
                )
            }
        },
        {
            label: 'Crér un compte',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate('/')
            }
        },
    ];

    const [searchText, setSearchText] = useState('');
    // console.log(searchText,'dddddddddddddddd');

    const [showButton, setShowButton] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate('/')
            }
        },
        {
            label: 'Link',
            icon: 'pi pi-fw pi-link',
            command: () => {
                navigate('/entreprise')
            }
        },
        {
            label: <span className="custom-label">About</span>,
            icon: 'pi pi-fw pi-times',
            command: () => {
                navigate('/rapport');
            },
            // disabled: true
        }
    ];
    const start = <span><BreadCrumb /></span>;
    // const handleInputChange = (e) => {
    //     setSearchText(e.target.value);
    //     setShowButton(e.target.value.length > 0); // Affiche le bouton si le champ n'est pas vide
    // };

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter' && searchText) {
    //         // Logique de recherche ou action quand "Entrée" est pressé
    //         console.log("Searching for:", searchText);
    //     }
    // };


    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter' && searchText) {
    //         // Filtrer le contenu et stocker les résultats
    //         const results = content.filter(item =>
    //             item.toLowerCase().includes(searchText.toLowerCase())
    //         );
    //         setFilteredResults(results);
    //         console.log("Searching for:", searchText);
    //     }
    // };
    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            filterContent();
        }
    };

    const filterContent = () => {
        const results = content.filter(item => {
            // Supposons que chaque item soit un élément React avec un nom et une description
            const name = item.props.children[0].props.children; // Récupère le nom
            const description = item.props.children[1].props.children; // Récupère la description
            return name.toLowerCase().includes(searchText.toLowerCase()) || 
                   description.toLowerCase().includes(searchText.toLowerCase());
        });
        setFilteredResults(results);
        console.log("Searching for:", searchText);
    };





    return (


        // <>
        //     <header className="align-items-center justify-content-between px-4 header" style={{ backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' }}>


        //         <div style={{ display: 'inline-block', width: '50%' }}>
        //             <Menubar model={items} start={start} style={{ background: '#2C3E50', border: 'none' }} />
        //             <div className="p-inputgroup mb-3" style={{ marginTop: '10px', position: 'relative' }}>
        //                 <InputText
        //                     placeholder="Search"
        //                     value={searchText}
        //                     onChange={handleInputChange}

        //                     style={{
        //                         flex: '1 1 auto',
        //                         minWidth: '200px',
        //                         border: 'none',
        //                         borderRadius: '20px',
        //                         boxShadow: 'none'
        //                     }}
        //                 />
        //                 {showButton && (
        //                     <Button
        //                         label="Search"
        //                         className="p-button-outlined"
        //                         style={{
        //                             position: 'absolute',
        //                             right: '15px',
        //                             top: '50%',
        //                             transform: 'translateY(-50%)',
        //                             borderRadius: '20px',
        //                             height: '35px',
        //                             color: 'white',
        //                             background: '#2C3E50',
        //                             border: 'none'
        //                         }}
        //                         onClick={() => console.log("Searching for:", searchText)} // Logique de recherche
        //                     />
        //                 )}
        //             </div>
        //         </div>



        //         <div className="d-flex align-items-center flex-1">

        //             {/* {
        //                     user.ID_PROFIL !== PROFILS.CORPORATE ? <SearchBar /> : <AppDateTime />
        //                     } */}

        //         </div>




        //         <div className="flex align-items-center py-2">




        //             <SlideMenu ref={menu} model={items1} popup viewportHeight={200} menuWidth={300} style={{ width: 300 }} className="mt-2" onHide={() => {
        //             }} />



        //             <Button text className="p-0 avatar mx-2" onClick={e => {
        //                 menu.current.toggle(e)
        //             }}>
        //                 <img src={user?.IMAGE || Image} alt="" className="" />
        //             </Button>

        //         </div>

        //     </header>
        // </>

        // <>
        //     <header className="align-items-center justify-content-between px-4 header" style={{ backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' }}>
        //         <div style={{ display: 'inline-block', width: '50%' }}>
        //             <Menubar model={items} start={<span><BreadCrumb /></span>} style={{ background: '#2C3E50', border: 'none' }} />
        //             <div className="p-inputgroup mb-3" style={{ marginTop: '10px', position: 'relative' }}>
        //                 <InputText
        //                     placeholder="Search"
        //                     value={searchText}
        //                     onChange={handleInputChange}
        //                     onKeyPress={handleKeyPress}
        //                     style={{
        //                         flex: '1 1 auto',
        //                         minWidth: '200px',
        //                         border: 'none',
        //                         borderRadius: '20px',
        //                         boxShadow: 'none'
        //                     }}
        //                 />
        //                 {showButton && (
        //                     <Button
        //                         label="Search"
        //                         className="p-button-outlined"
        //                         style={{
        //                             position: 'absolute',
        //                             right: '15px',
        //                             top: '50%',
        //                             transform: 'translateY(-50%)',
        //                             borderRadius: '20px',
        //                             height: '35px',
        //                             color: 'white',
        //                             background: '#2C3E50',
        //                             border: 'none'
        //                         }}
        //                         onClick={() => {
        //                             // Filtrer le contenu et stocker les résultats
        //                             const results = content.filter(item =>
        //                                 item.toLowerCase().includes(searchText.toLowerCase())
        //                             );
        //                             setFilteredResults(results);
        //                             console.log("Searching for:", searchText);
        //                         }}
        //                     />
        //                 )}
        //             </div>
        //         </div>

        //         <div className="flex align-items-center py-2">
        //             <SlideMenu ref={menu} model={items1} popup viewportHeight={200} menuWidth={300} />
        //             <Button text className="p-0 avatar mx-2" onClick={e => menu.current.toggle(e)}>
        //                 <img src={user?.IMAGE || Image} alt="" />
        //             </Button>
        //         </div>
        //     </header>

        //     {/* Affichage du contenu filtré */}
        //     <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        //         {filteredResults.length > 0 ? (
        //             filteredResults.map((item, index) => (
        //                 <div key={index} style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>
        //                     {item}
        //                 </div>
        //             ))
        //         ) : searchText ? (
        //             <p>Aucun résultat trouvé pour "{searchText}".</p>
        //         ) : (
        //             <p>Veuillez entrer un terme de recherche.</p>
        //         )}
        //     </div>
        // </>
        <>
            <header className="align-items-center justify-content-between px-4 header" style={{ backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' }}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                    <Menubar model={items} start={<span><BreadCrumb /></span>} style={{ background: '#2C3E50', border: 'none' }} />
                    <div className="p-inputgroup mb-3" style={{ marginTop: '10px', position: 'relative' }}>
                        <InputText
                            placeholder="Search"
                            value={searchText}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            style={{
                                flex: '1 1 auto',
                                minWidth: '200px',
                                border: 'none',
                                borderRadius: '20px',
                                boxShadow: 'none'
                            }}
                        />
                        {showButton && (
                            <Button
                                label="Search"
                                className="p-button-outlined"
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    borderRadius: '20px',
                                    height: '35px',
                                    color: 'white',
                                    background: '#2C3E50',
                                    border: 'none'
                                }}
                                onClick={filterContent}
                            />
                        )}
                    </div>
                </div>

                <div className="flex align-items-center py-2">
                    <SlideMenu ref={menu} model={items1} popup viewportHeight={200} menuWidth={300} />
                    <Button text className="p-0 avatar mx-2" onClick={e => menu.current.toggle(e)}>
                        <img src={user?.IMAGE || "/path/to/default/image.jpg"} alt="" />
                    </Button>
                </div>
            </header>

        </>
    )
}