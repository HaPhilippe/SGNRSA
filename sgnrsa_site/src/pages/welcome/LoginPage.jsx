


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
import { RadioButton } from "primereact/radiobutton";

export default function LoginPage() {
    const [category, setCategorie] = useState(null);
    // console.log(category);
    const [data, setData] = useState({ EMAIL: '', PASSWORD: '', USERNAME: '' });

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var handleSubmit
    {
        data.PASSWORD && category == 1 ?

            handleSubmit = async (e) => {
                e.preventDefault();
                if (!isValidate()) return;
                setLoading(true);
                setErrors({});

                // You can customize the action based on the selected genre
                if (category === 1) {
                    // Action for "Personnel"
                    // console.log("Personnel selected", data);
                } else if (category === 2) {
                    // Action for "Utilisateur"
                    // console.log("Utilisateur selected", data);
                }

                // Perform your form submission logic here
                // e.g., API call


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

                    if (user) {
                        dispatch(setUserAction(user));
                        localStorage.setItem('user', JSON.stringify(user));
                        navigate("/");
                        dispatch(setToastAction({ severity: 'success', summary: "Vous êtes connecté", detail: "Vos identifiants sont corrects", life: 3000, position: 'top-left' }));
                    } else {
                        navigate("/log");
                    }

                } catch (error) {
                    if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
                        setErrors(error.result);
                    } else {
                        dispatch(setToastAction({ severity: 'error', summary: 'Identifiants incorrects', detail: "Vérifiez votre EMAIL ou mot de passe", life: 3000 }));
                    }
                } finally {
                    setLoading(false);
                }

                setLoading(false);
            }

            :
            handleSubmit = async (e) => {
                e.preventDefault();
                if (!isValidate()) return;
                setLoading(true);
                setErrors({});

                // You can customize the action based on the selected genre
                if (category === 1) {
                    // Action for "Personnel"
                    console.log("Personnel selected", data);
                } else if (category === 2) {
                    // Action for "Utilisateur"
                    console.log("Utilisateur selected", data);
                }

                // Perform your form submission logic here
                // e.g., API call


                const form = new FormData();
                const deviceInfo = getDeviceInfo();
                form.append("EMAIL", data.EMAIL);
                form.append("USERNAME", data.USERNAME);
                form.append("deviceInfo", JSON.stringify(deviceInfo));

                try {
                    const res = await fetchApi("/administration/authsite/loginuser", {
                        method: 'POST',
                        body: form
                    });

                    const user = res.result;

                    if (user) {
                        dispatch(setUserAction(user));
                        localStorage.setItem('user', JSON.stringify(user));
                        navigate("/");
                        dispatch(setToastAction({ severity: 'success', summary: "Vous êtes connecté", detail: "Vos identifiants sont corrects", life: 3000, position: 'top-left' }));
                    } else {
                        navigate("/log");
                    }


                } catch (error) {
                    if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
                        setErrors(error.result);
                    } else {
                        dispatch(setToastAction({ severity: 'error', summary: 'Identifiants incorrects', detail: "Vérifiez votre EMAIL ou mot de passe", life: 3000 }));
                    }
                } finally {
                    setLoading(false);
                }

                setLoading(false);
            };


    }


    const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
        EMAIL: { required: true, email: true },
        // USERNAME: { required: true },
    }, {
        EMAIL: { required: "Ce champ est obligatoire", email: "Email invalide" },
        // USERNAME: { required: "Ce champ est obligatoire" },
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };




    const [visiblePassword, setVisiblePassword] = useState(false);


    return (
        <div className="flex flex-col align-items-center justify-content-center min-h-screen" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
            <div className="card p-5 shadow-2 border-round" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="text-center mb-2">Authentification</h1>
                <span className='d-flex justify-content-center'>Vous etes qui ?</span>

                <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex align-items-center col-4">
                        <RadioButton inputId="personnel" name="genre" value={1} onChange={(e) => setCategorie(e.value)} checked={category === 1} />
                        <label htmlFor="personnel" className="ml-2">Personnel</label>
                    </div>
                    <div className="flex align-items-center col-4">
                        <RadioButton inputId="utilisateur" name="utilisateur" value={2} onChange={(e) => setCategorie(e.value)} checked={category === 2} />
                        <label htmlFor="utilisateur" className="ml-2">Utilisateur</label>
                    </div>
                </div>

                {category == 1 ?
                    <form onSubmit={handleSubmit}>

                        <div className="field">
                            <label htmlFor="EMAIL" className="font-semibold">Email</label>
                            <InputText
                                id="EMAIL"
                                name="EMAIL"
                                value={data.EMAIL}
                                onChange={handleChange}
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


                        {/* <a href="" className="text-right block mt-2">Mot de passe oublié?</a> */}
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={data.EMAIL == ''} loading={loading} />
                    </form>
                    :
                    <form onSubmit={handleSubmit}>

                        <div className="field">
                            <label htmlFor="EMAIL" className="font-semibold">Email</label>
                            <InputText
                                id="EMAIL"
                                name="EMAIL"
                                value={data.EMAIL}
                                onChange={handleChange}
                                className={`w-full ${hasError('EMAIL') ? 'p-invalid' : ''}`}
                                placeholder="Ecrire votre email"
                            />
                            <small className="p-error">{hasError('EMAIL') ? getError('EMAIL') : ""}</small>
                        </div>

                        <div className="field">
                            <label htmlFor="USERNAME" className="font-semibold">Nom d'utilisateur</label>
                            <InputText
                                id="USERNAME"
                                name="USERNAME"
                                value={data.USERNAME}
                                onChange={handleChange}
                                className={`w-full ${hasError('USERNAME') ? 'p-invalid' : ''}`}
                                placeholder="Ecrire votre nom utilisateur"
                            />
                            <small className="p-error">{hasError('USERNAME') ? getError('USERNAME') : ""}</small>
                        </div>

                        {/* <a href="" className="text-right block mt-2">Mot de passe oublié?</a> */}
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={data.EMAIL == ''} loading={loading} />
                    </form>
                }

            </div>
        </div>
    );
}