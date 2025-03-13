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
import { rapport_routes_items } from "../../routes/rapport_stage/rapport_routes";


const initialForm = {
  ID_ETUD: null,
  ID_ENTREPR: null,
  DATE_DEBUT: null,
  DATE_FIN: null,
  SUJET: '',
  RAPPORT_PDF: '',
  NOTE_EVALUATION: '',
  ATTESTATION_DU_DEPOT: '',
  PAGE_GARDE: '',
  FICHIER_COTATION_PDF: ''
};

export default function Rapport_ad_page() {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const [etudiant, setEtudiants] = useState([])
  const [entreprise, setEntreprises] = useState([])
  const [file, setFile] = useState(null);
  // console.log(file);



  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {

    ID_ETUD: {
      required: true
    },
    ID_ENTREPR: {
      required: true
    },
    DATE_DEBUT: {
      required: true
    },
    DATE_FIN: {
      required: true
    },
    SUJET: {
      required: true,
      length: [1, 100],
      alpha: true
    },
    // RAPPORT_PDF: {
    //   required: true
    // },
    // NOTE_EVALUATION: {
    //   required: true
    // },
    // ATTESTATION_DU_DEPOT: {
    //   required: true
    // },
    // PAGE_GARDE: {
    //   required: true
    // },
    // FICHIER_COTATION_PDF: {
    //   required: true
    // }


  }, {
    ID_ETUD: {
      required: "Ce champ est obligatoire"
    },
    ID_ENTREPR: {
      required: "Ce champ est obligatoire"
    },
    DATE_DEBUT: {
      required: "Ce champ est obligatoire"
    },
    DATE_FIN: {
      required: "Ce champ est obligatoire"
    },
    SUJET: {
      required: "Ce champ est obligatoire",
      length: "Le sujet ne doit etre depasser max(200 carateres)",
      alpha: "Le sujet est invalide"
    },
    // RAPPORT_PDF: {
    //   required: "Ce champ est obligatoire"
    // },
    // NOTE_EVALUATION: {
    //   required: "Ce champ est obligatoire"
    // },
    // ATTESTATION_DU_DEPOT: {
    //   required: "Ce champ est obligatoire"
    // },
    // PAGE_GARDE: {
    //   required: "Ce champ est obligatoire"
    // },
    // PAGE_GARDE: {
    //   required: "Ce champ est obligatoire"
    // },
    // FICHIER_COTATION_PDF: {
    //   required: "Ce champ est obligatoire"
    // }

  })
  


  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("ID_ETUD", data.ID_ETUD?.code ? data.ID_ETUD?.code : '');
        form.append("ID_ENTREPR", data.ID_ENTREPR?.code ? data.ID_ENTREPR?.code : '');
        form.append("DATE_DEBUT", data.DATE_DEBUT);
        form.append("DATE_FIN", data.DATE_FIN);
        form.append("SUJET", data.SUJET);
        form.append("RAPPORT_PDF", file);

        if (!file) {
          alert("Veuillez sélectionner un fichier PDF.");
          return;
        }
        const res = await fetchApi(`/rapport_stage/rapport/create?`, {
          method: 'POST',
          body: form
        })


        const result = await res.json();
        // console.log(result);
        
        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Le rapport enregistré',
            detail: "Le rapport a été enregistré avec succès",
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


  const handleFileChange = (e) => {
    // Récupérer le fichier sélectionné
    const uploadedFile = e.files[0];
    setFile(uploadedFile);
  };

  

  // Liste deroularantes des etudiants
  const fetchEtudiants = useCallback(async () => {
    try {
      const res = await fetchApi("/rapport_stage/etudiant/fetch?")
      // return console.log(res.result.data);

      setEtudiants(res.result.data.map(etud => {
        return {
          name: etud.NOM,
          code: etud.ID_ETUD
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchEtudiants()
  }, [])

  // Liste deroularantes des entreprise
  const fetchEntreprises = useCallback(async () => {
    try {
      const res = await fetchApi("/rapport_stage/entreprise/fetch?")
      // return console.log(res.result.data);

      setEntreprises(res.result.data.map(entrep => {
        return {
          name: entrep.NOM_ENTREPR,
          code: entrep.ID_ENTREPR
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchEntreprises()
  }, [])


  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Ici, vous pouvez gérer le fichier, par exemple, en le stockant dans l'état local
  //     setData({ ...data, RAPPORT_PDF: file }); // Mettez à jour l'état avec le fichier
  //   }
  // };


  
   
   
  
    // const handleSubmit = async (event) => {
    //   event.preventDefault();
      
    //   const formData = new FormData();
      
  
    //   try {
    //     const response = await fetch('/api/upload', {
    //       method: 'POST',
    //       body: formData,
    //     });
  
    //     const result = await response.json();
    //     console.log('File uploaded successfully:', result);
    //     // Gérer le chemin du fichier dans la base de données ici
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //   }
    // };

  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
      rapport_routes_items.rapport,
      rapport_routes_items.add_rapport,
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
          <h4 className="mb-3">Ajouter le rapport</h4>
          <hr className="w-100" />
        </div>



        <form className="form w-100 mt-6" onSubmit={handleSubmit}>

          <div className="form-group col-sm mt-5">
            <div className="row align-items-center">


              <div className="col-md-6">
                <label htmlFor="ID_DEPARTEMENT" className="label mb-1">Etudiant</label>
                <Dropdown
                  value={data.ID_ETUD}
                  options={etudiant}
                  onChange={(e) => setValue("ID_ETUD", e.value)}
                  optionLabel="name"
                  id="ID_ETUD"
                  filter
                  filterBy="name"
                  placeholder="Sélectionner l'etudiant"
                  emptyFilterMessage="Aucun element trouvee"
                  emptyMessage="Aucun element trouvee"
                  name="ID_ETUD"
                  onHide={() => {
                    checkFieldData({ target: { name: "ID_ETUD" } });
                  }}
                  className={`w-100 ${hasError("ID_ETUD") ? "p-invalid" : ""}`}
                  showClear
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ID_ETUD") ? getError("ID_ETUD") : ""}
                </div>
              </div>


              <div className="col-md-6">
                <label htmlFor="ID_DEPARTEMENT" className="label mb-1">Entreprise</label>
                <Dropdown
                  value={data.ID_ENTREPR}
                  options={entreprise}
                  onChange={(e) => setValue("ID_ENTREPR", e.value)}
                  optionLabel="name"
                  id="ID_ENTREPR"
                  filter
                  filterBy="name"
                  placeholder="Sélectionner le departement"
                  emptyFilterMessage="Aucun element trouvee"
                  emptyMessage="Aucun element trouvee"
                  name="ID_ENTREPR"
                  onHide={() => {
                    checkFieldData({ target: { name: "ID_ENTREPR" } });
                  }}
                  className={`w-100 ${hasError("ID_ENTREPR") ? "p-invalid" : ""}`}
                  showClear
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ID_ENTREPR") ? getError("ID_ENTREPR") : ""}
                </div>
              </div>
              {data.ID_ENTREPR ?
                <div className="col-md-6">
                  <label htmlFor="DATE_DEBUT" className="label mb-1">Date de début</label>
                  <Calendar
                    value={data.DATE_DEBUT}
                    name="DATE_DEBUT"
                    onChange={(e) => {
                      setValue("DATE_DEBUT", e.value);
                      setError("DATE_DEBUT", {});
                    }}
                    placeholder="Chosir la date de début "
                    inputClassName="w-100"
                    onHide={() => {
                      checkFieldData({ target: { name: "DATE_DEBUT" } });
                    }}
                    className={`d-block w-100 ${hasError("DATE_DEBUT") ? "p-invalid" : ""
                      }`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                    {hasError("DATE_DEBUT") ? getError("DATE_DEBUT") : ""}
                  </div>
                </div>
                : ''}

              {data.DATE_DEBUT ?
                <>
                  <div className="col-md-6">
                    <label htmlFor="DATE_FIN" className="label mb-1">Date de fin</label>
                    <Calendar
                      value={data.DATE_FIN}
                      name="DATE_FIN"
                      onChange={(e) => {
                        setValue("DATE_FIN", e.value);
                        setError("DATE_FIN", {});
                      }}
                      placeholder="Chosir la date de fin "
                      inputClassName="w-100"
                      onHide={() => {
                        checkFieldData({ target: { name: "DATE_FIN" } });
                      }}
                      className={`d-block w-100 ${hasError("DATE_FIN") ? "p-invalid" : ""
                        }`}
                    />
                    <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                      {hasError("DATE_FIN") ? getError("DATE_FIN") : ""}
                    </div>
                  </div>

                  {
                    data.DATE_DEBUT < data.DATE_FIN ?
                      <>

                        <div className="col-md-6">
                          <label htmlFor="SUJET" className="label mb-1">Sujet</label>
                          <InputText
                            type="text"
                            placeholder="Ecrire la faculté"
                            id="SUJET"
                            name="SUJET"
                            value={data.SUJET}
                            onChange={handleChange}
                            onBlur={checkFieldData}
                            className={`w-100 ${hasError("SUJET") ? "p-invalid" : ""}`}
                          />
                          <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                            {hasError("SUJET") ? getError("SUJET") : ""}
                          </div>
                        </div>


                        <div className="col-md-6">
                          <label htmlFor="RAPPORT_PDF" className="label mb-1">Fichier du rapport</label>
                          <FileUpload
                            name="RAPPORT_PDF"
                            accept="application/pdf"
                            maxFileSize={1000000} // Taille maximale en octets (ex: 1 Mo)
                            onUpload={handleFileChange}
                            mode="basic" // Utilisez "advanced" pour un outil plus complet
                            chooseLabel="Choisir un fichier"
                            cancelLabel="Annuler"
                          />
                         
                        </div>





                        {/* <div className="col-md-6">
                          <label htmlFor="RAPPORT_PDF" className="label mb-1">Fichier du rapport</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            id="RAPPORT_PDF"
                            name="RAPPORT_PDF"
                            onChange={handleFileChange}
                            onBlur={checkFieldData}
                            className={`w-100 ${hasError("RAPPORT_PDF") ? "p-invalid" : ""}`}
                          />
                          <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                            {hasError("RAPPORT_PDF") ? getError("RAPPORT_PDF") : ""}
                          </div>
                        </div> */}



                        {/* <div className="col-md-8">
                          <div className="col-md-4">
                            <label htmlFor="RAPPORT_PDF" className="label mb-1">Fichier du rapport</label>
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

                        </div> */}

                        {/* <div className="RAPPORT_PDF">
                          <label htmlFor="RAPPORT_PDF" className="label mb-1">Fichier du rapport</label>
                          <FileUpload
                            name="RAPPORT_PDF"
                            accept="application/pdf"
                            maxFileSize={1000000} // Taille maximale en octets (ex: 1 Mo)
                            onUpload={handleFileChange}
                            mode="basic" // Utilisez "advanced" pour un outil plus complet
                            chooseLabel="Choisir un fichier"
                            cancelLabel="Annuler"
                          />
                        </div> */}

                      </>

                      :
                      <>
                        {!data.DATE_FIN ?

                          <span></span>

                          :
                          <span>Date de fin doit etre supérieur à celle de début</span>

                        }
                      </>

                  }

                </>


                : ''}

              <div>

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


