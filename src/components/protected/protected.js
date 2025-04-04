import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { isLogged } = useSelector((state) => state.user);
  const localToken = localStorage.getItem("userToken");
  const sessionToken = sessionStorage.getItem("userToken");
  
  // Vérification stricte : l'utilisateur doit être connecté selon Redux ET avoir un token valide
  if (!isLogged || (!localToken && !sessionToken)) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;