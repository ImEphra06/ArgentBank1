import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkPersistedAuth } from "./redux/userSlice";
import { userProfile } from "./redux/userAction";

import './index.css';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Homepage from "./page/homepage/homepage";
import SignIn from "./page/signin/signin";
import User from "./page/user/user";
import ErrorPage from "./page/error/error";
import reportWebVitals from './reportWebVitals';

// Créer un composant App qui peut utiliser les hooks React
function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Vérifier les tokens persistants au chargement de l'application
    dispatch(checkPersistedAuth());
    
    // Si un token existe, récupérer les informations de profil
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (token) {
      // Assurez-vous que cette action est correctement importée et configurée pour utiliser le token
      dispatch(userProfile({ token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/profile" element={<User />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();