
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../../public/images/user.png';


const Fonctionnalites = () => {
    
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            // icon: 'pi pi-fw pi-home',
            command: () => navigate('/'),
        },
        {
            label: 'Contact',
            // icon: 'pi pi-envelope',
            badge: 3,
            command: () => navigate('/contact'),
            // template: itemRenderer,
        },
        {
            label: <span className="custom-label">About</span>,
            // icon: 'pi pi-fw pi-info-circle',
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

    return (
        <div className="">
            <Menubar model={items} className='custom-menubar' style={{border:'none',boxShadow:'none'}}/>
        </div>
    );
};

export default Fonctionnalites;
        