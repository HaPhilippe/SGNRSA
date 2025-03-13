
// import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   setBreadCrumbItemsAction,
//   setToastAction,
// } from "../../store/actions/appActions";
// import { administration_routes_items } from "../../routes/admin/administration_routes";
// import { welcome_routes_items } from "../../routes/welcome/welcome_routes";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { Dialog } from 'primereact/dialog';
// import moment from "moment";
// import fetchApi from "../../helpers/fetchApi";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { SlideMenu } from "primereact/slidemenu";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import Loading from "../../components/app/Loading";
// import Authantifiaction from "./Authantifiaction";



// export default function Departement_liste_page() {
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [date, setDate] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [totalRecords, setTotalRecords] = useState(1);
//   const [employeur, setEmployeur] = useState([]);
//   const [details_modalUsers, setDetails_modalUsers] = useState(false);
//   const [detail_users, setDetail_users] = useState(null);
//   const [departement, setDepartement] = useState([]);
//   const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
//   const paginatorRight = <Button type="button" icon="pi pi-download" text />;
//   const [selectedItems, setSelectedItems] = useState(null);
//   const menu = useRef(null);
//   const [inViewMenuItem, setInViewMenuItem] = useState(null);
//   const [globalLoading, setGloabalLoading] = useState(false);

//   const navigate = useNavigate();

//   const [lazyState, setlazyState] = useState({
//     first: 0,
//     rows: 10,
//     page: 1,
//     sortField: null,
//     sortOrder: null,
//     search: "",
//     filters: {
//       name: { value: "", matchMode: "contains" },
//       "country.name": { value: "", matchMode: "contains" },
//       company: { value: "", matchMode: "contains" },
//       "representative.name": { value: "", matchMode: "contains" },
//     },
//   });

//   const dispacth = useDispatch();
//   const handleVisibility = (e) => {
//     setIsVisible(!isVisible);
//   };
//   const onPage = (event) => {
//     setlazyState(event);
//   };

//   const onSort = (event) => {
//     setlazyState(event);
//   };

//   const onFilter = (event) => {
//     event["first"] = 0;
//     setlazyState(event);
//   };

//   const onSelectionChange = (event) => {
//     const value = event.value;
//     setSelectedItems(value);
//     setSelectAll(value.length === totalRecords);
//   };

//   const onSelectAllChange = (event) => {
//     const selectAll = event.checked;

//     if (selectAll) {
//       setSelectAll(true);
//       setSelectedItems(departement);
//     } else {
//       setSelectAll(false);
//       setSelectedItems([]);
//     }
//   };

//   const deleteItems = async (itemsIds) => {
//     try {
//       setGloabalLoading(true);
//       const form = new FormData();
//       form.append("ids", JSON.stringify(itemsIds));
//       const res = await fetchApi("/rh/departement/detele", {
//         method: "POST",
//         body: form,
//       });
//       dispacth(
//         setToastAction({
//           severity: "success",
//           summary: "Departement supprimé",
//           detail: "Le departement a été supprimé avec succès",
//           life: 3000,
//         })
//       );
//       fetchDepartement();
//       setSelectAll(false);
//       setSelectedItems(null);
//     } catch (error) {
//       console.log(error);
//       dispacth(
//         setToastAction({
//           severity: "error",
//           summary: "Erreur du système",
//           detail: "Erreur du système, réessayez plus tard",
//           life: 3000,
//         })
//       );
//     } finally {
//       setGloabalLoading(false);
//     }
//   };

//   const handleDeletePress = (e, itemsIds) => {
//     e.preventDefault();
//     e.stopPropagation();
//     confirmDialog({
//       headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
//       headerClassName: "text-black",
//       header: "Supprimer ?",
//       message: (
//         <div className="d-flex flex-column align-items-center">

//           {inViewMenuItem ? (
//             <>

//               <div className="font-bold text-center my-2">
//                 {inViewMenuItem?.NOM_DEPARTEMENT}
//               </div>
//               <div className="text-center">
//                 Voulez-vous vraiment supprimer ?
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="text-muted">
//                 {selectedItems ? selectedItems.length : "0"} selectionné
//                 {selectedItems?.length > 1 && "s"}
//               </div>
//               <div className="text-center">
//                 Voulez-vous vraiment supprimer les éléments selectionnés ?
//               </div>
//             </>
//           )}
//         </div>
//       ),
//       acceptClassName: "p-button-danger",
//       acceptLabel: "Oui",
//       rejectLabel: "Non",
//       accept: () => {
//         deleteItems(itemsIds);
//       },
//     });
//   };


