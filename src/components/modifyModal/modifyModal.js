import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { userName } from "../../redux/userAction";
import { userClear } from "../../redux/userSlice";
import "../../style/main.css";

function ModifyModal({ mode, setMode }) {
    const dispatch = useDispatch();
    const { register, reset, handleSubmit } = useForm();
    const { firstName, lastName } = useSelector((state) => state.user);

    const editRef = useRef();
    const formRef = useRef();

    // Met à jour les champs avec les valeurs actuelles
    useEffect(() => {
        reset({
            firstName: firstName || "",
            lastName: lastName || "",
        });
    }, [firstName, lastName, reset]);

    // Vérifier si le nom a changé avant d'envoyer la requête
    const differentName = (name) => {
        return name.firstName !== firstName || name.lastName !== lastName;
    };

    // Envoi de la mise à jour du nom
    const submitForm = (dataName) => {
        if (differentName(dataName)) {
            dispatch(userClear());
            dispatch(userName(dataName));
        }
        toggleEditName();
    };

    // Gestion du bouton "Edit Name"
    function toggleEditName() {
        if (editRef.current.classList.contains("nodisplay")) {
            setMode("normal");
            editRef.current.classList.remove("nodisplay");
            formRef.current.classList.add("nodisplay");
        } else {
            setMode("edit");
            editRef.current.classList.add("nodisplay");
            formRef.current.classList.remove("nodisplay");
        }
    }

    return (
        <div className="edit-name-container">
            <button className="edit-button" onClick={toggleEditName} ref={editRef}>
                Edit Name
            </button>
            <div className="update-name-container nodisplay" ref={formRef}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="modifyField">
                        <input
                            className="input-name"
                            placeholder="First Name"
                            {...register("firstName")}
                            required
                        />
                        <input
                            className="input-name"
                            placeholder="Last Name"
                            {...register("lastName")}
                            required
                        />
                    </div>
                    <div className="modifyButton">
                        <button type="submit" className="save-button">
                            Save
                        </button>
                        <button type="button" className="cancel-button" onClick={toggleEditName}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModifyModal;