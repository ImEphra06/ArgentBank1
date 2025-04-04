import React, { useState, useEffect } from "react";
import "../../style/main.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { userLogin, userProfile } from "../../redux/userAction";
import { checkPersistedAuth } from "../../redux/userSlice"; 

function SignIn() {
    const { success, isLogged } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");

    useEffect(() => {
        // Vérifier les tokens au chargement de la page
        dispatch(checkPersistedAuth());
        
        const localToken = localStorage.getItem("userToken");
        const sessionToken = sessionStorage.getItem("userToken");
        const token = localToken || sessionToken;

        if (token) {
            const isRemembered = !!localToken;

            if (isRemembered) {
                localStorage.setItem("connected", "true");
            } else {
                sessionStorage.setItem("connected", "true");
            }
            dispatch(userProfile());
            navigate("/profile");
        } else if (success || isLogged) {
            dispatch(userProfile());
            navigate("/profile");
        }
    }, [success, isLogged, dispatch, navigate]);

    // Form submission handler
    const submitForm = (data) => {
        dispatch(userLogin({ email: data.email, password: data.password })).then((response) => {
            if (response.payload && response.payload.status === 200) {
                const token = response.payload.body.token;

                if (data.checkbox) {
                    localStorage.setItem("userToken", token);
                    localStorage.setItem("connected", "true");

                    sessionStorage.removeItem("userToken");
                    sessionStorage.removeItem("connected");
                } else {
                    sessionStorage.setItem("userToken", token);
                    sessionStorage.setItem("connected", "true");
                    
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("connected");
                }
                setLoginError("");
            } else {
                setLoginError("Identifiants incorrects ou mot de passe erroné.");
            }
        }).catch(() => {
            setLoginError("Une erreur s'est produite. Veuillez réessayer.");
        });
        reset();
    };

    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                {loginError && <div className="error-message">{loginError}</div>} {}
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