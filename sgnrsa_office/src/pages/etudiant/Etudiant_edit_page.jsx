import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from "primereact/image";
import { etudiant_routes_items } from "../../routes/rapport_stage/etudiant_routes";
import { RadioButton } from "primereact/radiobutton";
const initialForm = {
  NOM: '',
  PRENOM: '',
  EMAIL: '',
  ID_DEPARTEMENT: null,
  ID_ENCA: null,
  DATE_NAISSANCE: '',
  GENRE:'',
  PROFIL: null,
  ADRESS: '',
};

export default function Etudiant_edit_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { ID_ETUD } = useParams();
  const [etudiant, setEtudiant] = useState(null);
  const [departments, setDepartments] = useState([])
  const [genre, setGenre] = useState('');

  // console.log(departement,'departement');


  const [loadingDepartement, setLoadingDepartement] = useState(true);

  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {

    NOM: {
      required: true,
      length: [1, 50],
      alpha: true
    },
    PRENOM: {
      required: true,
      length: [1, 50],
      alpha: true
    },
    EMAIL: {
      required: true,
      length: [1, 100],
      alpha: true
    },
    ID_DEPARTEMENT: {
      required: true
    },
    ID_ENCA: {
      required: true
    },
    DATE_NAISSANCE: {
      required: true
    },
    PROFIL: {
      required: true,
    },
    ADRESS: {
      required: true,
      length: [1, 150],
      alpha: true
    }

  }, {
    NOM: {
      required: "Ce champ est obligatoire",
      length: "Le nom ne doit etre depasser max(50 carateres)",
      alpha: "Le nom est invalide"
    },
    PRENOM: {
      required: "Ce champ est obligatoire",
      length: "Le prenom ne doit etre depasser max(50 carateres)",
      alpha: "Le prenom est invalide"
    },
    EMAIL: {
      required: "Ce champ est obligatoire",
      length: "Le email ne doit etre depasser max(100 carateres)",
      alpha: "Le email est invalide"
    },
    ID_DEPARTEMENT: {
      required: "Ce champ est obligatoire"
    },
    ID_ENCA: {
      required: "Ce champ est obligatoire"
    },
    DATE_NAISSANCE: {
      required: "Ce champ est obligatoire"
    },
    PROFIL: {
      required: "Ce champ est obligatoire"
    },
    ADRESS: {
      required: "Ce champ est obligatoire",
      length: "L'addresse ne doit etre depasser max(150 carateres)",
      alpha: "L'addresse est invalide"
    },

  })

  const handleVisibility = (e) => {
    setShowCalendar(!showCalendar);
  };

  // Liste deroularantes des departements
    const fetchDepartements = useCallback(async () => {
      try {
        const res = await fetchApi("/rapport_stage/faculte_depar/fetch")
        // return console.log(res.result.data);
  
        setDepartments(res.result.data.map(depar => {
          return {
            name: depar.NOM_DEPARTEMENT,
            code: depar.ID_DEPARTEMENT
          }
        }))
      } catch (error) {
        console.log(error)
      }
    }, [])
  
    useEffect(() => {
      fetchDepartements()
    }, [])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM", data.NOM);
        form.append("PRENOM", data.PRENOM);
        form.append("EMAIL", data.EMAIL);
        form.append("ID_DEPARTEMENT", data.ID_DEPARTEMENT?.code ? data.ID_DEPARTEMENT?.code : '');
        form.append("ID_ENCA", data.ID_ENCA?.code ? data.ID_ENCA?.code : '');
        form.append("DATE_NAISSANCE", data.DATE_NAISSANCE);
        form.append("GENRE",genre),
        form.append("PROFIL", data.PROFIL);
        form.append("ADRESS", data.ADRESS);

        const res = await fetchApi(`/rapport_stage/etudiant/update/${ID_ETUD}`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: "Etudiant modifié",
            detail: "Etudiants a été modifié avec succès",
            life: 3000,
          })
        );
        navigate("/etudiant");
      }
      else {
        console.log(getErrors())
        setErrors(getErrors());
        dispacth(
          setToastAction({
            severity: "error",
            summary: 'La validation des données a échouée',
            detail: 'Veuillez corriger les erreurs mentionnées pour continuer',
            life: 3000,
          })
        );
        await wait(500)
        const header = document.querySelector('header')
        const nav = document.querySelector('nav')
        const firstErrorElement = document.querySelector(".p-invalid")
        if (firstErrorElement) {
          var headerHeight = 0
          if (header) headerHeight += header.offsetHeight
          if (nav) headerHeight += nav.offsetHeight
          const scrollPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }

      }
    }
    catch (error) {
      console.log(error)
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result);
        dispacth(setToastAction({
          severity: 'error',
          summary: 'Erreur du système',
          detail: 'Erreur du système, réessayez plus tard',
          life: 3000
        }));
        await wait(500)
        const header = document.querySelector('header')
        const nav = document.querySelector('nav')
        const firstErrorElement = document.querySelector(".p-invalid")
        if (firstErrorElement) {
          var headerHeight = 0
          if (header) headerHeight += header.offsetHeight
          if (nav) headerHeight += nav.offsetHeight
          const scrollPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      } else {
        dispacth(setToastAction({
          severity: 'error',
          summary: 'Erreur du système',
          detail: 'Erreur du système, réessayez plus tard',
          life: 3000
        }));
      }

    } finally {
      setIsSubmitting(false)
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi(`/rapport_stage/etudiant/find/${ID_ETUD}`);
        const etudiant = res.result;
        // return console.log(dep,"entreprise");

        setEtudiant(etudiant);
        setData({
          NOM: etudiant?.NOM,
          PRENOM: etudiant?.PRENOM,
          EMAIL: etudiant?.EMAIL,
          TITRE: etudiant?.TITRE,
          TEL: etudiant?.TEL

        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingDepartement(false);
      }
    })();
  }, []);

  useEffect(() => {
    dispacth(
      setBreadCrumbItemsAction([
        etudiant_routes_items.etudiant,
        etudiant_routes_items.edit_etudiant
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);



  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  if (loadingDepartement) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 w-100">
        <div className="spinner-border" role="status" />
      </div>
    );
  }
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h4 className="mb-3">
            {etudiant?.NOM}
          </h4>
          <hr className="w-100" />
        </div>
       <form className="form w-100 mt-6" onSubmit={handleSubmit}>
     
               <div className="form-group col-sm mt-5">
                 <div className="row align-items-center">
     
                   <div className="col-md-6">
                     <label htmlFor="NOM" className="label mb-1">Nom</label>
                     <InputText
                       type="text"
                       placeholder="Ecrire le nom"
                       id="NOM"
                       name="NOM"
                       value={data.NOM}
                       onChange={handleChange}
                       onBlur={checkFieldData}
                       className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("NOM") ? getError("NOM") : ""}
                     </div>
                   </div>
     
     
                   <div className="col-md-6">
                     <label htmlFor="PRENOM" className="label mb-1">Prenom</label>
                     <InputText
                       type="text"
                       placeholder="Ecrire le prenom"
                       id="PRENOM"
                       name="PRENOM"
                       value={data.PRENOM}
                       onChange={handleChange}
                       onBlur={checkFieldData}
                       className={`w-100 ${hasError("PRENOM") ? "p-invalid" : ""}`}
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("PRENOM") ? getError("PRENOM") : ""}
                     </div>
                   </div>
     
                   <div className="col-md-6">
                     <label htmlFor="EMAIL" className="label mb-1">Email</label>
                     <InputText
                       type="text"
                       placeholder="Ecrire le email"
                       id="EMAIL"
                       name="EMAIL"
                       value={data.EMAIL}
                       onChange={handleChange}
                       onBlur={checkFieldData}
                       className={`w-100 ${hasError("EMAIL") ? "p-invalid" : ""}`}
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("EMAIL") ? getError("EMAIL") : ""}
                     </div>
                   </div>
     
                   <div className="col-md-6">
                     <label htmlFor="ID_DEPARTEMENT" className="label mb-1">Departement</label>
                     <Dropdown
                       value={data.ID_DEPARTEMENT}
                       options={departments}
                       onChange={(e) => setValue("ID_DEPARTEMENT", e.value)}
                       optionLabel="name"
                       id="ID_DEPARTEMENT"
                       filter
                       filterBy="name"
                       placeholder="Sélectionner le departement"
                       emptyFilterMessage="Aucun element trouvee"
                       emptyMessage="Aucun element trouvee"
                       name="ID_DEPARTEMENT"
                       onHide={() => {
                         checkFieldData({ target: { name: "ID_DEPARTEMENT" } });
                       }}
                       className={`w-100 ${hasError("ID_DEPARTEMENT") ? "p-invalid" : ""}`}
                       showClear
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("ID_DEPARTEMENT") ? getError("ID_DEPARTEMENT") : ""}
                     </div>
                   </div>
     
                   <div className="col-md-6">
                     <label htmlFor="ID_DEPARTEMENT" className="label mb-1">Encandreur</label>
                     <Dropdown
                       value={data.ID_ENCA}
                       options={departments}
                       onChange={(e) => setValue("ID_ENCA", e.value)}
                       optionLabel="name"
                       id="ID_ENCA"
                       filter
                       filterBy="name"
                       placeholder="Sélectionner l'encadreur"
                       emptyFilterMessage="Aucun element trouvee"
                       emptyMessage="Aucun element trouvee"
                       name="ID_ENCA"
                       onHide={() => {
                         checkFieldData({ target: { name: "ID_ENCA" } });
                       }}
                       className={`w-100 ${hasError("ID_ENCA") ? "p-invalid" : ""}`}
                       showClear
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("ID_ENCA") ? getError("ID_ENCA") : ""}
                     </div>
                   </div>
     
                   <div className="col-md-6">
                     <label htmlFor="ADRESS" className="label mb-1">Adresse</label>
                     <InputText
                       type="text"
                       placeholder="Ecrire l'adresse"
                       id="ADRESS"
                       name="ADRESS"
                       value={data.ADRESS}
                       onChange={handleChange}
                       onBlur={checkFieldData}
                       className={`w-100 ${hasError("ADRESS") ? "p-invalid" : ""}`}
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("ADRESS") ? getError("ADRESS") : ""}
                     </div>
                   </div>
     
     
     
                   <div className="col-md-6">
                     <label htmlFor="DATE_NAISSANCE" className="label mb-1">Date de naissance</label>
                     <Calendar
                       value={data.DATE_NAISSANCE}
                       name="DATE_NAISSANCE"
                       onChange={(e) => {
                         setValue("DATE_NAISSANCE", e.value);
                         setError("DATE_NAISSANCE", {});
                       }}
                       placeholder="Chosir la date de naissance "
                       inputClassName="w-100"
                       onHide={() => {
                         checkFieldData({ target: { name: "DATE_NAISSANCE" } });
                       }}
                       className={`d-block w-100 ${hasError("DATE_NAISSANCE") ? "p-invalid" : ""
                         }`}
                     />
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("DATE_NAISSANCE") ? getError("DATE_NAISSANCE") : ""}
                     </div>
                   </div>
     
     
                   <div className="col-md-6">
                     <label htmlFor="GENRE" className="label mb-1">Genre</label>
                     <div className="flex flex-wrap gap-3">
     
                       <div className="flex align-items-center">
                         <RadioButton inputId="homme" name="homme" value={1} onChange={(e) => setGenre(e.value)} checked={genre === 1} />
                         <label htmlFor="homme" className="ml-2">Homme</label>
                       </div>
                       <div className="flex align-items-center">
                         <RadioButton inputId="femme" name="femme" value={2} onChange={(e) => setGenre(e.value)} checked={genre === 2} />
                         <label htmlFor="femme" className="ml-2">Femme</label>
                       </div>
                     </div>
     
                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                       {hasError("GENRE") ? getError("GENRE") : ""}
                     </div>
                   </div>
     
                   <div className="col-md-8">
                     <div className="col-md-4">
                       <label htmlFor="PROFIL" className="label mb-1">Profil</label>
                       <FileUpload
                         chooseLabel="Choisir l'image"
                         cancelLabel="Annuler"
                         name="image"
                         uploadOptions={{
                           style: { display: "none" },
                         }}
                         // className="p-invalid"
                         accept="image/*"
                         maxFileSize={4000000}
                         invalidFileSizeMessageDetail='Image est trop lourd'
                         emptyTemplate={
                           <p className="m-0">Glisser et déposez l'image ici.</p>
                         }
                         onSelect={async (e) => {
                           const file = e.files[0];
                           setValue("PROFIL", file);
                         }}
                         onClear={() => {
                           setError("PROFIL", {});
                         }}
                         className={`w-100 ${hasError("PROFIL") ? "p-invalid" : ""}`}
                       />
     
                     </div>
     
                   </div>
     
     
     
     
     
     
     
     
     
     
     
     
                   <div>
     
     
                     {/* {
                       data.DESCRIPTION ?
                         <>
     
     
                           {data.DEPARTEMENTS.map((dep, index) => (
     
     
                             <>
     
     
                               <div className="form-group col-sm mt-5">
                                 <div className="row align-items-center">
     
                                   <div className="col-md-6">
                                     <label htmlFor={`NOM_DEPARTEMENT ${index}`} className="label mb-1">Nom</label>
     
                                     <InputText
                                       id={`NOM_DEPARTEMENT ${index}`}
                                       name={`NOM_DEPARTEMENT ${index}`}
                                       value={dep.NOM_DEPARTEMENT}
                                       onChange={(e) => handleDepartmentChange(index, 'NOM_DEPARTEMENT', e.target.value)}
                                       className={`w-100 ${hasError(`NOM_DEPARTEMENT ${index}`) ? "p-invalid" : ""}`}
                                     />
     
                                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                                       {hasError(`NOM_DEPARTEMENT ${index}`) ? getError(`NOM_DEPARTEMENT ${index}`) : ""}
                                     </div>
                                   </div>
     
                                   <div className="col-md-6">
                                     <label htmlFor={`DESIGNATION_DEP ${index}`} className="label mb-1">Description</label>
     
                                     <InputText
                                       id={`DESIGNATION_DEP ${index}`}
                                       name={`DESIGNATION_DEP ${index}`}
                                       value={dep.DESIGNATION_DEP}
                                       onChange={(e) => handleDepartmentChange(index, 'DESIGNATION_DEP', e.target.value)}
                                       className={`w-100 ${hasError(`DESIGNATION_DEP ${index}`) ? "p-invalid" : ""}`}
                                     />
                                     <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                                       {hasError(`DESIGNATION_DEP ${index}`) ? getError(`DESIGNATION_DEP ${index}`) : ""}
                                     </div>
     
                                   </div>
                                 </div>
     
                               </div>
                             </>
     
                           ))}
     
                         </>
     
                         : ''
                     } */}
     
     
                   </div>
     
                 </div>
     
               </div>
     
               <div
                 style={{ position: "absolute", bottom: 0, right: 0 }}
                 className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
               >
                 <Button
                   label="Reinitialiser"
                   type="reset"
                   outlined
                   className="mt-3"
                   size="small"
                   onClick={(e) => {
                     e.preventDefault();
                     setData(initialForm);
                     setErrors({});
                   }}
                 />
     
                 <Button
                   label="envoyer"
                   type="submit"
                   className="mt-3 ml-3"
                   size="small"
                   disabled={isSubmitting}
                 />
               </div>
             </form >
      </div>
    </>
  );
}
