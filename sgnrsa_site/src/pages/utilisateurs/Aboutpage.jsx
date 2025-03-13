import React from 'react'
import Header from '../../components/app/Header'
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { administration_routes_items } from "../../routes/admin/administration_routes"
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
import { Password } from 'primereact/password';
import { Card } from 'primereact/card'
import { utilisateurswb_routes_items } from '../../routes/rapport_stage/utilisateurswb_routes'

const initialForm = {
  NOM: '',
  PRENOM: '',
  USERNAME: '',
  EMAIL: '',
  IMAGE: null
}
const Aboutpage = () => {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()


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
    USERNAME: {
      required: true,
      length: [1, 30],
      alpha: true
    },

    EMAIL: {
      required: true,
      length: [1, 50],
      alpha: true,
      email: true,
    },

    IMAGE: {
      required: true,
      image: 4000000
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
    USERNAME: {
      required: "Ce champ est obligatoire",
      length: "Le nom d'utilisateur ne doit pas depasser max(30 caracteres)",
      alpha: "Le nom d'utilisateur est invalide"
    },
    EMAIL: {
      required: "Ce champ est obligatoire",
      length: "L'email ne doit pas depasser max(50 caracteres)",
      alpha: "L'email est invalide",
      email: "L'email n'existe pas",
    },

    IMAGE: {
      required: "Ce champ est obligatoire",
      image: "L'image ne doit pas depasser 4Mo "
    }
  })



  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM", data.NOM);
        form.append("PRENOM", data.PRENOM);

        form.append("EMAIL", data.EMAIL);

        if (data?.IMAGE) {
          form.append('IMAGE', data?.IMAGE)
        }
        form.append("USERNAME", data.USERNAME);

        const res = await fetchApi(`/administration/utilisateursweb/create`, {
          method: 'POST',
          body: form
        })

        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Utilisateur enregistré',
            detail: "L'utilisateur a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/login')
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
      utilisateurswb_routes_items.utilisateurswb,
      utilisateurswb_routes_items.add_utilisateurswb
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])



  useEffect(() => {
    if (data.IMAGE) {
      checkFieldData({ target: { name: "IMAGE" } })
    }
  }, [data.IMAGE])

  const invalidClass = name => hasError(name) ? 'is-invalid' : ''
  return (
    <>
      <div className="pt-md-0 pb-md-0">
        <main id="content" role="main" className="flex-grow-1">
          <div className="d-flex flex-column flex-md-row align-items-md-center p-0" style={{ backgroundColor: '#2C3E50' }}>
            <div className="px-5 py-5 main_content has_footer">
              {/* <div className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light mb-4">
                <div className="pt-md-3 pb-md-4">
                  <h1 className="bd-title mt-0">A propos de nous.</h1>
                  <p className="bd-lead">
                    Bienvenue sur notre site dédié à la consultation en ligne des rapports de stages académiques déjà déposés. Les étudiants peuvent accéder à ces documents pour s'inspirer et rester motivés dans leur apprentissage.
                  </p>
                </div>
              </div> */}

              <div className="row">
                <div className="col-md-3">
                  {/* Contenu supplémentaire ici */}
                  {/* <div className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light mb-4 border-round-top border-round-bottom">
                    <div className="pt-md-3 pb-md-4">
                      <h4 className="bd-title mt-0">SMS.</h4>
                      <p className="bd-lead">
                        Bienvenue sur notre site dédié à la consultation en ligne des rapports de stages académiques déjà déposés
                      </p>
                    </div>
                  </div> */}

                  {/* <div className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light mb-4 border-round-top border-round-bottom">
                    <div className="pt-md-3 pb-md-4">
                      <h4 className="bd-title mt-0">SMS.</h4>
                      <p className="bd-lead">
                        Bienvenue sur notre site dédié à la consultation en ligne des rapports de stages académiques déjà déposés. Les étudiants peuvent accéder à ces documents pour s'inspirer et rester motivés dans leur apprentissage.
                      </p>
                    </div>
                  </div> */}
                  {/* <div className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light mb-4 border-round-top border-round-bottom">
                    <div className="pt-md-3 pb-md-4">
                      <h4 className="bd-title mt-0">SMS.</h4>
                      <p className="bd-lead">
                        Bienvenue sur notre site dédié à la consultation en ligne des rapports de stages académiques déjà déposés. Les étudiants peuvent accéder à ces documents pour s'inspirer et rester motivés dans leur apprentissage.
                      </p>
                    </div>
                  </div> */}


                </div>
                <div className="col-md-12 mb-4">
                  <div className="card p-5 shadow-2 border-round bg-light">
                    <h1 className="text-center mb-2">A propos de nous !</h1>
                    <div className="d-flex flex-column flex-md-row align-items-md-center p-5 bg-light mb-4 border-round-top border-round-bottom">
                      <div className="pt-md-3 pb-md-4">
                        {/* <h4 className="bd-title mt-0">HATANGIMANA Philippe</h4> */}
                        <p className="bd-lead">
                          Bienvenue sur notre site dédié à la consultation en ligne des rapports de stages académiques déjà déposés. Les étudiants peuvent accéder à ces documents pour s'inspirer et rester motivés dans leur apprentissage.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              {/* footer */}

            </div>
          </div>
        </main>
      </div>


    </>
  )
}

export default Aboutpage