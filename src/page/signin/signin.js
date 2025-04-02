import React, { useState } from "react";
import "../../style/main.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { userLogin, userProfile } from "../../redux/userAction";

function SignIn() {
    const { success } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(""); // État local pour les erreurs de connexion

    React.useEffect(() => {
        // Vérifier d'abord localStorage (persistant) puis sessionStorage (temporaire)
        const localToken = localStorage.getItem("userToken");
        const sessionToken = sessionStorage.getItem("userToken");
        const token = localToken || sessionToken;

        if (token) {
            // Ne pas transférer le token de localStorage vers sessionStorage
            // Utiliser le token tel qu'il est stocké

            // Pour indiquer que l'utilisateur est connecté
            const isRemembered = !!localToken;

            if (isRemembered) {
                localStorage.setItem("connected", "true");
            } else {
                sessionStorage.setItem("connected", "true");
            }

            dispatch(userProfile());
            navigate("/profile");
        } else if (success) {
            dispatch(userProfile());
            navigate("/profile");
        }
    }, [success, dispatch, navigate]);

    // Form submission handler
    const submitForm = (data) => {
        dispatch(userLogin(data)).then((response) => {
            if (response.payload && response.payload.token) {
                const token = response.payload.token;

                if (data.checkbox) {
                    // Si "Remember Me" est coché, utiliser localStorage (persistant)
                    localStorage.setItem("userToken", token);
                    localStorage.setItem("connected", "true");
                    // S'assurer qu'il n'y a pas de duplication dans sessionStorage
                    sessionStorage.removeItem("userToken");
                    sessionStorage.removeItem("connected");
                } else {
                    // Si "Remember Me" n'est pas coché, utiliser uniquement sessionStorage (temporaire)
                    sessionStorage.setItem("userToken", token);
                    sessionStorage.setItem("connected", "true");
                    // S'assurer qu'il n'y a pas de données résiduelles dans localStorage
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("connected");
                }

                // Si la connexion est réussie, réinitialiser le message d'erreur
                setLoginError("");
            } else {
                // En cas de problème (identifiants incorrects par exemple)
                setLoginError("Identifiants incorrects ou mot de passe erroné.");
            }
        }).catch(() => {
            // En cas d'erreur de requête (problème de réseau par exemple)
            setLoginError("Une erreur s'est produite. Veuillez réessayer.");
        });
        reset();
    };

    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                {loginError && <div className="error-message">{loginError}</div>} {/* Affichage du message d'erreur */}
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="input-wrapper">
                        <label htmlFor="email">Username</label>
                        <input type="email" {...register("email")} required />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label>
                        <input type="password" {...register("password")} required />
                    </div>
                    <div className="input-remember">
                        <input type="checkbox" id="remember-me" {...register("checkbox")} />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button type="submit" className="sign-in-button">Sign In</button>
                </form>
            </section>
        </main>
    );
}

export default SignIn;