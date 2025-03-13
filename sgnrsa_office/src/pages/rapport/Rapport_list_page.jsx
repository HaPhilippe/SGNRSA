
import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumbItemsAction, setToastAction, } from "../../store/actions/appActions";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SlideMenu } from "primereact/slidemenu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Loading from "../../components/app/Loading";
import { Image } from "primereact/image";
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';
import { rapport_routes_items } from "../../routes/rapport_stage/rapport_routes";


export default function Rapport_list_page() {


  const [selectedCity, setSelectedCity] = useState(null);
  const [date, setDate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [faculteDepart, setFaculteDepart] = useState([]);
  // console.log(faculteDepart);

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const [selectedItems, setSelectedItems] = useState(null);
  const menu = useRef(null);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);
  const [globalLoading, setGloabalLoading] = useState(false);

  const [visibleStatut, setVisibleStatut] = useState(false);
  const [lastId, setLastId] = useState(null);

  const navigate = useNavigate();

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

  const dispacth = useDispatch();
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

  const fetchFaculte_departement = useCallback(async () => {
    try {
      setLoading(true);
      const baseurl = `/rapport_stage/faculte_depar/fetch?`;
      var url = baseurl;
      for (let key in lazyState) {
        const value = lazyState[key];
        if (value) {
          if (typeof value == "object") {
            url += `${key}=${JSON.stringify(value)}&`;
          } else {
            url += `${key}=${value}&`;
          }
        }
      }
      const res = await fetchApi(url);
      setFaculteDepart(res.result.data);
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




  const ComfirmeDialogForCreateLotProduction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    confirmDialog({
      headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
      headerClassName: "text-black",
      header: "Enregistrement un rapport ?",
      message: (
        <div className="d-flex flex-column align-items-center">
          <div className="text-center mt-5">
            Voulez-vous vraiment enregistrement un rapport?
          </div>
        </div>
      ),

      acceptClassName: "p-button-danger",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        navigate("/rapport/add");

      },
    });
  };


  return (
    <>
      <ConfirmDialog />
      {globalLoading && <Loading />}
      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Rapports</h1>
          <Button
            label="Nouveau"
            icon="pi pi-plus"
            size="small"
            onClick={(e) => {
              ComfirmeDialogForCreateLotProduction(e)
            }}
          />

        </div>
        <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
          <div className="d-flex  align-items-center">
            <div className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="Recherche"
                className="p-inputtext-sm"
                style={{ minWidth: 300 }}
                onInput={(e) =>
                  setlazyState((s) => ({ ...s, search: e.target.value }))
                }
              />
            </div>

          </div>
          <div className="selection-actions d-flex align-items-center">
            <div className="text-muted mx-3">
              {selectedItems ? selectedItems.length : "0"} selectionné
              {selectedItems?.length > 1 && "s"}
            </div>
            <a
              href="#"
              className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length == 0) &&
                "opacity-50 pointer-events-none"
                }`}
              style={{}}
              onClick={(e) =>
                handleDeletePress(e, selectedItems.map((item) => item.ID_FAC))
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                style={{ marginRight: "0.3rem" }}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span className="p-menuitem-text">Supprimer</span>
            </a>
          </div>
        </div>
        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={faculteDepart}
              tableStyle={{ minWidth: "50rem" }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun lot production trouvé"
              // paginatorLeft={paginatorLeft}
              // paginatorRight={paginatorRight}
              first={lazyState.first}
              rows={lazyState.rows}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              onFilter={onFilter}
              filters={lazyState.filters}
              loading={loading}
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              selectAll={selectAll}
              onSelectAllChange={onSelectAllChange}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
            // size="normal"
            >
              <Column
                selectionMode="multiple"
                frozen
                headerStyle={{ width: "3rem" }}
              />

              
              <Column
                field="NOM"
                header="Faculté"
                frozen
                sortable
                body={(item) => {
                  const css = `
                            .round-indicator .p-image-preview-indicator {
                            border-radius: 50%
                            }`;
                  return (

                    // <>
                    //   <Tooltip target={`#Nocmnde-${item.faculte.NOM}`} className="w-4">
                    //     <div className="form-group col-md">
                    //       <div className="row d-flex">
                           
                    //         <div className="col-sm ml-1">
                    //           <div className="form-group col-sm">
                    //             <div className="row">
                    //               <div className="col-md-4">
                    //                 <label className="label mb-1">Faculté</label>
                    //               </div>
                    //               <div className="col-sm">: {item?.faculte.NOM}</div>
                    //             </div>
                    //           </div>
                    //           <div className="form-group col-sm">
                    //             <div className="row">
                    //               <div className="col-md-4">
                    //                 <label className="label mb-1">Date</label>
                    //               </div>
                    //               <div className="col-sm">: {moment(item.DATE_INSERTION).format("DD/MM/YYYY")}</div>
                    //             </div>
                    //           </div>


                    //         </div>
                    //       </div>
                    //     </div>
                    //   </Tooltip>
                    //   <Link
                    //     id={`Nocmnde-${item?.ID_FAC
                    //       }`}
                    //     className="text-decoration-none d-flex round-indicator"
                    //     style={{ color: '#399af2' }}
                    //     to={`/facultedepartement/add/${item?.ID_FAC}`}
                    //     onClick={(e) => {
                    //       e.stopPropagation();
                    //     }}
                    //     data-pr-position="bottom"
                    //   >
                    //     <span>{item?.faculte?.NOM}</span>
                    //   </Link>
                    // </>
                    <>
                    </>
                  );
                }}
              />


              <Column
                field="NOM_DEPARTEMENT"
                header="Département"
                sortable
                body={(item) => {
                  return (
                    // <span>{item.VALEUR ? parseInt(item.VALEUR).toLocaleString('fr-FR') : 0} Fbu</span>
                    <span>{item?.NOM_DEPARTEMENT
                    }</span>

                  );
                }}
              />
              <Column
                field="DESCRIPTION"
                header="Description"
                sortable
                body={(item) => {
                  return (
                    // <span>{item.VALEUR ? parseInt(item.VALEUR).toLocaleString('fr-FR') : 0} Fbu</span>
                    <span>{item?.faculte?.DESCRIPTION
                    }</span>

                  );
                }}
              />

              <Column
                field="DATE_INSERTION "
                header="Date "
                sortable
                body={(item) => {
                  return moment(item.DATE_INSERTION).format("DD/MM/YYYY");

                }}
              />
            
            </DataTable>
          </div>
        </div >
      </div >
      <Outlet />
    </>
  );

}
