import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './index.css';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Index from "./page/index/index";
//import SignIn from "./page/signin/signin";
//import User from "./page/user/user";
import ErrorPage from "./page/error/error";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Header />
      <Routes>
      <Route path="/" element={<Index />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
