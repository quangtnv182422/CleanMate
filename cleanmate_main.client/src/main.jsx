import React from "react";
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "../src/main-component/App/App";
import "./css/font-awesome.min.css";
import "./css/themify-icons.css";
import "./css/flaticon.css";
import "./sass/style.scss";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
