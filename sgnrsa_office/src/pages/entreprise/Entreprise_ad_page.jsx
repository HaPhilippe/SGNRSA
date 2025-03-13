import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import { rapport_stage_routes_items } from "../../routes/rapport_stage/rapport_stage_routes";
import { entreprise_routes_items } from "../../routes/rapport_stage/entreprise_routes";

const initialForm = {
  NOM_ENTREPR: '',
  ADRESSE_ENTREPR: '',
  SECTEUR: '',
  ADRESSE_ENTREPR: '',
  EMAIL: '',
  LOGO_ENTREPR: null
};

export default function Faculte_departements_ad_page() {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [nbreindex, setNbrIndex] = useState(0)
  // console.log(nbreindex + 2, 'nbreindex');

  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {

    NOM_ENTREPR: {
      required: true,
      length: [1, 100],
      alpha: true
    },
    ADRESSE_ENTREPR: {
      required: true,
      length: [1, 200],
      alpha: true
    },
    // LOGO_ENTREPR: {
    //   required: true,
    //   image: 4000000
    // },
    SECTEUR: {
      required: true,
      length: [1, 50],
      alpha: true
    },
    NOM_TUT: {
      required: true,
      length: [1, 50],
      alpha: true
    },
    PRENOM_TUT: {
      required: true,
      length: [1, 50],
      alpha: true
    },
    EMAIL: {
      required: true,
      length: [1, 250],
      alpha: true
    }
  }, {
    NOM_ENTREPR: {
      required: "Ce champ est obligatoire",
      length: "Le nom d'entreprise ne doit etre depasser max(100 carateres)",
      alpha: "Le nom d'entrepriseest invalide"
    },

    ADRESSE_ENTREPR: {
      required: "Ce champ est obligatoire",
      length: "La description ne doit etre depasser max(200 carateres)",
      alpha: "Le prenom est invalide"
    },
    // LOGO_ENTREPR: {
    //    required: "Ce champ est obligatoire",
    //   image: "L'image ne doit pas depasser 4Mo "
    // },
    SECTEUR: {
      required: "Ce champ est obligatoire",
      length: "Le secteur d'entreprise ne doit etre depasser max(50 carateres)",
      alpha: "Le secteur d'entrepriseest invalide"
    },
    NOM_TUT: {
      required: "Ce champ est obligatoire",
      length: "Le nom  du tuteur ne doit etre depasser max(50 carateres)",
      alpha: "Le nom du tuteur est invalide"
    },
    PRENOM_TUT: {
      required: "Ce champ est obligatoire",
      length: "Le prenom  du tuteur ne doit etre depasser max(50 carateres)",
      alpha: "Le prenom du tuteur est invalide"
    },
    EMAIL: {
      required: "Ce champ est obligatoire",
      length: "L'email ne doit etre depasser max(250 carateres)",
      alpha: "L'email est invalide"
    },
  })



  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM_ENTREPR", data.NOM_ENTREPR);
        form.append("ADRESSE_ENTREPR", data.ADRESSE_ENTREPR);
        form.append("SECTEUR", data.SECTEUR);
        form.append("NOM_TUT", data.NOM_TUT);
        form.append("PRENOM_TUT", data.PRENOM_TUT);
        form.append("EMAIL", data.EMAIL);
        if (data?.LOGO_ENTREPR) {
          form.append('LOGO_ENTREPR', data?.LOGO_ENTREPR)
        }
        
        const res = await fetchApi(`/rapport_stage/entreprise/create?`, {
          method: 'POST',
          body: form
        })

        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Entreprise enregistré',
            detail: "L'entreprise a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/entreprise')
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
    dispacth(setBreadCrumbItemsAction([
      entreprise_routes_items.entreprise,
      entreprise_routes_items.add_entreprise
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])


  const invalidClass = name => hasError(name) ? 'is-invalid' : ''
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h4 className="mb-3">Nouvelle entreprise</h4>
          <hr className="w-100" />
        </div>



        <form className="form w-100 mt-6" onSubmit={handleSubmit}>

          <div className="form-group col-sm mt-5">
            <div className="row align-items-center">

              <div className="col-md-6">
                <label htmlFor="NOM_ENTREPR" className="label mb-1">Entreprise</label>
                <InputText
                  type="text"
                  placeholder="Ecrire la faculté"
                  id="NOM_ENTREPR"
                  name="NOM_ENTREPR"
                  value={data.NOM_ENTREPR}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("NOM_ENTREPR") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("NOM_ENTREPR") ? getError("NOM_ENTREPR") : ""}
                </div>
              </div>


              <div className="col-md-6">
                <label htmlFor="ADRESSE_ENTREPR" className="label mb-1">Addresse</label>
                <InputText
                  type="text"
                  placeholder="Ecrire l'addresse de lentreprise"
                  id="ADRESSE_ENTREPR"
                  name="ADRESSE_ENTREPR"
                  value={data.ADRESSE_ENTREPR}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("ADRESSE_ENTREPR") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ADRESSE_ENTREPR") ? getError("ADRESSE_ENTREPR") : ""}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="SECTEUR" className="label mb-1">Secteur</label>
                <InputText
                  type="text"
                  placeholder="Ecrire le secteur de lentreprise"
                  id="SECTEUR"
                  name="SECTEUR"
                  value={data.SECTEUR}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("SECTEUR") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("SECTEUR") ? getError("SECTEUR") : ""}
                </div>
              </div>


              {
                data.SECTEUR ?
                  <>
                    <div className="col-md-6">
                      <label htmlFor="NOM_TUT" className="label mb-1">Nom tuteur</label>
                      <InputText
                        type="text"
                        placeholder="Ecrire le nom tuteur"
                        id="NOM_TUT"
                        name="NOM_TUT"
                        value={data.NOM_TUT}
                        onChange={handleChange}
                        onBlur={checkFieldData}
                        className={`w-100 ${hasError("NOM_TUT") ? "p-invalid" : ""}`}
                      />
                      <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                        {hasError("NOM_TUT") ? getError("NOM_TUT") : ""}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="PRENOM_TUT" className="label mb-1">Prenom</label>
                      <InputText
                        type="text"
                        placeholder="Ecrire le prenom"
                        id="PRENOM_TUT"
                        name="PRENOM_TUT"
                        value={data.PRENOM_TUT}
                        onChange={handleChange}
                        onBlur={checkFieldData}
                        className={`w-100 ${hasError("PRENOM_TUT") ? "p-invalid" : ""}`}
                      />
                      <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                        {hasError("PRENOM_TUT") ? getError("PRENOM_TUT") : ""}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="EMAIL" className="label mb-1">Email</label>
                      <InputText
                        type="text"
                        placeholder="Ecrire l'email"
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

                  </>

                  : ''
              }


              <div className="col-md-8">
                <div className="col-md-4">
                  <label htmlFor="LOGO_ENTREPR" className="label mb-1">Logo entreprise</label>
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
                      setValue("LOGO_ENTREPR", file);
                    }}
                    onClear={() => {
                      setError("LOGO_ENTREPR", {});
                    }}
                    className={`w-100 ${hasError("LOGO_ENTREPR") ? "p-invalid" : ""}`}
                  />
                  {/* <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("LOGO_ENTREPR") ? getError("LOGO_ENTREPR") : ""}
                  </div> */}
                </div>

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

            {/* <Button
              label="+ Département"
              type="button"
              className="mt-3 ml-3"
              size="small"
              onClick={addDepartment}
            /> */}
            <Button
              label="Envoyer"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              disabled={isSubmitting}
            />
          </div>
        </form >

      </div >
    </>
  )
}


