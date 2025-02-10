import { Link } from "react-router-dom";
import "./error.css";

function ErrorPage() {
	return (
		<article className="error">
			<strong>404</strong>
			<h2>Oups! La page que vous demandez n'existe pas</h2>
			<Link to="/"><h3>Retourner sur la page d'accueil</h3></Link>
		</article>
	);
}

export default ErrorPage;