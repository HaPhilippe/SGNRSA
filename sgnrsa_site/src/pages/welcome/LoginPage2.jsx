


import icon from '/images/user.png';
import { InputText } from 'primereact/inputtext';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { Button } from "primereact/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../components/app/Loading";
import fetchApi from "../../helpers/fetchApi";
import { setUserAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router";
import getDeviceInfo from "../../utils/getDeviceInfo";
import { setToastAction } from "../../store/actions/appActions";

export default function LoginPage2() {
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
         
            <div className="flex flex-col align-items-center justify-content-center min-h-screen" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
                <div className="card p-5 shadow-2 border-round">
                    <h1 className="text-center mb-4">Se </h1>
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
                        {/* <a href="#" className="text-right block mt-2">Mot de passe oublié?</a> */}
                        
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={!isValidate()} loading={loading} />
                    </form>
                </div>
            </div>
        </>
    );
}