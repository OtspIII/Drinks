import React from 'react';
import ReactDOM from 'react-dom';
// import {HashRouter} from "react-router-dom";
import App from "./index.js";

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  // <HashRouter>
    <App />,
  // </HashRouter>,
  rootElement,
);
