import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../redux/userSlice";
import logo from "../../asset/argentBankLogo.png";
import "../../style/main.css";

function Header() {
	const dispatch = useDispatch();

	// Récupérer les données utilisateur depuis Redux
	const { firstName, lastName } = useSelector((state) => state.user);
	console.log("User state:", useSelector((state) => state.user));

	// Vérifier la connexion dans sessionStorage OU localStorage
	const isConnected = sessionStorage.getItem("connected") === "true" ||
		localStorage.getItem("connected") === "true";

	function Signout() {
		dispatch(userLogout());
	}

	// Header actions dépendent de la connexion utilisateur
	function headerActions() {
		return isConnected ? (
			<div>
				<NavLink to="/profile" className="main-nav-item">
					<i className="fa fa-user-circle" />
					{` ${firstName} ${lastName}`}
				</NavLink>
				<NavLink to="/" className="main-nav-item" onClick={Signout}>
					<i className="fa fa-sign-out" /> Sign Out
				</NavLink>
			</div>
		) : (
			<div>
				<NavLink to="/login" className="main-nav-item">
					<i className="fa fa-user-circle" /> Sign In
				</NavLink>
			</div>
		);
	}

	return (
		<nav className="main-nav">
			<NavLink to="/" className="main-nav-logo">
				<img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
				<h1 className="sr-only">Argent Bank</h1>
			</NavLink>
			{headerActions()}
		</nav>
	);
}

export default Header;