//   const fetchDepartement = useCallback(async () => {
//     try {
//       setLoading(true);
//       const baseurl = `/rh/departement/fetchdeparte?`;
//       var url = baseurl;
//       for (let key in lazyState) {
//         const value = lazyState[key];
//         if (value) {
//           if (typeof value == "object") {
//             url += `${key}=${JSON.stringify(value)}&`;
//           } else {
//             url += `${key}=${value}&`;
//           }
//         }
//       }
//       const res = await fetchApi(url);

//       setDepartement(res.result.data);
//       setTotalRecords(res.result.totalRecords);

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [lazyState]);



//   useEffect(() => {
//     dispacth(setBreadCrumbItemsAction([administration_routes_items.departement]));
//     return () => {
//       dispacth(setBreadCrumbItemsAction([]));
//     };
//   }, []);



//   useEffect(() => {
//     fetchDepartement();
//   }, [lazyState]);
//   return (
//     <>
//       <ConfirmDialog closable dismissableMask={true} />
//       {globalLoading && <Loading />}
//       <div className="px-4 py-3 main_content">
//         <div className="d-flex align-items-center justify-content-between">
//           <h1 className="mb-3">Departement</h1>
//           <Button
//             label="Nouveau"
//             icon="pi pi-plus"
//             size="small"
//             onClick={() => {
//               navigate("/departement/add");
//             }}
//           />
//         </div>
//         <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
//           <div className="d-flex  align-items-center">
//             <div className="p-input-icon-left">
//               <i className="pi pi-search" />
//               <InputText
//                 type="search"
//                 placeholder="Recherche"
//                 className="p-inputtext-sm"
//                 style={{ minWidth: 300 }}
//                 onInput={(e) =>
//                   setlazyState((s) => ({ ...s, search: e.target.value }))
//                 }
//               />
//             </div>

//           </div>
//           <div className="selection-actions d-flex align-items-center">
//             <div className="text-muted mx-3">
//               {selectedItems ? selectedItems.length : "0"} selectionné
//               {selectedItems?.length > 1 && "s"}
//             </div>
//             <a
//               href="#"
//               className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length == 0) &&
//                 "opacity-50 pointer-events-none"
//                 }`}
//               style={{}}
//               onClick={(e) =>
//                 handleDeletePress(
//                   e,
//                   selectedItems.map((item) => item.ID_DEPARTEMENT)
//                 )
//               }
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className="bi bi-trash"
//                 viewBox="0 0 16 16"
//                 style={{ marginRight: "0.3rem" }}
//               >
//                 <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
//                 <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
//               </svg>
//               <span className="p-menuitem-text">Supprimer</span>
//             </a>
//           </div>
//         </div>
//         <div className="content">
//           <div className="shadow rounded mt-3 pr-1 bg-white">
//             <DataTable
//               lazy
//               value={departement}
//               tableStyle={{ minWidth: "50rem" }}
//               className=""
//               paginator
//               rowsPerPageOptions={[5, 10, 25, 50]}
//               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//               currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
//               emptyMessage="Aucun utilisateurs trouvé"
//               // paginatorLeft={paginatorLeft}
//               // paginatorRight={paginatorRight}
//               first={lazyState.first}
//               rows={lazyState.rows}
//               totalRecords={totalRecords}
//               onPage={onPage}
//               onSort={onSort}
//               sortField={lazyState.sortField}
//               sortOrder={lazyState.sortOrder}
//               onFilter={onFilter}
//               filters={lazyState.filters}
//               loading={loading}
//               selection={selectedItems}
//               onSelectionChange={onSelectionChange}
//               selectAll={selectAll}
//               onSelectAllChange={onSelectAllChange}
//               reorderableColumns
//               resizableColumns
//               columnResizeMode="expand"
//               paginatorClassName="rounded"
//               scrollable
//             // size="normal"
//             >
//               <Column
//                 selectionMode="multiple"
//                 frozen
//                 headerStyle={{ width: "3rem" }}
//               />

//               <Column
//                 field="NOM_DEPARTEMENT"
//                 header="Nom departement"
//                 sortable
//                 body={(item) => item?.NOM_DEPARTEMENT}
//               />
//                 <Column
//                 field="DESCRIPTION"
//                 header="Description"
//                 sortable
//                 body={(item) => item?.DESCRIPTION}
//               />
//               <Column
//                 field="ID_EMPLOYEUR"
//                 header="Employeur"
//                 sortable
//                 body={(item) => item.employeur?.NOM_EMPLOYEUR}
//               />
//               <Column
//                 field="DATE_INSERTION"
//                 header="Date d'insertion"
//                 sortable
//                 body={(item) => {
//                   return moment(item.employeur?.DATE_INSERTION).format("DD/MM/YYYY HH:ss");
//                 }}
//               />

