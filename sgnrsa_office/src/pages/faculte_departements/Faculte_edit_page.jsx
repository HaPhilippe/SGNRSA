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
  NOM: "",
  DESCRIPTION: ""
};

export default function Faculte_edit_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { ID_FAC } = useParams();
  const [faculte, setFaculte] = useState(null);
  // console.log(faculte,'faculte');
  
  const [loadingFaculte, setLoadingFaculte] = useState(true);

  const {hasError,getError,setErrors,checkFieldData,isValidate,setError,getErrors} = useFormErrorsHandle(data, {
    NOM: {
      required: true,
      alpha: true,
      length: [1, 50],
    },
    DESCRIPTION: {
      required: true,
      alpha: true,
      length: [1, 50],
    }
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
        form.append("NOM", data.NOM);
        form.append("DESCRIPTION", data.DESCRIPTION);
      
        const res = await fetchApi(`/rapport_stage/faculte_depar/updatefac/${ID_FAC }`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: "Faculte modifié",
            detail: "Faculte a été modifié avec succès",
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
        const res = await fetchApi(`/rapport_stage/faculte_depar/findfac/${ID_FAC}`);
        const facu = res.result;
        // console.log(facu,'facu');
        setFaculte(facu);
        setData({
          NOM: facu?.NOM,
          DESCRIPTION: facu?.DESCRIPTION
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFaculte(false);
      }
    })();
  }, []);

  useEffect(() => {
    dispacth(
      setBreadCrumbItemsAction([
     rapport_stage_routes_items.facultedep,
     rapport_stage_routes_items.edit_faculte,
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);

  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  if (loadingFaculte) {
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
            {faculte?.NOM}
          </h4>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">
                  Nom faculté
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Ecrire le nom"
                  id="NOM"
                  name="NOM"
                  value={data.NOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("NOM") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("NOM") ? getError("NOM") : ""}
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
                  name="DESCRIPTION"
                  id="DESCRIPTION"
                  value={data.DESCRIPTION}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("DESCRIPTION") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
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
