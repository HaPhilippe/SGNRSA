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
import { utilisateurswb_routes_items } from "../../routes/rapport_stage/utilisateurswb_routes";

const initialForm = {
  NOM: '',
  PRENOM: '',
  USERNAME: '',
  EMAIL: '',
  IMAGE: null
}

export default function Utilisateurwb_add_page() {
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

      {isSubmitting ? <Loading /> : null}
      <main id="content" role="main" className="flex-grow-1">
        <header className="d-flex flex-column flex-md-row align-items-md-center p-5" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
          {/* <div className="pt-md-3 pb-md-4"> */}
          <div className="">


            <div className="px-4 py-3 main_content bg-white has_footer " style={{ backgroundColor: '#2C3E50', color: 'white' }}>

              <div className="card p-5 shadow-2 border-round" style={{ width: '100%', maxWidth: '400px' }}>

                <h1 className="text-center mb-2">Créer un compte</h1>
                <form onSubmit={handleSubmit}>

                  <div className="field mt-3">
                    <label htmlFor="NOM" className="font-semibold">Nom</label>
                    <InputText
                      id="NOM"
                      name="NOM"
                      value={data.NOM}
                      onChange={handleChange}
                      onBlur={checkFieldData}
                      className={`w-full ${hasError('NOM') ? 'p-invalid' : ''}`}
                      placeholder="Saissez un nom"
                    />
                    <small className="p-error">{hasError('NOM') ? getError('NOM') : ""}</small>
                  </div>

                  <div className="field">
                    <label htmlFor="PRENOM" className="font-semibold">Prénom</label>
                    <InputText
                      id="PRENOM"
                      name="PRENOM"
                      value={data.PRENOM}
                      onChange={handleChange}
                      onBlur={checkFieldData}
                      className={`w-full ${hasError('PRENOM') ? 'p-invalid' : ''}`}
                      placeholder="Ecrire votre prénom"
                    />
                    <small className="p-error">{hasError('PRENOM') ? getError('PRENOM') : ""}</small>
                  </div>



                  <div className="field">
                    <label htmlFor="USERNAME" className="font-semibold">Non utilisteur</label>
                    <InputText
                      id="USERNAME"
                      name="USERNAME"
                      value={data.USERNAME}
                      onChange={handleChange}
                      onBlur={checkFieldData}
                      className={`w-full ${hasError('USERNAME') ? 'p-invalid' : ''}`}
                      placeholder="Ecrire votre nom utilisateur"
                    />
                    <small className="p-error">{hasError('USERNAME') ? getError('USERNAME') : ""}</small>
                  </div>


                  <div className="field">
                    <label htmlFor="EMAIL" className="font-semibold">Email</label>
                    <InputText
                      id="EMAIL"
                      name="EMAIL"
                      value={data.EMAIL}
                      onChange={handleChange}
                      onBlur={checkFieldData}
                      className={`w-full ${hasError('EMAIL') ? 'p-invalid' : ''}`}
                      placeholder="Ecrire votre email"
                    />
                    <small className="p-error">{hasError('EMAIL') ? getError('EMAIL') : ""}</small>
                  </div>
                  <div className="field">
                    <label htmlFor="IMAGE" className="font-semibold">Photo profil</label>
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
                        setValue("IMAGE", file);
                      }}
                      onClear={() => {
                        setError("IMAGE", {});
                      }}
                      className={`${hasError("IMAGE") ? "p-invalid" : ""}`}
                    />
                    <small className="p-error">{hasError('IMAGE') ? getError('IMAGE') : ""}</small>
                  </div>

                  <Button label="Envoyer" type="submit" className="w-full mt-3 ml-3" size="small" disabled={isSubmitting} />
                </form>

              </div>

            </div>

          </div>
        </header>

      </main>

    </>
  )
}