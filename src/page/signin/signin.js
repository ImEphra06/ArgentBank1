import React from "react";
import "../../style/main.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { /*userClear,*/ userSetRememberMe } from "../../redux/userSlice";
import { userLogin, userProfile } from "../../redux/userAction";

function SignIn() {
    const { success } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("useEffect triggered, success:", success, "Type:", typeof success);
        // Check if user token exists in localStorage
        if (localStorage.getItem("userToken")) {
            sessionStorage.setItem("userToken", localStorage.getItem("userToken"));
            sessionStorage.setItem("connected", true);
            navigate("/profile");
        }
        // Check if user token exists in sessionStorage
        else if (sessionStorage.getItem("userToken")) {
            sessionStorage.setItem("connected", true);
            navigate("/profile");
        }
        // If login was successful
        setTimeout(() => {
            console.log("⏳ Checking success after 500ms:", success);
            if (success === true) {
                /*dispatch(userClear());*/
                console.log("✅ Login successful! Dispatching userProfile...");
                dispatch(userProfile());
                navigate("/profile");
            }
        }, 500);
    }, [success, dispatch, navigate]);

    // Form submission handler
    const submitForm = (data) => {
        // Handle "remember me" checkbox
        if (data.checkbox) {
            dispatch(userSetRememberMe());
        }

        // Dispatch login action with form data
        dispatch(userLogin(data));
        reset();
    };

    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="input-wrapper">
                        <label htmlFor="email">Username</label><input type="email" {...register("email")} required />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label><input type="password" {...register("password")} required />
                    </div>
                    <div className="input-remember">
                        <input type="checkbox" id="remember-me" /><label htmlFor="checkbox">Remember me</label>
                    </div>
                    <button type="submit" className="sign-in-button">Sign In</button>
                </form>
            </section>
        </main>
    );
}

export default SignIn;