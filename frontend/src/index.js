import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const configuration: Configuration = {
  auth: {
      clientId: "dee13a4f-6a18-45b2-86a4-79f3d94c61e6"
  }
};

const pca = new PublicClientApplication(configuration);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider 
    instance={pca}>
    <App />
    </MsalProvider>
  </React.StrictMode>
);

