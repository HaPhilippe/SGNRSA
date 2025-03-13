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

const initialForm = {
  NOM: '',
  DESCRIPTION: '',
  DEPARTEMENTS: [{ NOM_DEPARTEMENT: '', DESIGNATION_DEP: '' }] // État pour les départements
};

export default function Faculte_departements_ad_page() {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [nbreindex, setNbrIndex] = useState(0)
  // console.log(nbreindex + 2, 'nbreindex');

  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {

    NOM: {
      required: true,
      length: [1, 100],
      alpha: true
    },
    DESCRIPTION: {
      required: true,
      length: [1, 250],
      alpha: true
    },


  }, {
    NOM: {
      required: "Ce champ est obligatoire",
      length: "Le nom ne doit etre depasser max(150 carateres)",
      alpha: "Le nom est invalide"
    },
    DESCRIPTION: {
      required: "Ce champ est obligatoire",
      length: "La description ne doit etre depasser max(250 carateres)",
      alpha: "Le prenom est invalide"
    }
  })

  const handleDepartmentChange = (index, field, value) => {
    const newDepartements = [...data.DEPARTEMENTS];

    setNbrIndex(newDepartements.length)

    newDepartements[index][field] = value;
    setData({ ...data, DEPARTEMENTS: newDepartements });
  };

  const addDepartment = () => {
    setData({ ...data, DEPARTEMENTS: [...data.DEPARTEMENTS, { NOM_DEPARTEMENT: '', DESIGNATION_DEP: '' }] });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM", data.NOM);
        form.append("DESCRIPTION", data.DESCRIPTION);
        form.append("TAILLE", nbreindex)

        // Ajout des départements
        data.DEPARTEMENTS.forEach((dep, index) => {
          form.append(`DEPARTEMENTS[${index}][NOM_DEPARTEMENT]`, dep.NOM_DEPARTEMENT);
          form.append(`DEPARTEMENTS[${index}][DESIGNATION_DEP]`, dep.DESIGNATION_DEP);
        });

        const res = await fetchApi(`/rapport_stage/faculte_depar/create?`, {
          method: 'POST',
          body: form
        })

        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Faculté enregistré',
            detail: "La faculté a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/')
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
      rapport_stage_routes_items.facultedep,
      rapport_stage_routes_items.add_facultedep
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
          <h4 className="mb-3">Nouvelle faculté</h4>
          <hr className="w-100" />
        </div>



        <form className="form w-100 mt-6" onSubmit={handleSubmit}>

          <div className="form-group col-sm mt-5">
            <div className="row align-items-center">

              <div className="col-md-6">
                <label htmlFor="NOM" className="label mb-1">Faculté</label>
                <InputText
                  type="text"
                  placeholder="Ecrire la faculté"
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
                <label htmlFor="DESCRIPTION" className="label mb-1">Description</label>
                <InputText
                  type="text"
                  placeholder="Ecrire la description"
                  id="DESCRIPTION"
                  name="DESCRIPTION"
                  value={data.DESCRIPTION}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("DESCRIPTION") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
                </div>
              </div>

              <div>


                {
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
                }


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
              label="+ Département"
              type="button"
              className="mt-3 ml-3"
              size="small"
              onClick={addDepartment}
            />
            <Button
              label="Valider"
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


