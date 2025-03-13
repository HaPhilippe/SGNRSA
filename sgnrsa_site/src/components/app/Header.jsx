
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


const Header = () => {
    
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
            <Menubar model={items} start={start} end={end} />
        </div>
    );
};

export default Header;