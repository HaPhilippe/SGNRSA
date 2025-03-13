import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { breadCrumbItemsSelector } from "../../store/selectors/appSelectors"
import { Menubar } from "primereact/menubar"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"


export default function BreadCrumb() {
    const breadCrumbItems = useSelector(breadCrumbItemsSelector)
    const navigate = useNavigate()
    const items = [
        // {
        //     label: <span className="custom-label">Home</span>,
        //     // icon: 'pi pi-fw pi-home',


        //     command: () => {
        //         navigate('/')
        //     }

        // },

        // {

        //     label: <span className="custom-label">Contact</span>,
        //     icon: <i className="pi pi-fw pi-envelope custom-icon" />,
        //     command: () => {
        //         navigate('/entreprise')
        //     },
        //     className: 'custom-menu-item'
        // },
        // {

        //     label: <span className="custom-label">About</span>,
        //     icon: <i className="pi pi-fw pi-info-circle custom-icon" />,
        //     command: () => {
        //         navigate('/rapport');
        //     },
        //     className: 'custom-menu-item'
        // },
    ];
    return (
        <div className="d-flex align-items-center text-muted mx-4" id="breadcrumb">
            {breadCrumbItems.map((item, index) => {
                return (

                    <>


                        <div className="d-flex align-items-center mx-1" key={index}>
                            <Link to={item.path} className={`text-decoration-none text-muted px-2 breadCrumbItem rounded py-1 ${index == breadCrumbItems.length - 1 ? 'active pointer-events-none' : ""}`} >
                                {item.name}
                            </Link>
                            {index < breadCrumbItems.length - 1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right mt-1" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                            </svg> : null}
                        </div>

                    </>

                )
            })}





            {breadCrumbItems.length > 0 ?
                // <>
                //     {/* <Link to={"/"} className="text-decoration-none text-muted px-2 breadCrumbItem rounded py-1">
                //         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house mb-1" viewBox="0 0 16 16">
                //             <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                //         </svg>
                //     </Link> */}
                //     <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-chevron-right " viewBox="0 0 16 16">
                //         <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                //     </svg>

                //     {/* <Button
                //         className="text-decoration-none text-muted px-2 rounded py-1"
                //         onClick={() => navigate('/')}
                //         style={{ display: 'flex', alignItems: 'center' }} // Pour centrer l'icône et le texte
                //     >
                //         <svg
                //             xmlns="http://www.w3.org/2000/svg"
                //             width="20"
                //             height="20"
                //             fill="currentColor"
                //             className="bi bi-house mb-1"
                //             viewBox="0 0 16 16"
                //             style={{ marginRight: '5px' }} // Espacement entre l'icône et le texte
                //         >
                //             <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                //         </svg>
                //         <span className="custom-label" style={{ color: 'white' }}>Home</span>
                //     </Button> */}

                //     <Link to={"/"} className="text-decoration-none text-muted px-2 breadCrumbItem rounded py-1" style={{ display: 'flex', alignItems: 'center' }}>
                //         {/* <svg
                //             xmlns="http://www.w3.org/2000/svg"
                //             width="20"
                //             height="20"
                //             fill="currentColor"
                //             className="bi bi-house mb-1"
                //             viewBox="0 0 16 16"
                //             style={{ marginRight: '5px' }} // Espacement entre l'icône et le texte
                //         >
                //             <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                //         </svg> */}
                //         <span className="custom-label" style={{ color: 'white' }}>Home</span>
                //     </Link>


                //     <Link
                //         to="/entreprise"
                //         className="text-decoration-none text-muted px-2 rounded py-1 custom-menu-item"
                //         style={{ display: 'flex', alignItems: 'center' }}
                //     >
                //         {/* <svg
                //             xmlns="http://www.w3.org/2000/svg"
                //             width="20"
                //             height="20"
                //             fill="currentColor"
                //             className="bi bi-house mb-1"
                //             viewBox="0 0 16 16"
                //             style={{ marginRight: '5px' }} // Espacement entre l'icône et le texte
                //         >
                //             <path d="M8 0L0 7h2v9h4V11h4v5h4V7h2L8 0z" />
                //         </svg> */}
                //         <span className="custom-label" style={{ color: 'white' }}>Contact</span>
                //     </Link>



                //     <Link
                //         to="/rapport"
                //         className="text-decoration-none text-muted px-2 rounded py-1 custom-menu-item"
                //         style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }} // Ajoutez un espacement entre les liens
                //     >
                //         {/* <i className="pi pi-fw pi-info-circle custom-icon" style={{ marginRight: '5px' }}></i> */}
                //         <span className="custom-label" style={{ color: 'white' }}>About</span>
                //     </Link>






                // </> 
                // <>
                //     <nav class="navbar navbar-expand-lg navbar-light bg-light">
                //         <a class="navbar-brand" href="#">Navbar</a>
                //         <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                //             <span class="navbar-toggler-icon"></span>
                //         </button>

                //         <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                //             <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                //                 <li class="nav-item active">
                //                     <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                //                 </li>
                //                 <li class="nav-item">
                //                     <a class="nav-link" href="#">Link</a>
                //                 </li>
                //                 <li class="nav-item">
                //                     <a class="nav-link disabled" href="#">Disabled</a>
                //                 </li>
                //             </ul>
                //             <form class="form-inline my-2 my-lg-0">
                //                 {/* <input class="form-control mr-sm-2" type="search" placeholder="Search"> */}
                //                     <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                //             </form>
                //         </div>
                //     </nav>

                // </>
                <>
                
                </>


                : null}

        </div>
    )
}

