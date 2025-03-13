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
import { encadrant_routes_items } from "../../routes/rapport_stage/encadrant_routes";

const initialForm = {
  NOM: '',
  PRENOM: '',
  EMAIL: '',
  TITRE: '',
  TEL: ''
};

export default function Encadrant_edit_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { ID_ENCA } = useParams();
  const [encadrant, setEncadrant] = useState(null);

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
    TITRE: {
      required: true
    },
    TEL: {
      required: true,
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

    TITRE: {
      required: "Ce champ est obligatoire"
    },
    TEL: {
      required: "Ce champ est obligatoire"
    }

  })
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
        form.append("PRENOM", data.PRENOM);
        form.append("EMAIL", data.EMAIL);
        form.append("TITRE", data.TITRE);
        form.append("TEL", data.TEL);

        const res = await fetchApi(`/rapport_stage/encadrant/update/${ID_ENCA}`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: "Encadrant modifié",
            detail: "Encadrant a été modifié avec succès",
            life: 3000,
          })
        );
        navigate("/encadrant");
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
        const res = await fetchApi(`/rapport_stage/encadrant/find/${ID_ENCA}`);
        const encadra = res.result;
        // return console.log(dep,"entreprise");

        setEncadrant(encadra);
        setData({
          NOM: encadra?.NOM,
          PRENOM: encadra?.PRENOM,
          EMAIL: encadra?.EMAIL,
          TITRE: encadra?.TITRE,
          TEL: encadra?.TEL

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
        encadrant_routes_items.encadrant,
        encadrant_routes_items.edit_encadrant
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
            {encadrant?.NOM}
          </h4>
          <hr className="w-100" />
        </div>
        <form className="form w-100 mt-6" onSubmit={handleSubmit}>

          <div className="form-group col-sm mt-5">
            <div className="row align-items-center">

              <div className="col-md-6">
                <label htmlFor="NOM" className="label mb-1">Encadreur</label>
                <InputText
                  type="text"
                  placeholder="Ecrire l'encadreur"
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
                  placeholder="Ecrire l'addresse de lentreprise"
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
                <label htmlFor="EMAIL" className="label mb-1">E-mail</label>
                <InputText
                  type="text"
                  placeholder="Ecrire le email de l'encadreur"
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
                <label htmlFor="TITRE" className="label mb-1">Titre</label>
                <InputText
                  type="text"
                  placeholder="Ecrire le titre de l'encadreur"
                  id="TITRE"
                  name="TITRE"
                  value={data.TITRE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("EMAIL") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("TITRE") ? getError("TITRE") : ""}
                </div>
              </div>


              <>
                <div className="col-md-6">
                  <label htmlFor="TEL" className="label mb-1">Téléphone</label>
                  <InputText
                    type="text"
                    placeholder="Ecrire le nom telephone"
                    id="TEL"
                    name="TEL"
                    value={data.TEL}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 ${hasError("TEL") ? "p-invalid" : ""}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                    {hasError("TEL") ? getError("TEL") : ""}
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
              label="Envoyer"
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
