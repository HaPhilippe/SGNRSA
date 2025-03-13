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
// console.log(CustomerService);





import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from './service/ProductService';
import fetchApi from "../../helpers/fetchApi";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";



export default function RootPage() {

    const [rapport, setRapport] = useState([]);
    const [loading, setLoading] = useState(true); // État de chargement


    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const getSeverity = (value) => {
        switch (value) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = newData;

        setProducts(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    // const statusEditor = (options) => {
    //     return (
    //         <Dropdown
    //             value={options.value}
    //             options={statuses}
    //             onChange={(e) => options.editorCallback(e.value)}
    //             placeholder="Select a Status"
    //             itemTemplate={(option) => {
    //                 return <Tag value={option} severity={getSeverity(option)}></Tag>;
    //             }}
    //         />
    //     );
    // };

    // const priceEditor = (options) => {
    //     return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
    // };

    // const statusBodyTemplate = (rowData) => {
    //     return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
    // };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };





    const [customers, setCustomers] = useState([]);

    // console.log(customers, 'customers');

    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => setCustomers(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <img alt={rapport.SUJET} src={`https://primefaces.org/cdn/primereact/images/avatar/${rapport.RAPPORT}`} width="32" style={{ verticalAlign: 'middle' }} className="ml-2" />
                <span className="vertical-align-middle ml-2 font-bold line-height-3">{data.SUJET}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan={5}>
                    <div className="flex justify-content-end font-bold w-full">Total : {calculateCustomerTotal(rapport.total)}</div>
                </td>
            </React.Fragment>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={rowData.country.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} /> */}
                <span>{rowData.RAPPORT}</span>
            </div>
        );
    };

    const etudiantBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.etudiant.NOM} </span>
                <span> {rowData.etudiant.PRENOM}</span>
            </div>
        );
    }

    // const statusBodyTemplate = (rowData) => {
    //     return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    // };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (rapport) {
            for (let rappo of rapport) {
                if (rappo.NOM === name) {
                    total++;
                }
            }
        }

        return total;
    };

    // const getSeverity = (status) => {
    //     switch (status) {
    //         case 'unqualified':
    //             return 'danger';

    //         case 'qualified':
    //             return 'success';

    //         case 'new':
    //             return 'info';

    //         case 'negotiation':
    //             return 'warning';

    //         case 'renewal':
    //             return null;
    //     }
    // };




     console.log(rapport, 'rapport');

    // useEffect(() => {
    //      async function name() {
    //            const res = await fetchApi(`/rh/stage/fetchstage?`);
    //            setRapport(res.result.data)
    //             console.log(rapport,'res');
    //     }
    //     name()

    // },[products])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // const response = await fetchApi(`/rapport_stage/faculte_depar/fetch?`);
    //             const response = await fetchApi(`/rapport_stage/faculte_depar/fetch?`);
    //             console.log(response,'rspons');

    //             setRapport(response.result.data);
    //         } catch (error) {
    //             console.error('Erreur lors de la récupérations des données', error);
    //         }
    //     };
    //     fetchData();
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Début du chargement
            try {
                const response = await fetchApi(`/rapport_stage/faculte_depar/fetch?`);
                console.log(response, 'response');

                // Formater les données
                const formattedData = response.result.data.map(item => ({
                    id: item.ID_DEPARTEMENT,
                    name: item.NOM_DEPARTEMENT,
                    country: {
                        name: item.faculte.NOM,
                        last_name: item.faculte.DESCRIPTION,
                        code: item.faculte.ID_FAC
                    },
                    company: item.DESIGNATION_DEP,
                    date: item.DATE_INSERTION,
                    status: 'active',
                    verified: true,
                    activity: 10,
                    representative: {
                        name: item.faculte.NOM,
                        image: 'faculte_image.png'
                    },
                    balance: 0
                }));

                setRapport(formattedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchData();
    }, []);






    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };

    const expandAll = () => {
        let _expandedRows = {};



        rapport.forEach((rap) => (_expandedRows[`${rap.ID_RAPPORT}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // const amountBodyTemplate = (rowData) => {
    //     return formatCurrency(rowData.amount);
    // };

    const statusOrderBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.toLowerCase()} severity={getOrderSeverity(rowData)}></Tag>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} width="64px" className="shadow-4" />;
    };

    // const priceBodyTemplate = (rowData) => {
    //     return formatCurrency(rowData.price);
    // };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
    };

    const getProductSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const getOrderSeverity = (order) => {
        switch (order.status) {
            case 'DELIVERED':
                return 'success';

            case 'CANCELLED':
                return 'danger';

            case 'PENDING':
                return 'warning';

            case 'RETURNED':
                return 'info';

            default:
                return null;
        }
    };

    const allowExpansion = (rowData) => {
        return rowData.orders.length > 0;
    };


    // const allowExpansion = (rowData = 1) => {
    //     return rowData > 0;
    // };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders}>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
    );


    return (
        <>
            <div className="px-4 py-3 main_content">
                <h1 className="mb-3">Home</h1>

                {/* <div>
                    <h4>List prsonnalisée !</h4>
                </div> */}
                <div className="content">
                   

                    <div className="card">
                        <DataTable value={rapport} rowGroupMode="subheader" groupRowsBy="representative.name"
                            sortMode="single" sortField="representative.name" sortOrder={1}
                            expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                            rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="name" header="Name" style={{ width: '20%' }}></Column>
                            <Column field="country" header="Country" body={countryBodyTemplate} style={{ width: '20%' }}></Column>
                            <Column field="company" header="Company" style={{ width: '20%' }}></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} style={{ width: '20%' }}></Column>
                            <Column field="date" header="Date" style={{ width: '20%' }}></Column>
                        </DataTable>
                    </div>

                    {/* <div>
                        {loading ? (
                            <p>Chargement des données...</p> // Indicateur de chargement
                        ) : (
                            rapport.map(customer => (
                                <div key={customer.id}>
                                    <h3>{customer.name}</h3>
                                    <p>{customer.company}</p>
                                    <p>{customer.country.name}</p>
                                </div>
                            ))
                        )}
                    </div> */}



                </div>
            </div>
            <Outlet />
        </>


    )
}

