import React from "react";
import { NavLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { userLogout } from "../../redux/userSlice";
import logo from "../../asset/argentBankLogo.png";
import "../../style/main.css";

function Header() {
	const dispatch = useDispatch();

	// retrieve store data to know about user connexion
	const { firstName, lastName } = useSelector((state) => state.user);
	console.log("User state:", useSelector((state) => state.user));
	const connected = sessionStorage.getItem("connected");

	function Signout() {
		dispatch(userLogout());
	}

	// Header actions depend on user connection
	function headerActions() {
		return connected ? (
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