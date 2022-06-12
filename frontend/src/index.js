import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import { ThemeProvider } from "react-bootstrap";
import { Provider } from 'react-redux';
import store from './store/store';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
   <React.StrictMode>
      <Provider store={store}>
         <ThemeProvider dir="rtl">
            <App />
         </ThemeProvider>
      </Provider>
   </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
