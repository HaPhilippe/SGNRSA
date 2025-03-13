


import icon from '/images/user.png';
import { InputText } from 'primereact/inputtext';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { Button } from "primereact/button";
import { useState ,useCallback, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import Loading from "../../components/app/Loading";
import fetchApi from "../../helpers/fetchApi";
import { setUserAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router";
import getDeviceInfo from "../../utils/getDeviceInfo";


export default function Createlogin() {

    const dispacth = useDispatch();
    const [data, handleChange] = useForm({
        EMAIL: '',
        PASSWORD: ''
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
        EMAIL: { required: true, email: true },
        PASSWORD: { required: true },
    }, {
        EMAIL: { required: "Ce champ est obligatoire", email: "Email invalide" },
        PASSWORD: { required: "Ce champ est obligatoire" },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidate()) return;
        setLoading(true);
        setErrors({});
        const form = new FormData();
        const deviceInfo = getDeviceInfo();
        form.append("EMAIL", data.EMAIL);
        form.append("PASSWORD", data.PASSWORD);
        form.append("deviceInfo", JSON.stringify(deviceInfo));

        try {
            const res = await fetchApi("/administration/auth/login", {
                method: 'POST',
                body: form
            });
            const user = res.result;
            dispatch(setUserAction(user));
            localStorage.setItem('user', JSON.stringify(user));
            navigate("/");
            dispatch(setToastAction({ severity: 'success', summary: "Vous êtes connecté", detail: "Vos identifiants sont corrects", life: 3000, position: 'top-left' }));
        } catch (error) {
            if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
                setErrors(error.result);
            } else {
                dispatch(setToastAction({ severity: 'error', summary: 'Identifiants incorrects', detail: "Vérifiez votre EMAIL ou mot de passe", life: 3000 }));
            }
        } finally {
            setLoading(false);
        }
    };


    const [visiblePassword, setVisiblePassword] = useState(false);
   

    return (
        <>
            {loading && <Loading />}
            
        
            <div className="flex flex-col align-items-center justify-content-center min-h-screen" style={{ backgroundColor: '#2C3E50', color: 'white',marginBottom:'60px' }}>
                <div className="card p-5 shadow-2 border-round">
                    <h1 className="text-center mb-4">Se connecter</h1>
                    <form onSubmit={handleSubmit}>
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
                        
                        <div className="field mt-3">
                            <label htmlFor="PASSWORD" className="font-semibold">Mot de passe</label>
                            <div className="relative">
                                <InputText
                                    id="PASSWORD"
                                    name="PASSWORD"
                                    type={visiblePassword ? "text" : "password"}
                                    value={data.PASSWORD}
                                    onChange={handleChange}
                                    onBlur={checkFieldData}
                                    className={`w-full ${hasError('PASSWORD') ? 'p-invalid' : ''}`}
                                    placeholder="Ecrire le mot de passe"
                                />
                                <button
                                    type="button"
                                    className="p-inputtext-icon toggle-password"
                                    onClick={() => setVisiblePassword(prev => !prev)}
                                    aria-label={visiblePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {visiblePassword ? <i className="pi pi-eye-slash" /> : <i className="pi pi-eye" />}
                                </button>
                            </div>
                            <small className="p-error">{hasError('PASSWORD') ? getError('PASSWORD') : ""}</small>
                        </div>
                        <a href="#" className="text-right block mt-2">Mot de passe oublié?</a>
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={!isValidate()} loading={loading} />
                    </form>
                </div>
            </div>
        </>
    );
}






  {/* <> 
  <div className="px-4 py-3 main_content bg-white has_footer">
  <div className="">
    <h4 className="mb-3">Créer un compte </h4>
    <hr className="w-100" />
  </div>
  <form className="form w-75 mt-5" onSubmit={handleSubmit}>

    <div className="form-group col-sm">
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="NOM" className="label mb-1">Nom</label>
        </div>
        <div className="col-sm">
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
      </div>
    </div>
    <div className="form-group col-sm mt-5">
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="PRENOM" className="label mb-1">Prénom</label>
        </div>
        <div className="col-sm">
          <InputText
            type="text"
            placeholder="Ecrire le prénom"
            id="PRENOM"
            name="PRENOM"
            value={data.PRENOM}
            onChange={handleChange}
            onBlur={checkFieldData}
            className={`w-100 ${hasError("PRENOM") ? "p-invalid" : ""}`}
          />
          <div
            className="invalid-feedback"
            style={{ minHeight: 21, display: "block" }}
          >
            {hasError("PRENOM") ? getError("PRENOM") : ""}
          </div>
        </div>
      </div>
    </div>
    <div className="form-group col-sm mt-5">
    <div className="row">
      <div className="col-md-4">
        <label htmlFor="TELEPHONE" className="label mb-1">Téléphone</label>
      </div>
      <div className="col-sm">
        <InputText
          type="text"
          // pattern="[0-9]
          // {3}-[0-9]{3}-[0-9]{4}"
          placeholder="Ecrire le numéro de téléphone"
          id="TELEPHONE"
          name="TELEPHONE"
          value={data.TELEPHONE}
          onChange={handleChange}
          onBlur={checkFieldData}
          className={`w-100 ${hasError("TELEPHONE") ? "p-invalid" : ""}`}
        />
        <div
          className="invalid-feedback"
          style={{ minHeight: 21, display: "block" }}
        >
          {hasError("TELEPHONE") ? getError("TELEPHONE") : ""}
        </div>
      </div>
    </div>
  </div>

    <div className="form-group col-sm mt-5">
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="USERNAME" className="label mb-1">Nom d'utilisateur</label>
        </div>
        <div className="col-sm">
          <InputText type="text" placeholder="Ecrire le nom d'utilisateur" name="USERNAME" id="USERNAME" value={data.USERNAME} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('USERNAME') ? 'p-invalid' : ''}`} />
          <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
            {hasError('USERNAME') ? getError('USERNAME') : ""}
          </div>
        </div>
      </div>
    </div>

    <div className="form-group mt-5">
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="profile" className="label mb-1">Profil</label>
        </div>
        <div className="col-sm">
          <Dropdown
            value={data.ID_PROFIL}
            options={profil}
            onChange={(e) => setValue("ID_PROFIL", e.value)}
            optionLabel="name"
            id="ID_PROFIL"
            filter
            filterBy="name"
            placeholder="Sélectionner le profil"
            emptyFilterMessage="Aucun element trouvee"
            emptyMessage="Aucun element trouvee"
            name="ID_PROFIL"
            onHide={() => {
              checkFieldData({ target: { name: "ID_PROFIL" } });
            }}
            className={`w-100 ${hasError("ID_PROFIL") ? "p-invalid" : ""}`}
            showClear
          />
          <div
            className="invalid-feedback"
            style={{ minHeight: 21, display: "block" }}
          >
            {hasError("ID_PROFIL") ? getError("ID_PROFIL") : ""}
          </div>

        </div>
      </div>
    </div>
    <div className="form-group col-sm mt-5">
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="EMAIL" className="label mb-1">Adresse email</label>
        </div>
        <div className="col-sm">
          <InputText type="email" placeholder="Ecrire l'adresse e-mail" name="EMAIL" id="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL') ? 'p-invalid' : ''}`} />
          <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
            {hasError('EMAIL') ? getError('EMAIL') : ""}
          </div>
        </div>
      </div>
    </div>


    <div className="form-group col-sm mt-5">
      <div className="row">
        <div className="col-md-4 ">
          <label htmlFor="Photo" className="label mb-1">
            Photo du profile
          </label>
        </div>
        <div className="col-sm">
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
          <div
            className="invalid-feedback"
            style={{ minHeight: 21, display: "block" }}
          >
            {hasError("IMAGE") ? getError("IMAGE") : ""}
          </div>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">
      <Button label="Reinitialiser" type="reset" outlined className="mt-3" size="small" onClick={e => {
        e.preventDefault()
        setData(initialForm)
        setErrors({})
      }} />
      <Button label="Envoyer" type="submit" className="mt-3 ml-3" size="small" disabled={isSubmitting} />
    </div>
  </form>
</div>
 </> */}