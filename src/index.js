import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import { ProvideOrbitDb } from './context/orbitDbContext';
import { ProvideEthersProvider } from './context/providerContext.js';

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`
};

console.log(themes);
const prevTheme = window.localStorage.getItem('theme');

ReactDOM.render(
  <ProvideEthersProvider>
    <ProvideOrbitDb>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || 'light'}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeSwitcherProvider>
    </ProvideOrbitDb>
  </ProvideEthersProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