//               <Column
//                 field=""
//                 header=""
//                 alignFrozen="right"
//                 frozen
//                 body={(item) => {
//                   const items = [

//                     {
//                       template: (deleteItem, options) => {
//                         return (
//                           <Link
//                             to={`/departement/edit/${inViewMenuItem?.ID_DEPARTEMENT}`}
//                             className="p-menuitem-link"
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               fill="currentColor"
//                               className="bi bi-pencil-square"
//                               viewBox="0 0 16 16"
//                               style={{ marginRight: "0.5rem" }}
//                             >
//                               <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
//                               <path
//                                 fillRule="evenodd"
//                                 d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
//                               />
//                             </svg>
//                             <span className="p-menuitem-text">Modifier</span>
//                           </Link>
//                         );
//                       },
//                     },
//                     {
//                       template: (deleteItem, options) => {
//                         return (
//                           <a
//                             href="#"
//                             className="p-menuitem-link text-danger"
//                             onClick={(e) =>
//                               handleDeletePress(e, [
//                                 inViewMenuItem.ID_DEPARTEMENT,
//                               ])
//                             }
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               fill="currentColor"
//                               className="bi bi-trash"
//                               viewBox="0 0 16 16"
//                               style={{ marginRight: "0.5rem" }}
//                             >
//                               <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
//                               <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
//                             </svg>
//                             <span className="p-menuitem-text text-danger">
//                               Supprimer
//                             </span>
//                           </a>
//                         );
//                       },
//                     },

//                   ];
//                   return (
//                     <>
//                       <SlideMenu
//                         ref={menu}
//                         model={items}
//                         popup
//                         viewportHeight={150}
//                         menuWidth={220}
//                         onHide={() => {
//                           setInViewMenuItem(null);
//                         }}
//                       />
//                       <Button
//                         rounded
//                         severity="secondary"
//                         text
//                         aria-label="Menu"
//                         size="small"
//                         className="mx-1"
//                         onClick={(event) => {

//                           setInViewMenuItem(item);
//                           setDetail_users(item)
//                           menu.current.toggle(event);
//                         }}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="16"
//                           height="16"
//                           fill="currentColor"
//                           className="bi bi-three-dots"
//                           viewBox="0 0 16 16"
//                         >
//                           <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
//                         </svg>
//                       </Button>

//                     </>
//                   );
//                 }}
//               />
//             </DataTable>
//           </div>
//         </div>
//       </div>
//       <Outlet />
//     </>

//     // <div>
//     //   <Authantifiaction />

//     // </div>
//   );
// }



// import React, { useState, useEffect, useRef } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Tag } from 'primereact/tag';
// import { CustomerService } from './service/CustomerService';

// export default function SubHeaderRowGroupDemo() {
//     const [customers, setCustomers] = useState([]);

