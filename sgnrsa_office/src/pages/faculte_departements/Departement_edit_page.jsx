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
import { rapport_stage_routes_items } from "../../routes/rapport_stage/rapport_stage_routes";

const initialForm = {
  NOM_DEPARTEMENT: "",
  DESIGNATION_DEP: ""
};

export default function Departement_edit_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { ID_DEPARTEMENT } = useParams();
  const [departement, setDepartements] = useState(null);

  // console.log(departement,'departement');
  
  
  const [loadingDepartement, setLoadingDepartement] = useState(true);

  const {hasError,getError,setErrors,checkFieldData,isValidate,setError,getErrors} = useFormErrorsHandle(data, {

    NOM_DEPARTEMENT: {
      required: true,
      length: [1, 50],
      alpha:true
    },
    DESIGNATION_DEP: {
      required: true,
      length: [1, 50],
      alpha: true,
    },
  });
  const handleVisibility = (e) => {
    setShowCalendar(!showCalendar);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM_DEPARTEMENT", data.NOM_DEPARTEMENT);
        form.append("DESIGNATION_DEP", data.DESIGNATION_DEP);
        

        const res = await fetchApi(`/rapport_stage/faculte_depar/updatedep/${ID_DEPARTEMENT}`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: "Département modifié",
            detail: "Département a été modifié avec succès",
            life: 3000,
          })
        );
        navigate("/facultedep");
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
        const res = await fetchApi(`/rapport_stage/faculte_depar/finddep/${ID_DEPARTEMENT}`);
        const dep= res.result;
        // return console.log(dep,"dep");
        

        setDepartements(dep);
        setData({
          DESIGNATION_DEP: dep?.DESIGNATION_DEP,
          NOM_DEPARTEMENT: dep?.NOM_DEPARTEMENT
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
     rapport_stage_routes_items.facultedep,
     rapport_stage_routes_items.edit_departement,
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
            {departement?.NOM_DEPARTEMENT}
          </h4>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM_DEPARTEMENT" className="label mb-1">
                  Nom departement
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Ecrire le nom de departement"
                  id="NOM_DEPARTEMENT"
                  name="NOM_DEPARTEMENT"
                  value={data.NOM_DEPARTEMENT}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("NOM_DEPARTEMENT") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("NOM_DEPARTEMENT") ? getError("NOM_DEPARTEMENT") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="" className="label mb-1">
                  Description
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire la description"
                  name="DESIGNATION_DEP"
                  id="DESIGNATION_DEP"
                  value={data.DESIGNATION_DEP}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("DESIGNATION_DEP") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("DESIGNATION_DEP") ? getError("DESIGNATION_DEP") : ""}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
            <Button
              label="Annuler"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                navigate("/");
              }}
            />
            <Button
              label="Modifier"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              disabled={ isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
}
