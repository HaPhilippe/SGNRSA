
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../../public/images/user.png';

const itemRenderer = (item) => (
    <a
        className="flex align-items-center p-menuitem-link"
        onClick={item.command}
        style={{ cursor: 'pointer' }}
    >
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
            <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                {item.shortcut}
            </span>
        )}
    </a>
);


const Footer = () => {

    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/'),
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            badge: 3,
            command: () => navigate('/contact'),
            template: itemRenderer,
        },
        {
            label: <span className="custom-label">About</span>,
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/about'),
        },
        {
            label: 'Options',
            // icon: 'pi pi-search',
            items: [
                {
                    label: 'Se connecter',
                    // icon: 'pi pi-bolt'
                    command: () => navigate('/login'),

                },
                {
                    label: 'Se déconnecter',
                    // icon: 'pi pi-server'
                    command: () => navigate('#'),
                }


            ]
        },

    ];

    const start = <img alt="logo" src={logoImg} height="40" className="mr-2" />;

    const end = (
        <div className="flex align-items-center gap-2">
            {/* <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" /> */}
            <Avatar
                image={logoImg}
                shape="circle"
                onClick={() => navigate('/login')} // Navigate to About on click
                style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer
            />
        </div>
    );

    return (
        <div className="">
{/* #2C3E50 */}
            <footer style={{ backgroundColor: '', color: ' #2C3E50 ' }} className="p-d-flex p-flex-wrap p-ai-center p-py-3 p-my-4 p-border-top ">
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
        </div>
    );
};

export default Footer;