//     useEffect(() => {
//         CustomerService.getCustomersMedium().then((data) => setCustomers(data));
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const headerTemplate = (data) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={data.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${data.representative.image}`} width="32" />
//                 <span className="font-bold">{data.representative.name}</span>
//             </div>
//         );
//     };

//     const footerTemplate = (data) => {
//         return (
//             <React.Fragment>
//                 <td colSpan="5">
//                     <div className="flex justify-content-end font-bold w-full">Total Customers: {calculateCustomerTotal(data.representative.name)}</div>
//                 </td>
//             </React.Fragment>
//         );
//     };

//     const countryBodyTemplate = (rowData) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={rowData.country.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//                 <span>{rowData.country.name}</span>
//             </div>
//         );
//     };

//     const statusBodyTemplate = (rowData) => {
//         return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
//     };

//     const calculateCustomerTotal = (name) => {
//         let total = 0;

//         if (customers) {
//             for (let customer of customers) {
//                 if (customer.representative.name === name) {
//                     total++;
//                 }
//             }
//         }

//         return total;
//     };

//     const getSeverity = (status) => {
//         switch (status) {
//             case 'unqualified':
//                 return 'danger';

//             case 'qualified':
//                 return 'success';

//             case 'new':
//                 return 'info';

//             case 'negotiation':
//                 return 'warning';

//             case 'renewal':
//                 return null;
//         }
//     };

//     return (
//         <div className="card">
//             <DataTable value={customers} rowGroupMode="subheader" groupRowsBy="representative.name" sortMode="single" sortField="representative.name"
//                     sortOrder={1} scrollable scrollHeight="400px" rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="name" header="Name" style={{ minWidth: '200px' }}></Column>
//                 <Column field="country" header="Country" body={countryBodyTemplate} style={{ minWidth: '200px' }}></Column>
//                 <Column field="company" header="Company" style={{ minWidth: '200px' }}></Column>
//                 <Column field="status" header="Status" body={statusBodyTemplate} style={{ minWidth: '200px' }}></Column>
//                 <Column field="date" header="Date" style={{ minWidth: '200px' }}></Column>
//             </DataTable>
//         </div>
//     );
// }
       


// import React, { useState, useEffect, useRef } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ProductService } from './service/ProductService';
// import { Rating } from 'primereact/rating';
// import { Button } from 'primereact/button';
// import { Tag } from 'primereact/tag';
// import { Toast } from 'primereact/toast';

// export default function RowExpansionDemo() {
//     const [products, setProducts] = useState([]);
//     const [rapport,setRapport] = useState([]);
//     const [expandedRows, setExpandedRows] = useState(null);
//     const toast = useRef(null);

//     // useEffect(() => {
//     //     ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
//     // }, []); // eslint-disable-line react-hooks/exhaustive-deps


//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // const response = await fetchApi(`/rapport_stage/faculte_depar/fetch?`);
//           const response = await fetchApi(`/rapport_stage/rapport/fetch?`);
//           setRapport(response.result.data);
//         } catch (error) {
//           console.error('Erreur lors de la récupérations des données', error);
//         }
//       };
//       fetchData();
//     }, [])


//     const onRowExpand = (event) => {
//         toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
//     };

//     const onRowCollapse = (event) => {
//         toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
//     };

//     const expandAll = () => {
//         let _expandedRows = {};

//         rapport.forEach((rap) => (_expandedRows[`${rap.ID_RAPPORT}`] = true));

//         setExpandedRows(_expandedRows);
//     };

//     const collapseAll = () => {
//         setExpandedRows(null);
//     };

//     const formatCurrency = (value) => {
//         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//     };

//     const amountBodyTemplate = (rowData) => {
//         return formatCurrency(rowData.etudiant.NUMERO_CARTE);
//     };

//     const statusOrderBodyTemplate = (rowData) => {
//         return <Tag value={rowData.status.toLowerCase()} severity={getOrderSeverity(rowData)}></Tag>;
//     };

//     const searchBodyTemplate = () => {
//         return <Button icon="pi pi-search" />;
//     };

//     const imageBodyTemplate = (rowData) => {
//         return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} width="64px" className="shadow-4" />;
//     };

//     const priceBodyTemplate = (rowData) => {
//         return formatCurrency(rowData.price);
//     };

//     const ratingBodyTemplate = (rowData) => {
//         return <Rating value={rowData.rating} readOnly cancel={false} />;
//     };

//     const statusBodyTemplate = (rowData) => {
//         return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
//     };

//     const getProductSeverity = (product) => {
//         switch (product.inventoryStatus) {
//             case 'INSTOCK':
//                 return 'success';

//             case 'LOWSTOCK':
//                 return 'warning';

//             case 'OUTOFSTOCK':
//                 return 'danger';

//             default:
//                 return null;
//         }
//     };

//     const getOrderSeverity = (order) => {
//         switch (order.status) {
//             case 'DELIVERED':
//                 return 'success';

//             case 'CANCELLED':
//                 return 'danger';

//             case 'PENDING':
//                 return 'warning';

//             case 'RETURNED':
//                 return 'info';

//             default:
//                 return null;
//         }
//     };

//     const allowExpansion = (rowData) => {
//         return rowData.orders.length > 0;
//     };

//     const rowExpansionTemplate = (data) => {
//         return (
//             <div className="p-3">
//                 <h5>Orders for {data.name}</h5>
//                 <DataTable value={data.orders}>
//                     <Column field="id" header="Id" sortable></Column>
//                     <Column field="customer" header="Customer" sortable></Column>
//                     <Column field="date" header="Date" sortable></Column>
//                     <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
//                     <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
//                     <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
//                 </DataTable>
//             </div>
//         );
//     };

//     const header = (
//         <div className="flex flex-wrap justify-content-end gap-2">
//             <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
//             <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
//         </div>
//     );

//     return (
//         <div className="card">
//             <Toast ref={toast} />
//             <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
//                     onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
//                     dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}>
//                 <Column expander={allowExpansion} style={{ width: '5rem' }} />
//                 <Column field="name" header="Name" sortable />
//                 <Column header="Image" body={imageBodyTemplate} />
//                 {/* <Column field="price" header="Price" sortable body={priceBodyTemplate} /> */}
//                 <Column field="category" header="Category" sortable />
//                 <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} />
//                 <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate} />
//             </DataTable>
//         </div>
//     );
// }
        

